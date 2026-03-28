# 🙏 Sudarshan Platform - Live Darshan Setup Guide

## Overview
A modern, scalable web platform for experiencing sacred live feeds from temples. Built with Next.js and YouTube API integration.

## What You've Been Set Up With

### Technology Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes (Node.js)
- **Storage**: Local JSON file storage (upgradeable to MongoDB/PostgreSQL)
- **API**: YouTube Data API v3 for dynamic live stream fetching
- **Deployment**: Docker & Docker Compose
- **Scalability**: Stateless design, ready for load balancing

### Key Features Implemented

✅ **Live Darshan Dashboard** - Multiple video windows displaying temple streams
✅ **Dynamic YouTube Integration** - No hardcoded links, automatic live stream detection
✅ **Channel Management** - Add, edit, delete temple channels via UI
✅ **Responsive Design** - Works on desktop, tablet, and mobile
✅ **Real-time Stats** - View counts and engagement metrics
✅ **API-First Architecture** - RESTful endpoints for all operations
✅ **Docker Ready** - Single command deployment with `docker-compose up`
✅ **Zero Configuration** - Works out of the box with default settings

## Project Structure

```
sudarshan-platform/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Home page (Live Darshan)
│   │   ├── layout.tsx               # Root layout
│   │   └── api/
│   │       └── channels/            # All channel endpoints
│   │           ├── route.ts         # GET all, POST new
│   │           ├── [id]/
│   │           │   ├── route.ts     # GET/PUT/DELETE single
│   │           │   └── live/
│   │           │       └── route.ts # GET live stream
│   ├── components/
│   │   ├── LiveStreamWindow.tsx     # Individual video player
│   │   └── LiveDarshanPage.tsx      # Main dashboard
│   └── lib/
│       ├── youtube.ts               # YouTube API utilities
│       └── storage.ts               # Data persistence layer
├── data/                            # Local storage (auto-created)
├── public/                          # Static assets
├── Dockerfile                       # Container image
├── docker-compose.yml               # Container orchestration
├── .env.local                       # Environment variables
├── next.config.ts                   # Next.js configuration
├── tsconfig.json                    # TypeScript configuration
└── README.md                        # Default template README
```

## Getting Started (5 minutes)

### 1. Install Dependencies
```bash
cd c:\Users\Ashish\OneDrive\Desktop\SecuRT\sudarshan-platform
npm install
```

### 2. Configure YouTube API (Optional but Recommended)

**Option A: With YouTube API (Recommended)**
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable "YouTube Data API v3"
   - Search for "YouTube Data API v3"
   - Click "ENABLE"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the API key

**Option B: Without API (Demo Mode)**
- Platform will still work, but won't fetch live streams
- Good for testing UI/functionality

### 3. Add API Key to Environment
```bash
# Edit .env.local in project root
NEXT_PUBLIC_YOUTUBE_API_KEY=your_copied_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

### 5. Add Your First Temple Channel

Click "+ Add Channel" and fill in:
- **Name**: Siddhivinayak Mumbai
- **Channel ID**: ShreeSiddhivinayakTrust (from youtube.com/@ShreeSiddhivinayakTrust)
- **Description**: Live Darshan from Siddhivinayak Temple

The platform will automatically fetch the latest live feed!

## How to Find YouTube Channel IDs

### Method 1: From Channel URL
- Visit the channel on YouTube
- URL format: `https://www.youtube.com/@CHANNEL_NAME`
- **Channel ID = CHANNEL_NAME** (the part after @)

### Method 2: From Channel Settings
1. Go to your channel
2. Click "About" tab
3. Scroll to find the channel ID

### Example Channels to Try
- Siddhivinayak Temple: `ShreeSiddhivinayakTrust`
- Kashi Vishwanath: `KashiVishwanath`
- Tirupati Temple: `TTDofficial`

## API Endpoints

### Channel Management
```
GET    /api/channels              - Get all channels
POST   /api/channels              - Add new channel
GET    /api/channels/[id]         - Get single channel
PUT    /api/channels/[id]         - Update channel
DELETE /api/channels/[id]         - Delete channel
GET    /api/channels/[id]/live    - Get live stream for channel
```

### Example API Calls
```bash
# Add a channel
curl -X POST http://localhost:3000/api/channels \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Siddhivinayak Mumbai",
    "channelId": "ShreeSiddhivinayakTrust",
    "description": "Temple in Mumbai"
  }'

# Get all channels
curl http://localhost:3000/api/channels

# Get live stream
curl http://localhost:3000/api/channels/ch_1234567890/live
```

