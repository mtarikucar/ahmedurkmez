# AhmedUrkMez Production Deployment System

A comprehensive deployment and backup automation system for the AhmedUrkMez project.

## 🚀 Quick Start

### Initial Setup
```bash
# Make scripts executable
chmod +x scripts/*.sh

# Setup automated backups
./scripts/setup-cron.sh

# Deploy the application
./scripts/deploy-manager.sh deploy full
```

## 📋 Available Scripts

### Deployment Scripts
- `deploy-manager.sh` - Central deployment manager (recommended)
- `deploy-full.sh` - Deploy entire application stack
- `deploy-backend.sh` - Deploy only backend service
- `deploy-frontend.sh` - Deploy only frontend service

### Backup Scripts
- `backup-daily.sh` - Daily backup (database, uploads, configs)
- `backup-weekly.sh` - Weekly backup (comprehensive)
- `backup-monthly.sh` - Monthly backup (archival)

### Utility Scripts
- `setup-cron.sh` - Setup automated backup schedules
- `generate-ssl.sh` - Generate SSL certificates

## 🎛️ Deployment Manager Usage

The deployment manager is the recommended way to interact with the system:

```bash
# Deploy services
./scripts/deploy-manager.sh deploy full      # Full deployment
./scripts/deploy-manager.sh deploy backend   # Backend only
./scripts/deploy-manager.sh deploy frontend  # Frontend only

# Run backups
./scripts/deploy-manager.sh backup daily     # Daily backup
./scripts/deploy-manager.sh backup weekly    # Weekly backup
./scripts/deploy-manager.sh backup monthly   # Monthly backup

# System management
./scripts/deploy-manager.sh status           # Show system status
./scripts/deploy-manager.sh logs nginx       # Show service logs
./scripts/deploy-manager.sh restart backend  # Restart service
./scripts/deploy-manager.sh monitor          # Live monitoring dashboard
./scripts/deploy-manager.sh rollback         # Rollback deployment

# Setup and maintenance
./scripts/deploy-manager.sh setup            # Setup automation
./scripts/deploy-manager.sh update           # Update scripts
```

## 🔄 CI/CD Pipeline

The project includes GitHub Actions workflow for automated deployment:

### Triggers
- **Push to main branch**: Automatic full deployment
- **Pull Request**: Build and test only
- **Manual dispatch**: Choose deployment type (full/backend/frontend)

### Workflow Steps
1. **Build & Test**: Compile and test both backend and frontend
2. **Security Scan**: Vulnerability scanning with Trivy
3. **Docker Build**: Build and push container images
4. **Deploy**: Deploy to production server
5. **Verify**: Health checks and deployment verification
6. **Notify**: Deployment status notifications

### Required Secrets
Configure these secrets in GitHub repository settings:
- `PRODUCTION_SSH_PRIVATE_KEY`: SSH private key for production server

## 📦 Backup System

### Backup Types

#### Daily Backups (Retention: 7 days)
- Database snapshot
- Upload files
- Configuration files
- Container logs

#### Weekly Backups (Retention: 4 weeks)
- Complete database backup with schema
- Full application data
- System configuration
- Docker images
- System state snapshot

#### Monthly Backups (Retention: 12 months)
- Comprehensive database archive
- Complete application archive
- Source code snapshot
- System documentation
- Integrity verification

### Backup Schedule
```
Daily:   Every day at 2:00 AM
Weekly:  Every Sunday at 3:00 AM
Monthly: 1st of each month at 4:00 AM
```

### Backup Locations
```
backups/
├── daily/          # Daily backups
├── weekly/         # Weekly backups
└── monthly/        # Monthly backups
```

## 🔧 System Requirements

### Server Requirements
- Ubuntu 20.04+ or similar Linux distribution
- Docker 20.10+
- Docker Compose 1.29+
- 2GB+ RAM
- 20GB+ disk space
- Root or sudo access

### Network Requirements
- HTTP/HTTPS (ports 80/443)
- SSH access (port 22)
- Internet connectivity for package installation

## 🛡️ Security Features

### SSL/TLS
- Self-signed certificates for IP-based access
- Automatic certificate generation
- HTTPS enforcement
- Security headers configuration

### Container Security
- Non-root user execution where possible
- Resource limits and constraints
- Health checks for all services
- Isolated networking

### Backup Security
- Automated backup verification
- Integrity checking with checksums
- Secure backup storage options
- Optional S3 integration with encryption

## 🔍 Monitoring

### Health Checks
- Application health endpoints
- Database connectivity checks
- Container health monitoring
- Resource usage tracking

### Logging
- Structured logging for all services
- Automated log rotation
- Deployment and backup logs
- Error tracking and alerting

### Monitoring Dashboard
```bash
./scripts/deploy-manager.sh monitor
```

## 🚨 Troubleshooting

### Common Issues

#### Deployment Fails
```bash
# Check service status
./scripts/deploy-manager.sh status

# Check logs
./scripts/deploy-manager.sh logs backend
./scripts/deploy-manager.sh logs frontend

# Restart services
./scripts/deploy-manager.sh restart
```

#### Health Checks Failing
```bash
# Check container logs
docker-compose -f docker-compose.prod.yml logs backend

# Restart unhealthy services
docker-compose -f docker-compose.prod.yml restart backend
```

#### Out of Disk Space
```bash
# Clean up old Docker resources
docker system prune -a

# Clean up old backups
find backups/ -type d -mtime +30 -exec rm -rf {} \;

# Check disk usage
df -h
```

### Recovery Procedures

#### Database Recovery
```bash
# Stop services
docker-compose -f docker-compose.prod.yml down

# Restore from latest backup
gunzip -c backups/latest/database.sql.gz | \
  docker-compose -f docker-compose.prod.yml exec -T postgres \
  psql -U postgres ahmedurkmez_db

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

#### Full System Recovery
```bash
# Use the deployment manager rollback
./scripts/deploy-manager.sh rollback

# Or manually restore from backup
./scripts/deploy-full.sh
```

## 📊 Performance Optimization

### Docker Optimization
- Multi-stage builds for smaller images
- Layer caching for faster builds
- Resource limits for containers
- Health checks for reliability

### Application Optimization
- Production environment variables
- Compression middleware
- Static file optimization
- Database connection pooling

## 🔒 Environment Configuration

### Production Environment Variables
All production configuration is stored in `.env.production`:

```bash
# Database
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=<generated>
DATABASE_NAME=ahmedurkmez_db

# Application
NODE_ENV=production
PORT=3001

# Security
JWT_SECRET=<generated>
REDIS_PASSWORD=<generated>

# Frontend
NEXT_PUBLIC_API_URL=https://84.247.165.153/api
```

## 📝 Maintenance Tasks

### Daily
- Automated backups
- Log rotation
- Health monitoring

### Weekly
- Comprehensive backups
- Docker image cleanup
- Security updates check

### Monthly
- Full system backup
- Performance review
- SSL certificate check
- Backup integrity verification

## 🤝 Contributing

### Adding New Services
1. Update `docker-compose.prod.yml`
2. Add health checks
3. Update deployment scripts
4. Test deployment process

### Modifying Backup Strategy
1. Update backup scripts
2. Test restore procedures
3. Update retention policies
4. Document changes

## 📞 Support

For issues and questions:
1. Check logs: `./scripts/deploy-manager.sh logs [service]`
2. Check status: `./scripts/deploy-manager.sh status`
3. Review backup logs: `cat logs/backup.log`
4. Check deployment logs: `cat logs/deployment.log`

## 📄 License

This deployment system is part of the AhmedUrkMez project and follows the same licensing terms.
