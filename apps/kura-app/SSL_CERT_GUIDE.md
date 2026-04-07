# SSL Certificate Configuration Guide

## Problem: Self-Signed HTTPS Certificates in Development

React Native rejects self-signed HTTPS certificates by default. When testing locally with a backend at `https://localhost:8080`, requests fail with "Network request failed" error.

## Solutions

### Option 1: Use HTTP in Development (Recommended for Testing)

Set the development backend URL to use HTTP instead of HTTPS:

1. Edit `.env.local`:
```bash
# Production uses HTTPS
EXPO_PUBLIC_BACKEND_URL=https://localhost:8080

# Development uses HTTP (uncomment to enable)
EXPO_PUBLIC_BACKEND_URL_DEV=http://localhost:8080
```

2. Restart the app - it will automatically use HTTP in development

**Pros:**
- Simple configuration
- No code changes needed
- Works immediately

**Cons:**
- Only for development/testing
- Less secure than HTTPS

### Option 2: Configure Backend to Support Both HTTP and HTTPS

Have your backend listen on both ports:
- HTTP: `http://localhost:8080`
- HTTPS: `https://localhost:8080`

Then update `.env.local`:
```bash
EXPO_PUBLIC_BACKEND_URL=http://localhost:8080
```

### Option 3: Create a Valid SSL Certificate (Advanced)

For better development experience, create a proper self-signed certificate with correct hostname:

```bash
# Generate self-signed certificate for localhost
openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365 \
  -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,DNS:*.localhost,IP:127.0.0.1"
```

Then configure your backend to:
1. Use this certificate
2. Add CORS headers for your dev client IP

## How It Works

The app's authentication API service (`src/shared/api/authApi.ts`) now:

1. **In development mode** (`__DEV__`):
   - Checks for `EXPO_PUBLIC_BACKEND_URL_DEV` environment variable
   - If set, uses HTTP URL instead of HTTPS
   - Logs a helpful message about the certificate issue

2. **Priority order**:
   1. Explicit config from `app.config.js`
   2. `EXPO_PUBLIC_BACKEND_URL` environment variable
   3. `EXPO_PUBLIC_BACKEND_URL_DEV` (fallback for self-signed certs)
   4. Default: `https://localhost:8080`

## Debugging

Check the Logger Debug Panel (tap the logo in top-left 5 times) to see:
- Which backend URL is being used
- Network request failures with details
- SSL/Certificate related warnings

## Environment Variables

- `EXPO_PUBLIC_BACKEND_URL` - Main backend URL (production)
- `EXPO_PUBLIC_BACKEND_URL_DEV` - Development fallback (typically HTTP)
- `EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID` - WalletConnect project ID

## Backend Considerations

Make sure your backend:
1. Accepts requests from `http://192.168.1.143:8081` (Expo dev server)
2. Has CORS configured appropriately
3. Returns proper error responses in JSON format

Example backend response for auth failure:
```json
{
  "error": "Invalid credentials",
  "code": "INVALID_CREDENTIALS"
}
```
