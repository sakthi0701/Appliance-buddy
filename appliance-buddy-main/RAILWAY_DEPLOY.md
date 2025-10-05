# Railway Deployment Guide

## ✅ Issues Fixed:

- **ES Module Support**: Fixed `__dirname` issue in ES modules by using `fileURLToPath` and `import.meta.url`
- **Package Manager**: Forced npm usage instead of Bun by removing `bun.lockb` and configuring nixpacks
- **Build Process**: Verified complete build and start process works correctly

## Quick Deploy

1. **Connect Repository to Railway:**
   - Go to [Railway.app](https://railway.app)
   - Connect your GitHub repository
   - Railway will auto-detect this as a Node.js project

2. **Set Environment Variables:**
   ```
   NODE_ENV=production
   VITE_SUPABASE_URL=https://ovrfhetyaysygxmkemit.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92cmZoZXR5YXlzeWd4bWtlbWl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NDIzNTUsImV4cCI6MjA3NDAxODM1NX0.R81hDr6kyFE-TgQzrJH0EjmHQ7gToDVy483dgb842vw
   ```

3. **Deploy:**
   - Railway will automatically use npm (not Bun)
   - Build command: `npm run build`
   - Start command: `npm run start:prod`
   - Health check: `/health`

## Files Configured for Railway:

- ✅ `nixpacks.toml` - Forces npm usage
- ✅ `.railwayignore` - Excludes unnecessary files
- ✅ `.npmrc` - npm configuration
- ✅ `package.json` - Build and start scripts
- ✅ Removed `bun.lockb` to prevent Bun detection

## Architecture:

Single service deployment:
- Backend serves API endpoints (`/api/*`)
- Backend serves frontend static files (`/*`)
- Health check endpoint (`/health`)