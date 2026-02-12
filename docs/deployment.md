# Deployment Guide

## Environment Variables

See [src/index.ts](../src/index.ts) for supported environment variables.

```bash
PORT=3000  # Server port (default: 3000)
```

## Option 1: Node.js

Requires Node.js version specified in [package.json](../package.json) `engines` field.

```bash
pnpm install --frozen-lockfile
pnpm build
PORT=3000 pnpm start
```

## Option 2: Docker

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

```bash
docker build -t obsidian-clipper-api .
docker run -p 3000:3000 obsidian-clipper-api
```

## Option 3: Docker Compose

```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
    restart: unless-stopped
```

```bash
docker-compose up -d
```

## Cloud Platforms

### Google Cloud Run

```bash
gcloud run deploy obsidian-clipper-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Fly.io

```bash
fly launch
fly deploy
```

### Cloudflare Workers

Requires adapter (future feature).

### AWS Lambda

Requires adapter (future feature).

## Production Considerations

- Add reverse proxy (nginx, Caddy) for rate limiting
- Use API gateway for authentication if needed
- Monitor with logging service
- Set up health checks and alerting
