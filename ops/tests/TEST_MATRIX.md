# AIAS Platform - Test Matrix

## Overview
This document defines the comprehensive testing strategy for the AIAS platform, including unit tests, integration tests, end-to-end tests, and performance tests.

## Testing Philosophy
- **Test Pyramid**: Unit tests (70%), Integration tests (20%), E2E tests (10%)
- **Coverage Thresholds**: Global ≥80%, Critical modules ≥90%
- **Quality Gates**: All tests must pass before deployment
- **Continuous Testing**: Automated testing in CI/CD pipeline

## Test Types

### 1. Unit Tests
**Framework**: Vitest + Testing Library  
**Coverage Target**: 80% overall, 90% critical modules  
**Location**: `src/**/*.test.{ts,tsx}`

#### Components Testing
- **UI Components**: Rendering, props, user interactions
- **Hooks**: Custom React hooks behavior
- **Utilities**: Pure functions and helpers
- **Business Logic**: Core application logic

#### Test Examples
```typescript
// Component test
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

// Hook test
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '@/hooks/use-counter';

describe('useCounter Hook', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('increments count', () => {
    const { result } = renderHook(() => useCounter());
    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);
  });
});
```

### 2. Integration Tests
**Framework**: Vitest + Testing Library + MSW  
**Coverage Target**: 80%  
**Location**: `src/**/*.integration.test.{ts,tsx}`

#### API Integration
- **API Endpoints**: Request/response handling
- **Database Operations**: CRUD operations
- **External Services**: Third-party API integration
- **Authentication**: Login/logout flows

#### Test Examples
```typescript
// API integration test
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitFor } from '@testing-library/react';
import { UserProfile } from '@/components/UserProfile';

const server = setupServer(
  rest.get('/api/user', (req, res, ctx) => {
    return res(ctx.json({ id: 1, name: 'John Doe', email: 'john@example.com' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('UserProfile Integration', () => {
  it('loads and displays user data', async () => {
    render(<UserProfile userId="1" />);
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});
```

### 3. End-to-End Tests
**Framework**: Playwright  
**Coverage Target**: Critical user journeys  
**Location**: `tests/e2e/**/*.spec.ts`

#### Critical User Journeys
- **Authentication**: Login, logout, password reset
- **User Registration**: Signup, email verification
- **Platform Usage**: Create project, deploy agent
- **Payment Flow**: Subscribe, upgrade, cancel
- **Admin Functions**: User management, system settings

#### Test Examples
```typescript
// E2E test
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('user can login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'user@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('user cannot login with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'user@example.com');
    await page.fill('[data-testid="password"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');
    
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials');
  });
});
```

### 4. Performance Tests
**Framework**: Lighthouse CI + Playwright  
**Coverage Target**: Core Web Vitals compliance  
**Location**: `tests/performance/**/*.test.ts`

#### Performance Metrics
- **Core Web Vitals**: LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms
- **Bundle Size**: ≤ 1MB total, ≤ 250KB per chunk
- **Load Time**: ≤ 3s on 3G connection
- **API Response**: ≤ 500ms average response time

#### Test Examples
```typescript
// Performance test
import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('homepage meets Core Web Vitals', async ({ page }) => {
    await page.goto('/');
    
    // Measure LCP
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });
    
    expect(lcp).toBeLessThan(2500);
  });

  test('bundle size is within limits', async ({ page }) => {
    const response = await page.goto('/');
    const contentLength = response?.headers()['content-length'];
    
    if (contentLength) {
      expect(parseInt(contentLength)).toBeLessThan(1024 * 1024); // 1MB
    }
  });
});
```

### 5. Accessibility Tests
**Framework**: Playwright + axe-core  
**Coverage Target**: WCAG 2.2 AA compliance  
**Location**: `tests/a11y/**/*.spec.ts`

#### Accessibility Checks
- **Keyboard Navigation**: Tab order, focus management
- **Screen Reader**: ARIA labels, semantic HTML
- **Color Contrast**: WCAG AA compliance
- **Form Labels**: Proper labeling and error messages

#### Test Examples
```typescript
// Accessibility test
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('homepage is accessible', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('forms are keyboard accessible', async ({ page }) => {
    await page.goto('/login');
    
    // Test tab order
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="email"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="password"]')).toBeFocused();
  });
});
```

## Test Configuration

### Vitest Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
        critical: {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Playwright Configuration
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Test Data Management

### Test Fixtures
- **User Data**: Test users with different roles
- **Project Data**: Sample projects and configurations
- **API Responses**: Mocked API responses
- **File Uploads**: Test files for upload scenarios

### Database Seeding
```typescript
// test/setup.ts
import { beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Seed test database
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      // ... other fields
    },
  });
});

afterAll(async () => {
  // Clean up test database
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Reset database state before each test
  await prisma.user.deleteMany();
});
```

## Test Automation

### CI/CD Integration
```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:e2e
      
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### Test Reporting
- **Coverage Reports**: HTML and JSON coverage reports
- **Test Results**: JUnit XML for CI integration
- **Screenshots**: Failed test screenshots
- **Videos**: E2E test recordings
- **Traces**: Playwright traces for debugging

## Test Maintenance

### Regular Tasks
- **Weekly**: Review and update test data
- **Monthly**: Update test dependencies
- **Quarterly**: Review test coverage and add missing tests
- **Annually**: Complete test strategy review

### Test Quality Metrics
- **Flakiness Rate**: < 5% for E2E tests
- **Execution Time**: < 10 minutes for full suite
- **Coverage**: Maintain 80%+ coverage
- **Maintenance**: < 20% of development time

## Test Documentation

### Test Cases
- **User Stories**: Link tests to user stories
- **Acceptance Criteria**: Clear test criteria
- **Test Data**: Document test data requirements
- **Environment**: Test environment setup

### Test Reports
- **Daily**: Test execution summary
- **Weekly**: Coverage and quality metrics
- **Monthly**: Test strategy effectiveness
- **Quarterly**: Test automation ROI

## Best Practices

### Writing Tests
1. **Arrange-Act-Assert**: Clear test structure
2. **Single Responsibility**: One test per scenario
3. **Descriptive Names**: Clear test descriptions
4. **Independent Tests**: Tests don't depend on each other
5. **Fast Execution**: Unit tests should be fast

### Test Data
1. **Realistic Data**: Use realistic test data
2. **Minimal Data**: Use only necessary test data
3. **Isolated Data**: Tests don't share data
4. **Cleanup**: Clean up after tests

### Maintenance
1. **Regular Updates**: Keep tests up to date
2. **Refactoring**: Refactor tests with code changes
3. **Documentation**: Document test decisions
4. **Monitoring**: Monitor test health and performance