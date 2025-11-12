> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Accessibility Report Template (WCAG 2.2 AA)

**Assessment Date:** [Date]  
**Assessor:** [Name/Role]  
**Scope:** [Pages/Routes Tested]  
**Standard:** WCAG 2.2 Level AA

## Executive Summary

### Overall Compliance

- **Compliance Level:** [Pass / Partial / Fail]
- **Pages Tested:** [Number]
- **Critical Issues:** [Number]
- **Non-Critical Issues:** [Number]

### Key Findings

- [Summary of most critical accessibility issues]
- [Areas of strength]
- [Recommended priority actions]

## Tested Routes

| Route | Status | Critical Issues | Notes |
|-------|--------|----------------|-------|
| `/` | [Pass/Partial/Fail] | [Count] | [Notes] |
| `/trust` | [Pass/Partial/Fail] | [Count] | [Notes] |
| `/privacy` | [Pass/Partial/Fail] | [Count] | [Notes] |
| `/status` | [Pass/Partial/Fail] | [Count] | [Notes] |
| `/help` | [Pass/Partial/Fail] | [Count] | [Notes] |
| `/account/audit-log` | [Pass/Partial/Fail] | [Count] | [Notes] |

## WCAG 2.2 AA Checklist

### Perceivable

#### 1.1.1 Non-text Content (Level A)
- [ ] All images have alt text
- [ ] Decorative images have empty alt attributes
- [ ] Icons have accessible names or aria-labels
- **Status:** [Pass/Partial/Fail]
- **Issues:** [List issues]

#### 1.3.1 Info and Relationships (Level A)
- [ ] Headings are properly structured (h1 → h2 → h3)
- [ ] Lists use proper list markup
- [ ] Form fields have associated labels
- **Status:** [Pass/Partial/Fail]
- **Issues:** [List issues]

#### 1.4.3 Contrast (Minimum) (Level AA)
- [ ] Text contrast ratio ≥ 4.5:1 (normal text)
- [ ] Text contrast ratio ≥ 3:1 (large text)
- [ ] UI components have sufficient contrast
- **Status:** [Pass/Partial/Fail]
- **Issues:** [List issues]
- **Tools Used:** [axe DevTools, WAVE, manual inspection]

#### 1.4.10 Reflow (Level AA)
- [ ] Content reflows at 320px width without horizontal scrolling
- [ ] No fixed-width containers that cause overflow
- **Status:** [Pass/Partial/Fail]
- **Issues:** [List issues]

#### 1.4.11 Non-text Contrast (Level AA)
- [ ] UI components have contrast ratio ≥ 3:1
- [ ] Focus indicators are visible
- **Status:** [Pass/Partial/Fail]
- **Issues:** [List issues]

#### 1.4.12 Text Spacing (Level AA)
- [ ] Text spacing can be adjusted without loss of content
- **Status:** [Pass/Partial/Fail]
- **Issues:** [List issues]

#### 1.4.13 Content on Hover or Focus (Level AA)
- [ ] Hover/focus content is dismissible
- [ ] Hover/focus content is hoverable
- [ ] Hover/focus content is persistent
- **Status:** [Pass/Partial/Fail]
- **Issues:** [List issues]

### Operable

#### 2.1.1 Keyboard (Level A)
- [ ] All functionality available via keyboard
- [ ] No keyboard traps
- [ ] Tab order is logical
- **Status:** [Pass/Partial/Fail]
- **Issues:** [List issues]

#### 2.1.2 No Keyboard Trap (Level A)
- [ ] Users can navigate away from all components
- [ ] Modal dialogs can be closed with Escape
- **Status:** [Pass/Partial/Fail]
- **Issues:** [List issues]

#### 2.1.4 Character Key Shortcuts (Level A)
- [ ] Single-key shortcuts can be turned off or remapped
- **Status:** [Pass/Partial/Fail]
- **Issues:** [List issues] (if applicable)

#### 2.4.1 Bypass Blocks (Level A)
- [ ] Skip-to-content link present
- [ ] Skip link is functional and visible on focus
- **Status:** [Pass/Partial/Fail]
- **Issues:** [List issues]
- **Note:** Skip link exists in `app/layout.tsx`

#### 2.4.2 Page Titled (Level A)
- [ ] Each page has a descriptive title
- [ ] Titles are unique and descriptive
- **Status:** [Pass/Partial/Fail]
- **Issues:** [List issues]

#### 2.4.3 Focus Order (Level A)
- [ ] Focus order follows visual order
- [ ] Dynamic content appears in logical order
- **Status:** [Pass/Partial/Fail]
- **Issues:** [List issues]

#### 2.4.4 Link Purpose (In Context) (Level A)
- [ ] Link text is descriptive
- [ ] Links make sense out of context
- **Status:** [Pass/Partial/Fail]
- **Issues:** [List issues]

