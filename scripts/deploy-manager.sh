#!/bin/bash

# Deployment Manager Script
# Central script for managing all deployment operations

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
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

info() {
    echo -e "${CYAN}[$(date +'%Y-%m-%d %H:%M:%S')] ℹ️  $1${NC}"
}

# Function to display usage
show_usage() {
    cat << EOF
🚀 AhmedUrkMez Deployment Manager
================================

Usage: $0 [COMMAND] [OPTIONS]

Commands:
  deploy [full|backend|frontend]  Deploy services to production
  backup [daily|weekly|monthly]   Run backup operations
  status                          Show system status
  logs [service]                  Show service logs
  restart [service]               Restart services
  update                          Update deployment scripts
  monitor                         Show monitoring dashboard
  rollback                        Rollback to previous deployment
  setup                           Setup automated backups and monitoring
  help                            Show this help message

Examples:
  $0 deploy full                  Deploy entire application
  $0 deploy backend               Deploy only backend service
  $0 backup daily                 Run daily backup
  $0 status                       Show all services status
  $0 logs nginx                   Show nginx logs
  $0 restart backend              Restart backend service
  $0 setup                        Setup automation (cron jobs)

Services: backend, frontend, nginx, postgres, redis

EOF
}

# Function to show system status
show_status() {
    log "Checking system status..."
    
    echo -e "\n${CYAN}🔍 System Overview${NC}"
    echo "=================="
    echo "Server: $(hostname)"
    echo "Date: $(date)"
    echo "Uptime: $(uptime -p)"
    
    echo -e "\n${CYAN}📊 Resource Usage${NC}"
    echo "=================="
    echo "CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
    echo "Memory Usage: $(free | grep Mem | awk '{printf "%.1f%%", $3/$2 * 100.0}')"
    echo "Disk Usage: $(df / | tail -1 | awk '{print $5}')"
    
    echo -e "\n${CYAN}🐳 Docker Status${NC}"
    echo "================"
    if docker info > /dev/null 2>&1; then
        success "Docker is running"
        echo "Docker Version: $(docker --version | cut -d' ' -f3 | tr -d ',')"
        echo "Compose Version: $(docker-compose --version | cut -d' ' -f3 | tr -d ',')"
    else
        error "Docker is not running!"
        return 1
    fi
    
    echo -e "\n${CYAN}🏗️  Services Status${NC}"
    echo "=================="
    if [ -f "$PROJECT_ROOT/docker-compose.prod.yml" ]; then
        docker-compose -f "$PROJECT_ROOT/docker-compose.prod.yml" --env-file "$PROJECT_ROOT/.env.production" ps 2>/dev/null || {
            warning "Unable to get service status"
        }
    else
        error "Docker compose file not found"
    fi
    
    echo -e "\n${CYAN}🌐 Application Health${NC}"
    echo "===================="
    local api_status="❌ Unreachable"
    local frontend_status="❌ Unreachable"
    
    if curl -f -k -s https://84.247.165.153/api/health > /dev/null 2>&1; then
        api_status="✅ Healthy"
    fi
    
    if curl -f -k -s https://84.247.165.153 > /dev/null 2>&1; then
        frontend_status="✅ Accessible"
    fi
    
    echo "API Health: $api_status"
    echo "Frontend: $frontend_status"
    
    echo -e "\n${CYAN}📁 Backup Status${NC}"
    echo "================"
    local daily_backup=$(find "$PROJECT_ROOT/backups/daily" -name "daily-*" -type d -mtime -1 2>/dev/null | wc -l)
    local weekly_backup=$(find "$PROJECT_ROOT/backups/weekly" -name "weekly-*" -type d -mtime -8 2>/dev/null | wc -l)
    local monthly_backup=$(find "$PROJECT_ROOT/backups/monthly" -name "monthly-*" -type d -mtime -32 2>/dev/null | wc -l)
    
    echo "Daily backup (last 24h): $([ $daily_backup -gt 0 ] && echo "✅ Available" || echo "❌ Missing")"
    echo "Weekly backup (last 8d): $([ $weekly_backup -gt 0 ] && echo "✅ Available" || echo "❌ Missing")"
    echo "Monthly backup (last 32d): $([ $monthly_backup -gt 0 ] && echo "✅ Available" || echo "❌ Missing")"
}

# Function to show service logs
show_logs() {
    local service="${1:-}"
    
    if [ -z "$service" ]; then
        error "Please specify a service: backend, frontend, nginx, postgres, redis"
        return 1
    fi
    
    log "Showing logs for $service..."
    
    if docker-compose -f "$PROJECT_ROOT/docker-compose.prod.yml" --env-file "$PROJECT_ROOT/.env.production" ps | grep -q "$service"; then
        docker-compose -f "$PROJECT_ROOT/docker-compose.prod.yml" --env-file "$PROJECT_ROOT/.env.production" logs --tail=50 -f "$service"
    else
        error "Service $service not found or not running"
        return 1
    fi
}

# Function to restart services
restart_service() {
    local service="${1:-}"
    
    if [ -z "$service" ]; then
        log "Restarting all services..."
        docker-compose -f "$PROJECT_ROOT/docker-compose.prod.yml" --env-file "$PROJECT_ROOT/.env.production" restart
    else
        log "Restarting $service service..."
        docker-compose -f "$PROJECT_ROOT/docker-compose.prod.yml" --env-file "$PROJECT_ROOT/.env.production" restart "$service"
    fi
    
    success "Service(s) restarted successfully"
}

