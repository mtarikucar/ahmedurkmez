#!/bin/bash

# Weekly Backup Script
# Performs comprehensive weekly backups with additional system state information

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_ROOT="$PROJECT_ROOT/backups/weekly"
COMPOSE_FILE="$PROJECT_ROOT/docker-compose.prod.yml"
ENV_FILE="$PROJECT_ROOT/.env.production"
RETENTION_WEEKS=4  # Keep weekly backups for 4 weeks

# AWS S3 Configuration
S3_ENABLED=false
S3_BUCKET=""
S3_PREFIX="weekly-backups"

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

# Function to backup database with schema
backup_database_complete() {
    local backup_dir="$1"
    
    log "Performing complete database backup..."
    
    # Create database backup with schema
    if docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T postgres pg_dump -U postgres --verbose --clean --no-owner --no-acl ahmedurkmez_db > "$backup_dir/database-complete.sql"; then
        
        # Create schema-only backup
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T postgres pg_dump -U postgres --schema-only ahmedurkmez_db > "$backup_dir/database-schema.sql" 2>/dev/null || true
        
        # Create data-only backup
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T postgres pg_dump -U postgres --data-only ahmedurkmez_db > "$backup_dir/database-data.sql" 2>/dev/null || true
        
        # Compress all database backups
        gzip "$backup_dir"/database-*.sql
        
        local complete_size=$(du -h "$backup_dir/database-complete.sql.gz" | cut -f1)
        success "Complete database backup completed (Size: $complete_size)"
        
        return 0
    else
        error "Database backup failed!"
        return 1
    fi
}

# Function to backup all application data
backup_application_data() {
    local backup_dir="$1"
    
    log "Backing up all application data..."
    
    # Create application data directory
    local app_data_dir="$backup_dir/application-data"
    mkdir -p "$app_data_dir"
    
    # Backup uploads
    if [ -d "$PROJECT_ROOT/uploads" ]; then
        cp -r "$PROJECT_ROOT/uploads" "$app_data_dir/"
    fi
    
    # Backup logs
    if [ -d "$PROJECT_ROOT/logs" ]; then
        cp -r "$PROJECT_ROOT/logs" "$app_data_dir/"
    fi
    
    # Backup any additional data directories
    for dir in data cache tmp; do
        if [ -d "$PROJECT_ROOT/$dir" ]; then
            cp -r "$PROJECT_ROOT/$dir" "$app_data_dir/"
        fi
    done
    
    # Compress application data
    tar -czf "$backup_dir/application-data.tar.gz" -C "$backup_dir" application-data
    rm -rf "$app_data_dir"
    
    local app_data_size=$(du -h "$backup_dir/application-data.tar.gz" | cut -f1)
    success "Application data backup completed (Size: $app_data_size)"
}

# Function to backup system configuration
backup_system_configuration() {
    local backup_dir="$1"
    
    log "Backing up complete system configuration..."
    
    local config_dir="$backup_dir/system-config"
    mkdir -p "$config_dir"
    
    # Backup all configuration files
    cp "$ENV_FILE" "$config_dir/" 2>/dev/null || true
    cp "$COMPOSE_FILE" "$config_dir/" 2>/dev/null || true
    
    # Backup nginx configuration
    if [ -d "$PROJECT_ROOT/nginx" ]; then
        cp -r "$PROJECT_ROOT/nginx" "$config_dir/"
    fi
    
    # Backup docker directory if exists
    if [ -d "$PROJECT_ROOT/docker" ]; then
        cp -r "$PROJECT_ROOT/docker" "$config_dir/"
    fi
    
    # Backup database init scripts
    if [ -d "$PROJECT_ROOT/database" ]; then
        cp -r "$PROJECT_ROOT/database" "$config_dir/"
    fi
    
    # Backup deployment scripts
    if [ -d "$PROJECT_ROOT/scripts" ]; then
        cp -r "$PROJECT_ROOT/scripts" "$config_dir/"
    fi
    
    # Backup any CI/CD configuration
    for file in .github Dockerfile* package.json package-lock.json yarn.lock pnpm-lock.yaml; do
        if [ -e "$PROJECT_ROOT/$file" ]; then
            cp -r "$PROJECT_ROOT/$file" "$config_dir/"
        fi
    done
    
    # Compress system configuration
    tar -czf "$backup_dir/system-configuration.tar.gz" -C "$backup_dir" system-config
    rm -rf "$config_dir"
    
    local config_size=$(du -h "$backup_dir/system-configuration.tar.gz" | cut -f1)
    success "System configuration backup completed (Size: $config_size)"
}

