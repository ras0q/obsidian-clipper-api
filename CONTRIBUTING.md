# Contributing Guide

## Development Setup

### Prerequisites

See [package.json](package.json) `engines` field for required versions.

### Initial Setup

```bash
git clone https://github.com/ras0q/obsidian-clipper-api.git
cd obsidian-clipper-api
git submodule update --init --recursive
corepack enable pnpm
pnpm install
pnpm dev
```

Test API:
```bash
curl http://localhost:3000/
curl -X POST http://localhost:3000/convert \
  -H "Content-Type: application/json" \
  -d @test/fixtures/basic-template.json
```

## Code Standards

### Language

All code artifacts (comments, variable names, commit messages, documentation) must be in English.

### Commit Messages

Use Conventional Commits:

```markdown
<type>(<scope>): <subject>

<body>

<!-- If you used AI assistance, add this line -->
Assisted-by: Claude Code (model: Claude Opus 4.5)
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

**Breaking changes:** Add `!` after type: `feat(api)!: change response format`

### Code Style

Use Biome (see [biome.json](biome.json)):

```bash
pnpm lint          # Check for issues
pnpm lint:fix      # Auto-fix issues
pnpm format        # Format code
```

### Comments

Only comment non-obvious decisions (explain WHY, not WHAT):

```typescript
// ✅ Good - Explains workaround
// FIXME: Direct import doesn't work with current esbuild config
import * as converter from "obsidian-clipper/utils/markdown-converter.ts";

// ❌ Bad - Restates code
// Create a new JSDOM instance
const dom = new JSDOM(html, { url });
```

## Project Architecture

### Data Flow

```
Request → convert.ts → extractor.ts → converter.ts → Response
                         ↓
                      variables.ts
                         ↓
                      frontmatter.ts
```

See [docs/specification.md](docs/specification.md) for details.

### Clipper Integration

**Import types and utilities from submodule:**

See [vendor/obsidian-clipper/](vendor/obsidian-clipper/) for available modules.

Path mapping in [tsconfig.json](tsconfig.json) allows:
```typescript
import type { Template } from "obsidian-clipper/types/types";
import { renderTemplate } from "obsidian-clipper/utils/renderer";
```

**Adapt for server:**
- Browser DOM → jsdom
- Browser fetch → Node.js fetch
- See [src/core/](src/core/) for adaptations

## Common Tasks

### Add a New Variable

Edit [src/core/variables.ts](src/core/variables.ts):

```typescript
export function buildVariableContext(pageData: ExtractedPageData): VariableContext {
  return {
    // ...existing variables...
    readingTime: Math.ceil(pageData.wordCount / 200),
  };
}
```

### Add a New Endpoint

Create `src/routes/health.ts`:

```typescript
import { Hono } from "hono";

const health = new Hono();

health.get("/", (c) => {
  return c.json({ status: "ok" });
});

export default health;
```

Register in [src/index.ts](src/index.ts):

```typescript
import health from "./routes/health.ts";

app.route("/health", health);
```

### Update Obsidian Clipper Submodule

```bash
cd vendor/obsidian-clipper
git pull origin main
cd ../..
git add vendor/obsidian-clipper
git commit -m "chore(deps): update obsidian-clipper submodule"
```

## Testing

### Manual Testing

```bash
pnpm dev

# Test with fixture
curl -X POST http://localhost:3000/convert \
  -H "Content-Type: application/json" \
  -d @test/fixtures/basic-template.json
```

See [test/fixtures/](test/fixtures/) for example templates.

### Test Sites

- Simple: https://example.com
- Documentation: https://developer.mozilla.org/
- Article: https://hacks.mozilla.org/

## Pull Request Process

1. Create feature branch: `git checkout -b feat/feature-name`
2. Make changes with clean code
3. Run linting: `pnpm lint:fix`
4. Commit with conventional commits
5. Push and create PR

## Documentation

### SSoT Principle

**Never duplicate information that exists in code/config files.**

- Version info → Link to [package.json](package.json)
- Type definitions → Link to [src/types/](src/types/)
- Obsidian Clipper specs → Link to [vendor/obsidian-clipper/](vendor/obsidian-clipper/)
- Configuration → Link to config files

### Stock Information (Keep Updated)

- [README.md](README.md) - User-facing documentation
- [docs/specification.md](docs/specification.md) - Technical specification
- [docs/deployment.md](docs/deployment.md) - Deployment guide
- [docs/ios-integration.md](docs/ios-integration.md) - iOS integration guide
- [CONTRIBUTING.md](CONTRIBUTING.md) - This file

### Flow Information (Development Notes)

Create notes for detailed discussions:

```bash
touch notes/$(date '+%Y-%m-%dT%H-%M-%S')_feature-name.md
```

Flow notes capture journey, not destination. Never updated after creation.

## Common Issues

### Build Errors

**Cannot find module 'obsidian-clipper/...'**

Initialize submodule:
```bash
git submodule update --init --recursive
```

Check [tsconfig.json](tsconfig.json) path mapping.

### Runtime Errors

**document is not defined**

Ensure jsdom globals are initialized at top of [src/core/extractor.ts](src/core/extractor.ts).

**Fetch fails**

Website may block request. Try different User-Agent in [src/core/extractor.ts](src/core/extractor.ts).

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

