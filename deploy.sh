#!/bin/bash

# Ahmed Urkmez Production Deployment Script
# This master script deploys the application to production

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
PROJECT_NAME="ahmedurkmez"
DOMAIN="${DOMAIN:-yourdomain.com}"
ENVIRONMENT="${ENVIRONMENT:-production}"

print_header() {
    echo -e "${BLUE}"
    echo "========================================"
    echo "   Ahmed Urkmez - Production Deploy"
    echo "========================================"
    echo -e "${NC}"
}

print_step() {
    echo -e "${GREEN}[STEP] $1${NC}"
}

print_info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

print_error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

# Validate environment
validate_environment() {
    print_step "Validating environment..."
    
    # Check required commands
    local required_commands=("docker" "docker-compose" "git" "node" "npm")
    for cmd in "${required_commands[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            print_error "Required command not found: $cmd"
            exit 1
        fi
    done
    
    # Check if running as root for production setup
    if [ "$EUID" -eq 0 ] && [ "$ENVIRONMENT" = "production" ]; then
        print_warning "Running as root. This is acceptable for production setup."
    fi
    
    # Check environment file
    if [ ! -f ".env.production" ]; then
        print_error ".env.production file not found!"
        print_info "Please copy .env.production.example to .env.production and configure it."
        exit 1
    fi
    
    print_info "Environment validation completed"
}

# Generate secrets if needed
setup_secrets() {
    print_step "Setting up security secrets..."
    
    if [ ! -f ".env.production" ] || grep -q "your-super-strong-jwt-secret" .env.production; then
        print_info "Generating secure secrets..."
        ./scripts/generate-secrets.sh
        print_warning "Please update .env.production with the generated secrets above"
        read -p "Press Enter after updating .env.production..."
    fi
    
    # Set proper permissions
    chmod 600 .env.production
    chmod 600 apps/server/.env.production 2>/dev/null || true
    chmod 600 apps/client/.env.production 2>/dev/null || true
    
    print_info "Security setup completed"
}

# Setup SSL certificates
setup_ssl() {
    print_step "Setting up SSL certificates..."
    
    mkdir -p nginx/ssl
    
    if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then
        print_warning "SSL certificates not found"
        print_info "Options:"
        echo "1. Use Let's Encrypt (recommended for production)"
        echo "2. Use self-signed certificates (for testing)"
        echo "3. Use existing certificates"
        
        read -p "Choose option (1-3): " ssl_option
        
        case $ssl_option in
            1)
                print_info "Setting up Let's Encrypt..."
                # Add Let's Encrypt setup here
                print_warning "Let's Encrypt setup requires manual configuration"
                print_info "Please run: certbot --nginx -d $DOMAIN"
                ;;
            2)
                print_info "Generating self-signed certificates..."
                openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
                    -keyout nginx/ssl/key.pem \
                    -out nginx/ssl/cert.pem \
                    -subj "/C=TR/ST=Istanbul/L=Istanbul/O=$PROJECT_NAME/CN=$DOMAIN"
                ;;
            3)
                print_info "Please place your certificates in nginx/ssl/"
                print_info "cert.pem - Certificate file"
                print_info "key.pem - Private key file"
                read -p "Press Enter after placing certificates..."
                ;;
        esac
    fi
    
    print_info "SSL setup completed"
}

# Build and deploy
build_and_deploy() {
    print_step "Building and deploying application..."
    
    # Load environment variables
    export $(cat .env.production | grep -v '^#' | xargs)
    
    # Stop existing services
    print_info "Stopping existing services..."
    docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
    
    # Build images
    print_info "Building Docker images..."
    docker-compose -f docker-compose.prod.yml build --no-cache
    
    # Setup database
    print_info "Setting up database..."
    ./scripts/database-setup.sh
    
    # Start services
    print_info "Starting services..."
    docker-compose -f docker-compose.prod.yml up -d
    
    # Wait for services to be ready
    print_info "Waiting for services to be ready..."
    sleep 30
    
    # Health check
    local max_attempts=12
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost/health >/dev/null 2>&1; then
            print_info "Application is ready!"
            break
        fi
        
        print_info "Waiting for application... (attempt $attempt/$max_attempts)"
        sleep 10
        ((attempt++))
    done
    
    if [ $attempt -gt $max_attempts ]; then
        print_error "Application failed to start properly"
        print_info "Check logs: docker-compose -f docker-compose.prod.yml logs"
        exit 1
    fi
    
    print_info "Deployment completed successfully!"
}

