
# Deployment Guide

This guide provides comprehensive instructions for deploying the Supplier Price Watch application to various environments.

## Prerequisites

### System Requirements

- Node.js 18.x or higher
- npm 9.x or higher
- 2GB RAM minimum (4GB recommended)
- 10GB storage space

### Required Access

- GitHub repository access
- AWS account (for production deployment)
- Shopify Partner account (for development)
- Gadget.dev account (optional)

### Environment Variables

Create a `.env` file with the following variables:

```
# Application
VITE_APP_ENV=development|staging|production
VITE_APP_VERSION=3.5.2
VITE_PUBLIC_URL=http://localhost:3000

# Shopify
VITE_SHOPIFY_API_KEY=your_shopify_api_key
VITE_SHOPIFY_API_SECRET=your_shopify_api_secret
VITE_SHOPIFY_SCOPES=read_products,write_products
VITE_SHOPIFY_REDIRECT_URI=http://localhost:3000/auth/callback

# Gadget.dev
VITE_GADGET_APP_ID=your_gadget_app_id
VITE_GADGET_API_KEY=your_gadget_api_key
VITE_GADGET_ENV=development|production

# Google APIs
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_API_KEY=your_google_api_key
VITE_GOOGLE_SCOPES=https://www.googleapis.com/auth/gmail.send,https://www.googleapis.com/auth/calendar

# Analytics
VITE_GA_TRACKING_ID=your_ga_tracking_id
```

## Local Development Deployment

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/supplier-price-watch.git
   cd supplier-price-watch
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` with development variables

4. Start development server:
   ```bash
   npm run dev
   ```

5. Access development server at http://localhost:3000

### Testing Build Locally

1. Create a production build:
   ```bash
   npm run build
   ```

2. Preview the production build:
   ```bash
   npm run preview
   ```

3. Access preview server at http://localhost:4173

## Staging Deployment

### AWS Amplify Deployment

1. Log in to AWS Management Console
2. Navigate to AWS Amplify
3. Click "New app" > "Host web app"
4. Connect to GitHub repository
5. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
6. Add environment variables for staging
7. Deploy the application

### Staging Environment Configuration

Configure the following for staging:
- Use staging API endpoints
- Enable error logging and monitoring
- Disable certain production-only features
- Add "STAGING" banner to UI

## Production Deployment

### Deployment with GitHub Actions

1. Create `.github/workflows/deploy-production.yml`:
   ```yaml
   name: Deploy to Production

   on:
     push:
       branches:
         - main
       tags:
         - 'v*'

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             cache: 'npm'
             
         - name: Install dependencies
           run: npm ci
           
         - name: Build
           run: npm run build
           env:
             VITE_APP_ENV: production
             VITE_SHOPIFY_API_KEY: ${{ secrets.PROD_SHOPIFY_API_KEY }}
             # Add other environment variables
             
         - name: Deploy to AWS
           uses: aws-actions/configure-aws-credentials@v1
           with:
             aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
             aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
             aws-region: us-east-1
             
         - name: Deploy to S3
           run: aws s3 sync ./dist s3://your-production-bucket/ --delete
           
         - name: Invalidate CloudFront
           run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CF_DISTRIBUTION_ID }} --paths "/*"
   ```

2. Set up GitHub repository secrets
3. Push changes to main branch or create a tag
4. Monitor workflow in GitHub Actions tab

### Production Infrastructure (AWS)

- **S3 Bucket**: Hosts static assets
- **CloudFront**: CDN for global distribution
- **Route 53**: DNS management
- **Certificate Manager**: SSL certificate
- **CloudWatch**: Logging and monitoring

### Domain Configuration

1. Register domain in Route 53 or configure existing domain
2. Create SSL certificate in Certificate Manager
3. Configure CloudFront distribution with custom domain
4. Create A record in Route 53 pointing to CloudFront distribution

## Security Considerations

### HTTPS Configuration

- Force HTTPS redirect
- Implement proper HSTS headers
- Configure secure cookies
- Use TLS 1.2 or later

### Content Security Policy

Implement CSP headers:
```
Content-Security-Policy: default-src 'self'; script-src 'self' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://cdn.shopify.com; connect-src 'self' https://api.shopify.com https://api.gadget.app https://www.googleapis.com;
```

### Secrets Management

- Never commit secrets to the repository
- Use environment variables for all secrets
- Rotate API keys regularly
- Use AWS Secrets Manager for production secrets

## Monitoring and Logging

### CloudWatch Setup

1. Create CloudWatch dashboard
2. Set up log groups for application logs
3. Configure metrics and alarms
4. Set up notification for critical errors

### Performance Monitoring

- Configure performance budgets
- Monitor page load times
- Track API response times
- Set up alerts for performance degradation

## Backup and Disaster Recovery

### Backup Strategy

- Automated database backups (if applicable)
- S3 versioning for static assets
- Regular infrastructure-as-code exports
- Documentation of deployment process

### Disaster Recovery Plan

1. Identify critical components
2. Document recovery procedures
3. Test recovery process quarterly
4. Define RTO (Recovery Time Objective) and RPO (Recovery Point Objective)

## Maintenance Procedures

### Regular Updates

- Schedule monthly dependency updates
- Review security vulnerabilities weekly
- Plan quarterly major updates
- Maintain changelog for all changes

### Rollback Procedures

1. Identify issue requiring rollback
2. Deploy previous stable version
3. Invalidate CDN cache
4. Notify users of temporary disruption
5. Investigate root cause

## Compliance and Regulations

- GDPR compliance measures
- CCPA compliance for California users
- PCI compliance if handling payment data
- Accessibility compliance (WCAG 2.1)

