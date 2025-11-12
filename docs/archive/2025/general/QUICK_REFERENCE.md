> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Quick Reference - Hardonia Front-End

## 🚀 Quick Commands

```bash
# Development
npm run dev              # Start dev server (localhost:3000)

# Production
npm run build           # Build for production
npm start               # Start production server

# Quality Checks
npm run typecheck       # TypeScript type checking
npm run lint            # ESLint
npm run format          # Prettier formatting
```

## 📦 Key Dependencies

- **Next.js 14+**: App Router, React Server Components
- **TailwindCSS**: Utility-first CSS framework
- **shadcn/ui**: Accessible component library
- **Radix UI**: Unstyled, accessible primitives
- **Framer Motion**: Animation library
- **class-variance-authority**: Variant management

## 🎨 Design Tokens

### Colors (CSS Variables)
```css
--primary: 221 83% 53%      /* Blue */
--secondary: 210 40% 96%    /* Light gray */
--accent: 269 83% 60%      /* Purple */
--destructive: 0 84% 60%   /* Red */
```

### Spacing
- Base unit: 4px (0.25rem)
- Container: max-width 1280px, centered
- Section padding: py-20 (mobile), py-32 (desktop)

### Border Radius
- Base: 14px (`--radius`)
- Components: `rounded-xl` (12px)

## 🧩 Component Usage

### Button
```tsx
import { Button } from "@/components/ui/button";

<Button variant="default" size="md">Click me</Button>
<Button variant="outline" size="pill">Outlined</Button>
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Motion
```tsx
import FadeIn from "@/components/motion/fade-in";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";

<FadeIn delay={0.1}>
  <div>Content</div>
</FadeIn>

<StaggerList>
  {items.map(item => (
    <StaggerItem key={item.id}>
      <Card>{item.content}</Card>
    </StaggerItem>
  ))}
</StaggerList>
```

## 🎯 Accessibility Checklist

- ✅ Skip links for main content
- ✅ Focus indicators (2px outline)
- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Semantic HTML
- ✅ Reduced motion support

## 📱 Responsive Breakpoints

```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

## 🌙 Theme System

```tsx
import { useTheme } from "@/components/theme-provider";

const { theme, setTheme, resolvedTheme } = useTheme();
// theme: "light" | "dark" | "system"
// resolvedTheme: "light" | "dark"
```

## 🔍 Performance Targets

- **LCP**: ≤ 2.5s (mobile)
- **INP**: ≤ 200ms
- **CLS**: ≤ 0.05

## 📝 File Paths

- **Layout**: `app/layout.tsx`
- **Pages**: `app/[page]/page.tsx`
- **Components**: `components/[category]/[name].tsx`
- **Utils**: `lib/utils.ts`
- **Hooks**: `hooks/[name].ts`

## 🛠️ External UI Ingestion

```bash
# Import from external-dump directory
npx ts-node scripts/ingest-external-ui.ts \
  --src ./external-dump \
  --dest ./components/external
```

## 📚 Documentation

- Setup: `FRONTEND_SETUP.md`
- Summary: `IMPLEMENTATION_SUMMARY.md`
- UX Guide: `docs/ux-styleguide.md`
- Performance: `docs/perf-report.md`
