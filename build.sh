#!/bin/bash

echo "🚀 Building AI Study Buddy for Render..."

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install react-scripts explicitly
echo "🔧 Installing react-scripts..."
npm install react-scripts@5.0.1

# Build the frontend with environment variables explicitly set
echo "🏗️ Building frontend..."
REACT_APP_FIREBASE_API_KEY="AIzaSyAz4KaboNV1JnIfzTNmmXvfZuDEcziqWMo" \
REACT_APP_FIREBASE_AUTH_DOMAIN="studybuddy-778f8.firebaseapp.com" \
REACT_APP_FIREBASE_PROJECT_ID="studybuddy-778f8" \
REACT_APP_FIREBASE_STORAGE_BUCKET="studybuddy-778f8.firebasestorage.app" \
REACT_APP_FIREBASE_MESSAGING_SENDER_ID="733206808364" \
REACT_APP_FIREBASE_APP_ID="1:733206808364:web:e325f8833192a502f9ce89" \
npm run build

# Copy build to root directory for server to serve
echo "📁 Copying build to root directory..."
cp -r build ../public

echo "✅ Build completed successfully!" 