#!/bin/bash

# Full System Deployment Script
# Deploys the entire application stack to production

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="$PROJECT_ROOT/docker-compose.prod.yml"
ENV_FILE="$PROJECT_ROOT/.env.production"
HEALTH_CHECK_URL="https://84.247.165.153"
API_HEALTH_URL="https://84.247.165.153/api/health"
MAX_WAIT_TIME=600  # 10 minutes for full deployment

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

# Function to check system health
check_system_health() {
    local retries=0
    local max_retries=$((MAX_WAIT_TIME / 15))
    
    log "Performing comprehensive system health check..."
    
    while [ $retries -lt $max_retries ]; do
        local frontend_ok=false
        local backend_ok=false
        
        # Check frontend
        if curl -f -k -s "$HEALTH_CHECK_URL" > /dev/null 2>&1; then
            frontend_ok=true
        fi
        
        # Check backend API
        if curl -f -k -s "$API_HEALTH_URL" > /dev/null 2>&1; then
            backend_ok=true
        fi
        
        if [ "$frontend_ok" = true ] && [ "$backend_ok" = true ]; then
            success "System is fully operational!"
            return 0
        fi
        
        retries=$((retries + 1))
        log "Health check attempt $retries/$max_retries (Frontend: $frontend_ok, Backend: $backend_ok)..."
        sleep 15
    done
    
    error "System health check failed after $MAX_WAIT_TIME seconds"
    return 1
}

# Function to create comprehensive backup
create_full_backup() {
    log "Creating comprehensive pre-deployment backup..."
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_dir="$PROJECT_ROOT/backups/full-deploy-$timestamp"
    
    mkdir -p "$backup_dir"
    
    # Backup database
    log "Backing up database..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T postgres pg_dump -U postgres ahmedurkmez_db > "$backup_dir/database.sql" 2>/dev/null || {
        warning "Database backup failed, continuing anyway..."
    }
    
    # Backup uploads
    if [ -d "$PROJECT_ROOT/uploads" ]; then
        log "Backing up uploads..."
        cp -r "$PROJECT_ROOT/uploads" "$backup_dir/" 2>/dev/null || {
            warning "Uploads backup failed, continuing anyway..."
        }
    fi
    
    # Backup current container logs
    log "Backing up container logs..."
    for service in backend frontend nginx postgres redis; do
        if docker ps --format "table {{.Names}}" | grep -q "ahmedurkmez_${service}_prod"; then
            docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs "$service" > "$backup_dir/${service}.log" 2>/dev/null || true
        fi
    done
    
    # Backup environment configuration
    cp "$ENV_FILE" "$backup_dir/env.backup" 2>/dev/null || true
    
    success "Full backup created at $backup_dir"
}

# Function to perform rollback
rollback_system() {
    error "Full deployment failed, attempting system rollback..."
    
    # Stop all services
    log "Stopping all services..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" stop
    
    # Start core services first (database, redis)
    log "Starting core services..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d postgres redis
    
    # Wait for core services
    sleep 10
    
    # Start application services
    log "Starting application services..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --no-deps backend frontend nginx
    
    warning "System rollback completed. Please check logs for issues."
}

# Function to verify prerequisites
verify_prerequisites() {
    log "Verifying deployment prerequisites..."
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        error "Docker is not running!"
        exit 1
    fi
    
    # Check if docker-compose is available
    if ! command -v docker-compose > /dev/null 2>&1; then
        error "docker-compose is not available!"
        exit 1
    fi
    
    # Check available disk space (require at least 2GB)
    local available_space=$(df /var/lib/docker --output=avail | tail -n 1)
    if [ "$available_space" -lt 2097152 ]; then  # 2GB in KB
        warning "Low disk space detected. Available: $(($available_space / 1024))MB"
    fi
    
    success "Prerequisites verified"
}

# Function to update system configuration
update_configuration() {
    log "Updating system configuration..."
    
    # Ensure SSL certificates exist
    if [ ! -f "$PROJECT_ROOT/nginx/ssl/cert.pem" ] || [ ! -f "$PROJECT_ROOT/nginx/ssl/key.pem" ]; then
        warning "SSL certificates not found, generating new ones..."
        "$SCRIPT_DIR/generate-ssl.sh" || {
            error "Failed to generate SSL certificates"
            exit 1
        }
    fi
    
    # Ensure uploads directory exists with correct permissions
    mkdir -p "$PROJECT_ROOT/uploads"
    chmod 755 "$PROJECT_ROOT/uploads"
    
    # Ensure logs directory exists
    mkdir -p "$PROJECT_ROOT/logs"
    
    success "Configuration updated"
}

# Main deployment function
deploy_full_system() {
    log "Starting full system deployment..."
    
    # Change to project root
    cd "$PROJECT_ROOT"
    
    # Verify prerequisites
    verify_prerequisites
    
    # Update configuration
    update_configuration
    
    # Create comprehensive backup
    create_full_backup
    
    # Pull latest code (if this is run in a git repository)
    if [ -d .git ]; then
        log "Pulling latest code..."
        git pull origin main || {
            warning "Git pull failed, continuing with local code..."
        }
    fi
    
    # Build all images
    log "Building all application images..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" build || {
        error "Build failed!"
        exit 1
    }
    
    # Stop all services
    log "Stopping all services..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down
    
    # Start services in proper order
    log "Starting core services (database, redis)..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d postgres redis
    
    # Wait for core services to be ready
    log "Waiting for core services to be ready..."
    sleep 20
    
    # Start backend service
    log "Starting backend service..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --no-deps backend
    
    # Wait for backend to be ready
    log "Waiting for backend to be ready..."
    sleep 30
    
    # Start frontend service
    log "Starting frontend service..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --no-deps frontend
    
    # Wait for frontend to be ready
    log "Waiting for frontend to be ready..."
    sleep 20
    
    # Start nginx service
    log "Starting nginx service..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --no-deps nginx
    
    # Wait for nginx to be ready
    log "Waiting for nginx to be ready..."
    sleep 10
    
    # Perform comprehensive health check
    log "Performing final system health check..."
    if check_system_health; then
        success "Full system deployment completed successfully!"
        
        # Cleanup old images and containers
        log "Cleaning up old Docker resources..."
        docker image prune -f > /dev/null 2>&1 || true
        docker container prune -f > /dev/null 2>&1 || true
        
        # Log successful deployment
        echo "$(date '+%Y-%m-%d %H:%M:%S') - Full system deployed successfully" >> "$PROJECT_ROOT/logs/deployment.log"
        
        # Display final status
        log "Final system status:"
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
        
    else
        rollback_system
        exit 1
    fi
}

# Create logs directory if it doesn't exist
mkdir -p "$PROJECT_ROOT/logs"

# Run deployment with proper error handling
trap 'error "Deployment interrupted"; rollback_system; exit 1' INT TERM

deploy_full_system

success "🎉 Full system deployment completed successfully! 🚀"
success "Frontend: $HEALTH_CHECK_URL"
success "API: $API_HEALTH_URL"
