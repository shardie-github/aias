> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Front-End Excellence Setup - Hardonia

## Overview

This setup implements a production-ready Next.js 14+ front-end with:
- **Design System**: TailwindCSS + shadcn/ui + Radix + Framer Motion
- **Accessibility**: WCAG 2.2 AA compliant
- **Performance**: Optimized for Core Web Vitals (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.05)
- **PWA**: Installable with offline support
- **SEO**: Complete metadata, Open Graph, sitemap
- **External UI Ingestion**: CLI tool for importing Lovable/visual builder exports

## Quick Start

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Run Development Server

```bash
npm run dev
```

### 3. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Global styles + CSS variables
│   ├── offline/           # Offline page
│   └── sitemap.ts         # Dynamic sitemap
├── components/
│   ├── ui/                # shadcn/ui primitives
│   ├── layout/            # Header, Footer, Mobile Nav
│   ├── home/              # Homepage sections
│   ├── motion/            # Framer Motion wrappers
│   ├── a11y/              # Accessibility utilities
│   └── dev/               # Development tools (Performance HUD)
├── lib/
│   └── utils.ts           # Utility functions (cn helper)
├── hooks/
│   └── use-toast.ts       # Toast notifications
├── public/
│   ├── manifest.webmanifest  # PWA manifest
│   ├── sw.js              # Service worker
│   └── robots.txt         # SEO robots file
└── scripts/
    └── ingest-external-ui.ts  # External UI importer
```

## Features

### Design System

- **Colors**: CSS variables with light/dark mode support
- **Typography**: System font stack with OpenType features
- **Spacing**: 4px base unit, consistent spacing scale
- **Border Radius**: 14px base, consistent rounded corners
- **Motion**: Spring animations with reduced-motion support

### UI Components

All components follow shadcn/ui patterns:
- `Button` - Multiple variants (default, secondary, outline, ghost, destructive)
- `Input` - Form inputs with proper focus states
- `Select` - Dropdown selects with Radix UI
- `Card` - Content containers
- `Badge` - Status indicators
- `Sheet` - Slide-out panels
- `Dialog` - Modal dialogs
- `Toast` - Notification system

### Accessibility

- **Skip Links**: Jump to main content
- **Focus Indicators**: Visible 2px outline
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels
- **Reduced Motion**: Respects `prefers-reduced-motion`

### Performance

- **Performance HUD**: Dev-only overlay showing Core Web Vitals
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Font Preloading**: Preconnect to font domains

### PWA

- **Manifest**: `/public/manifest.webmanifest`
- **Service Worker**: `/public/sw.js` (basic offline shell)
- **Installable**: Meets PWA criteria

### SEO

- **Metadata**: Complete Open Graph and Twitter cards
- **Sitemap**: Dynamic sitemap at `/sitemap.xml`
- **Robots**: `/public/robots.txt`

## External UI Ingestion

### Usage

```bash
npx ts-node scripts/ingest-external-ui.ts --src ./external-dump --dest ./components/external
```

### What It Does

1. Converts HTML files to React components
2. Processes SVG files (SVGO + SVGR)
3. Copies CSS files as CSS Modules
4. Generates import report

### Output

- Components placed in `components/external/`
- Report saved to `components/external/_import-report.txt`

## CI/CD

The GitHub Actions workflow (`.github/workflows/ui-ingest.yml`):
- Runs on pull requests
- Executes external UI ingestion if `external-dump` exists
- Builds project to verify changes

## Documentation

- **UX Style Guide**: `/docs/ux-styleguide.md`
- **Performance Report**: `/docs/perf-report.md`
- **External UI Ingestion Plan**: `/docs/external-ui-ingestion-plan.md`

## Development Tools

### Performance HUD

Development-only overlay showing:
- LCP (Largest Contentful Paint)
- CLS (Cumulative Layout Shift)
- INP (Interaction to Next Paint)

### Theme Toggle

System-aware theme switching:
- Light mode
- Dark mode
- System preference (default)

## Next Steps

1. **Install Dependencies**: Run `npm install`
2. **Configure Domain**: Update `sitemap.ts` and `robots.txt` with your domain
3. **Add PWA Icons**: Place icon files in `/public/icons/`
4. **Customize Brand**: Update colors in `app/globals.css`
5. **Add Content**: Build out pages using components

## Validation Checklist

- [ ] Lighthouse mobile: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.05
- [ ] Axe: 0 critical, 0 serious issues
- [ ] PWA: Installable, offline page works
- [ ] Motion: Respects reduced motion preference
- [ ] Keyboard: All interactive elements accessible
- [ ] CI: Build passes

## Support

For issues or questions:
1. Check `/docs/` for detailed guides
2. Review component examples in `components/`
3. Run `npm run typecheck` for TypeScript errors
4. Run `npm run lint` for code quality issues