# Function to create system state snapshot
create_system_snapshot() {
    local backup_dir="$1"
    
    log "Creating system state snapshot..."
    
    local snapshot_file="$backup_dir/system-snapshot.txt"
    
    {
        echo "Weekly System State Snapshot"
        echo "============================"
        echo "Snapshot Date: $(date)"
        echo "Server: $(hostname)"
        echo "Uptime: $(uptime)"
        echo ""
        
        echo "Docker Version:"
        docker --version 2>/dev/null || echo "Docker not available"
        echo ""
        
        echo "Docker Compose Version:"
        docker-compose --version 2>/dev/null || echo "Docker Compose not available"
        echo ""
        
        echo "Container Status:"
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps 2>/dev/null || echo "Unable to get container status"
        echo ""
        
        echo "Docker Images:"
        docker images | grep ahmedurkmez 2>/dev/null || echo "No project images found"
        echo ""
        
        echo "Docker Networks:"
        docker network ls | grep ahmedurkmez 2>/dev/null || echo "No project networks found"
        echo ""
        
        echo "Docker Volumes:"
        docker volume ls | grep ahmedurkmez 2>/dev/null || echo "No project volumes found"
        echo ""
        
        echo "Disk Usage:"
        df -h
        echo ""
        
        echo "Memory Usage:"
        free -h
        echo ""
        
        echo "Docker System Info:"
        docker system df 2>/dev/null || echo "Unable to get Docker system info"
        echo ""
        
        echo "Environment Variables (sanitized):"
        if [ -f "$ENV_FILE" ]; then
            grep -E "^[A-Z_]+" "$ENV_FILE" | sed 's/=.*/=***/' || echo "Unable to read environment file"
        fi
        echo ""
        
        echo "Recent Deployment History:"
        if [ -f "$PROJECT_ROOT/logs/deployment.log" ]; then
            tail -n 20 "$PROJECT_ROOT/logs/deployment.log" 2>/dev/null || echo "No deployment history found"
        fi
        echo ""
        
        echo "Recent Backup History:"
        if [ -f "$PROJECT_ROOT/logs/backup.log" ]; then
            tail -n 20 "$PROJECT_ROOT/logs/backup.log" 2>/dev/null || echo "No backup history found"
        fi
        
    } > "$snapshot_file"
    
    success "System snapshot created"
}

# Function to backup Docker images
backup_docker_images() {
    local backup_dir="$1"
    
    log "Backing up Docker images..."
    
    local images_dir="$backup_dir/docker-images"
    mkdir -p "$images_dir"
    
    # Get list of project images
    local project_images=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep ahmedurkmez || true)
    
    if [ -n "$project_images" ]; then
        echo "$project_images" | while read -r image; do
            if [ -n "$image" ]; then
                local image_name=$(echo "$image" | tr '/:' '_')
                log "Saving image: $image"
                docker save "$image" | gzip > "$images_dir/${image_name}.tar.gz" || {
                    warning "Failed to save image: $image"
                }
            fi
        done
        
        # Create images manifest
        echo "$project_images" > "$images_dir/images-manifest.txt"
        
        success "Docker images backup completed"
    else
        warning "No project Docker images found to backup"
    fi
}

