#!/bin/bash

# Script to generate secure secrets for production deployment
# Run this script to generate secure random values for sensitive configuration

echo "Generating secure secrets for production..."
echo "========================================"

# Generate JWT Secret (256-bit)
JWT_SECRET=$(openssl rand -base64 32)
echo "JWT_SECRET=$JWT_SECRET"
echo ""

# Generate Database Password
DB_PASSWORD=$(openssl rand -base64 24 | tr -d "=+/" | cut -c1-20)
echo "DATABASE_PASSWORD=$DB_PASSWORD"
echo ""

# Generate Redis Password
REDIS_PASSWORD=$(openssl rand -base64 24 | tr -d "=+/" | cut -c1-20)
echo "REDIS_PASSWORD=$REDIS_PASSWORD"
echo ""

# Generate Admin Password
ADMIN_PASSWORD=$(openssl rand -base64 24 | tr -d "=+/" | cut -c1-16)
echo "ADMIN_PASSWORD=$ADMIN_PASSWORD"
echo ""

echo "IMPORTANT SECURITY NOTES:"
echo "========================"
echo "1. Save these values securely and never commit them to version control"
echo "2. Use these values in your .env.production file"
echo "3. Ensure your production server has proper file permissions (600) for .env files"
echo "4. Consider using a secrets management service for production"
echo "5. Rotate these secrets regularly"
echo ""

echo "To set proper permissions on your .env files:"
echo "chmod 600 .env.production"
echo "chown root:root .env.production"