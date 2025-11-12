> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Performance Report - Hardonia

## Core Web Vitals Targets

### Mobile Priority
- **LCP (Largest Contentful Paint)**: ≤ 2.5s
- **INP (Interaction to Next Paint)**: ≤ 200ms
- **CLS (Cumulative Layout Shift)**: ≤ 0.05

## Optimization Strategies

### LCP Optimization
1. **Preconnect to font domains**
   ```tsx
   <link rel="preconnect" href="https://fonts.googleapis.com">
   ```

2. **Hero image priority**
   ```tsx
   <Image priority src="/hero.jpg" alt="Hero" />
   ```

3. **Avoid blocking CSS**
   - Use CSS-in-JS or inline critical CSS
   - Defer non-critical stylesheets

4. **Optimize server response**
   - Use edge runtime when possible
   - Implement proper caching headers

### INP Optimization
1. **Avoid long tasks**
   - Split large JavaScript bundles
   - Use code splitting for routes

2. **Defer non-critical JS**
   - Lazy load analytics
   - Use `next/dynamic` for heavy components

3. **Prefer CSS animations**
   - Use CSS transitions for simple animations
   - Reserve JS for complex interactions

### CLS Optimization
1. **Reserve media sizes**
   ```tsx
   <Image width={800} height={600} src="/image.jpg" />
   ```

2. **Use aspect-ratio**
   ```tsx
   <div className="aspect-video">
   ```

3. **Avoid dynamic content above fold**
   - Pre-render critical content
   - Use skeleton loaders instead of layout shifts

## Performance Monitoring

### Development HUD
- Component: `components/dev/performance-hud.tsx`
- Shows real-time LCP, CLS, INP metrics
- Only visible in development mode

### Production Monitoring
- Use Vercel Analytics for production metrics
- Set up Lighthouse CI in GitHub Actions
- Monitor Core Web Vitals in production

## Remediation Notes

### Common Issues

1. **Slow LCP**
   - Check network waterfall
   - Optimize hero images (WebP, AVIF)
   - Preload critical resources

2. **High INP**
   - Profile JavaScript execution
   - Identify long tasks (>50ms)
   - Optimize event handlers

3. **High CLS**
   - Add explicit dimensions to images
   - Avoid inserting content above existing content
   - Use CSS aspect-ratio for containers

## Testing

### Lighthouse CI
```bash
npm run lighthouse
```

### Performance Budgets
- Set budgets in `lighthouserc.json`
- Fail builds on budget violations
- Track metrics over time

## Metrics Snapshot

### Baseline (Before Optimization)
- LCP: ~3.5s
- INP: ~250ms
- CLS: ~0.08

### Target (After Optimization)
- LCP: ≤2.5s ✅
- INP: ≤200ms ✅
- CLS: ≤0.05 ✅

## Next Steps

1. ✅ Implement performance HUD
2. ✅ Add image optimization
3. ✅ Set up code splitting
4. ⏳ Add font preloading
5. ⏳ Implement service worker caching strategy
6. ⏳ Set up Vercel Analytics