# Setup monitoring
setup_monitoring() {
    print_step "Setting up monitoring..."
    
    # Setup backup cron job
    print_info "Setting up automated backups..."
    ./scripts/setup-cron.sh
    
    # Create monitoring service (systemd)
    if command -v systemctl &> /dev/null; then
        print_info "Creating monitoring service..."
        
        cat > /etc/systemd/system/ahmedurkmez-monitor.service << EOF
[Unit]
Description=Ahmed Urkmez Application Monitor
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$(pwd)
ExecStart=$(pwd)/scripts/monitor.sh --daemon
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

        systemctl daemon-reload
        systemctl enable ahmedurkmez-monitor
        systemctl start ahmedurkmez-monitor
        
        print_info "Monitoring service started"
    fi
    
    print_info "Monitoring setup completed"
}

# Post-deployment checks
post_deployment_checks() {
    print_step "Running post-deployment checks..."
    
    # Run health checks
    ./scripts/monitor.sh
    
    # Check logs for errors
    print_info "Checking application logs..."
    docker-compose -f docker-compose.prod.yml logs --tail=50
    
    # Display service status
    print_info "Service status:"
    docker-compose -f docker-compose.prod.yml ps
    
    print_info "Post-deployment checks completed"
}

# Display deployment summary
show_summary() {
    print_step "Deployment Summary"
    
    echo -e "${GREEN}"
    echo "🎉 Deployment completed successfully!"
    echo ""
    echo "📋 Services:"
    echo "   • Frontend: http://$DOMAIN"
    echo "   • Backend API: http://$DOMAIN/api"
    echo "   • Admin Panel: http://$DOMAIN/admin"
    echo ""
    echo "📊 Monitoring:"
    echo "   • Health Check: http://$DOMAIN/health"
    echo "   • Logs: docker-compose -f docker-compose.prod.yml logs -f"
    echo "   • Monitor: systemctl status ahmedurkmez-monitor"
    echo ""
    echo "🔧 Management Commands:"
    echo "   • Backup: ./scripts/backup.sh"
    echo "   • Restore: ./scripts/restore.sh <backup_date>"
    echo "   • Monitor: ./scripts/monitor.sh"
    echo ""
    echo "📁 Important Files:"
    echo "   • Environment: .env.production"
    echo "   • SSL Certificates: nginx/ssl/"
    echo "   • Backups: /backups/"
    echo "   • Logs: ./logs/"
    echo -e "${NC}"
    
    print_warning "Next Steps:"
    echo "1. Update DNS records to point to this server"
    echo "2. Configure firewall rules (ports 80, 443)"
    echo "3. Setup SSL certificate renewal (if using Let's Encrypt)"
    echo "4. Configure monitoring alerts"
    echo "5. Test all functionality thoroughly"
}

# Main execution
main() {
    print_header
    
    print_info "Starting production deployment for $PROJECT_NAME"
    print_info "Domain: $DOMAIN"
    print_info "Environment: $ENVIRONMENT"
    echo ""
    
    validate_environment
    setup_secrets
    setup_ssl
    build_and_deploy
    setup_monitoring
    post_deployment_checks
    show_summary
    
    print_info "🚀 Production deployment completed!"
}

# Handle script arguments
case "${1:-}" in
    "build")
        build_and_deploy
        ;;
    "monitor")
        setup_monitoring
        ;;
    "check")
        post_deployment_checks
        ;;
    "ssl")
        setup_ssl
        ;;
    *)
        main
        ;;
esac