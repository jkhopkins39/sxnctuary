# PayPal Integration Setup Guide

## Overview
This guide will walk you through setting up PayPal as the main payment option for your SXNCTUARY merch website.

## Step 1: PayPal Developer Account Setup

### 1.1 Create PayPal Developer Account
1. Go to [developer.paypal.com](https://developer.paypal.com)
2. Click "Sign Up" and create a developer account
3. Verify your email address

### 1.2 Create PayPal App
1. Log into the PayPal Developer Dashboard
2. Navigate to "Apps & Credentials"
3. Click "Create App"
4. Give your app a name (e.g., "SXNCTUARY Merch")
5. Select "Business" account type
6. Click "Create App"

### 1.3 Get Your Credentials
1. After creating the app, you'll see your Client ID and Secret
2. **Important**: Keep these credentials secure and never commit them to version control
3. For testing, use the Sandbox environment
4. For production, use the Live environment

## Step 2: Environment Configuration

### 2.1 Create Environment File
Create a `.env` file in your project root with the following variables:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# PayPal Configuration
REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id_here
REACT_APP_PAYPAL_ENVIRONMENT=sandbox

# Image Upload (ImgBB)
IMGBB_API_KEY=your_imgbb_api_key_here

# Server Configuration
PORT=3001
```

### 2.2 Replace Placeholder Values
- Replace `your_paypal_client_id_here` with your actual PayPal Client ID
- Set `REACT_APP_PAYPAL_ENVIRONMENT` to:
  - `sandbox` for testing
  - `production` for live payments

## Step 3: Testing the Integration

### 3.1 Sandbox Testing
1. Use PayPal's sandbox accounts for testing:
   - **Buyer Account**: sb-buyer@business.example.com
   - **Password**: Use the password from your PayPal Developer Dashboard

### 3.2 Test Purchase Flow
1. Start your development server: `npm run dev:full`
2. Navigate to the merch page
3. Add items to cart
4. Click "Checkout"
5. Complete payment using sandbox credentials
6. Verify order appears in your database

## Step 4: Production Deployment

### 4.1 Switch to Live Environment
1. In PayPal Developer Dashboard, switch to "Live" environment
2. Get your live Client ID
3. Update your environment variables:
   ```env
   REACT_APP_PAYPAL_CLIENT_ID=your_live_client_id
   REACT_APP_PAYPAL_ENVIRONMENT=production
   ```

### 4.2 Security Considerations
- Never expose your PayPal Secret in frontend code
- Use environment variables for all sensitive data
- Implement proper error handling
- Set up webhook notifications for order status updates

## Step 5: Additional Features

### 5.1 Email Notifications
Consider implementing email notifications for:
- Order confirmation to customers
- Order notifications to admin
- Payment failure alerts

### 5.2 Inventory Management
- Update product inventory after successful orders
- Implement low stock alerts
- Add inventory tracking to admin dashboard

### 5.3 Shipping Integration
- Integrate with shipping providers (USPS, FedEx, etc.)
- Generate shipping labels automatically
- Track shipment status

## Step 6: Monitoring and Analytics

### 6.1 PayPal Analytics
- Monitor transaction success rates
- Track payment method preferences
- Analyze customer behavior

### 6.2 Error Monitoring
- Set up error logging for failed payments
- Monitor API response times
- Track abandoned cart rates

## Troubleshooting

### Common Issues

1. **PayPal Button Not Loading**
   - Check your Client ID is correct
   - Verify environment setting (sandbox/production)
   - Check browser console for errors

2. **Payment Fails**
   - Verify sandbox account credentials
   - Check PayPal Developer Dashboard for error details
   - Ensure order total is valid

3. **Order Not Saved**
   - Check server logs for database errors
   - Verify database migration ran successfully
   - Check API endpoint is accessible

### Support Resources
- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal Support](https://www.paypal.com/support/)
- [React PayPal JS Documentation](https://github.com/paypal/react-paypal-js)

## Security Best Practices

1. **Environment Variables**
   - Never hardcode credentials
   - Use different credentials for development and production
   - Regularly rotate credentials

2. **Data Validation**
   - Validate all payment data on server side
   - Implement proper error handling
   - Log security events

3. **HTTPS**
   - Always use HTTPS in production
   - Configure proper SSL certificates
   - Enable security headers

## Next Steps

After completing this setup:

1. Test thoroughly with sandbox accounts
2. Set up monitoring and analytics
3. Implement additional features (email notifications, inventory management)
4. Plan for scaling and optimization
5. Consider adding alternative payment methods

## Support

If you encounter issues during setup:
1. Check the troubleshooting section above
2. Review PayPal Developer documentation
3. Contact PayPal Developer Support
4. Check your server logs for detailed error messages