#### 2.4.6 Headings and Labels (Level AA)
- [ ] Headings describe topic or purpose
- [ ] Form labels describe purpose
- **Status:** [Pass/Partial/Fail]
- **Issues:** [List issues]

#### 2.4.7 Focus Visible (Level AA)
- [ ] Focus indicators are visible
- [ ] Focus indicators meet contrast requirements
- **Status:** [Pass/Partial/Fail]
- **Issues:** [List issues]
- **Note:** Focus styles defined in `app/globals.css`

#### 2.5.3 Label in Name (Level A)
- [ ] Accessible name contains visible text
- [ ] Icon buttons have accessible names
- **Status:** [Pass/Partial/Fail]
- **Issues:** [List issues]

#### 2.5.4 Motion Actuation (Level A)
- [ ] Motion-based actions can be performed without motion
- **Status:** [Pass/Partial/Fail]
- **Issues:** [List issues]

### Understandable

#### 3.2.1 On Focus (Level A)
- [ ] No context changes on focus
- **Status:** [Pass/Partial/Fail]
- **Issues:** [List issues]

#### 3.2.2 On Input (Level A)
- [ ] No unexpected context changes on input
- **Status:** [Pass/Partial/Fail]
- **Issues:** [List issues]

#### 3.3.1 Error Identification (Level A)
- [ ] Errors are identified
- [ ] Error messages are descriptive
- **Status:** [Pass/Partial/Fail]
- **Issues:** [List issues]

#### 3.3.2 Labels or Instructions (Level A)
- [ ] Form fields have labels or instructions
- [ ] Required fields are indicated
- **Status:** [Pass/Partial/Fail]
- **Issues:** [List issues]

#### 3.3.3 Error Suggestion (Level AA)
- [ ] Error suggestions are provided
- **Status:** [Pass/Partial/Fail]
- **Issues:** [List issues]

#### 3.3.4 Error Prevention (Legal, Financial, Data) (Level AA)
- [ ] Financial transactions are reversible or confirmable
- **Status:** [Pass/Partial/Fail]
- **Issues:** [List issues]

### Robust

#### 4.1.1 Parsing (Level A)
- [ ] HTML is valid (no parsing errors)
- **Status:** [Pass/Partial/Fail]
- **Issues:** [List issues]

#### 4.1.2 Name, Role, Value (Level A)
- [ ] Custom components have accessible names
- [ ] ARIA attributes are used correctly
- [ ] Roles are assigned appropriately
- **Status:** [Pass/Partial/Fail]
- **Issues:** [List issues]

#### 4.1.3 Status Messages (Level AA)
- [ ] Status messages are announced to screen readers
- [ ] ARIA live regions used appropriately
- **Status:** [Pass/Partial/Fail]
- **Issues:** [List issues]

## Known Issues

### Critical Issues (P0)

1. **[Issue Title]**
   - **Route:** `/route`
   - **WCAG Criterion:** [Criterion]
   - **Impact:** [Impact description]
   - **Fix:** [Proposed fix]
   - **ETA:** [Date]

### Non-Critical Issues (P1-P2)

1. **[Issue Title]**
   - **Route:** `/route`
   - **WCAG Criterion:** [Criterion]
   - **Impact:** [Impact description]
   - **Fix:** [Proposed fix]

## Testing Tools Used

- **Automated:** [axe DevTools, WAVE, Lighthouse, pa11y]
- **Manual:** [Screen reader testing (NVDA/JAWS/VoiceOver), Keyboard navigation]
- **Browser Testing:** [Chrome, Firefox, Safari, Edge]

## Screen Reader Testing

### Tested With

- [ ] NVDA (Windows)
- [ ] JAWS (Windows)
- [ ] VoiceOver (macOS/iOS)
- [ ] TalkBack (Android)

### Results

- [Summary of screen reader compatibility]
- [Key issues found]

## Keyboard Navigation Testing

### Tested Routes

- [ ] All routes navigable via keyboard
- [ ] Focus order is logical
- [ ] Focus indicators are visible
- [ ] No keyboard traps

### Issues Found

- [List keyboard navigation issues]

## Reduced Motion Testing

### Implementation

- **Status:** Implemented in `app/globals.css`
- **CSS:** `@media (prefers-reduced-motion: reduce)`

### Testing

- [ ] Reduced motion preference respected
- [ ] Animations disabled when preference set
- [ ] No essential information lost

## Remediation Plan

### Immediate (0-1 week)

1. [Fix critical issues]
2. [Add missing alt text]
3. [Fix contrast issues]

### Short-term (1-4 weeks)

1. [Improve ARIA labels]
2. [Enhance keyboard navigation]
3. [Fix form labels]

### Long-term (1-3 months)

1. [Full WCAG 2.2 AA audit]
2. [Automated accessibility testing in CI]
3. [Screen reader testing program]

## Next Steps

1. [ ] Review and prioritize issues
2. [ ] Assign remediation tasks
3. [ ] Schedule follow-up audit
4. [ ] Implement automated testing

## References

- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
