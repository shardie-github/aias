# OAuth Configuration Guide

This document explains how to configure OAuth providers (GitHub, Google) for the AIAS Platform.

## Overview

The platform supports OAuth authentication via Supabase Auth. Configure providers in the Supabase dashboard and set environment variables.

## GitHub OAuth

### 1. Create GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: AIAS Platform
   - **Homepage URL**: `https://your-app.vercel.app` (or `http://localhost:3000` for dev)
   - **Authorization callback URL**: 
     - Production: `https://{project-ref}.supabase.co/auth/v1/callback`
     - Development: `https://{project-ref}.supabase.co/auth/v1/callback` (same for both)
     
   Replace `{project-ref}` with your actual Supabase project reference.

4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**

### 2. Configure in Supabase

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable "GitHub"
3. Enter:
   - **Client ID**: Your GitHub OAuth App Client ID
   - **Client Secret**: Your GitHub OAuth App Client Secret
4. Click "Save"

### 3. Set Environment Variables

Add to `.env.local` (dev) and Vercel (prod):

```bash
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## Google OAuth

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Google+ API" (if not already enabled)
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Configure:
   - **Application type**: Web application
   - **Name**: AIAS Platform
   - **Authorized JavaScript origins**:
     - `https://{project-ref}.supabase.co` (replace `{project-ref}` with your project ref)
     - `https://your-app.vercel.app` (production)
     - `http://localhost:3000` (development, optional)
   - **Authorized redirect URIs**:
     - `https://{project-ref}.supabase.co/auth/v1/callback` (replace `{project-ref}` with your project ref)
6. Click "Create"
7. Copy the **Client ID** and **Client Secret**

### 2. Configure in Supabase

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable "Google"
3. Enter:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
4. Click "Save"

### 3. Set Environment Variables

Add to `.env.local` (dev) and Vercel (prod):

```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Redirect URIs Summary

All OAuth providers use the same Supabase callback URL:

- **Production**: `https://{project-ref}.supabase.co/auth/v1/callback`
- **Development**: `https://{project-ref}.supabase.co/auth/v1/callback`

Replace `{project-ref}` with your actual Supabase project reference.

**Note**: The callback URL is the same for both environments because Supabase handles the redirect. Your app's `NEXTAUTH_URL` determines where users land after authentication.

## Testing OAuth

### Local Development

1. Set `NEXTAUTH_URL=http://localhost:3000` in `.env.local`
2. Start dev server: `pnpm run dev`
3. Navigate to login page and click "Sign in with GitHub" or "Sign in with Google"
4. Complete OAuth flow
5. You should be redirected back to `http://localhost:3000`

### Production

1. Set `NEXTAUTH_URL=https://your-app.vercel.app` in Vercel
2. Deploy your app
3. Navigate to login page and test OAuth flow
4. You should be redirected back to your production URL

## Troubleshooting

### "Redirect URI mismatch" error

- Verify the redirect URI in your OAuth provider matches exactly: `https://{project-ref}.supabase.co/auth/v1/callback` (replace `{project-ref}` with your project ref)
- Check for trailing slashes or protocol mismatches (http vs https)

### "Invalid client" error

- Verify `GITHUB_CLIENT_ID` / `GOOGLE_CLIENT_ID` are set correctly
- Check that the OAuth app is active in the provider's dashboard

### "Invalid client secret" error

- Verify `GITHUB_CLIENT_SECRET` / `GOOGLE_CLIENT_SECRET` are set correctly
- Regenerate the secret if needed

### OAuth works but user not created

- Check Supabase Auth logs (Dashboard → Authentication → Logs)
- Verify RLS policies allow user creation
- Check that `profiles` table trigger exists (created by migrations)

## Security Notes

- **Never commit OAuth secrets** to the repository
- Use different OAuth apps for development and production (recommended)
- Rotate secrets regularly
- Monitor OAuth usage in provider dashboards for suspicious activity

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [GitHub OAuth Documentation](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
