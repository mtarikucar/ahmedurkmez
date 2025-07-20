#!/bin/bash

# Production Restore Script
# This script restores database and uploaded files from backups

set -e

# Configuration
BACKUP_DIR="/backups"
PROJECT_NAME="ahmedurkmez"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_info() {
    echo -e "${GREEN}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if backup file is provided
if [ -z "$1" ]; then
    print_error "Usage: $0 <backup_date> [component]"
    echo ""
    echo "Available backup dates:"
    ls -la "${BACKUP_DIR}/database/" | grep "${PROJECT_NAME}_db_" | awk '{print $9}' | sed 's/.*_db_\(.*\)\.sql\.gz/\1/' | sort -r | head -10
    echo ""
    echo "Components: database, uploads, config, all (default)"
    echo ""
    echo "Examples:"
    echo "  $0 20241220_143022              # Restore all components"
    echo "  $0 20241220_143022 database     # Restore only database"
    echo "  $0 20241220_143022 uploads      # Restore only uploads"
    exit 1
fi

BACKUP_DATE="$1"
COMPONENT="${2:-all}"

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
else
    print_error ".env.production file not found!"
    exit 1
fi

print_info "Starting restore process for backup date: ${BACKUP_DATE}"
echo "========================================"

# Restore database
restore_database() {
    DB_BACKUP_FILE="${BACKUP_DIR}/database/${PROJECT_NAME}_db_${BACKUP_DATE}.sql.gz"
    
    if [ ! -f "${DB_BACKUP_FILE}" ]; then
        print_error "Database backup file not found: ${DB_BACKUP_FILE}"
        return 1
    fi
    
    print_warning "This will COMPLETELY REPLACE the current database!"
    print_warning "Current database: ${DATABASE_NAME} on ${DATABASE_HOST}:${DATABASE_PORT}"
    read -p "Are you sure you want to continue? (yes/no): " -r
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        print_info "Database restore cancelled"
        return 0
    fi
    
    print_info "Restoring database from ${DB_BACKUP_FILE}..."
    
    # Stop application services (if running with docker-compose)
    if command -v docker-compose &> /dev/null; then
        print_info "Stopping application services..."
        docker-compose -f docker-compose.prod.yml stop backend frontend || true
    fi
    
    # Restore database
    gunzip -c "${DB_BACKUP_FILE}" | PGPASSWORD=${DATABASE_PASSWORD} psql \
        -h ${DATABASE_HOST} \
        -p ${DATABASE_PORT} \
        -U ${DATABASE_USERNAME} \
        -d postgres
    
    print_info "✅ Database restore completed"
}

# Restore uploads
restore_uploads() {
    UPLOADS_BACKUP_FILE="${BACKUP_DIR}/uploads/${PROJECT_NAME}_uploads_${BACKUP_DATE}.tar.gz"
    
    if [ ! -f "${UPLOADS_BACKUP_FILE}" ]; then
        print_error "Uploads backup file not found: ${UPLOADS_BACKUP_FILE}"
        return 1
    fi
    
    print_warning "This will REPLACE all uploaded files!"
    read -p "Are you sure you want to continue? (yes/no): " -r
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        print_info "Uploads restore cancelled"
        return 0
    fi
    
    print_info "Restoring uploads from ${UPLOADS_BACKUP_FILE}..."
    
    # Backup current uploads
    if [ -d "./apps/server/uploads" ]; then
        print_info "Backing up current uploads..."
        mv "./apps/server/uploads" "./apps/server/uploads.backup.$(date +%Y%m%d_%H%M%S)"
    fi
    
    # Restore uploads
    tar -xzf "${UPLOADS_BACKUP_FILE}" -C "./apps/server/"
    
    print_info "✅ Uploads restore completed"
}

# Restore configuration
restore_config() {
    CONFIG_BACKUP_FILE="${BACKUP_DIR}/${PROJECT_NAME}_config_${BACKUP_DATE}.tar.gz"
    
    if [ ! -f "${CONFIG_BACKUP_FILE}" ]; then
        print_error "Configuration backup file not found: ${CONFIG_BACKUP_FILE}"
        return 1
    fi
    
    print_warning "This will REPLACE configuration files!"
    read -p "Are you sure you want to continue? (yes/no): " -r
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        print_info "Configuration restore cancelled"
        return 0
    fi
    
    print_info "Restoring configuration from ${CONFIG_BACKUP_FILE}..."
    
    # Extract configuration
    tar -xzf "${CONFIG_BACKUP_FILE}"
    
    print_info "✅ Configuration restore completed"
}

# Main restore logic
case "$COMPONENT" in
    "database")
        restore_database
        ;;
    "uploads")
        restore_uploads
        ;;
    "config")
        restore_config
        ;;
    "all")
        restore_database
        restore_uploads
        restore_config
        ;;
    *)
        print_error "Unknown component: $COMPONENT"
        print_info "Available components: database, uploads, config, all"
        exit 1
        ;;
esac

# Restart services if docker-compose is available
if command -v docker-compose &> /dev/null && [ "$COMPONENT" != "uploads" ]; then
    print_info "Restarting application services..."
    docker-compose -f docker-compose.prod.yml up -d
fi

print_info "🎉 Restore process completed successfully!"
print_warning "Don't forget to:"
print_warning "1. Verify that the application is working correctly"
print_warning "2. Check logs for any errors"
print_warning "3. Test critical functionality"