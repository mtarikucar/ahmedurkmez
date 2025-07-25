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

# Function to setup cron jobs
setup_cron_jobs() {
    log "Setting up automated backup schedules..."
    
    # Create temporary cron file
    local temp_cron="/tmp/ahmedurkmez_cron"
    
    # Get current crontab (if any) and filter out our jobs
    (crontab -l 2>/dev/null || echo "") | grep -v "ahmedurkmez backup" > "$temp_cron" || true
    
    # Add our backup jobs
    cat >> "$temp_cron" << EOF

# AhmedUrkMez Project Automated Backups
# =====================================

# Daily backup at 2:00 AM
0 2 * * * $SCRIPT_DIR/backup-daily.sh >> $PROJECT_ROOT/logs/cron-daily.log 2>&1 # ahmedurkmez backup daily

# Weekly backup on Sundays at 3:00 AM
0 3 * * 0 $SCRIPT_DIR/backup-weekly.sh >> $PROJECT_ROOT/logs/cron-weekly.log 2>&1 # ahmedurkmez backup weekly

# Monthly backup on the 1st of each month at 4:00 AM
0 4 1 * * $SCRIPT_DIR/backup-monthly.sh >> $PROJECT_ROOT/logs/cron-monthly.log 2>&1 # ahmedurkmez backup monthly

# Daily log rotation at 1:00 AM
0 1 * * * find $PROJECT_ROOT/logs -name "*.log" -size +100M -exec gzip {} \; # ahmedurkmez backup log-rotation

# Weekly Docker cleanup on Mondays at 5:00 AM
0 5 * * 1 docker system prune -f >> $PROJECT_ROOT/logs/docker-cleanup.log 2>&1 # ahmedurkmez backup cleanup

EOF
    
    # Install the new crontab
    if crontab "$temp_cron"; then
        success "Cron jobs installed successfully!"
        rm "$temp_cron"
    else
        error "Failed to install cron jobs!"
        rm "$temp_cron"
        return 1
    fi
    
    # Display current schedule
    log "Current backup schedule:"
    echo "  - Daily backup: Every day at 2:00 AM"
    echo "  - Weekly backup: Every Sunday at 3:00 AM"
    echo "  - Monthly backup: 1st of each month at 4:00 AM"
    echo "  - Log rotation: Every day at 1:00 AM"
    echo "  - Docker cleanup: Every Monday at 5:00 AM"
}

# Main setup function
main() {
    log "Starting cron setup for automated backups..."
    
    # Check if running as root or with sudo
    if [ "$EUID" -eq 0 ]; then
        warning "Running as root. Cron jobs will be installed for root user."
    fi
    
    # Setup cron jobs
    setup_cron_jobs
    
    success "Cron setup completed successfully!"
    
    # Display current crontab
    log "Current crontab entries:"
    crontab -l | grep "ahmedurkmez backup" || true
    
    log "Setup complete! Automated backups are now scheduled."
}

# Run setup
main "$@"
