module.exports = {
  apps: [
    {
      name: 'ahmedurkmez-backend',
      script: 'dist/main.js',
      cwd: './apps/server',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      // Monitoring
      monitoring: true,
      pmx: true,
      
      // Auto restart
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      
      // Logging
      log_file: './logs/backend/combined.log',
      out_file: './logs/backend/out.log',
      error_file: './logs/backend/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Advanced settings
      kill_timeout: 5000,
      listen_timeout: 8000,
      wait_ready: true,
      
      // Health monitoring
      min_uptime: '10s',
      max_restarts: 10,
      
      // Cron restart (optional - restart every day at 2 AM)
      cron_restart: '0 2 * * *',
      
      // Environment-specific settings
      env_file: '.env.production'
    },
    {
      name: 'ahmedurkmez-frontend',
      script: 'server.js',
      cwd: './apps/client',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      
      // Monitoring
      monitoring: true,
      pmx: true,
      
      // Auto restart
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      
      // Logging
      log_file: './logs/frontend/combined.log',
      out_file: './logs/frontend/out.log',
      error_file: './logs/frontend/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Advanced settings
      kill_timeout: 5000,
      listen_timeout: 8000,
      wait_ready: true,
      
      // Health monitoring
      min_uptime: '10s',
      max_restarts: 10,
      
      // Environment-specific settings
      env_file: '.env.production'
    }
  ],

  // Deployment configuration
  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server-ip'],
      ref: 'origin/main',
      repo: 'https://github.com/yourusername/ahmedurkmez.git',
      path: '/var/www/ahmedurkmez',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'mkdir -p /var/www/ahmedurkmez/logs/backend /var/www/ahmedurkmez/logs/frontend',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};