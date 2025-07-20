# Ahmed Urkmez - Production Deployment Guide

Bu doküman, Ahmed Urkmez uygulamasının production sunucusunda nasıl deploy edileceğini açıklar.

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Ubuntu 20.04+ veya CentOS 8+ sunucu
- Docker ve Docker Compose
- Node.js 18+
- PostgreSQL (Docker içinde çalışacak)
- En az 2GB RAM, 20GB disk alanı
- Domain adı ve SSL sertifikası

### Tek Komutla Deployment

```bash
# Repository'yi klonlayın
git clone https://github.com/yourusername/ahmedurkmez.git
cd ahmedurkmez

# Production deployment script'ini çalıştırın
sudo ./deploy.sh
```

## 📋 Detaylı Setup

### 1. Sunucu Hazırlığı

```bash
# Sistem güncellemesi
sudo apt update && sudo apt upgrade -y

# Docker kurulumu
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Docker Compose kurulumu
sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Node.js kurulumu
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Gerekli araçlar
sudo apt-get install -y git curl wget unzip htop
```

### 2. Environment Konfigürasyonu

```bash
# .env.production dosyasını oluşturun
cp .env.production.example .env.production

# Güvenli secret'ları generate edin
./scripts/generate-secrets.sh

# .env.production dosyasını düzenleyin
nano .env.production
```

#### Önemli Environment Variables:

```bash
# Database
DATABASE_PASSWORD=your-strong-password
DATABASE_NAME=ahmedurkmez_db

# Security
JWT_SECRET=your-256-bit-secret
ADMIN_PASSWORD=your-admin-password

# Domain
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
CORS_ORIGIN=https://yourdomain.com

# Mail
MAIL_HOST=smtp.gmail.com
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### 3. SSL Sertifikası Setup

#### Let's Encrypt (Önerilen):

```bash
# Certbot kurulumu
sudo apt install certbot python3-certbot-nginx

# SSL sertifikası alın
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

#### Self-signed Certificate (Test için):

```bash
# Deploy script otomatik oluşturacak
./deploy.sh ssl
```

### 4. Database Setup

```bash
# Database'i başlatın
docker-compose -f docker-compose.prod.yml up -d postgres

# Database setup script'ini çalıştırın
./scripts/database-setup.sh
```

### 5. Application Build ve Deploy

```bash
# Tüm servisleri build edin ve başlatın
docker-compose -f docker-compose.prod.yml up -d --build

# Servislerin durumunu kontrol edin
docker-compose -f docker-compose.prod.yml ps
```

## 🔧 Yönetim Komutları

### Servis Yönetimi

```bash
# Servisleri başlat
docker-compose -f docker-compose.prod.yml up -d

# Servisleri durdur
docker-compose -f docker-compose.prod.yml down

# Servisleri yeniden başlat
docker-compose -f docker-compose.prod.yml restart

# Logları görüntüle
docker-compose -f docker-compose.prod.yml logs -f
```

### Backup ve Restore

```bash
# Manual backup
./scripts/backup.sh

# Backup restore
./scripts/restore.sh 20241220_143022

# Otomatik backup setup
./scripts/setup-cron.sh
```

### Monitoring

```bash
# Tek seferlik health check
./scripts/monitor.sh

# Sürekli monitoring (daemon mode)
./scripts/monitor.sh --daemon

# Monitoring servisini başlat
sudo systemctl start ahmedurkmez-monitor
sudo systemctl enable ahmedurkmez-monitor
```

## 📊 Servis Durumları

### Health Check Endpoints

- **Frontend**: `http://yourdomain.com`
- **Backend API**: `http://yourdomain.com/api/health`
- **Nginx**: `http://yourdomain.com/health`

### Log Dosyaları

```bash
# Application logs
tail -f logs/backend/combined.log
tail -f logs/frontend/combined.log
tail -f logs/nginx/access.log

# Backup logs
tail -f logs/backup-$(date +%Y%m%d).log

# Monitor logs
tail -f logs/monitor-$(date +%Y%m%d).log
```

## 🔒 Güvenlik

### Firewall Konfigürasyonu

```bash
# UFW ile port açma
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### SSL Sertifikası Yenileme

```bash
# Let's Encrypt otomatik yenileme
sudo crontab -e
# Ekleyin: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Güvenlik Updates

```bash
# Sistem güncellemeleri
sudo apt update && sudo apt upgrade -y

# Docker image güncellemeleri
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## 📈 Performance Optimizasyonu

### Database Optimizasyonu

```bash
# PostgreSQL ayarları
sudo docker exec -it ahmedurkmez_postgres_prod psql -U postgres -c "
  ALTER SYSTEM SET shared_buffers = '256MB';
  ALTER SYSTEM SET effective_cache_size = '1GB';
  SELECT pg_reload_conf();
"
```

### Nginx Cache

```bash
# Nginx cache konfigürasyonu nginx/conf.d/cache.conf'da
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=10g 
                 inactive=60m use_temp_path=off;
```

## 🚨 Troubleshooting

### Yaygın Problemler

#### 1. Container başlamıyor
```bash
# Logları kontrol edin
docker-compose -f docker-compose.prod.yml logs [service_name]

# Disk alanını kontrol edin
df -h

# Memory kullanımını kontrol edin
free -m
```

#### 2. Database bağlantı sorunu
```bash
# Database container'ının çalıştığını kontrol edin
docker ps | grep postgres

# Database bağlantısını test edin
docker exec -it ahmedurkmez_postgres_prod pg_isready
```

#### 3. SSL sertifikası problemi
```bash
# Sertifika geçerliliğini kontrol edin
openssl x509 -in nginx/ssl/cert.pem -text -noout

# Let's Encrypt yenileme
sudo certbot renew --dry-run
```

### Emergency Recovery

```bash
# Son backup'tan restore
./scripts/restore.sh $(ls /backups/database/ | grep ahmedurkmez_db | sort -r | head -1 | sed 's/.*_db_\(.*\)\.sql\.gz/\1/')

# Servisleri safe mode'da başlat
docker-compose -f docker-compose.yml up -d postgres
```

## 📞 Support ve Monitoring

### Monitoring Alerts

Environment variables ile webhook URL konfigüre ederek Slack/Discord/Teams entegrasyonu:

```bash
WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### Maintenance Mode

```bash
# Maintenance page aktif et
echo "Maintenance in progress..." > nginx/maintenance.html
# Nginx konfigürasyonunu güncelle
```

## 📝 Notlar

- Production environment'da debug mode kapatılmalı
- Log rotate konfigürasyonu yapılmalı  
- Regular backup verification yapılmalı
- Security updates takip edilmeli
- Performance metrics monitör edilmeli