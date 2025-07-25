#!/bin/bash

# SSL Certificate Generation Script
# Generates self-signed SSL certificates for production use

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SSL_DIR="$PROJECT_ROOT/nginx/ssl"
SERVER_IP="84.247.165.153"
CERT_VALIDITY_DAYS=365

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

# Generate SSL certificates
generate_ssl_certificates() {
    log "Generating SSL certificates for $SERVER_IP..."
    
    # Create SSL directory if it doesn't exist
    mkdir -p "$SSL_DIR"
    
    # Change to SSL directory
    cd "$SSL_DIR"
    
    # Generate private key
    log "Generating private key..."
    openssl genrsa -out key.pem 2048
    
    # Generate certificate signing request
    log "Generating certificate signing request..."
    openssl req -new -key key.pem -out cert.csr -subj "/C=TR/ST=Istanbul/L=Istanbul/O=AhmedUrkMez/CN=$SERVER_IP" -config <(
        echo '[req]'
        echo 'distinguished_name = req'
        echo '[san]'
        echo "subjectAltName=IP:$SERVER_IP"
    ) -extensions san
    
    # Generate self-signed certificate
    log "Generating self-signed certificate..."
    openssl x509 -req -in cert.csr -signkey key.pem -out cert.pem -days $CERT_VALIDITY_DAYS -extensions san -extfile <(
        echo '[san]'
        echo "subjectAltName=IP:$SERVER_IP"
    )
    
    # Set proper permissions
    chmod 600 key.pem
    chmod 644 cert.pem
    
    # Remove CSR file
    rm cert.csr
    
    # Verify certificate
    log "Verifying certificate..."
    if openssl x509 -in cert.pem -text -noout | grep -q "$SERVER_IP"; then
        success "SSL certificate generated and verified successfully!"
        success "Certificate valid for $CERT_VALIDITY_DAYS days"
        
        # Display certificate info
        log "Certificate information:"
        openssl x509 -in cert.pem -text -noout | grep -A 1 "Subject:\|Not Before:\|Not After:\|DNS:\|IP Address:"
    else
        error "Certificate verification failed!"
        exit 1
    fi
}

# Main function
main() {
    log "Starting SSL certificate generation..."
    
    # Check if openssl is available
    if ! command -v openssl > /dev/null 2>&1; then
        error "OpenSSL is not installed!"
        exit 1
    fi
    
    # Backup existing certificates if they exist
    if [ -f "$SSL_DIR/cert.pem" ] || [ -f "$SSL_DIR/key.pem" ]; then
        local backup_dir="$SSL_DIR/backup-$(date +%Y%m%d_%H%M%S)"
        log "Backing up existing certificates to $backup_dir..."
        mkdir -p "$backup_dir"
        cp "$SSL_DIR"/*.pem "$backup_dir/" 2>/dev/null || true
    fi
    
    # Generate new certificates
    generate_ssl_certificates
    
    success "SSL certificate generation completed!"
}

# Run the script
main "$@"
