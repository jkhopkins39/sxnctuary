# Image Upload Setup Guide

## Overview
The merch system now uses ImgBB for cloud image storage instead of local file storage. This ensures images work properly when deployed.

## Setup Steps

### 1. Get ImgBB API Key (Free)

1. Go to [https://api.imgbb.com/](https://api.imgbb.com/)
2. Click "Get API Key" or "Register"
3. Create a free account
4. Copy your API key

### 2. Add API Key to Environment Variables

Add your ImgBB API key to your `.env` file:

```env
# Existing variables
VITE_ADMIN_USERNAME=sxnctuaryAdmin
VITE_ADMIN_PASSWORD=drumnbass2025
DATABASE_URL="file:./dev.db"

# Add this new variable
IMGBB_API_KEY=your_imgbb_api_key_here
```

### 3. For Vercel Deployment

Add the environment variable to your Vercel project:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   - **Name**: `IMGBB_API_KEY`
   - **Value**: Your ImgBB API key
   - **Environment**: Production, Preview, Development

### 4. Test the Setup

1. Start your development server: `npm run dev:full`
2. Go to the merch page
3. Login as admin
4. Try adding a product with images
5. Images should upload to ImgBB and display properly

## Features

- **Free Storage**: ImgBB provides free image hosting
- **No Local Files**: Images are stored in the cloud
- **Deployment Ready**: Works with Vercel, Netlify, etc.
- **CDN**: Images are served via CDN for fast loading
- **No Maintenance**: No need to manage local file storage

## Alternative Services

If you prefer other services, you can easily switch to:

- **Cloudinary**: More features, generous free tier
- **AWS S3**: Professional solution, pay per use
- **Firebase Storage**: Google's solution, good free tier

## Troubleshooting

### Images not uploading?
- Check your ImgBB API key is correct
- Ensure the API key is in your environment variables
- Check the browser console for errors

### Images not displaying?
- Verify the ImgBB API key has proper permissions
- Check if the image URLs are being returned correctly
- Ensure your deployment has the environment variable set

### API Key not working?
- Make sure you're using the correct API key from ImgBB
- Check if your ImgBB account is active
- Verify the API key format (should be a long string of letters/numbers)

## Security Notes

- Keep your API key private
- Don't commit it to version control
- Use environment variables for all deployments
- The API key is only used server-side for uploads 