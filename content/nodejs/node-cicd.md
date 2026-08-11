---
title: "CI/CD & Hosting"
category: "nodejs"
chapterId: "node-devops"
slug: "node-cicd"
description: "GitHub Actions pipelines and deploying to AWS, Heroku, Render, and DigitalOcean."
---

# CI/CD & Hosting

## GitHub Actions — automated pipeline

```yaml
# .github/workflows/deploy.yml
name: CI / CD

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build Docker image
        run: docker build -t my-api .

      - name: Push to ECR
        run: |
          aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_REGISTRY
          docker tag my-api $ECR_REGISTRY/my-api:latest
          docker push $ECR_REGISTRY/my-api:latest
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          ECR_REGISTRY: ${{ secrets.ECR_REGISTRY }}
```

## Hosting options

| Platform | Best for | Notes |
|---|---|---|
| AWS EC2 | Full control | Manual setup; use PM2 or Docker |
| AWS ECS/Fargate | Containers | Serverless container orchestration |
| Heroku | Quick deploy | `git push heroku main` — simplest DX |
| Render | Modern Heroku | Free tier, auto-deploys from GitHub |
| DigitalOcean App Platform | Simplicity | Dockerfile or buildpack auto-detect |

## Render — simplest deployment

1. Connect GitHub repo.
2. Select "Web Service" → choose Node environment.
3. Set build command: `npm ci && npm run build`.
4. Set start command: `node dist/app.js`.
5. Add environment variables in the dashboard.

## Best practices

- Store all secrets in GitHub Actions secrets / hosting env vars — never in code.
- Run `npm audit` in CI and fail the build on critical vulnerabilities.
- Use environment-specific configs (`NODE_ENV=production`).
- Tag Docker images with the git commit SHA for traceability.

```yaml
- name: Tag with SHA
  run: docker tag my-api my-api:${{ github.sha }}
```
