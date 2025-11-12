> Archived on 2025-11-12. Superseded by: (see docs/final index)

# WCAG 2.2 Accessibility Checklist — AIAS Platform

**Standard:** WCAG 2.2 Level AA (Web Content Accessibility Guidelines)  
**Last Updated:** January 15, 2024  
**Status:** In Progress

---

## Overview

WCAG 2.2 ensures web content is accessible to people with disabilities. This checklist ensures AIAS Platform meets WCAG 2.2 Level AA standards.

**Key Principles:**
- **Perceivable:** Information must be perceivable to users
- **Operable:** Interface must be operable by users
- **Understandable:** Information must be understandable
- **Robust:** Content must be robust and compatible

---

## Level A (Minimum Requirements)

### 1.1 Text Alternatives
- [ ] **Images:** All images have alt text (descriptive alt text for informative images, empty alt="" for decorative images)
- [ ] **Icons:** Icon buttons have accessible names (aria-label or text)
- [ ] **Charts/Graphs:** Complex images have long descriptions (aria-describedby or text)

### 1.2 Time-Based Media
- [ ] **Video:** Videos have captions (if audio content)
- [ ] **Audio:** Audio content has transcripts (if no video)
- [ ] **Auto-Playing:** Auto-playing media can be paused or stopped

### 1.3 Adaptable
- [ ] **Layout:** Content structure is preserved when CSS is disabled
- [ ] **Tables:** Tables have headers (th elements)
- [ ] **Forms:** Form fields have labels (associated with inputs)

### 1.4 Distinguishable
- [ ] **Color Contrast:** Text has sufficient contrast (4.5:1 for normal text, 3:1 for large text)
- [ ] **Color Alone:** Information not conveyed by color alone (use icons, text)
- [ ] **Audio Control:** Audio can be paused/stopped (if auto-playing)

### 2.1 Keyboard Accessible
- [ ] **Keyboard Navigation:** All functionality available via keyboard (no mouse-only interactions)
- [ ] **Focus Order:** Focus order is logical (tab order matches visual order)
- [ ] **Focus Visible:** Keyboard focus is visible (focus indicators)

### 2.2 Enough Time
- [ ] **No Timeouts:** No time limits (or users can extend time limits)
- [ ] **Pause/Stop:** Auto-updating content can be paused/stopped
- [ ] **No Flashing:** No flashing content (prevents seizures)

### 2.3 Seizures
- [ ] **No Flashing:** No flashing content (3 flashes per second or less)

### 2.4 Navigable
- [ ] **Page Titles:** Pages have descriptive titles
- [ ] **Skip Links:** Skip to main content links (for keyboard users)
- [ ] **Headings:** Content organized with headings (h1-h6 hierarchy)
- [ ] **Focus Order:** Focus order is logical

### 3.1 Readable
- [ ] **Language:** Page language declared (lang attribute on html element)
- [ ] **Language Changes:** Language changes marked (lang attribute on elements)

### 3.2 Predictable
- [ ] **No Context Changes:** No unexpected context changes (on focus, input)
- [ ] **Consistent Navigation:** Navigation is consistent across pages
- [ ] **Consistent Identification:** Components are consistently identified

### 3.3 Input Assistance
- [ ] **Error Identification:** Errors are identified (error messages, aria-invalid)
- [ ] **Labels/Instructions:** Form fields have labels and instructions
- [ ] **Error Suggestions:** Error suggestions provided (how to fix errors)

### 4.1 Compatible
- [ ] **Valid HTML:** HTML is valid (no syntax errors)
- [ ] **Name/Role/Value:** UI components have accessible names, roles, values (ARIA)

---

## Level AA (Enhanced Requirements)

### 1.2.4 Captions (Live)
- [ ] **Live Captions:** Live videos have captions (if applicable)

### 1.2.5 Audio Description
- [ ] **Audio Description:** Pre-recorded videos have audio descriptions (if applicable)

### 1.4.3 Contrast (Minimum)
- [ ] **Text Contrast:** Text has 4.5:1 contrast ratio (normal text)
- [ ] **Large Text:** Large text has 3:1 contrast ratio (18pt+ or 14pt+ bold)
- [ ] **UI Components:** UI components have 3:1 contrast ratio (borders, focus indicators)

### 1.4.4 Resize Text
- [ ] **Text Resize:** Text can be resized up to 200% without loss of functionality

### 1.4.5 Images of Text
- [ ] **No Images of Text:** Text is not presented as images (use real text)

### 2.4.5 Multiple Ways
- [ ] **Navigation:** Multiple ways to navigate (navigation menu, search, sitemap)

### 2.4.6 Headings and Labels
- [ ] **Descriptive Headings:** Headings describe content
- [ ] **Descriptive Labels:** Labels describe form fields

