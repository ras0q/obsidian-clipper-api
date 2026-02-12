# syntax=docker/dockerfile:1

FROM node:24-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app
RUN corepack enable

FROM base AS pruned

RUN --mount=type=bind,source=.,target=/app,rw \
    --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile && \
    pnpm -F obsidian-clipper-api --legacy deploy /tmp/pruned

FROM base AS builder

COPY --from=pruned /tmp/pruned /app
RUN pnpm build

FROM base AS runner

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist

USER node
EXPOSE 3000
ENV NODE_ENV=production
STOPSIGNAL SIGTERM

CMD ["node", "/app/dist/index.node.js"]
