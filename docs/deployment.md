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

### Using Pre-built Image

```bash
docker run -p 3000:3000 ghcr.io/ras0q/obsidian-clipper-api:latest
```

### Building from Source

```bash
docker build -t obsidian-clipper-api .
docker run -p 3000:3000 obsidian-clipper-api
```
