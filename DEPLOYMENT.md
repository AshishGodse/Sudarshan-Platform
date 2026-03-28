# 🚀 Sudarshan Platform - Deployment Guide

## Quick Links
- **Local Development**: `npm run dev` → http://localhost:3000
- **Docker**: `docker-compose up -d` → http://localhost:3000
- **Production Build**: `npm run build && npm start`

---

## 1. Local Development (Easiest)

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org))
- YouTube API Key (optional but recommended)

### Steps
```bash
# 1. Install dependencies
npm install

# 2. Create .env.local
cp .env.example .env.local

# 3. Add your YouTube API key
# Edit .env.local and add your key

# 4. Run development server
npm run dev

# 5. Open browser
# http://localhost:3000
```

**Benefits**:
- ✅ Fast hot reload
- ✅ Easy debugging
- ✅ Full TypeScript support
- ✅ Development tools enabled

---

## 2. Docker Deployment (Recommended for Production)

### Prerequisites
- Docker ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)

### Steps

#### Option A: Using Docker Compose (Easiest)
```bash
# 1. Edit docker-compose.yml and add your YouTube API key
# OR set environment variable:
export YOUTUBE_API_KEY=your_api_key_here

# 2. Start the application
docker-compose up -d

# 3. Check if running
docker-compose ps

# 4. View logs
docker-compose logs -f web

# 5. Stop
docker-compose down
```

#### Option B: Using Plain Docker
```bash
# 1. Build the image
docker build -t sudarshan-platform .

# 2. Run the container
docker run -d \
  --name sudarshan \
  -p 3000:3000 \
  -e NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key \
  -v $(pwd)/data:/app/data \
  sudarshan-platform

# 3. View logs
docker logs -f sudarshan

# 4. Stop
docker stop sudarshan
```

**Benefits**:
- ✅ Consistent across environments
- ✅ Easy scaling
- ✅ Isolated dependencies
- ✅ Production-ready

---

## 3. Vercel Deployment (Best for Next.js)

Vercel is made by the creators of Next.js and offers the best experience.

### Steps

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/sudarshan-platform
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "Add New Project"
   - Select your repository
   - Click "Import"

3. **Configure Environment Variables**
   - In Project Settings → Environment Variables
   - Add: `NEXT_PUBLIC_YOUTUBE_API_KEY` = your_api_key
   - Click "Save"

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your site will be live at `https://your-project.vercel.app`

5. **Setup Custom Domain** (Optional)
   - In Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

**Benefits**:
- ✅ Free tier available
- ✅ Automatic deployments on push
- ✅ Global CDN included
- ✅ Serverless (no server management)
- ✅ Analytics included

---

## 4. AWS Deployment

### Option A: AWS Lightsail (Easiest VPS)
```bash
# 1. Create a Lightsail instance (Ubuntu)
# 2. SSH into the instance
ssh -i your-key.pem ubuntu@your-instance-ip

# 3. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 4. Clone your repository
git clone https://github.com/yourusername/sudarshan-platform
cd sudarshan-platform

# 5. Create .env file
echo "NEXT_PUBLIC_YOUTUBE_API_KEY=your_key" > .env.local

# 6. Run with Docker Compose
docker-compose up -d

# 7. Setup Nginx reverse proxy (optional)
sudo apt update && sudo apt install nginx
# Configure nginx to forward to port 3000
```

### Option B: AWS ECS Fargate (Serverless Containers)
```bash
# 1. Push image to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

docker build -t sudarshan-platform .
docker tag sudarshan-platform:latest $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/sudarshan-platform:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/sudarshan-platform:latest

# 2. Create ECS cluster and task definition
# (Use AWS Console or CloudFormation)

# 3. Create service and load balancer
# (Automatically scales based on load)
```

---

## 5. DigitalOcean Deployment

### Using App Platform (Git-based)
```
1. Go to digitalocean.com/apps
2. Click "Create App"
3. Connect GitHub repository
4. Configure:
   - Build command: npm run build
   - Run command: npm start
5. Add environment variables
6. Deploy
```

### Using Droplet + Docker
```bash
# 1. Create Ubuntu Droplet
# 2. SSH in
ssh root@your-droplet-ip

# 3. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 4. Clone and run
git clone https://github.com/yourusername/sudarshan-platform
cd sudarshan-platform
docker-compose up -d
```

---

## 6. Heroku Deployment

Heroku has removed free tier, but still offers a good experience:

```bash
# 1. Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# 2. Create Procfile
echo "web: npm start" > Procfile

# 3. Deploy
heroku login
heroku create sudarshan-platform
heroku config:set NEXT_PUBLIC_YOUTUBE_API_KEY=your_key
git push heroku main

# 4. Open
heroku open
```

---

## 7. Self-Hosted VPS (Generic)

