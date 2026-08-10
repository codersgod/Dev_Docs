---
title: "Testing & Deployment"
category: "react"
chapterId: "server-frameworks-deployment"
slug: "testing-deployment"
description: "Unit, integration, and E2E tests with Jest, React Testing Library, Playwright, or Cypress."
---

# Testing & Deployment

## What is it?

Testing ensures your React app works correctly before users see it. Deployment is the process of pushing your app to production. Both are critical for professional React development.

## Types of testing

### 1. Unit Tests — test individual functions/components

Use **Jest** (test runner) and **React Testing Library** (component testing).

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

```jsx
// Button.test.jsx
import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renders button with label', () => {
  render(<Button label="Click me" />);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

**When to use:** Test pure components, utility functions, and hooks.

### 2. Integration Tests — test multiple components together

Test how components interact — forms submitting, modals opening, data flowing.

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './LoginForm';

test('submits form with correct data', async () => {
  const mockSubmit = jest.fn();
  render(<LoginForm onSubmit={mockSubmit} />);

  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
  fireEvent.click(screen.getByText('Login'));

  expect(mockSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
});
```

**When to use:** Test user flows that span multiple components.

### 3. End-to-End (E2E) Tests — test the entire app in a real browser

Use **Playwright** (recommended) or **Cypress**.

```bash
npm install --save-dev @playwright/test
```

```js
// tests/login.spec.js
import { test, expect } from '@playwright/test';

test('user can log in', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  await expect(page.locator('text=Dashboard')).toBeVisible();
});
```

**When to use:** Test critical user journeys (signup, checkout, login).

## Testing philosophy

- **Unit tests** → fast, isolated, test logic.
- **Integration tests** → test component interactions.
- **E2E tests** → slow, expensive, test the whole app like a user.

Aim for:
- 70% unit tests.
- 20% integration tests.
- 10% E2E tests.

## Deployment strategies

### 1. Static Hosting (CSR / SSG)

Deploy static files to a CDN.

**Providers:**
- Vercel (best for Next.js).
- Netlify (great DX, automatic deploys from Git).
- Cloudflare Pages (fast edge network).
- GitHub Pages (free for open-source).

**Steps:**
1. Run `npm run build`.
2. Upload `build/` or `dist/` to the provider.
3. Done — automatic CDN distribution.

### 2. Server Hosting (SSR / Next.js)

Deploy a Node.js server.

**Providers:**
- Vercel (zero-config for Next.js).
- Railway, Render, Fly.io (simple Node.js hosts).
- AWS, Google Cloud, Azure (enterprise-scale).

**Steps:**
1. Build the app (`npm run build`).
2. Deploy to a server that runs `npm start`.
3. Configure environment variables (API keys, database URLs).

### 3. Edge Deployment (ISR / Remix)

Deploy to edge networks (servers close to users worldwide).

**Providers:**
- Cloudflare Workers (fastest edge network).
- Vercel Edge Functions.
- Netlify Edge Functions.

## CI/CD — Continuous Integration / Deployment

Automate testing and deployment with **GitHub Actions**, **GitLab CI**, or **CircleCI**.

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test
      - run: npm run build
      - run: vercel --prod
```

Every push to `main` → tests run → if pass, deploy to production.

## Deployment checklist

- [ ] Run tests before deploying.
- [ ] Set environment variables (never commit secrets).
- [ ] Enable HTTPS (automatic on Vercel/Netlify).
- [ ] Configure custom domain.
- [ ] Set up analytics (Vercel Analytics, Google Analytics).
- [ ] Monitor errors (Sentry, LogRocket).

> ⚠️ **Warning:** Never commit `.env` files to Git. Use `.gitignore` and set environment variables in your hosting provider's dashboard. Leaked API keys can cost you thousands in cloud bills or security breaches.
