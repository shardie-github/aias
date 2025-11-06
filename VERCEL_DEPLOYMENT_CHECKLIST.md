# Vercel Deployment Checklist — AIAS Platform

## ✅ Pre-Deployment Checklist

### 1. Environment Variables
Ensure these are set in Vercel dashboard under Settings → Environment Variables:

**Required:**
- `NEXT_PUBLIC_SITE_URL` - Your production domain (e.g., `https://aias-platform.com`)
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

**Optional (for full functionality):**
- `STRIPE_SECRET_KEY` - For payment processing
- `STRIPE_PUBLISHABLE_KEY` - For Stripe checkout
- `RESEND_API_KEY` - For email sending
- `OPENAI_API_KEY` - For AI features

**Security:**
- Never commit `.env` files
- Use Vercel's environment variables UI
- Set different values for Production, Preview, and Development

---

### 2. Build Configuration
✅ **Verified:**
- `next.config.ts` - Optimized for Vercel
- `vercel.json` - Vercel-specific configuration
- `package.json` - Build scripts configured

---

### 3. Pages & Routes
✅ **All pages created:**
- `/` - Homepage with value proposition
- `/pricing` - Pricing page with CAD pricing
- `/features` - Features showcase
- `/integrations` - Canadian integrations list
- `/case-studies` - Customer success stories
- `/demo` - Demo booking page
- `/blog` - Blog listing page
- `/about` - About page

---

### 4. SEO & Metadata
✅ **SEO optimized:**
- Meta tags in `app/layout.tsx`
- Open Graph tags for social sharing
- Twitter Card tags
- Structured data (JSON-LD)
- Sitemap configured (`app/sitemap.ts`)
- Robots.txt configured (`public/robots.txt`)

---

### 5. Components
✅ **All components verified:**
- Header navigation (desktop & mobile)
- Footer with business links
- Hero section with CTAs
- Features section
- Testimonials section
- UI components (Button, Card, Sheet, etc.)
- SEO structured data components

---

### 6. Performance
✅ **Optimizations:**
- Image formats (AVIF, WebP)
- Package import optimization
- SWC minification enabled
- Compression enabled
- Security headers configured

---

### 7. Branding
✅ **Brand consistency:**
- All "Hardonia" references replaced with "AIAS Platform"
- Canadian messaging throughout
- CAD pricing displayed
- PIPEDA compliance badges

---

## 🚀 Deployment Steps

### Step 1: Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will auto-detect Next.js

### Step 2: Configure Project
1. **Framework Preset:** Next.js (auto-detected)
2. **Root Directory:** `./` (root)
3. **Build Command:** `npm run build` (default)
4. **Output Directory:** `.next` (default)
5. **Install Command:** `npm install` (default)

### Step 3: Set Environment Variables
1. Go to Project Settings → Environment Variables
2. Add all required variables (see above)
3. Set values for:
   - Production
   - Preview
   - Development (optional)

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Review deployment logs for any errors

### Step 5: Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `aias-platform.com`)
3. Follow DNS configuration instructions
4. SSL certificate will be auto-configured

---

## 🔍 Post-Deployment Verification

### 1. Check Pages
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Pricing page displays CAD pricing
- [ ] Features page loads
- [ ] Integrations page loads
- [ ] Case studies page loads
- [ ] Blog page loads
- [ ] About page loads
- [ ] Demo page loads

### 2. Check SEO
- [ ] Meta tags in `<head>`
- [ ] Open Graph tags present
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] Structured data present (check with Google Rich Results Test)

### 3. Check Performance
- [ ] Page loads quickly (< 3s)
- [ ] Images optimize correctly
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Lighthouse score > 90

### 4. Check Functionality
- [ ] Navigation works (desktop & mobile)
- [ ] CTAs link correctly
- [ ] Forms render (if any)
- [ ] External links open in new tab
- [ ] Social sharing works (if implemented)

---

## 🐛 Troubleshooting

### Build Fails
1. Check build logs in Vercel dashboard
2. Verify all dependencies in `package.json`
3. Check for TypeScript errors locally: `npm run typecheck`
4. Ensure Node.js version is compatible (check `.nvmrc` if exists)

### Environment Variables Not Working
1. Verify variables are set in Vercel dashboard
2. Check variable names match exactly (case-sensitive)
3. Restart deployment after adding new variables
4. Use `NEXT_PUBLIC_` prefix for client-side variables

### Pages Not Found
1. Verify all pages are in `app/` directory
2. Check file naming (must be `page.tsx`)
3. Ensure routes match Next.js 13+ App Router conventions

### Images Not Loading
1. Check `next.config.ts` image configuration
2. Verify remote patterns for external images
3. Ensure images are in `public/` directory or use Next.js Image component

---

## 📊 Performance Targets

### Core Web Vitals
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

### Lighthouse Scores
- **Performance:** > 90
- **Accessibility:** > 90
- **Best Practices:** > 90
- **SEO:** > 90

---

## 🔒 Security Checklist

✅ **Security headers configured:**
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

✅ **Best practices:**
- No secrets in code
- Environment variables in Vercel
- HTTPS enforced (automatic on Vercel)
- Security headers configured

---

## 📝 Post-Deployment Tasks

### Immediate (Day 1)
1. [ ] Test all pages and links
2. [ ] Verify SEO meta tags
3. [ ] Check mobile responsiveness
4. [ ] Test CTAs and forms
5. [ ] Submit sitemap to Google Search Console

### Week 1
1. [ ] Set up Google Analytics
2. [ ] Configure Vercel Analytics (optional)
3. [ ] Set up error monitoring (Sentry, etc.)
4. [ ] Test payment flows (if applicable)
5. [ ] Monitor performance metrics

### Week 2+
1. [ ] Create blog content (4+ posts)
2. [ ] Set up email marketing integration
3. [ ] Configure A/B testing (if applicable)
4. [ ] Set up conversion tracking
5. [ ] Monitor and optimize based on data

---

## 🎯 Success Criteria

✅ **Deployment is successful when:**
- All pages load without errors
- Navigation works on desktop and mobile
- SEO meta tags are present
- Performance scores > 90
- No console errors
- Mobile responsive
- All CTAs functional

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review Next.js documentation
3. Check GitHub issues (if applicable)
4. Contact support@aias-platform.com

---

**Last Updated:** January 2025  
**Status:** ✅ Ready for Vercel Deployment
