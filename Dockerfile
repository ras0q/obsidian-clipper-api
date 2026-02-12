# syntax=docker/dockerfile:1

FROM node:24-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app
RUN corepack enable

FROM base AS pruned

RUN --mount=type=bind,source=.,target=.,rw \
    --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile && \
    pnpm build && \
    pnpm -F obsidian-clipper-api -P --legacy deploy /tmp/pruned

FROM base AS runner

COPY --from=pruned /tmp/pruned .

USER node
EXPOSE 3000
ENV NODE_ENV=production
STOPSIGNAL SIGTERM

CMD ["node", "dist/index.node.js"]
