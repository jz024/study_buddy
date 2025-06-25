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

# Go back to root directory
cd ..

# Create public directory if it doesn't exist
echo "📁 Creating public directory..."
mkdir -p public

# Copy build to root directory for server to serve
echo "📁 Copying build to root directory..."
cp -r frontend/build/* public/

# Verify the files were copied
echo "✅ Verifying build files..."
ls -la public/
echo "✅ index.html exists: $(test -f public/index.html && echo 'YES' || echo 'NO')"

echo "✅ Build completed successfully!" 