## Docker Deployment (Easy Scaling)

### Local Docker Testing
```bash
# Build image
docker build -t sudarshan .

# Run with Docker
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_YOUTUBE_API_KEY=your_key \
  -v $(pwd)/data:/app/data \
  sudarshan
```

### Production with Docker Compose (Recommended)
```bash
# Edit docker-compose.yml and add your API key
# Then run:
docker-compose up -d

# View logs
docker-compose logs -f web

# Stop
docker-compose down
```

## Cloud Deployment Options

### Option 1: Vercel (Recommended for Next.js)
- **Easiest**: Vercel is made by Next.js creators
- **Steps**:
  1. Push code to GitHub
  2. Connect repo to [vercel.com](https://vercel.com)
  3. Add `NEXT_PUBLIC_YOUTUBE_API_KEY` in dashboard
  4. Deploy automatically on push
- **Cost**: Free tier available
- **Scaling**: Automatic

### Option 2: AWS
- **EC2 + Docker**: Manual setup, full control
- **ECS Fargate**: Serverless containers, pay per use
- **Lightsail**: Simple VPS alternative
- **App Runner**: Simple container deployment

### Option 3: DigitalOcean
- **App Platform**: Git-based, similar to Vercel
- **Droplets**: VPS with Docker Compose
- **Docker Hub**: Push image, deploy from DO
- **Cost**: ~$5/month minimum

### Option 4: Other VPS (Linode, Hetzner, etc.)
```bash
# SSH into server
# Install Docker & Docker Compose
# Clone repo
git clone <your-repo>

# Run
docker-compose up -d

# Setup Nginx reverse proxy (optional)
# Point domain to server IP
```

## Scaling for High Traffic

The platform is built for scale:

1. **Stateless**: No session storage, run multiple instances
2. **Docker**: Use Kubernetes or Docker Swarm
3. **Database**: Swap JSON for MongoDB/PostgreSQL
4. **CDN**: Videos served via YouTube CDN (free)
5. **Caching**: Add Redis for API caching
6. **Load Balancer**: Nginx or cloud provider's LB

### Scale to 1000 Concurrent Users
```bash
# With Docker Swarm
docker swarm init
docker stack deploy -c docker-compose.yml sudarshan

# Or use Kubernetes
kubectl apply -f k8s-config.yaml
```

## Configuration

### Environment Variables
```bash
# YouTube API
NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key

# Database (optional upgrade)
DATABASE_URL=mongodb+srv://user:pass@host/db

# Storage
USE_LOCAL_STORAGE=true

# Environment
NODE_ENV=production
```

### Next.js Config
Edit `next.config.ts` to customize:
- Custom domain
- API rewrites
- Redirects
- Image optimization

### Tailwind CSS
Edit `tailwind.config.ts` to:
- Change color scheme
- Customize fonts
- Adjust spacing/sizes

## Troubleshooting

### "No live streams found"
- Check Channel ID is correct
- Channel must have public videos
- Platform falls back to latest video

### "YouTube API Key issues"
- Verify key is in `.env.local`
- Check API is enabled in Google Cloud
- Confirm key has no restrictions

### "Port 3000 already in use"
```bash
# Use different port
npm run dev -- -p 3001
```

### "Data not persisting with Docker"
```yaml
# In docker-compose.yml, ensure:
volumes:
  - ./data:/app/data
```

## Next Steps

### For Development
1. [ ] Add more channels
2. [ ] Customize UI colors/fonts
3. [ ] Add user accounts
4. [ ] Implement favorites
5. [ ] Add search functionality

### For Production
1. [ ] Set up custom domain
2. [ ] Enable HTTPS
3. [ ] Configure backups
4. [ ] Set up monitoring
5. [ ] Add analytics
6. [ ] Implement rate limiting

### Feature Roadmap
- [ ] User authentication
- [ ] Multi-language support
- [ ] Schedule/notifications
- [ ] Comment system
- [ ] Admin dashboard
- [ ] Mobile app
- [ ] API documentation
- [ ] Payment integration

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **YouTube API**: https://developers.google.com/youtube/v3
- **Docker Docs**: https://docs.docker.com
- **Tailwind CSS**: https://tailwindcss.com/docs

## License
MIT - Use freely for any purpose

---

🙏 **Sudarshan** - "Good Vision" in Sanskrit

Built with ❤️ for spiritual seekers and tech enthusiasts
