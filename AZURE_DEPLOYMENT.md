# Azure Deployment Guide for Contacts UI

This guide explains how to deploy the Contacts UI (Angular) to Azure Static Web Apps.

## Prerequisites

- Azure subscription
- GitHub repository access
- Contacts API already deployed (see contact-api/AZURE_DEPLOYMENT.md)

## Step 1: Update Production Environment

Before deploying, update `src/environments/environment.prod.ts` with your deployed API URL:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-name.azurewebsites.net'  // Your deployed API URL
};
```

## Step 2: Create Azure Static Web App

### Option A: Via Azure Portal

1. Go to Azure Portal > Create a resource > Static Web App
2. Configure:
   - **Name**: contacts-ui-prod
   - **Region**: Select closest to your users
   - **Source**: GitHub
   - **Organization**: Your GitHub org
   - **Repository**: contacts-ui
   - **Branch**: main
   - **Build Presets**: Angular
   - **App location**: /
   - **Output location**: dist/contacts-ui/browser

3. Click "Review + create" then "Create"

### Option B: Via Azure CLI

```bash
# Login to Azure
az login

# Create a resource group (if not exists)
az group create --name contacts-rg --location eastus

# Create Static Web App
az staticwebapp create \
  --name contacts-ui-prod \
  --resource-group contacts-rg \
  --source https://github.com/YOUR_USERNAME/contacts-ui \
  --location eastus \
  --branch main \
  --app-location "/" \
  --output-location "dist/contacts-ui/browser" \
  --login-with-github
```

## Step 3: Configure GitHub Actions (if using manual workflow)

If you're using the provided `.github/workflows/azure-static-web-apps.yml`:

1. Go to Azure Portal > Your Static Web App > Manage deployment token
2. Copy the deployment token
3. Go to GitHub > Repository Settings > Secrets and variables > Actions
4. Create a new secret named `AZURE_STATIC_WEB_APPS_API_TOKEN`
5. Paste the deployment token

## Step 4: Update CORS in Contacts API

After deploying the UI, update the `CORS_ORIGINS` environment variable in your Contacts API:

```bash
az webapp config appsettings set \
  --name contacts-api-prod \
  --resource-group contacts-rg \
  --settings CORS_ORIGINS="https://your-static-web-app.azurestaticapps.net"
```

## Configuration Files

### staticwebapp.config.json

This file configures:
- **Navigation fallback**: Routes all requests to index.html for Angular routing
- **Security headers**: X-Content-Type-Options, X-Frame-Options, CSP
- **MIME types**: Proper content types for fonts and JSON

## Verify Deployment

After deployment:

1. Visit your Static Web App URL (e.g., `https://contacts-ui-prod.azurestaticapps.net`)
2. You should see the login page
3. Try logging in with your credentials
4. Verify the contact list loads correctly

## Troubleshooting

### Blank page or routing issues
- Ensure `staticwebapp.config.json` is in the root directory
- Check that `navigationFallback` is configured correctly

### API calls failing
- Verify `environment.prod.ts` has the correct API URL
- Check CORS is configured in the API to allow your Static Web App origin
- Check browser console for specific error messages

### Build failures
- Check GitHub Actions logs for detailed error messages
- Ensure `output_location` matches your Angular build output path
- Verify Node.js version compatibility

### 404 on refresh
- This is usually a routing issue - ensure `staticwebapp.config.json` has the navigation fallback configured

## Custom Domain (Optional)

To add a custom domain:

1. Go to Azure Portal > Your Static Web App > Custom domains
2. Click "Add"
3. Follow the instructions to verify domain ownership
4. Azure will automatically provision an SSL certificate

## Environment-Specific Builds

For different environments, you can:

1. Create additional environment files (e.g., `environment.staging.ts`)
2. Add Angular build configurations in `angular.json`
3. Create separate GitHub Actions workflows for each environment
