#!/bin/bash

# Frontend Deployment Script
# Deploys only the frontend service to production

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="$PROJECT_ROOT/docker-compose.prod.yml"
ENV_FILE="$PROJECT_ROOT/.env.production"
SERVICE_NAME="frontend"
HEALTH_CHECK_URL="https://84.247.165.153"
MAX_WAIT_TIME=300  # 5 minutes

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

# Function to check if frontend is responding
check_frontend_health() {
    local retries=0
    local max_retries=$((MAX_WAIT_TIME / 10))
    
    log "Checking frontend health..."
    
    while [ $retries -lt $max_retries ]; do
        if curl -f -k -s "$HEALTH_CHECK_URL" > /dev/null 2>&1; then
            success "Frontend is responding!"
            return 0
        fi
        
        retries=$((retries + 1))
        log "Health check attempt $retries/$max_retries..."
        sleep 10
    done
    
    error "Frontend health check failed after $MAX_WAIT_TIME seconds"
    return 1
}

# Function to create backup before deployment
create_backup() {
    log "Creating pre-deployment backup..."
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_dir="$PROJECT_ROOT/backups/pre-deploy-frontend-$timestamp"
    
    mkdir -p "$backup_dir"
    
    # Backup current frontend build (if exists)
    if docker ps --format "table {{.Names}}" | grep -q "ahmedurkmez_frontend_prod"; then
        log "Backing up current frontend container state..."
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs "$SERVICE_NAME" > "$backup_dir/frontend.log" 2>/dev/null || true
    fi
    
    success "Backup created at $backup_dir"
}

# Function to rollback on failure
rollback() {
    error "Deployment failed, attempting rollback..."
    
    # Stop the failed service
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" stop "$SERVICE_NAME" 2>/dev/null || true
    
    # Start the service again (will use previous image)
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --no-deps "$SERVICE_NAME"
    
    warning "Rollback completed. Please check logs for issues."
}

# Main deployment function
deploy_frontend() {
    log "Starting frontend deployment..."
    
    # Change to project root
    cd "$PROJECT_ROOT"
    
    # Validate environment
    if [ ! -f "$COMPOSE_FILE" ]; then
        error "Docker compose file not found: $COMPOSE_FILE"
        exit 1
    fi
    
    if [ ! -f "$ENV_FILE" ]; then
        error "Environment file not found: $ENV_FILE"
        exit 1
    fi
    
    # Create backup
    create_backup
    
    # Pull latest code (if this is run in a git repository)
    if [ -d .git ]; then
        log "Pulling latest code..."
        git pull origin main || {
            warning "Git pull failed, continuing with local code..."
        }
    fi
    
    # Build new frontend image
    log "Building frontend image..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" build "$SERVICE_NAME" || {
        error "Frontend build failed!"
        exit 1
    }
    
    # Stop current frontend service
    log "Stopping current frontend service..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" stop "$SERVICE_NAME"
    
    # Remove old frontend container
    log "Removing old frontend container..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" rm -f "$SERVICE_NAME"
    
    # Start new frontend service
    log "Starting new frontend service..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --no-deps "$SERVICE_NAME" || {
        rollback
        exit 1
    }
    
    # Wait for service to be ready
    log "Waiting for frontend to be ready..."
    if check_frontend_health; then
        success "Frontend deployment completed successfully!"
        
        # Cleanup old images
        log "Cleaning up old Docker images..."
        docker image prune -f > /dev/null 2>&1 || true
        
        # Log deployment
        echo "$(date '+%Y-%m-%d %H:%M:%S') - Frontend deployed successfully" >> "$PROJECT_ROOT/logs/deployment.log"
        
    else
        rollback
        exit 1
    fi
}

# Create logs directory if it doesn't exist
mkdir -p "$PROJECT_ROOT/logs"

# Run deployment
trap 'error "Deployment interrupted"; rollback; exit 1' INT TERM

deploy_frontend

success "Frontend deployment completed! 🚀"
