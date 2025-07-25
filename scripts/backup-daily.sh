#!/bin/bash

# Daily Backup Script
# Performs daily backups of database, uploads, and configurations

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_ROOT="$PROJECT_ROOT/backups/daily"
COMPOSE_FILE="$PROJECT_ROOT/docker-compose.prod.yml"
ENV_FILE="$PROJECT_ROOT/.env.production"
RETENTION_DAYS=7  # Keep daily backups for 7 days

# AWS S3 Configuration (if enabled)
S3_ENABLED=false
S3_BUCKET=""
S3_PREFIX="daily-backups"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] ✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ❌ $1${NC}"
}

# Function to backup database
backup_database() {
    local backup_dir="$1"
    
    log "Backing up PostgreSQL database..."
    
    # Create database backup
    if docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T postgres pg_dump -U postgres ahmedurkmez_db > "$backup_dir/database.sql"; then
        
        # Compress database backup
        gzip "$backup_dir/database.sql"
        
        # Get backup size
        local backup_size=$(du -h "$backup_dir/database.sql.gz" | cut -f1)
        success "Database backup completed (Size: $backup_size)"
        
        return 0
    else
        error "Database backup failed!"
        return 1
    fi
}

# Function to backup uploads directory
backup_uploads() {
    local backup_dir="$1"
    
    log "Backing up uploads directory..."
    
    if [ -d "$PROJECT_ROOT/uploads" ] && [ "$(ls -A "$PROJECT_ROOT/uploads" 2>/dev/null)" ]; then
        if tar -czf "$backup_dir/uploads.tar.gz" -C "$PROJECT_ROOT" uploads; then
            local backup_size=$(du -h "$backup_dir/uploads.tar.gz" | cut -f1)
            success "Uploads backup completed (Size: $backup_size)"
            return 0
        else
            error "Uploads backup failed!"
            return 1
        fi
    else
        warning "No uploads directory found or directory is empty"
        return 0
    fi
}

# Function to backup configurations
backup_configurations() {
    local backup_dir="$1"
    
    log "Backing up configurations..."
    
    # Create configs backup directory
    local config_backup_dir="$backup_dir/configs"
    mkdir -p "$config_backup_dir"
    
    # Backup environment file
    if [ -f "$ENV_FILE" ]; then
        cp "$ENV_FILE" "$config_backup_dir/env.production"
    fi
    
    # Backup docker-compose file
    if [ -f "$COMPOSE_FILE" ]; then
        cp "$COMPOSE_FILE" "$config_backup_dir/"
    fi
    
    # Backup nginx configuration
    if [ -d "$PROJECT_ROOT/nginx" ]; then
        cp -r "$PROJECT_ROOT/nginx" "$config_backup_dir/"
    fi
    
    # Backup SSL certificates
    if [ -d "$PROJECT_ROOT/nginx/ssl" ]; then
        cp -r "$PROJECT_ROOT/nginx/ssl" "$config_backup_dir/ssl-backup"
    fi
    
    # Compress configurations
    tar -czf "$backup_dir/configurations.tar.gz" -C "$backup_dir" configs
    rm -rf "$config_backup_dir"
    
    local backup_size=$(du -h "$backup_dir/configurations.tar.gz" | cut -f1)
    success "Configurations backup completed (Size: $backup_size)"
}

