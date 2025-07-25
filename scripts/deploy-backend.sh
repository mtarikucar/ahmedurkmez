#!/bin/bash

# Backend Deployment Script
# Deploys only the backend service to production

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="$PROJECT_ROOT/docker-compose.prod.yml"
ENV_FILE="$PROJECT_ROOT/.env.production"
SERVICE_NAME="backend"
HEALTH_CHECK_URL="https://84.247.165.153/api/health"
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

# Function to check if service is healthy
check_service_health() {
    local retries=0
    local max_retries=$((MAX_WAIT_TIME / 10))
    
    log "Checking backend health..."
    
    while [ $retries -lt $max_retries ]; do
        if curl -f -k -s "$HEALTH_CHECK_URL" > /dev/null 2>&1; then
            success "Backend is healthy!"
            return 0
        fi
        
        retries=$((retries + 1))
        log "Health check attempt $retries/$max_retries..."
        sleep 10
    done
    
    error "Backend health check failed after $MAX_WAIT_TIME seconds"
    return 1
}

# Function to create backup before deployment
create_backup() {
    log "Creating pre-deployment backup..."
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_dir="$PROJECT_ROOT/backups/pre-deploy-backend-$timestamp"
    
    mkdir -p "$backup_dir"
    
    # Backup database
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec -T postgres pg_dump -U postgres ahmedurkmez_db > "$backup_dir/database.sql" 2>/dev/null || {
        warning "Database backup failed, continuing anyway..."
    }
    
    # Backup uploads
    if [ -d "$PROJECT_ROOT/uploads" ]; then
        cp -r "$PROJECT_ROOT/uploads" "$backup_dir/" 2>/dev/null || {
            warning "Uploads backup failed, continuing anyway..."
        }
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
deploy_backend() {
    log "Starting backend deployment..."
    
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
    
    # Build new backend image
    log "Building backend image..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" build "$SERVICE_NAME" || {
        error "Backend build failed!"
        exit 1
    }
    
    # Stop current backend service
    log "Stopping current backend service..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" stop "$SERVICE_NAME"
    
    # Remove old backend container
    log "Removing old backend container..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" rm -f "$SERVICE_NAME"
    
    # Start new backend service
    log "Starting new backend service..."
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --no-deps "$SERVICE_NAME" || {
        rollback
        exit 1
    }
    
    # Wait for service to be healthy
    log "Waiting for backend to be ready..."
    if check_service_health; then
        success "Backend deployment completed successfully!"
        
        # Cleanup old images
        log "Cleaning up old Docker images..."
        docker image prune -f > /dev/null 2>&1 || true
        
        # Log deployment
        echo "$(date '+%Y-%m-%d %H:%M:%S') - Backend deployed successfully" >> "$PROJECT_ROOT/logs/deployment.log"
        
    else
        rollback
        exit 1
    fi
}

# Create logs directory if it doesn't exist
mkdir -p "$PROJECT_ROOT/logs"

# Run deployment
trap 'error "Deployment interrupted"; rollback; exit 1' INT TERM

deploy_backend

success "Backend deployment completed! 🚀"
