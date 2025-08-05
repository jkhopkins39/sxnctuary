# EmailJS Setup Guide

## Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose "Gmail" (or your preferred email provider)
4. Connect your Gmail account (sxnctuaryy8@gmail.com)
5. Note down the **Service ID** (e.g., `service_abc123`)

## Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template:

**Subject:** New Newsletter Subscriber

**HTML Content:**
```html
<h2>New Newsletter Subscriber</h2>
<p><strong>Email:</strong> {{subscriber_email}}</p>
<p><strong>Subscribed at:</strong> {{subscribed_at}}</p>
<p><strong>Message:</strong> {{message}}</p>
```

4. Save the template and note down the **Template ID** (e.g., `template_xyz789`)

## Step 4: Get Public Key
1. Go to "Account" → "API Keys"
2. Copy your **Public Key** (e.g., `user_def456`)

## Step 5: Add Environment Variables
Add these to your `.env` file:

```env
REACT_APP_EMAILJS_SERVICE_ID=your_service_id_here
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id_here
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key_here
```

## Step 6: Test the Setup
1. Restart your development server
2. Try subscribing to the newsletter
3. Check your email (sxnctuaryy8@gmail.com) for the notification

## Example .env Configuration:
```env
REACT_APP_EMAILJS_SERVICE_ID=service_abc123
REACT_APP_EMAILJS_TEMPLATE_ID=template_xyz789
REACT_APP_EMAILJS_PUBLIC_KEY=user_def456
```

## Troubleshooting:
- Make sure all environment variables start with `REACT_APP_`
- Restart your development server after adding environment variables
- Check EmailJS dashboard for any error logs
- Verify your email service is properly connected

## Free Tier Limits:
- 200 emails per month
- Perfect for newsletter notifications
- Upgrade if you need more volume 