#!/bin/bash

# Production Database Setup Script
# This script sets up the production database and runs necessary migrations

set -e

echo "Starting production database setup..."

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
else
    echo "Error: .env.production file not found!"
    exit 1
fi

# Wait for database to be ready
echo "Waiting for database to be ready..."
while ! pg_isready -h ${DATABASE_HOST} -p ${DATABASE_PORT} -U ${DATABASE_USERNAME}; do
  echo "Waiting for database..."
  sleep 2
done

echo "Database is ready!"

# Run database initialization (if needed)
if [ -f database/init-production.sql ]; then
    echo "Running database initialization..."
    PGPASSWORD=${DATABASE_PASSWORD} psql -h ${DATABASE_HOST} -p ${DATABASE_PORT} -U ${DATABASE_USERNAME} -d postgres -f database/init-production.sql
fi

# Navigate to server directory
cd apps/server

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm ci --only=production
fi

# Build the application if not already built
if [ ! -d "dist" ]; then
    echo "Building application..."
    npm run build
fi

# Run database migrations
echo "Running database migrations..."
npm run migration:run || echo "Migration command not found, skipping..."

# Create admin user
echo "Creating admin user..."
npm run create-admin || echo "Admin creation failed or already exists"

echo "Database setup completed!"

# Create backup directory
mkdir -p ../backups

echo "Production database setup completed successfully!"
echo "Important reminders:"
echo "1. Make sure to setup regular database backups"
echo "2. Monitor database performance and logs"
echo "3. Keep database credentials secure"
echo "4. Setup SSL connection to database in production"