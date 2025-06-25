# AI Study Buddy - Deployment Guide

## Overview
This guide will help you deploy your AI Study Buddy application to Vercel, which is recommended for its simplicity and excellent free tier.

## Prerequisites
1. A GitHub account
2. A Vercel account (free at vercel.com)
3. A MongoDB database (MongoDB Atlas free tier recommended)
4. OpenAI API key
5. Firebase project (for authentication)

## Step 1: Prepare Your Database

### MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user with read/write permissions
4. Get your connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/database`)

## Step 2: Prepare Environment Variables

You'll need to set these environment variables in Vercel:

### Backend Environment Variables
```
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/ai-study-buddy
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=your-openai-api-key
FRONTEND_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

### Frontend Environment Variables (React App)
```
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_API_URL=https://your-app-name.vercel.app/api
```

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy your application:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy: Yes
   - Which scope: Select your account
   - Link to existing project: No
   - Project name: ai-study-buddy (or your preferred name)
   - Directory: ./ (current directory)

### Option B: Deploy via GitHub Integration

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project settings:
   - Framework Preset: Node.js
   - Root Directory: ./
   - Build Command: `npm run vercel-build`
   - Output Directory: frontend/build
   - Install Command: `npm install`

## Step 4: Configure Environment Variables in Vercel

1. Go to your project dashboard in Vercel
2. Navigate to Settings > Environment Variables
3. Add all the environment variables listed in Step 2
4. Make sure to set them for "Production" environment

## Step 5: Update Frontend API Configuration

After deployment, update your frontend to use the production API URL:

1. In your frontend code, make sure API calls use the production URL
2. Update any hardcoded localhost URLs to use `process.env.REACT_APP_API_URL`

## Step 6: Test Your Deployment

1. Visit your Vercel URL (e.g., `https://your-app-name.vercel.app`)
2. Test the main functionality:
   - User registration/login
   - Chat functionality
   - Flashcard creation
   - Quiz features

## Troubleshooting

### Common Issues:

1. **Build Errors**: Check that all dependencies are in package.json
2. **Environment Variables**: Ensure all required env vars are set in Vercel
3. **Database Connection**: Verify MongoDB connection string is correct
4. **CORS Issues**: Check that FRONTEND_URL is set correctly

### Debug Commands:
```bash
# Check build logs
vercel logs

# Redeploy
vercel --prod

# Check environment variables
vercel env ls
```

## Alternative Deployment Options

### Railway
- Similar to Vercel but with better database integration
- Good for full-stack apps with MongoDB

### Render
- Free tier available
- Good for Node.js applications

### Heroku
- More traditional platform
- Requires credit card for free tier

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to your repository
2. **JWT Secret**: Use a strong, random secret
3. **API Keys**: Rotate keys regularly
4. **CORS**: Configure properly for production
5. **Rate Limiting**: Already implemented in your server

## Monitoring and Maintenance

1. Set up Vercel Analytics (free)
2. Monitor your MongoDB Atlas dashboard
3. Check Vercel function logs regularly
4. Set up error monitoring (e.g., Sentry)

## Cost Optimization

- Vercel: Free tier includes 100GB bandwidth/month
- MongoDB Atlas: Free tier includes 512MB storage
- OpenAI: Pay per use (very affordable for small scale)

Your application should now be live and accessible via a public URL! 