# Function to backup container logs
backup_logs() {
    local backup_dir="$1"
    
    log "Backing up container logs..."
    
    local logs_dir="$backup_dir/logs"
    mkdir -p "$logs_dir"
    
    # Backup logs for each service
    for service in backend frontend nginx postgres redis; do
        if docker ps --format "table {{.Names}}" | grep -q "ahmedurkmez_${service}_prod"; then
            docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs --tail=1000 "$service" > "$logs_dir/${service}.log" 2>/dev/null || true
        fi
    done
    
    # Backup application logs if they exist
    if [ -d "$PROJECT_ROOT/logs" ]; then
        cp -r "$PROJECT_ROOT/logs"/* "$logs_dir/" 2>/dev/null || true
    fi
    
    # Compress logs
    tar -czf "$backup_dir/logs.tar.gz" -C "$backup_dir" logs
    rm -rf "$logs_dir"
    
    local backup_size=$(du -h "$backup_dir/logs.tar.gz" | cut -f1)
    success "Logs backup completed (Size: $backup_size)"
}

# Function to upload to S3 (if enabled)
upload_to_s3() {
    local backup_dir="$1"
    local backup_name="$(basename "$backup_dir")"
    
    if [ "$S3_ENABLED" = true ] && [ -n "$S3_BUCKET" ]; then
        log "Uploading backup to S3..."
        
        if command -v aws > /dev/null 2>&1; then
            # Create tarball of entire backup
            local tarball="$backup_dir.tar.gz"
            tar -czf "$tarball" -C "$(dirname "$backup_dir")" "$backup_name"
            
            # Upload to S3
            if aws s3 cp "$tarball" "s3://$S3_BUCKET/$S3_PREFIX/$backup_name.tar.gz"; then
                success "Backup uploaded to S3"
                rm "$tarball"
            else
                error "S3 upload failed"
                rm "$tarball"
            fi
        else
            warning "AWS CLI not found, skipping S3 upload"
        fi
    fi
}

# Function to cleanup old backups
cleanup_old_backups() {
    log "Cleaning up old daily backups..."
    
    if [ -d "$BACKUP_ROOT" ]; then
        # Remove backups older than retention period
        find "$BACKUP_ROOT" -type d -name "daily-*" -mtime +$RETENTION_DAYS -exec rm -rf {} \; 2>/dev/null || true
        
        # Count remaining backups
        local remaining_backups=$(find "$BACKUP_ROOT" -type d -name "daily-*" | wc -l)
        success "Cleanup completed. $remaining_backups daily backups retained."
    fi
}

# Function to create backup summary
create_backup_summary() {
    local backup_dir="$1"
    local summary_file="$backup_dir/backup-summary.txt"
    
    {
        echo "Daily Backup Summary"
        echo "==================="
        echo "Backup Date: $(date)"
        echo "Backup Location: $backup_dir"
        echo ""
        echo "Files:"
        ls -lh "$backup_dir"
        echo ""
        echo "Total Backup Size:"
        du -sh "$backup_dir"
        echo ""
        echo "System Status at Backup Time:"
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps 2>/dev/null || echo "Unable to get container status"
    } > "$summary_file"
}

# Main backup function
perform_daily_backup() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_dir="$BACKUP_ROOT/daily-$timestamp"
    
    log "Starting daily backup..."
    
    # Create backup directory
    mkdir -p "$backup_dir"
    
    # Track backup success
    local backup_success=true
    
    # Perform backups
    backup_database "$backup_dir" || backup_success=false
    backup_uploads "$backup_dir" || backup_success=false
    backup_configurations "$backup_dir" || backup_success=false
    backup_logs "$backup_dir" || backup_success=false
    
    # Create backup summary
    create_backup_summary "$backup_dir"
    
    # Upload to S3 if enabled
    upload_to_s3 "$backup_dir"
    
    # Cleanup old backups
    cleanup_old_backups
    
    if [ "$backup_success" = true ]; then
        success "Daily backup completed successfully!"
        success "Backup location: $backup_dir"
        
        # Log to main log file
        echo "$(date '+%Y-%m-%d %H:%M:%S') - Daily backup completed: $backup_dir" >> "$PROJECT_ROOT/logs/backup.log"
        
        # Get total backup size
        local total_size=$(du -sh "$backup_dir" | cut -f1)
        success "Total backup size: $total_size"
        
    else
        error "Daily backup completed with errors!"
        exit 1
    fi
}

# Load S3 configuration from environment file if it exists
if [ -f "$ENV_FILE" ]; then
    source "$ENV_FILE" 2>/dev/null || true
    
    if [ -n "${AWS_ACCESS_KEY_ID:-}" ] && [ -n "${AWS_SECRET_ACCESS_KEY:-}" ] && [ -n "${BACKUP_S3_BUCKET:-}" ]; then
        S3_ENABLED=true
        S3_BUCKET="$BACKUP_S3_BUCKET"
        export AWS_ACCESS_KEY_ID
        export AWS_SECRET_ACCESS_KEY
        export AWS_DEFAULT_REGION="${AWS_REGION:-us-east-1}"
    fi
fi

# Create logs directory if it doesn't exist
mkdir -p "$PROJECT_ROOT/logs"

# Run backup
perform_daily_backup

success "Daily backup process completed! 📦"