# Function to upload to S3
upload_to_s3() {
    local backup_dir="$1"
    local backup_name="$(basename "$backup_dir")"
    
    if [ "$S3_ENABLED" = true ] && [ -n "$S3_BUCKET" ]; then
        log "Uploading weekly backup to S3..."
        
        if command -v aws > /dev/null 2>&1; then
            # Create tarball of entire backup
            local tarball="$backup_dir.tar.gz"
            tar -czf "$tarball" -C "$(dirname "$backup_dir")" "$backup_name"
            
            # Upload to S3
            if aws s3 cp "$tarball" "s3://$S3_BUCKET/$S3_PREFIX/$backup_name.tar.gz"; then
                success "Weekly backup uploaded to S3"
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
    log "Cleaning up old weekly backups..."
    
    if [ -d "$BACKUP_ROOT" ]; then
        # Remove backups older than retention period
        find "$BACKUP_ROOT" -type d -name "weekly-*" -mtime +$((RETENTION_WEEKS * 7)) -exec rm -rf {} \; 2>/dev/null || true
        
        # Count remaining backups
        local remaining_backups=$(find "$BACKUP_ROOT" -type d -name "weekly-*" | wc -l)
        success "Cleanup completed. $remaining_backups weekly backups retained."
    fi
}

# Function to create backup summary
create_backup_summary() {
    local backup_dir="$1"
    local summary_file="$backup_dir/weekly-backup-summary.txt"
    
    {
        echo "Weekly Backup Summary"
        echo "===================="
        echo "Backup Date: $(date)"
        echo "Backup Type: Comprehensive Weekly Backup"
        echo "Backup Location: $backup_dir"
        echo ""
        echo "Backup Contents:"
        echo "- Complete database backup (with schema)"
        echo "- Application data (uploads, logs, cache)"
        echo "- System configuration files"
        echo "- Docker images"
        echo "- System state snapshot"
        echo ""
        echo "Files and Sizes:"
        ls -lh "$backup_dir"
        echo ""
        echo "Total Backup Size:"
        du -sh "$backup_dir"
        echo ""
        echo "System Status at Backup Time:"
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps 2>/dev/null || echo "Unable to get container status"
        echo ""
        echo "Backup Integrity Check:"
        echo "- Database backup: $([ -f "$backup_dir/database-complete.sql.gz" ] && echo "✅ Present" || echo "❌ Missing")"
        echo "- Application data: $([ -f "$backup_dir/application-data.tar.gz" ] && echo "✅ Present" || echo "❌ Missing")"
        echo "- System config: $([ -f "$backup_dir/system-configuration.tar.gz" ] && echo "✅ Present" || echo "❌ Missing")"
        echo "- System snapshot: $([ -f "$backup_dir/system-snapshot.txt" ] && echo "✅ Present" || echo "❌ Missing")"
    } > "$summary_file"
}

# Main backup function
perform_weekly_backup() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_dir="$BACKUP_ROOT/weekly-$timestamp"
    
    log "Starting comprehensive weekly backup..."
    
    # Create backup directory
    mkdir -p "$backup_dir"
    
    # Track backup success
    local backup_success=true
    
    # Perform comprehensive backups
    backup_database_complete "$backup_dir" || backup_success=false
    backup_application_data "$backup_dir" || backup_success=false
    backup_system_configuration "$backup_dir" || backup_success=false
    create_system_snapshot "$backup_dir" || backup_success=false
    backup_docker_images "$backup_dir" || backup_success=false
    
    # Create backup summary
    create_backup_summary "$backup_dir"
    
    # Upload to S3 if enabled
    upload_to_s3 "$backup_dir"
    
    # Cleanup old backups
    cleanup_old_backups
    
    if [ "$backup_success" = true ]; then
        success "Weekly backup completed successfully!"
        success "Backup location: $backup_dir"
        
        # Log to main log file
        echo "$(date '+%Y-%m-%d %H:%M:%S') - Weekly backup completed: $backup_dir" >> "$PROJECT_ROOT/logs/backup.log"
        
        # Get total backup size
        local total_size=$(du -sh "$backup_dir" | cut -f1)
        success "Total backup size: $total_size"
        
    else
        error "Weekly backup completed with errors!"
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
perform_weekly_backup

success "Weekly backup process completed! 📦✨"
