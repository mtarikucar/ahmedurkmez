#!/bin/bash

# Production Backup Script
# This script creates backups of database and uploaded files

set -e

# Configuration
BACKUP_DIR="/backups"
PROJECT_NAME="ahmedurkmez"
DATE=$(date +"%Y%m%d_%H%M%S")
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-30}

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
fi

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}/database"
mkdir -p "${BACKUP_DIR}/uploads"
mkdir -p "${BACKUP_DIR}/logs"

echo "Starting backup process at $(date)"
echo "========================================"

# Database backup
echo "📊 Creating database backup..."
DB_BACKUP_FILE="${BACKUP_DIR}/database/${PROJECT_NAME}_db_${DATE}.sql"
PGPASSWORD=${DATABASE_PASSWORD} pg_dump \
    -h ${DATABASE_HOST} \
    -p ${DATABASE_PORT} \
    -U ${DATABASE_USERNAME} \
    -d ${DATABASE_NAME} \
    --verbose \
    --clean \
    --if-exists \
    --create \
    --format=custom \
    > "${DB_BACKUP_FILE}.dump"

# Also create a plain SQL backup for easier restoration
PGPASSWORD=${DATABASE_PASSWORD} pg_dump \
    -h ${DATABASE_HOST} \
    -p ${DATABASE_PORT} \
    -U ${DATABASE_USERNAME} \
    -d ${DATABASE_NAME} \
    --verbose \
    --clean \
    --if-exists \
    --create \
    > "${DB_BACKUP_FILE}"

# Compress the SQL backup
gzip "${DB_BACKUP_FILE}"

echo "✅ Database backup completed: ${DB_BACKUP_FILE}.gz"

# Uploads backup
echo "📁 Creating uploads backup..."
UPLOADS_BACKUP_FILE="${BACKUP_DIR}/uploads/${PROJECT_NAME}_uploads_${DATE}.tar.gz"
if [ -d "./apps/server/uploads" ]; then
    tar -czf "${UPLOADS_BACKUP_FILE}" -C "./apps/server" uploads/
    echo "✅ Uploads backup completed: ${UPLOADS_BACKUP_FILE}"
else
    echo "⚠️  Uploads directory not found, skipping uploads backup"
fi

# Logs backup (optional)
echo "📝 Creating logs backup..."
LOGS_BACKUP_FILE="${BACKUP_DIR}/logs/${PROJECT_NAME}_logs_${DATE}.tar.gz"
if [ -d "./logs" ]; then
    tar -czf "${LOGS_BACKUP_FILE}" logs/
    echo "✅ Logs backup completed: ${LOGS_BACKUP_FILE}"
else
    echo "ℹ️  Logs directory not found, skipping logs backup"
fi

# Configuration backup
echo "⚙️  Creating configuration backup..."
CONFIG_BACKUP_FILE="${BACKUP_DIR}/${PROJECT_NAME}_config_${DATE}.tar.gz"
tar -czf "${CONFIG_BACKUP_FILE}" \
    --exclude='.env.production' \
    --exclude='node_modules' \
    --exclude='dist' \
    --exclude='build' \
    --exclude='.git' \
    docker-compose.prod.yml \
    nginx/ \
    ecosystem.config.js \
    package*.json \
    2>/dev/null || true

echo "✅ Configuration backup completed: ${CONFIG_BACKUP_FILE}"

# Calculate backup sizes
DB_SIZE=$(du -h "${DB_BACKUP_FILE}.gz" 2>/dev/null | cut -f1 || echo "N/A")
UPLOADS_SIZE=$(du -h "${UPLOADS_BACKUP_FILE}" 2>/dev/null | cut -f1 || echo "N/A")
CONFIG_SIZE=$(du -h "${CONFIG_BACKUP_FILE}" 2>/dev/null | cut -f1 || echo "N/A")

echo ""
echo "📊 Backup Summary:"
echo "=================="
echo "Database backup: ${DB_SIZE}"
echo "Uploads backup: ${UPLOADS_SIZE}"
echo "Config backup: ${CONFIG_SIZE}"
echo "Backup location: ${BACKUP_DIR}"

# Cleanup old backups
echo ""
echo "🧹 Cleaning up old backups (older than ${RETENTION_DAYS} days)..."
find "${BACKUP_DIR}" -name "${PROJECT_NAME}_*" -type f -mtime +${RETENTION_DAYS} -delete
echo "✅ Cleanup completed"

# Upload to cloud storage (optional)
if [ ! -z "${AWS_ACCESS_KEY_ID}" ] && [ ! -z "${BACKUP_S3_BUCKET}" ]; then
    echo ""
    echo "☁️  Uploading to AWS S3..."
    
    # Upload database backup
    aws s3 cp "${DB_BACKUP_FILE}.gz" "s3://${BACKUP_S3_BUCKET}/database/" --storage-class STANDARD_IA
    
    # Upload uploads backup
    if [ -f "${UPLOADS_BACKUP_FILE}" ]; then
        aws s3 cp "${UPLOADS_BACKUP_FILE}" "s3://${BACKUP_S3_BUCKET}/uploads/" --storage-class STANDARD_IA
    fi
    
    # Upload config backup
    aws s3 cp "${CONFIG_BACKUP_FILE}" "s3://${BACKUP_S3_BUCKET}/config/" --storage-class STANDARD_IA
    
    echo "✅ Cloud upload completed"
fi

echo ""
echo "🎉 Backup process completed successfully at $(date)"

# Send notification (optional)
if [ ! -z "${WEBHOOK_URL}" ]; then
    curl -X POST "${WEBHOOK_URL}" \
         -H "Content-Type: application/json" \
         -d "{\"text\":\"✅ Backup completed for ${PROJECT_NAME} - DB: ${DB_SIZE}, Uploads: ${UPLOADS_SIZE}\"}" \
         2>/dev/null || true
fi