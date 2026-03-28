#!/bin/bash
# Quick start script for Sudarshan Platform

echo "🙏 Sudarshan Platform - Quick Start"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org"
    exit 1
fi

echo "✓ Node.js is installed"
node --version

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check .env.local
echo ""
echo "🔑 Checking environment configuration..."
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Creating template..."
    cat > .env.local << EOF
# YouTube API Configuration
NEXT_PUBLIC_YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY_HERE

# Database Configuration
DATABASE_URL=mongodb://localhost:27017/sudarshan
USE_LOCAL_STORAGE=true

# Environment
NODE_ENV=development
EOF
    echo "✓ Created .env.local template"
    echo "  → Please add your YouTube API key to .env.local"
else
    echo "✓ .env.local already configured"
fi

# Build
echo ""
echo "🏗️  Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✓ Build successful!"

# Ready to run
echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the development server, run:"
echo "   npm run dev"
echo ""
echo "📱 Then open: http://localhost:3000"
echo ""
echo "🐳 To run with Docker Compose:"
echo "   docker-compose up -d"
echo ""
echo "📖 For more information, see SETUP_GUIDE.md"