### 2.4.7 Focus Visible
- [ ] **Focus Indicators:** Keyboard focus is visible (2px solid outline, 3:1 contrast)

### 3.2.3 Consistent Navigation
- [ ] **Consistent Navigation:** Navigation is consistent across pages

### 3.2.4 Consistent Identification
- [ ] **Consistent Identification:** Components are consistently identified (same icons, labels)

### 3.3.1 Error Identification
- [ ] **Error Identification:** Errors are identified (error messages, aria-invalid, aria-describedby)

### 3.3.2 Labels or Instructions
- [ ] **Labels/Instructions:** Form fields have labels and instructions

### 3.3.3 Error Suggestion
- [ ] **Error Suggestions:** Error suggestions provided (how to fix errors)

### 3.3.4 Error Prevention (Legal)
- [ ] **Error Prevention:** Legal/financial submissions can be reviewed and corrected

### 4.1.2 Name, Role, Value
- [ ] **ARIA:** UI components have accessible names, roles, values (ARIA attributes)

---

## WCAG 2.2 New Criteria (Level AA)

### 2.4.11 Focus Not Obscured (Minimum)
- [ ] **Focus Visible:** Keyboard focus is not obscured (visible when focused)

### 2.4.12 Focus Not Obscured (Enhanced)
- [ ] **Focus Fully Visible:** Keyboard focus is fully visible (no partial obscuring)

### 2.5.7 Dragging Movements
- [ ] **Alternatives:** Dragging has keyboard alternatives (arrow keys, buttons)

### 2.5.8 Target Size (Minimum)
- [ ] **Touch Targets:** Touch targets are at least 24x24px (mobile/tablet)

### 3.2.6 Consistent Help
- [ ] **Help Location:** Help is consistently located (same place on every page)

### 3.3.7 Redundant Entry
- [ ] **No Redundant Entry:** Previously entered information is not re-entered (autofill, cookies)

### 3.3.8 Accessible Authentication (Minimum)
- [ ] **No Cognitive Tests:** Authentication doesn't require cognitive tests (CAPTCHA alternatives)

---

## Implementation Checklist

### Design Phase
- [ ] **Color Contrast:** Check contrast ratios (use WebAIM Contrast Checker)
- [ ] **Keyboard Navigation:** Design for keyboard users (no mouse-only interactions)
- [ ] **Focus Indicators:** Design visible focus indicators (2px solid outline)
- [ ] **Touch Targets:** Design 24x24px+ touch targets (mobile/tablet)

### Development Phase
- [ ] **HTML Semantics:** Use semantic HTML (headings, landmarks, lists)
- [ ] **ARIA:** Use ARIA attributes where needed (aria-label, aria-describedby, aria-invalid)
- [ ] **Form Labels:** Associate labels with form fields (for/id or aria-labelledby)
- [ ] **Keyboard Navigation:** Implement keyboard navigation (tab, enter, escape)
- [ ] **Focus Management:** Manage focus (focus traps, focus restoration)

### Testing Phase
- [ ] **Automated Testing:** Run automated accessibility tests (axe, Lighthouse, WAVE)
- [ ] **Keyboard Testing:** Test with keyboard only (no mouse)
- [ ] **Screen Reader Testing:** Test with screen readers (NVDA, JAWS, VoiceOver)
- [ ] **Manual Testing:** Manual accessibility audit (WCAG 2.2 checklist)

---

## Testing Tools

### Automated Testing
- **axe DevTools:** Browser extension for accessibility testing
- **Lighthouse:** Chrome DevTools accessibility audit
- **WAVE:** Web accessibility evaluation tool

### Screen Readers
- **NVDA:** Free screen reader for Windows
- **JAWS:** Commercial screen reader for Windows
- **VoiceOver:** Built-in screen reader for macOS/iOS

### Color Contrast
- **WebAIM Contrast Checker:** Check color contrast ratios
- **Contrast Ratio:** Online contrast checker

---

## Priority Fixes (Critical)

1. **Color Contrast:** Ensure all text meets 4.5:1 contrast ratio
2. **Keyboard Navigation:** Ensure all functionality is keyboard accessible
3. **Focus Indicators:** Ensure keyboard focus is visible
4. **Form Labels:** Ensure all form fields have labels
5. **Alt Text:** Ensure all images have alt text

---

## Resources

- **WCAG 2.2 Guidelines:** https://www.w3.org/WAI/WCAG22/quickref/
- **WebAIM:** https://webaim.org/
- **A11y Project:** https://www.a11yproject.com/
- **Canadian Accessibility Standards:** https://www.ic.gc.ca/eic/site/012.nsf/eng/home

---

**Last Updated:** January 15, 2024  
**Status:** In Progress (Target: WCAG 2.2 Level AA compliance by Q2 2024)  
**Next Review:** April 15, 2024 (Quarterly)
