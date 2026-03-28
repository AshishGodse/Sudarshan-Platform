# 🔒 Secure Deployment Guide - Sudarshan Platform with Custom Domain

**Last Updated**: March 2026  
**For**: Production deployment with custom domain (e.g., yourdomain.com)

---

## Table of Contents
1. [Pre-Deployment Setup](#pre-deployment-setup)
2. [Security Checklist](#security-checklist)
3. [Server Setup](#server-setup)
4. [SSL/TLS Certificate](#ssltls-certificate)
5. [Docker & Application](#docker--application)
6. [Nginx Reverse Proxy](#nginx-reverse-proxy)
7. [Domain Configuration](#domain-configuration)
8. [Environment Variables](#environment-variables)
9. [Firewall Rules](#firewall-rules)
10. [Monitoring & Maintenance](#monitoring--maintenance)
11. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Setup

### Prerequisites
- ✅ Custom domain registered (e.g., `www.yourdomain.com`)
- ✅ VPS or dedicated server (Ubuntu 22.04+ recommended)
- ✅ SSH access to server
- ✅ YouTube API key
- ✅ Basic Linux command knowledge
- ✅ 1GB RAM minimum (2GB+ recommended)

### Recommended Providers
- **DigitalOcean**: $5-20/month, easy setup
- **Linode**: $5-20/month, good performance
- **Vultr**: $2.50+/month, fast globally
- **AWS Lightsail**: $3.50+/month, pay-as-you-go
- **Hetzner**: €3+/month, excellent value

---

## Security Checklist

Before deploying, ensure:

- [ ] Use HTTPS only (SSL/TLS certificate)
- [ ] API keys are in environment variables (NOT in code)
- [ ] Firewall blocks all ports except 22 (SSH), 80 (HTTP), 443 (HTTPS)
- [ ] SSH uses public key authentication (not password)
- [ ] Server has automatic updates enabled
- [ ] Log files are monitored
- [ ] Regular backups enabled
- [ ] HSTS headers configured
- [ ] Hot-module reloading disabled in production
- [ ] Error details hidden from end users

---

## Server Setup

### Step 1: Initial Server Configuration

```bash
# SSH into your server
ssh root@your.server.ip

# Update system packages
apt update && apt upgrade -y

# Install essential tools
apt install -y curl wget git nano htop
```

### Step 2: Install Docker & Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
rm get-docker.sh

# Add current user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### Step 3: Create Application Directory

```bash
# Create app directory
mkdir -p /home/sudarshan
cd /home/sudarshan

# Clone your repository (replace with your repo)
git clone https://github.com/yourusername/sudarshan-platform .

# Set proper permissions
sudo chown -R $USER:$USER /home/sudarshan
chmod 755 /home/sudarshan
```

---

## SSL/TLS Certificate

### Option A: Let's Encrypt (FREE - Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate (replace with your domain)
sudo certbot certonly --standalone \
  -d yourdomain.com \
  -d www.yourdomain.com \
  --email your-email@example.com \
  --agree-tos \
  --non-interactive

# Certificate location:
# - Certificate: /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# - Private Key: /etc/letsencrypt/live/yourdomain.com/privkey.pem

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Verify renewal
sudo certbot renew --dry-run
```

### Option B: Paid SSL Certificate

If you prefer a paid certificate from:
- **Sectigo/Comodo**
- **DigiCert**
- **GlobalSign**

Contact your domain registrar for setup instructions.

---

## Docker & Application

### Step 1: Update Environment Variables

```bash
# Create .env file with PRODUCTION settings
cat > /home/sudarshan/.env.production << 'EOF'
# YouTube API
NEXT_PUBLIC_YOUTUBE_API_KEY=your_actual_api_key_here

# Node environment
NODE_ENV=production

# Data persistence
DATA_DIR=/app/data

# Security headers
SECURE_HEADERS=true
EOF
```

**⚠️ IMPORTANT**: 
- Never commit `.env.production` to Git
- Use strong, random API keys
- Rotate API keys regularly
- Keep this file readable only by docker: `chmod 600 .env.production`

### Step 2: Update Dockerfile for Production

Check if your Dockerfile has production optimizations:

```dockerfile
# Dockerfile
FROM node:20-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --production

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
```

### Step 3: Update docker-compose.yml for Production

```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: sudarshan-prod
    restart: always
    ports:
      - "3000:3000"
    env_file: .env.production
    volumes:
      - ./data:/app/data
      - /etc/letsencrypt/live/yourdomain.com:/app/certs:ro
    environment:
      NODE_ENV: production
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/channels"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - sudarshan-net

networks:
  sudarshan-net:
    driver: bridge
```

### Step 4: Start Application

```bash
cd /home/sudarshan

# Build and start containers
docker-compose -f docker-compose.yml up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app

# Test if running
curl http://localhost:3000
```

---

## Nginx Reverse Proxy

Nginx acts as:
- HTTPS gateway
- Load balancer
- Cache layer
- Security headers provider

### Step 1: Install Nginx

```bash
apt install -y nginx

# Verify installation
nginx -v
```

### Step 2: Create Nginx Configuration

```bash
# Create config file
sudo nano /etc/nginx/sites-available/sudarshan
```

**Paste this configuration:**

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    
    return 301 https://$server_name$request_uri;
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Certificate paths (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL Configuration (Security Best Practices)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Logging
    access_log /var/log/nginx/sudarshan_access.log;
    error_log /var/log/nginx/sudarshan_error.log;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json;
    gzip_min_length 1024;

    # Proxy settings
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 90;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public, immutable";
    }

    # API routes - no caching
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_cache off;
    }

    # Rate limiting for API
    location /api/channels {
        limit_req zone=api burst=10 nodelay;
        proxy_pass http://localhost:3000;
    }
}

# Rate limiting zone
limit_req_zone $binary_remote_addr zone=api:10m rate=5r/s;
```

### Step 3: Enable Nginx Configuration

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/sudarshan /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# If OK, restart nginx
sudo systemctl restart nginx

# Enable auto-start
sudo systemctl enable nginx
```

---

## Domain Configuration

### Step 1: Update DNS Records

Go to your domain registrar (GoDaddy, Namecheap, etc.) and add these DNS records:

**DNS A Records:**
```
Type    | Name  | Value           | TTL
--------|-------|-----------------|-----
A       | @     | your.server.ip  | 3600
A       | www   | your.server.ip  | 3600
```

**DNS CNAME (Optional, for www redirect):**
```
Type    | Name | Value        | TTL
--------|------|--------------|-----
CNAME   | www  | yourdomain.com | 3600
```

### Step 2: Verify DNS Propagation

```bash
# Check DNS records
nslookup yourdomain.com
# or
dig yourdomain.com

# Test connectivity
curl -I https://yourdomain.com
```

**Expected output should show:**
- `HTTP/2 200` or `HTTP/1.1 200`
- No SSL errors
- Certificate valid

---

## Environment Variables

### Step 1: Protect API Key

**NEVER do this:**
```javascript
// ❌ WRONG - Never hardcode API keys
const apiKey = "AIzaSyCdqcL0Ib8Hr6tMJSgZpEol7cGl4aO-7QM";
```

**DO this instead:**

In `.env.production`:
```
NEXT_PUBLIC_YOUTUBE_API_KEY=your_actual_key
```

In your code (`src/lib/youtube.ts`):
```typescript
const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

if (!apiKey) {
  throw new Error("YouTube API key not configured");
}
```

### Step 2: Rotate API Keys

Every 3-6 months:

```bash
# Generate new API key from Google Cloud Console
# Update .env.production
nano /home/sudarshan/.env.production

# Restart docker
docker-compose restart
```

### Step 3: Add Rate Limiting

Create `src/lib/rateLimiter.ts`:

```typescript
import { NextResponse } from 'next/server';

const requestCounts = new Map<string, { count: number; reset: number }>();

export function rateLimit(identifier: string, limit = 10, window = 60000) {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  if (!record || now > record.reset) {
    requestCounts.set(identifier, { count: 1, reset: now + window });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}
```

---

## Firewall Rules

### Step 1: Configure UFW (Uncomplicated Firewall)

```bash
# Enable firewall
sudo ufw enable

# Allow SSH (important! Don't lock yourself out)
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Deny everything else
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Check rules
sudo ufw status
```

### Step 2: Configure Fail2Ban (Attack Protection)

```bash
# Install Fail2Ban
sudo apt install -y fail2ban

# Create config
sudo nano /etc/fail2ban/jail.local
```

**Paste this:**
```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s

[nginx-http-auth]
enabled = true
logpath = %(nginx_error_log)s

[nginx-noscript]
enabled = true
logpath = %(nginx_access_log)s
```

```bash
# Enable Fail2Ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Check status
sudo fail2ban-client status
```

---

## Monitoring & Maintenance

### Step 1: Set Up Log Monitoring

```bash
# Create monitoring script
nano /home/sudarshan/monitor.sh
```

**Paste this:**
```bash
#!/bin/bash

# Check Docker container health
docker-compose ps

# Check disk space
df -h

# Check memory usage
free -h

# Check application logs
docker-compose logs --tail 20

# Check Nginx logs
tail -20 /var/log/nginx/sudarshan_error.log
```

```bash
chmod +x /home/sudarshan/monitor.sh
```

### Step 2: Set Up Automatic Backups

```bash
# Create backup script
nano /home/sudarshan/backup.sh
```

**Paste this:**
```bash
#!/bin/bash

BACKUP_DIR="/home/sudarshan/backups"
mkdir -p $BACKUP_DIR

# Backup channels data
cp /home/sudarshan/data/channels.json $BACKUP_DIR/channels_$(date +%Y%m%d_%H%M%S).json

# Keep last 30 days only
find $BACKUP_DIR -name "*.json" -mtime +30 -delete

echo "Backup completed"
```

```bash
chmod +x /home/sudarshan/backup.sh

# Schedule daily backup (crontab)
crontab -e

# Add this line:
0 2 * * * /home/sudarshan/backup.sh
```

### Step 3: Monitor Application Health

```bash
# Create health check script
nano /home/sudarshan/healthcheck.sh
```

**Paste this:**
```bash
#!/bin/bash

# Check if application is running
if curl -sf https://yourdomain.com/api/channels > /dev/null; then
    echo "✓ Application is healthy"
else
    echo "✗ Application is down!"
    # Send alert email
    echo "Application down" | mail -s "Alert: Sudarshan Platform" admin@example.com
    
    # Attempt restart
    docker-compose restart
fi
```

```bash
chmod +x /home/sudarshan/healthcheck.sh

# Run every 5 minutes
crontab -e

# Add:
*/5 * * * * /home/sudarshan/healthcheck.sh
```

---

## Troubleshooting

### Issue 1: SSL Certificate Not Loading

```bash
# Check certificate validity
sudo certbot certificates

# Check certificate expiration
openssl x509 -in /etc/letsencrypt/live/yourdomain.com/fullchain.pem -text -noout | grep -A2 "Validity"

# Force renewal
sudo certbot renew --force-renewal

# Reload Nginx
sudo systemctl reload nginx
```

### Issue 2: Domain Not Resolving

```bash
# Flush DNS cache
sudo resolvectl flush-caches

# Check DNS propagation
nslookup yourdomain.com
dig yourdomain.com

# Test from different DNS servers
nslookup yourdomain.com 8.8.8.8  # Google DNS
nslookup yourdomain.com 1.1.1.1  # Cloudflare DNS
```

### Issue 3: Application Running Slowly

```bash
# Check resource usage
docker stats

# Check if container restarting
docker-compose logs | grep "restart"

# Increase memory limit in docker-compose.yml:
services:
  app:
    mem_limit: 512m
    memswap_limit: 1g
```

### Issue 4: YouTube API Returns 403 (Quota Exceeded)

```bash
# Check API quota in Google Cloud Console
# Increase quota or implement caching

# Add Redis caching:
docker run -d --name redis -p 6379:6379 redis:alpine

# Update API calls to cache results for 1 hour
```

### Issue 5: Cannot Access Server via SSH

```bash
# On your local machine, generate SSH key
ssh-keygen -t rsa -b 4096 -f ~/.ssh/sudarshan_key

# Copy public key to server
ssh-copy-id -i ~/.ssh/sudarshan_key.pub root@your.server.ip

# Use key to connect
ssh -i ~/.ssh/sudarshan_key root@your.server.ip
```

---

## Production Checklist

Before going live:

- [ ] SSL certificate installed and valid
- [ ] Domain points to server IP
- [ ] Nginx reverse proxy configured
- [ ] Firewall rules in place
- [ ] API key in environment variables
- [ ] Docker containers running healthy
- [ ] Logs monitored
- [ ] Backups automated
- [ ] Health checks running
- [ ] Fail2Ban protecting SSH
- [ ] Rate limiting configured
- [ ] Security headers set
- [ ] Test HTTPS connection: `https://yourdomain.com`
- [ ] Test API endpoint: `https://yourdomain.com/api/channels`

---

## Quick Reference: Commands

```bash
# View logs
docker-compose logs -f app

# Restart application
docker-compose restart

# Update application (pull latest code)
cd /home/sudarshan
git pull
docker-compose up -d --build

# Check certificate expiration
sudo certbot certificates

# Check Nginx status
sudo systemctl status nginx

# Monitor resources
docker stats

# Backup data
cp -r /home/sudarshan/data /home/sudarshan/data.backup
```

---

## Support & Questions

For issues with:
- **Next.js**: https://nextjs.org/docs
- **Docker**: https://docs.docker.com/
- **Nginx**: https://nginx.org/en/docs/
- **YouTube API**: https://developers.google.com/youtube/v3
- **Let's Encrypt**: https://letsencrypt.org/getting-started/

---

**Last Updated**: March 2026  
**Version**: 1.0
