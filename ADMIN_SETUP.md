# Admin System Setup

This website includes an admin system that allows authenticated users to manage merchandise and edit website content.

## Features

- **Admin Login**: Secure authentication using environment variables
- **Merchandise Management**: Add, edit, and remove merch items
- **Content Management**: Edit text fields throughout the website
- **Responsive Design**: Works on all devices

## Environment Variables

To set up the admin system, you need to configure the following environment variables in your Vercel deployment:

### Required Variables

1. `VITE_ADMIN_USERNAME` - The admin username
2. `VITE_ADMIN_PASSWORD` - The admin password

### Setting up in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add the following variables:
   - Name: `VITE_ADMIN_USERNAME`
   - Value: Your desired admin username
   - Environment: Production (and Preview if needed)
   
   - Name: `VITE_ADMIN_PASSWORD`
   - Value: Your secure admin password
   - Environment: Production (and Preview if needed)

5. Redeploy your application

## Usage

### Accessing Admin Panel

1. Scroll to the bottom of any page
2. Click the "Admin Login" button in the footer
3. Enter your username and password
4. You'll be redirected to the admin dashboard

### Managing Merchandise

1. In the admin dashboard, click the "Manage Merch" tab
2. Use the "Add New Product" button to create new items
3. Click "Edit" on existing products to modify them
4. Click "Delete" to remove products

### Editing Content

1. In the admin dashboard, click the "Edit Content" tab
2. Click "Edit" on any content field
3. Make your changes and click "Save"

## Security Notes

- The admin credentials are stored in environment variables
- The login system uses client-side validation (in a production app, you'd want server-side validation)
- Admin sessions are stored in localStorage
- Always use strong, unique passwords

## Development

For local development, create a `.env` file in the root directory with:

```
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=your_password_here
```

## File Structure

- `src/contexts/AdminContext.tsx` - Admin authentication context
- `src/components/AdminLogin.tsx` - Login modal component
- `src/components/AdminDashboard.tsx` - Main admin dashboard
- `src/components/AdminLogin.css` - Login modal styles
- `src/components/AdminDashboard.css` - Dashboard styles 