# Function to show monitoring dashboard
show_monitoring() {
    log "Displaying monitoring dashboard..."
    
    while true; do
        clear
        echo -e "${CYAN}🖥️  AhmedUrkMez Monitoring Dashboard${NC}"
        echo "===================================="
        echo "Last Update: $(date)"
        echo "Press Ctrl+C to exit"
        echo ""
        
        # Show service status
        echo -e "${YELLOW}Services:${NC}"
        docker-compose -f "$PROJECT_ROOT/docker-compose.prod.yml" --env-file "$PROJECT_ROOT/.env.production" ps 2>/dev/null | tail -n +2 | while read line; do
            if echo "$line" | grep -q "Up"; then
                echo "  ✅ $line"
            else
                echo "  ❌ $line"
            fi
        done
        
        echo ""
        echo -e "${YELLOW}Resources:${NC}"
        echo "  CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
        echo "  Memory: $(free | grep Mem | awk '{printf "%.1f%%", $3/$2 * 100.0}')"
        echo "  Disk: $(df / | tail -1 | awk '{print $5}')"
        
        echo ""
        echo -e "${YELLOW}Application Health:${NC}"
        if curl -f -k -s https://84.247.165.153/api/health > /dev/null 2>&1; then
            echo "  ✅ API Health Check"
        else
            echo "  ❌ API Health Check"
        fi
        
        if curl -f -k -s https://84.247.165.153 > /dev/null 2>&1; then
            echo "  ✅ Frontend Access"
        else
            echo "  ❌ Frontend Access"
        fi
        
        sleep 5
    done
}

# Function to perform rollback
perform_rollback() {
    warning "This will rollback to the previous deployment. Continue? (y/N)"
    read -r confirm
    
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        info "Rollback cancelled"
        return 0
    fi
    
    log "Performing rollback..."
    
    # Stop current services
    docker-compose -f "$PROJECT_ROOT/docker-compose.prod.yml" --env-file "$PROJECT_ROOT/.env.production" down
    
    # Find previous deployment backup
    local backup_dir=$(find "$PROJECT_ROOT/backups" -name "*pre-deploy*" -type d | sort -r | head -1)
    
    if [ -n "$backup_dir" ]; then
        log "Found backup: $backup_dir"
        
        # Restore database if backup exists
        if [ -f "$backup_dir/database.sql" ]; then
            log "Restoring database..."
            docker-compose -f "$PROJECT_ROOT/docker-compose.prod.yml" --env-file "$PROJECT_ROOT/.env.production" up -d postgres
            sleep 10
            docker-compose -f "$PROJECT_ROOT/docker-compose.prod.yml" --env-file "$PROJECT_ROOT/.env.production" exec -T postgres psql -U postgres -d ahmedurkmez_db < "$backup_dir/database.sql" || {
                warning "Database restore failed, continuing anyway..."
            }
        fi
        
        # Restore uploads if backup exists
        if [ -d "$backup_dir/uploads" ]; then
            log "Restoring uploads..."
            rm -rf "$PROJECT_ROOT/uploads"
            cp -r "$backup_dir/uploads" "$PROJECT_ROOT/"
        fi
        
        # Start all services
        docker-compose -f "$PROJECT_ROOT/docker-compose.prod.yml" --env-file "$PROJECT_ROOT/.env.production" up -d
        
        success "Rollback completed successfully"
    else
        error "No backup found for rollback!"
        return 1
    fi
}

# Function to update deployment scripts
update_scripts() {
    log "Updating deployment scripts..."
    
    # Make sure all scripts are executable
    chmod +x "$SCRIPT_DIR"/*.sh
    
    # Check for script updates (if this is a git repository)
    if [ -d "$PROJECT_ROOT/.git" ]; then
        log "Checking for script updates..."
        git pull origin main || {
            warning "Git pull failed, continuing with local scripts..."
        }
    fi
    
    success "Scripts updated successfully"
}

# Function to setup automation
setup_automation() {
    log "Setting up automated backups and monitoring..."
    
    # Run the cron setup script
    if [ -f "$SCRIPT_DIR/setup-cron.sh" ]; then
        "$SCRIPT_DIR/setup-cron.sh"
    else
        error "Cron setup script not found!"
        return 1
    fi
    
    success "Automation setup completed"
}

# Main function
main() {
    local command="${1:-help}"
    local option="${2:-}"
    
    case "$command" in
        "deploy")
            case "$option" in
                "full"|"")
                    "$SCRIPT_DIR/deploy-full.sh"
                    ;;
                "backend")
                    "$SCRIPT_DIR/deploy-backend.sh"
                    ;;
                "frontend")
                    "$SCRIPT_DIR/deploy-frontend.sh"
                    ;;
                *)
                    error "Invalid deployment type: $option"
                    echo "Valid options: full, backend, frontend"
                    exit 1
                    ;;
            esac
            ;;
        "backup")
            case "$option" in
                "daily"|"")
                    "$SCRIPT_DIR/backup-daily.sh"
                    ;;
                "weekly")
                    "$SCRIPT_DIR/backup-weekly.sh"
                    ;;
                "monthly")
                    "$SCRIPT_DIR/backup-monthly.sh"
                    ;;
                *)
                    error "Invalid backup type: $option"
                    echo "Valid options: daily, weekly, monthly"
                    exit 1
                    ;;
            esac
            ;;
        "status")
            show_status
            ;;
        "logs")
            show_logs "$option"
            ;;
        "restart")
            restart_service "$option"
            ;;
        "monitor")
            show_monitoring
            ;;
        "rollback")
            perform_rollback
            ;;
        "update")
            update_scripts
            ;;
        "setup")
            setup_automation
            ;;
        "help"|*)
            show_usage
            ;;
    esac
}

# Run main function with all arguments
main "$@"
