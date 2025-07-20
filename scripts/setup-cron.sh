#!/bin/bash

# Setup Cron Jobs for Production Backups
# This script sets up automated backup scheduling

set -e

PROJECT_DIR="/var/www/ahmedurkmez"
BACKUP_SCHEDULE="${BACKUP_SCHEDULE:-0 2 * * *}"  # Default: 2 AM daily

echo "Setting up automated backup cron jobs..."
echo "========================================"

# Create backup script wrapper for cron
cat > "${PROJECT_DIR}/scripts/backup-cron.sh" << 'EOF'
#!/bin/bash

# Cron wrapper for backup script
# This ensures proper environment and logging for cron execution

set -e

# Setup environment
cd "$(dirname "$0")/.."
export PATH="/usr/local/bin:/usr/bin:/bin"

# Log file
LOG_FILE="./logs/backup-$(date +%Y%m%d).log"
mkdir -p ./logs

# Execute backup with logging
echo "=== Backup started at $(date) ===" >> "$LOG_FILE"
./scripts/backup.sh >> "$LOG_FILE" 2>&1
BACKUP_EXIT_CODE=$?

if [ $BACKUP_EXIT_CODE -eq 0 ]; then
    echo "=== Backup completed successfully at $(date) ===" >> "$LOG_FILE"
else
    echo "=== Backup failed at $(date) with exit code $BACKUP_EXIT_CODE ===" >> "$LOG_FILE"
    
    # Send alert notification if webhook is configured
    if [ ! -z "$WEBHOOK_URL" ]; then
        curl -X POST "$WEBHOOK_URL" \
             -H "Content-Type: application/json" \
             -d "{\"text\":\"❌ Backup failed for ahmedurkmez project with exit code $BACKUP_EXIT_CODE\"}" \
             2>/dev/null || true
    fi
fi

# Clean up old log files (keep last 30 days)
find ./logs -name "backup-*.log" -type f -mtime +30 -delete 2>/dev/null || true

exit $BACKUP_EXIT_CODE
EOF

# Make it executable
chmod +x "${PROJECT_DIR}/scripts/backup-cron.sh"

# Current crontab
CURRENT_CRON=$(crontab -l 2>/dev/null || echo "")

# Check if backup job already exists
if echo "$CURRENT_CRON" | grep -q "backup-cron.sh"; then
    echo "⚠️  Backup cron job already exists, updating..."
    # Remove existing backup job
    CURRENT_CRON=$(echo "$CURRENT_CRON" | grep -v "backup-cron.sh")
fi

# Add new backup job
NEW_CRON="${CURRENT_CRON}
# Ahmed Urkmez Project - Automated Backup
${BACKUP_SCHEDULE} cd ${PROJECT_DIR} && ./scripts/backup-cron.sh"

# Install new crontab
echo "$NEW_CRON" | crontab -

echo "✅ Backup cron job installed successfully!"
echo "Schedule: ${BACKUP_SCHEDULE}"
echo "Script: ${PROJECT_DIR}/scripts/backup-cron.sh"
echo ""

# Setup log rotation for backup logs
cat > "/etc/logrotate.d/ahmedurkmez-backup" << EOF
${PROJECT_DIR}/logs/backup-*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 $(whoami) $(whoami)
}
EOF

echo "✅ Log rotation configured"
echo ""

# Display current cron jobs
echo "Current cron jobs:"
echo "=================="
crontab -l

echo ""
echo "Setup completed! Your backups will run automatically."
echo ""
echo "To monitor backup logs:"
echo "  tail -f ${PROJECT_DIR}/logs/backup-\$(date +%Y%m%d).log"
echo ""
echo "To test the backup manually:"
echo "  ${PROJECT_DIR}/scripts/backup.sh"
echo ""
echo "To remove the cron job:"
echo "  crontab -e  # Then delete the backup line"