#!/bin/bash

set -e  # Exit on any error

echo "🚀 Building AI Study Buddy for Render (Robust Version)..."

# Install backend dependencies first (this should happen automatically, but let's be explicit)
echo "📦 Installing backend dependencies..."
npm install --production=false

# Verify critical packages are installed
echo "🔍 Verifying critical packages..."
if [ -d "node_modules/@google-cloud/speech" ]; then
    echo "✅ @google-cloud/speech package found"
else
    echo "❌ @google-cloud/speech package NOT found - installing..."
    npm install @google-cloud/speech --save
fi

# Navigate to frontend directory
cd frontend

echo "📦 Installing frontend dependencies..."
npm install --production=false

echo "🔧 Ensuring react-scripts is installed..."
npm install react-scripts@5.0.1 --save-dev

echo "🔍 Checking public directory structure..."
if [ ! -d "public" ]; then
    echo "📁 Creating public directory..."
    mkdir -p public
fi

if [ ! -f "public/index.html" ]; then
    echo "📄 Creating index.html..."
    cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#1976d2" />
    <meta
      name="description"
      content="AI Study Buddy - Your intelligent companion for effective learning through AI-powered chat, flashcards, and personalized quizzes. Study smarter with artificial intelligence."
    />
    <meta name="keywords" content="AI, study, learning, education, flashcards, quiz, chat, artificial intelligence, student, tutor" />
    <meta name="author" content="AI Study Buddy" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="AI Study Buddy - Intelligent Learning Companion" />
    <meta property="og:description" content="Study smarter with AI-powered chat, flashcards, and personalized quizzes" />
    <meta property="og:url" content="https://aistudybuddy.com" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content="AI Study Buddy - Intelligent Learning Companion" />
    <meta property="twitter:description" content="Study smarter with AI-powered chat, flashcards, and personalized quizzes" />
    
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Favicon -->
    <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico" />
    
    <title>AI Study Buddy - Intelligent Learning Companion</title>
  </head>
  <body>
    <noscript>
      You need to enable JavaScript to run AI Study Buddy. 
      Please enable JavaScript in your browser settings and refresh the page.
    </noscript>
    <div id="root"></div>
  </body>
</html>
EOF
fi

if [ ! -f "public/manifest.json" ]; then
    echo "📄 Creating manifest.json..."
    cat > public/manifest.json << 'EOF'
{
  "short_name": "AI Study Buddy",
  "name": "AI Study Buddy - Intelligent Learning Companion",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#1976d2",
  "background_color": "#ffffff"
}
EOF
fi

echo "🔍 Verifying public directory..."
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