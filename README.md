# Obsidian Clipper API

Lightweight API for converting web pages to Markdown using Obsidian Clipper templates.

## ✅ Phase 1 Implementation Complete

### Features Implemented

- ✅ URL fetching and content extraction with **Defuddle**
- ✅ Markdown conversion using Obsidian Clipper's `markdown-converter`
- ✅ Template variable system (`{{title}}`, `{{url}}`, `{{content}}`, etc.)
- ✅ Filter support (`{{date:YYYY-MM-DD}}`, `{{title|uppercase}}`, etc.)
- ✅ Frontmatter generation from template properties
- ✅ REST API with Hono framework
  - `GET /health` - Health check
  - `POST /convert` - Convert URL to Markdown

### Quick Start

```bash
# Install dependencies
pnpm install

# Start server
pnpm start
# or
pnpm dev

# Test API (in another terminal)
curl http://localhost:3000/health

curl -X POST http://localhost:3000/convert \
  -H "Content-Type: application/json" \
  -d @test/fixtures/basic-template.json
```

### Project Structure

```
obsidian-clipper-api/
├── src/                    # API implementation
│   ├── index.ts           # Hono app entry point
│   ├── routes/            # API endpoints
│   ├── core/              # Core logic
│   │   ├── extractor.ts   # Defuddle + fetch
│   │   ├── variables.ts   # Variable context building
│   │   ├── renderer.ts    # Template rendering
│   │   ├── frontmatter.ts # YAML frontmatter generation
│   │   └── converter.ts   # Main conversion orchestrator
│   └── types/             # TypeScript types
├── vendor/                # Git submodule
│   └── obsidian-clipper/  # Official Obsidian Clipper source
├── test/
│   └── fixtures/          # Test templates
└── docs/
    └── specification.md   # Full specification
```

### API Usage

#### Convert URL to Markdown

**Request:**
```bash
POST /convert
Content-Type: application/json

{
  "url": "https://example.com/article",
  "template": {
    "id": "default",
    "name": "Default Template",
    "behavior": "create",
    "noteNameFormat": "{{title}}",
    "path": "Clips",
    "noteContentFormat": "# {{title}}\n\n{{content}}",
    "properties": [
      {"name": "title", "value": "{{title}}"},
      {"name": "source", "value": "{{url}}"},
      {"name": "created", "value": "{{date:YYYY-MM-DD}}"}
    ]
  }
}
```

**Response:**
```json
{
  "success": true,
  "markdown": "---\ntitle: \"Article Title\"\nsource: \"https://example.com/article\"\ncreated: \"2026-02-12\"\n---\n\n# Article Title\n\nArticle content here...",
  "metadata": {
    "title": "Article Title",
    "domain": "example.com",
    "wordCount": 450
  }
}
```

### Template Variables

Supports all Obsidian Clipper variables:

```
{{title}}              - Page title
{{url}}                - Full URL  
{{domain}}             - Domain name
{{author}}             - Article author
{{published}}          - Published date
{{description}}        - Meta description
{{content}}            - Markdown content (extracted by Defuddle)
{{date}}               - Current date (ISO)
{{date:YYYY-MM-DD}}    - Formatted date
{{image}}              - Featured image URL
{{favicon}}            - Favicon URL
{{wordCount}}          - Word count
{{schema:*}}           - Schema.org data
```

### Filters

Supports common filters:

```
{{title|uppercase}}                    - HELLO WORLD
{{date:YYYY-MM-DD}}                    - 2026-02-12
{{author|split:", "|wikilink|join}}   - [[Author 1]], [[Author 2]]
{{content|strip_html|truncate:500}}   - Plain text, max 500 chars
{{title|kebab}}                        - hello-world
{{tags|capitalize}}                    - Clippings, Article
```

### Development

```bash
# Run development server
pnpm dev

# Lint and format
pnpm lint          # Check for issues
pnpm lint:fix      # Auto-fix issues
pnpm format        # Format code

# Type checking
cd src
tsc --noEmit
```

### Deployment Options

#### Option 1: Node.js with tsx (Recommended)

```bash
pnpm start
```

#### Option 2: Direct tsx execution

```bash
cd src
tsx index.ts
```

#### Option 2: Docker

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN corepack enable pnpm
RUN pnpm install --frozen-lockfile
WORKDIR /app/src
CMD ["tsx", "index.ts"]
```

#### Option 3: Cloudflare Workers

(Requires adapter - see docs/specification.md)

### Environment Variables

```bash
PORT=3000  # Server port (default: 3000)
```

### Next Steps (Phase 2+)

- [ ] Full filter support (import all from Clipper)
- [ ] Conditional logic (`{{#if}}...{{/if}}`)
- [ ] Loop support (`{{#for}}...{{/for}}`)
- [ ] Schema.org extraction
- [ ] Rate limiting
- [ ] Input validation (Zod)
- [ ] OpenAPI spec
- [ ] Production logging

### License

MIT

### Acknowledgments

- Built on [Obsidian Clipper](https://github.com/obsidianmd/obsidian-clipper)
- Uses [Defuddle](https://github.com/kepano/defuddle) for content extraction
- Powered by [Hono](https://hono.dev) web framework
