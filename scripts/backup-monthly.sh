#!/bin/bash

# Monthly Backup Script
# Performs comprehensive monthly archival backups with extended retention

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_ROOT="$PROJECT_ROOT/backups/monthly"
COMPOSE_FILE="$PROJECT_ROOT/docker-compose.prod.yml"
ENV_FILE="$PROJECT_ROOT/.env.production"
RETENTION_MONTHS=12  # Keep monthly backups for 12 months

# AWS S3 Configuration
S3_ENABLED=false
S3_BUCKET=""
S3_PREFIX="monthly-backups"

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

# Function to create database archive
create_database_archive() {
    local backup_dir="$1"
    
    log "Creating comprehensive database archive..."
    
    local db_dir="$backup_dir/database-archive"
    mkdir -p "$db_dir"
    
    # Complete backup with all options
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T postgres pg_dump \
        -U postgres \
        --verbose \
        --clean \
        --no-owner \
        --no-acl \
        --format=custom \
        ahmedurkmez_db > "$db_dir/database-custom.dump" || {
        error "Custom format backup failed"
        return 1
    }
    
    # Plain SQL backup
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T postgres pg_dump \
        -U postgres \
        --verbose \
        --clean \
        --no-owner \
        --no-acl \
        ahmedurkmez_db > "$db_dir/database-complete.sql" || {
        error "SQL backup failed"
        return 1
    }
    
    # Schema-only backup
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T postgres pg_dump \
        -U postgres \
        --schema-only \
        --verbose \
        ahmedurkmez_db > "$db_dir/database-schema.sql" || true
    
    # Data-only backup
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T postgres pg_dump \
        -U postgres \
        --data-only \
        --verbose \
        ahmedurkmez_db > "$db_dir/database-data.sql" || true
    
    # Global objects (users, roles, etc.)
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T postgres pg_dumpall \
        -U postgres \
        --globals-only > "$db_dir/database-globals.sql" || true
    
    # Database statistics
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T postgres psql \
        -U postgres \
        -d ahmedurkmez_db \
        -c "SELECT schemaname,tablename,attname,n_distinct,correlation FROM pg_stats;" > "$db_dir/database-stats.txt" || true
    
    # Table sizes
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T postgres psql \
        -U postgres \
        -d ahmedurkmez_db \
        -c "SELECT tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;" > "$db_dir/table-sizes.txt" || true
    
    # Compress all database files
    gzip "$db_dir"/*.sql
    
    # Compress the entire database directory
    tar -czf "$backup_dir/database-archive.tar.gz" -C "$backup_dir" database-archive
    rm -rf "$db_dir"
    
    local archive_size=$(du -h "$backup_dir/database-archive.tar.gz" | cut -f1)
    success "Database archive completed (Size: $archive_size)"
}

# Function to create complete application archive
create_application_archive() {
    local backup_dir="$1"
    
    log "Creating complete application archive..."
    
    local app_dir="$backup_dir/application-archive"
    mkdir -p "$app_dir"
    
    # Archive all application data
    for dir in uploads logs data cache tmp; do
        if [ -d "$PROJECT_ROOT/$dir" ]; then
            log "Archiving $dir directory..."
            cp -r "$PROJECT_ROOT/$dir" "$app_dir/"
        fi
    done
    
    # Archive configuration and infrastructure
    log "Archiving infrastructure files..."
    local infra_dir="$app_dir/infrastructure"
    mkdir -p "$infra_dir"
    
    # Copy all infrastructure files
    for item in nginx docker database scripts .env.production docker-compose.prod.yml; do
        if [ -e "$PROJECT_ROOT/$item" ]; then
            cp -r "$PROJECT_ROOT/$item" "$infra_dir/"
        fi
    done
    
    # Archive source code (if this is a git repository)
    if [ -d "$PROJECT_ROOT/.git" ]; then
        log "Creating source code archive..."
        git archive --format=tar.gz --prefix=source/ HEAD > "$app_dir/source-code.tar.gz" 2>/dev/null || {
            warning "Git archive failed, copying source manually..."
            local src_dir="$app_dir/source"
            mkdir -p "$src_dir"
            cp -r "$PROJECT_ROOT/apps" "$src_dir/" 2>/dev/null || true
            tar -czf "$app_dir/source-code.tar.gz" -C "$app_dir" source
            rm -rf "$src_dir"
        }
    fi
    
    # Create deployment history
    log "Creating deployment history..."
    {
        echo "Monthly Archive - Deployment History"
        echo "===================================="
        echo "Archive Date: $(date)"
        echo ""
        if [ -f "$PROJECT_ROOT/logs/deployment.log" ]; then
            echo "Deployment History:"
            cat "$PROJECT_ROOT/logs/deployment.log"
        else
            echo "No deployment history found"
        fi
        echo ""
        if [ -f "$PROJECT_ROOT/logs/backup.log" ]; then
            echo "Backup History:"
            cat "$PROJECT_ROOT/logs/backup.log"
        else
            echo "No backup history found"
        fi
    } > "$app_dir/deployment-history.txt"
    
    # Compress the entire application archive
    tar -czf "$backup_dir/application-archive.tar.gz" -C "$backup_dir" application-archive
    rm -rf "$app_dir"
    
    local archive_size=$(du -h "$backup_dir/application-archive.tar.gz" | cut -f1)
    success "Application archive completed (Size: $archive_size)"
}

# Function to create system documentation
create_system_documentation() {
    local backup_dir="$1"
    
    log "Creating comprehensive system documentation..."
    
    local doc_file="$backup_dir/system-documentation.txt"
    
    {
        echo "Monthly System Documentation"
        echo "==========================="
        echo "Generated: $(date)"
        echo "Server: $(hostname)"
        echo ""
        
        echo "SYSTEM OVERVIEW"
        echo "==============="
        echo "Operating System: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)"
        echo "Kernel: $(uname -r)"
        echo "Architecture: $(uname -m)"
        echo "Uptime: $(uptime)"
        echo ""
        
        echo "HARDWARE INFORMATION"
        echo "==================="
        echo "CPU: $(cat /proc/cpuinfo | grep 'model name' | head -1 | cut -d':' -f2 | xargs)"
        echo "CPU Cores: $(nproc)"
        echo "Memory: $(free -h | grep Mem | awk '{print $2}')"
        echo "Disk Space:"
        df -h
        echo ""
        
        echo "DOCKER ENVIRONMENT"
        echo "=================="
        echo "Docker Version: $(docker --version)"
        echo "Docker Compose Version: $(docker-compose --version)"
        echo ""
        echo "Docker System Info:"
        docker system info 2>/dev/null | head -20 || echo "Unable to get Docker info"
        echo ""
        echo "Docker Images:"
        docker images
        echo ""
        echo "Docker Networks:"
        docker network ls
        echo ""
        echo "Docker Volumes:"
        docker volume ls
        echo ""
        
        echo "APPLICATION STATUS"
        echo "=================="
        echo "Container Status:"
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps 2>/dev/null || echo "Unable to get container status"
        echo ""
        
        echo "APPLICATION CONFIGURATION"
        echo "========================="
        echo "Environment Configuration (sanitized):"
        if [ -f "$ENV_FILE" ]; then
            grep -E "^[A-Z_]+" "$ENV_FILE" | sed 's/=.*/=***/' | head -20
        fi
        echo ""
        
        echo "SERVICE ENDPOINTS"
        echo "================="
        echo "Frontend: https://84.247.165.153"
        echo "API: https://84.247.165.153/api"
        echo "Health Check: https://84.247.165.153/api/health"
        echo ""
        
        echo "BACKUP INFORMATION"
        echo "=================="
        echo "Backup Schedule:"
        echo "- Daily: Automated at 2:00 AM"
        echo "- Weekly: Automated on Sundays"
        echo "- Monthly: Automated on 1st of each month"
        echo ""
        echo "Backup Retention:"
        echo "- Daily: 7 days"
        echo "- Weekly: 4 weeks"
        echo "- Monthly: 12 months"
        echo ""
        
        echo "SECURITY CONFIGURATION"
        echo "======================"
        echo "SSL Certificate Info:"
        if [ -f "$PROJECT_ROOT/nginx/ssl/cert.pem" ]; then
            openssl x509 -in "$PROJECT_ROOT/nginx/ssl/cert.pem" -text -noout | grep -A 2 "Subject:\|Not After:\|DNS:\|IP Address:" || echo "Unable to read certificate"
        else
            echo "SSL certificate not found"
        fi
        echo ""
        
        echo "MONITORING AND LOGS"
        echo "=================="
        echo "Recent System Logs (last 24 hours):"
        journalctl --since "24 hours ago" --no-pager | tail -20 2>/dev/null || echo "Unable to access system logs"
        echo ""
        
        echo "RECOVERY PROCEDURES"
        echo "=================="
        echo "Database Recovery:"
        echo "1. Stop the application: docker-compose down"
        echo "2. Restore database: gunzip -c database-archive.tar.gz | tar -xf - && psql -U postgres ahmedurkmez_db < database-complete.sql"
        echo "3. Restore uploads: tar -xzf application-archive.tar.gz && cp -r application-archive/uploads ."
        echo "4. Start application: docker-compose up -d"
        echo ""
        echo "Full System Recovery:"
        echo "1. Extract all archives to project directory"
        echo "2. Run deployment script: ./scripts/deploy-full.sh"
        echo ""
        
        echo "MAINTENANCE CHECKLIST"
        echo "===================="
        echo "Monthly Tasks:"
        echo "- [ ] Review backup integrity"
        echo "- [ ] Check disk space usage"
        echo "- [ ] Update Docker images"
        echo "- [ ] Review security configurations"
        echo "- [ ] Test disaster recovery procedures"
        echo "- [ ] Review application logs for errors"
        echo "- [ ] Update SSL certificates if needed"
        echo ""
        
    } > "$doc_file"
    
    success "System documentation created"
}

