> Archived on 2025-11-12. Superseded by: (see docs/final index)

# UX Style Guide - Hardonia

## Design Principles

### Visual Identity
- **Modern & Bold**: Clean lines, high contrast, premium feel
- **Microinteractions**: Smooth 150-250ms transitions for user feedback
- **Motion**: Tasteful animations using spring physics for page mounts
- **Responsive**: Mobile-first approach with thumb-friendly tap targets (min 44x44px)

### Color System
- **Primary**: Blue (`--primary: 221 83% 53%`) - Main actions, links
- **Secondary**: Light gray (`--secondary: 210 40% 96%`) - Subtle backgrounds
- **Accent**: Purple (`--accent: 269 83% 60%`) - Highlights, emphasis
- **Destructive**: Red (`--destructive: 0 84% 60%`) - Errors, destructive actions

### Typography
- **Font**: System font stack with `font-feature-settings: "rlig" 1, "calt" 1`
- **Headings**: Bold, high contrast
- **Body**: Optimized for readability with proper line-height

### Spacing
- **Base unit**: 4px (0.25rem)
- **Container**: Max-width 1280px, centered, 1rem padding
- **Section padding**: py-20 (mobile), py-32 (desktop)

### Border Radius
- **Base**: 14px (`--radius`)
- **Components**: `rounded-xl` (12px)
- **Buttons**: `rounded-xl` or `rounded-full` for pill style

### Motion Guidelines
- **Transitions**: 150-250ms for interactive elements
- **Page transitions**: Spring animation (stiffness: 120, damping: 18)
- **Reduced motion**: Always respect `prefers-reduced-motion: reduce`

## Component Usage

### Buttons
- Use `variant="default"` for primary actions
- Use `variant="outline"` for secondary actions
- Use `variant="ghost"` for tertiary actions
- Use `size="pill"` for rounded pill buttons

### Cards
- Use `Card` for content containers
- Always include `CardHeader` with `CardTitle` and optional `CardDescription`
- Use `CardContent` for main content

### Forms
- Use `Input` with proper labels
- Include focus states (automatic via components)
- Use `Select` for dropdowns with proper ARIA labels

### Motion Components
- Use `FadeIn` for single elements
- Use `StaggerList` + `StaggerItem` for lists/grids
- Always test with reduced motion preferences

## Accessibility Requirements

### WCAG 2.2 AA Compliance
- **Color contrast**: Minimum 4.5:1 for text, 3:1 for UI components
- **Focus indicators**: Visible 2px outline with ring color
- **Keyboard navigation**: All interactive elements accessible via Tab
- **Screen readers**: Proper ARIA labels and semantic HTML

### Best Practices
- Always include skip links for main content
- Use proper heading hierarchy (h1 → h2 → h3)
- Provide alt text for images
- Use `aria-label` for icon-only buttons

## Performance Targets

### Core Web Vitals
- **LCP**: ≤ 2.5s (mobile priority)
- **INP**: ≤ 200ms
- **CLS**: ≤ 0.05

### Optimization
- Preload critical fonts
- Use `priority` prop for hero images
- Lazy load below-the-fold content
- Defer non-critical JavaScript

## Tone & Voice

- **Professional**: Clear, concise communication
- **Approachable**: Friendly but not casual
- **Confident**: Assured without being arrogant
- **Helpful**: Anticipate user needs

## Spacing Examples

```tsx
// Section spacing
<section className="py-20 md:py-32">

// Card spacing
<Card className="p-6">

// Button spacing
<Button className="px-4 py-2">

// Grid gaps
<div className="grid gap-6">
```

## Dark Mode

- Automatically respects system preference
- Users can override via theme toggle
- Smooth transition between modes
- Ensure all colors maintain contrast in both modes
