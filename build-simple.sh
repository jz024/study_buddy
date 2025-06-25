#!/bin/bash

set -e  # Exit on any error

echo "🚀 Building AI Study Buddy for Render (Simple Version)..."

# Navigate to frontend directory
cd frontend

echo "📦 Installing dependencies..."
npm install --production=false

echo "🔧 Ensuring react-scripts is installed..."
npm install react-scripts@5.0.1 --save-dev

echo "🔍 Checking public directory structure..."
ls -la public/

echo "🏗️ Building React app..."
export REACT_APP_FIREBASE_API_KEY="AIzaSyAz4KaboNV1JnIfzTNmmXvfZuDEcziqWMo"
export REACT_APP_FIREBASE_AUTH_DOMAIN="studybuddy-778f8.firebaseapp.com"
export REACT_APP_FIREBASE_PROJECT_ID="studybuddy-778f8"
export REACT_APP_FIREBASE_STORAGE_BUCKET="studybuddy-778f8.firebasestorage.app"
export REACT_APP_FIREBASE_MESSAGING_SENDER_ID="733206808364"
export REACT_APP_FIREBASE_APP_ID="1:733206808364:web:e325f8833192a502f9ce89"

npm run build

echo "✅ Build completed in frontend/build/"
ls -la build/

# Go back to root and copy files
cd ..
echo "📁 Creating public directory..."
mkdir -p public

echo "📁 Copying build files..."
cp -r frontend/build/* public/

echo "✅ Final verification..."
ls -la public/
echo "✅ index.html exists: $(test -f public/index.html && echo 'YES' || echo 'NO')"

echo "🎉 Build completed successfully!" 