# Deployment Guide

## Quick Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Configuration**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

## Alternative Deployment Options

### Netlify
1. Connect GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `.next`

### Manual Deployment
```bash
# Build the project
npm run build

# The built files will be in .next folder
# Upload to your hosting service
```

## Environment Variables
No environment variables required - the app uses the free Open-Meteo API.

## Post-Deployment Checklist
- [ ] Test all features on deployed URL
- [ ] Verify map functionality
- [ ] Test polygon drawing
- [ ] Check timeline slider
- [ ] Verify API data loading
- [ ] Test on mobile devices