Works on Linode, Hetzner, Vultr, etc.

```bash
# 1. SSH into server
ssh root@your.server.ip

# 2. Update system
apt update && apt upgrade -y

# 3. Install Docker
curl -fsSL https://get.docker.com | sh
usermod -aG docker root

# 4. Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 5. Clone repository
git clone https://github.com/yourusername/sudarshan-platform
cd sudarshan-platform

# 6. Setup environment
echo "NEXT_PUBLIC_YOUTUBE_API_KEY=your_key" > .env.local

# 7. Run with Docker Compose
docker-compose up -d

# 8. Setup Nginx reverse proxy
apt install -y nginx

# 9. Configure Nginx (create /etc/nginx/sites-available/sudarshan)
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 10. Enable the site
ln -s /etc/nginx/sites-available/sudarshan /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# 11. Setup SSL with Let's Encrypt
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

---

## 8. Scaling for High Traffic

### Load Balancing
```bash
# Run multiple instances
docker-compose up -d --scale web=3

# Or use cloud provider's load balancer
# AWS ALB, DigitalOcean Load Balancer, etc.
```

### Database Scaling
```bash
# Replace local JSON with MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sudarshan

# Or PostgreSQL
DATABASE_URL=postgresql://user:pass@host/db
```

### Caching
```bash
# Add Redis for API caching
# Store YouTube API responses to reduce calls
```

### CDN
```bash
# All videos are served via YouTube CDN (free)
# For your assets, use Cloudflare or CloudFront
```

---

## 9. Monitoring & Health Checks

### Docker Health Check
```yaml
# In docker-compose.yml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000"]
  interval: 30s
  timeout: 10s
  retries: 3
```

### Application Monitoring
- **Vercel**: Built-in analytics
- **AWS**: CloudWatch
- **DigitalOcean**: Monitoring tools
- **Self-hosted**: Prometheus + Grafana

---

## 10. Backup & Recovery

### Backup Data
```bash
# Backup local storage
docker cp sudarshan:/app/data ./backup-$(date +%Y%m%d)

# Or setup volume backups with your cloud provider
```

### Database Backup
```bash
# MongoDB
mongodump --uri="mongodb+srv://..." --out ./backup

# PostgreSQL
pg_dump -h host -U user database > backup.sql
```

---

## Environment Variables Reference

```env
# Required for live stream features
NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key

# Optional - for database (defaults to local JSON)
DATABASE_URL=mongodb+srv://...
# or
DATABASE_URL=postgresql://...

# Storage mode
USE_LOCAL_STORAGE=true

# Application environment
NODE_ENV=production
```

---

## Troubleshooting

### "Port already in use"
```bash
# Change docker-compose.yml port
# Or kill process: lsof -i :3000 | kill -9 <pid>
```

### "Docker: permission denied"
```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### "Build fails in Docker"
```bash
# Check Dockerfile syntax
docker build --no-cache -t sudarshan .

# Check Node version
docker run node:18-alpine node --version
```

### "No live streams found"
- Verify YouTube API key is correct
- Check channel ID is valid
- Verify API is enabled in Google Cloud

---

## Recommended Setups by Use Case

### Personal Project
- **Local**: `npm run dev`
- **Production**: Vercel (free tier)

### Small Business
- **Deployment**: Docker on DigitalOcean Droplet ($5/month)
- **Database**: DigitalOcean Managed Database (optional)
- **Monitoring**: Built-in Docker logs

### High Traffic (1000+ users)
- **Deployment**: AWS ECS Fargate with ALB
- **Database**: MongoDB Atlas or AWS RDS
- **Caching**: AWS ElastiCache (Redis)
- **CDN**: CloudFront
- **Monitoring**: CloudWatch + DataDog

---

## Cost Comparison

| Platform | Monthly Cost | Scaling | Best For |
|----------|-------------|---------|----------|
| **Vercel** | $0-20 | Automatic | Next.js projects |
| **DigitalOcean App** | $5+ | Manual | Simple deployments |
| **DigitalOcean Droplet** | $5+ | Manual | Full control |
| **AWS Fargate** | $10-100+ | Automatic | Enterprise |
| **Heroku** | $50+ | Automatic | Easy deployment |
| **Self-hosted VPS** | $5+ | Manual | Maximum control |

---

## Quick Deploy Checklist

- [ ] Code committed to GitHub
- [ ] YouTube API key obtained
- [ ] Environment variables configured
- [ ] Build tested locally
- [ ] Docker build tested locally
- [ ] Deployment platform selected
- [ ] Domain configured (if applicable)
- [ ] SSL/HTTPS enabled
- [ ] Health checks configured
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] Documentation updated

---

For questions or issues, refer to [SETUP_GUIDE.md](./SETUP_GUIDE.md) or check the [README.md](./README.md).

🙏 Happy deploying! 🚀
