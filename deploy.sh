#!/bin/bash

echo "🚀 AI Study Buddy Deployment Script"
echo "=================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing now..."
    npm install -g vercel
else
    echo "✅ Vercel CLI is already installed"
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel..."
    vercel login
else
    echo "✅ Already logged in to Vercel"
fi

# Build the frontend
echo "🔨 Building frontend..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "📝 Don't forget to set up your environment variables in the Vercel dashboard"
echo "📖 Check DEPLOYMENT.md for detailed instructions" 