# Function to create integrity verification
create_integrity_verification() {
    local backup_dir="$1"
    
    log "Creating backup integrity verification..."
    
    local integrity_file="$backup_dir/integrity-check.txt"
    
    {
        echo "Backup Integrity Verification"
        echo "============================="
        echo "Generated: $(date)"
        echo ""
        
        echo "File Checksums (SHA256):"
        find "$backup_dir" -type f -name "*.tar.gz" -o -name "*.sql.gz" -o -name "*.dump" | while read -r file; do
            echo "$(basename "$file"): $(sha256sum "$file" | cut -d' ' -f1)"
        done
        echo ""
        
        echo "File Sizes:"
        ls -lh "$backup_dir"
        echo ""
        
        echo "Archive Contents Verification:"
        for archive in "$backup_dir"/*.tar.gz; do
            if [ -f "$archive" ]; then
                echo "Archive: $(basename "$archive")"
                tar -tzf "$archive" | head -10
                echo "..."
                echo ""
            fi
        done
        
        echo "Database Backup Verification:"
        if [ -f "$backup_dir/database-archive.tar.gz" ]; then
            echo "✅ Database archive present"
        else
            echo "❌ Database archive missing"
        fi
        
        echo "Application Archive Verification:"
        if [ -f "$backup_dir/application-archive.tar.gz" ]; then
            echo "✅ Application archive present"
        else
            echo "❌ Application archive missing"
        fi
        
    } > "$integrity_file"
    
    success "Integrity verification completed"
}

# Function to upload to S3 with metadata
upload_to_s3_with_metadata() {
    local backup_dir="$1"
    local backup_name="$(basename "$backup_dir")"
    
    if [ "$S3_ENABLED" = true ] && [ -n "$S3_BUCKET" ]; then
        log "Uploading monthly archive to S3 with metadata..."
        
        if command -v aws > /dev/null 2>&1; then
            # Create tarball of entire backup
            local tarball="$backup_dir.tar.gz"
            tar -czf "$tarball" -C "$(dirname "$backup_dir")" "$backup_name"
            
            # Upload to S3 with metadata
            local backup_date=$(date +%Y-%m-%d)
            local backup_size=$(du -sh "$tarball" | cut -f1)
            
            if aws s3 cp "$tarball" "s3://$S3_BUCKET/$S3_PREFIX/$backup_name.tar.gz" \
                --metadata "backup-date=$backup_date,backup-type=monthly,backup-size=$backup_size"; then
                success "Monthly archive uploaded to S3 with metadata"
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

# Function to cleanup old monthly backups
cleanup_old_backups() {
    log "Cleaning up old monthly backups..."
    
    if [ -d "$BACKUP_ROOT" ]; then
        # Remove backups older than retention period
        find "$BACKUP_ROOT" -type d -name "monthly-*" -mtime +$((RETENTION_MONTHS * 30)) -exec rm -rf {} \; 2>/dev/null || true
        
        # Count remaining backups
        local remaining_backups=$(find "$BACKUP_ROOT" -type d -name "monthly-*" | wc -l)
        success "Cleanup completed. $remaining_backups monthly backups retained."
        
        # Show backup history
        log "Monthly backup history:"
        find "$BACKUP_ROOT" -type d -name "monthly-*" | sort | while read -r backup; do
            local backup_date=$(basename "$backup" | cut -d'-' -f2-)
            local backup_size=$(du -sh "$backup" 2>/dev/null | cut -f1 || echo "Unknown")
            echo "  - $backup_date (Size: $backup_size)"
        done
    fi
}

# Function to create comprehensive backup summary
create_comprehensive_summary() {
    local backup_dir="$1"
    local summary_file="$backup_dir/monthly-backup-summary.txt"
    
    {
        echo "MONTHLY BACKUP SUMMARY"
        echo "====================="
        echo "Backup Date: $(date)"
        echo "Backup Type: Comprehensive Monthly Archive"
        echo "Server: $(hostname)"
        echo "Backup Location: $backup_dir"
        echo ""
        
        echo "BACKUP CONTENTS"
        echo "==============="
        echo "✅ Complete database archive (multiple formats)"
        echo "✅ Full application data and configuration"
        echo "✅ Source code snapshot"
        echo "✅ System documentation"
        echo "✅ Deployment and backup history"
        echo "✅ Integrity verification data"
        echo ""
        
        echo "BACKUP FILES AND SIZES"
        echo "====================="
        ls -lh "$backup_dir"
        echo ""
        echo "Total Archive Size: $(du -sh "$backup_dir" | cut -f1)"
        echo ""
        
        echo "SYSTEM STATE AT BACKUP TIME"
        echo "==========================="
        echo "Container Status:"
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps 2>/dev/null || echo "Unable to get container status"
        echo ""
        echo "System Resources:"
        echo "- CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
        echo "- Memory Usage: $(free | grep Mem | awk '{printf "%.1f%%", $3/$2 * 100.0}')"
        echo "- Disk Usage: $(df / | tail -1 | awk '{print $5}')"
        echo ""
        
        echo "BACKUP VERIFICATION"
        echo "=================="
        echo "Integrity Check: $([ -f "$backup_dir/integrity-check.txt" ] && echo "✅ Completed" || echo "❌ Failed")"
        echo "Database Archive: $([ -f "$backup_dir/database-archive.tar.gz" ] && echo "✅ Present" || echo "❌ Missing")"
        echo "Application Archive: $([ -f "$backup_dir/application-archive.tar.gz" ] && echo "✅ Present" || echo "❌ Missing")"
        echo "System Documentation: $([ -f "$backup_dir/system-documentation.txt" ] && echo "✅ Present" || echo "❌ Missing")"
        echo ""
        
        echo "RECOVERY INFORMATION"
        echo "==================="
        echo "This monthly backup can be used for:"
        echo "- Complete disaster recovery"
        echo "- Point-in-time restoration"
        echo "- Migration to new server"
        echo "- Compliance and audit requirements"
        echo ""
        echo "Recovery Instructions:"
        echo "1. Extract application-archive.tar.gz to project directory"
        echo "2. Extract database-archive.tar.gz and restore database"
        echo "3. Run deployment script to rebuild containers"
        echo "4. Verify all services are operational"
        echo ""
        
        echo "NEXT BACKUP SCHEDULED"
        echo "===================="
        echo "Next monthly backup: $(date -d "next month" '+%Y-%m-01')"
        echo "Retention period: $RETENTION_MONTHS months"
        echo ""
        
    } > "$summary_file"
}

# Main backup function
perform_monthly_backup() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_dir="$BACKUP_ROOT/monthly-$timestamp"
    
    log "Starting comprehensive monthly archival backup..."
    
    # Create backup directory
    mkdir -p "$backup_dir"
    
    # Track backup success
    local backup_success=true
    
    # Perform comprehensive monthly backup
    create_database_archive "$backup_dir" || backup_success=false
    create_application_archive "$backup_dir" || backup_success=false
    create_system_documentation "$backup_dir" || backup_success=false
    create_integrity_verification "$backup_dir" || backup_success=false
    
    # Create comprehensive summary
    create_comprehensive_summary "$backup_dir"
    
    # Upload to S3 if enabled
    upload_to_s3_with_metadata "$backup_dir"
    
    # Cleanup old backups
    cleanup_old_backups
    
    if [ "$backup_success" = true ]; then
        success "Monthly archival backup completed successfully!"
        success "Archive location: $backup_dir"
        
        # Log to main log file
        echo "$(date '+%Y-%m-%d %H:%M:%S') - Monthly backup completed: $backup_dir" >> "$PROJECT_ROOT/logs/backup.log"
        
        # Get total backup size
        local total_size=$(du -sh "$backup_dir" | cut -f1)
        success "Total archive size: $total_size"
        
        # Send success notification (if configured)
        log "Monthly backup completed successfully. Archive size: $total_size"
        
    else
        error "Monthly backup completed with errors!"
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
perform_monthly_backup

success "Monthly archival backup process completed! 📦🏛️"
