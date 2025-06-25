#!/bin/bash

echo "🚀 Building AI Study Buddy for Vercel..."

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install react-scripts explicitly
echo "🔧 Installing react-scripts..."
npm install react-scripts@5.0.1

# Build the frontend
echo "🏗️ Building frontend..."
npm run build

echo "✅ Build completed successfully!" 