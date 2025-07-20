-- Production Database Initialization Script
-- This script sets up the production database with proper security settings

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS ahmedurkmez_db;

-- Switch to the database
\c ahmedurkmez_db;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create indexes for better performance
-- These will be created by TypeORM migrations, but listed here for reference

-- Performance optimizations
-- Update statistics
ANALYZE;

-- Grant necessary permissions to application user
GRANT CONNECT ON DATABASE ahmedurkmez_db TO postgres;
GRANT USAGE ON SCHEMA public TO postgres;
GRANT CREATE ON SCHEMA public TO postgres;

-- Security settings
-- Revoke public access to database
REVOKE ALL ON DATABASE ahmedurkmez_db FROM PUBLIC;

-- Log configuration
ALTER SYSTEM SET log_min_duration_statement = 1000;
ALTER SYSTEM SET log_checkpoints = on;
ALTER SYSTEM SET log_connections = on;
ALTER SYSTEM SET log_disconnections = on;
ALTER SYSTEM SET log_lock_waits = on;

-- Performance settings
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.7;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;

-- Apply changes
SELECT pg_reload_conf();