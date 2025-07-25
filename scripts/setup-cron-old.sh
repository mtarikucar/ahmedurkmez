#!/bin/bash

# Cron Setup Script
# Sets up automated backup schedules

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

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