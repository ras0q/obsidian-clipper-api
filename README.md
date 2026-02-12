# Obsidian Clipper API

HTTP API for converting web pages to Markdown using Obsidian Clipper's template system.

## Why This Project?

iOS in-app browsers don't support browser extensions. This API provides a stateless HTTP endpoint that accepts a URL and an Obsidian Clipper template, then returns formatted Markdown.

## Features

- Obsidian Clipper compatible (same template format and variables)
- Full template support (variables, filters, conditionals, loops)
- YAML frontmatter generation
- Stateless (no database, no authentication)
- Lightweight (Hono framework)

## Quick Start

```bash
pnpm install
pnpm dev
```

API available at `http://localhost:3000`.

## API Usage

### GET `/`

Returns API information.

```bash
curl http://localhost:3000/
```

### POST `/convert`

Converts a web page to Markdown.

```bash
curl -X POST http://localhost:3000/convert \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "template": {
      "id": "default",
      "name": "Default",
      "behavior": "create",
      "noteNameFormat": "{{title}}",
      "path": "",
      "noteContentFormat": "# {{title}}\\n\\n{{content}}",
      "properties": [
        {"name": "title", "value": "{{title}}"},
        {"name": "url", "value": "{{url}}"},
        {"name": "created", "value": "{{date:YYYY-MM-DD}}", "type": "date"}
      ]
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "markdown": "---\ntitle: \"Example Domain\"...\n---\n\n# Example Domain\n...",
  "metadata": {
    "title": "Example Domain",
    "domain": "example.com",
    "wordCount": 26
  }
}
```

Test with fixture:
```bash
curl -X POST http://localhost:3000/convert \
  -H "Content-Type: application/json" \
  -d @test/fixtures/basic-template.json
```

## Documentation

- **[docs/specification.md](docs/specification.md)** - Full API specification and template system reference
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Development guide for contributors

## Deployment

```bash
pnpm build
PORT=3000 pnpm start
```

See [docs/deployment.md](docs/deployment.md) for Docker and cloud deployment options.

## iOS Integration

Use iOS Shortcuts to clip from Safari/in-app browsers:

1. Share URL → Shortcut
2. Shortcut calls API with template
3. API returns Markdown
4. Shortcut creates Obsidian note via `obsidian://new?...`

See [docs/ios-integration.md](docs/ios-integration.md) for details.

## License

MIT

## Acknowledgments

- [Obsidian Clipper](https://github.com/obsidianmd/obsidian-clipper)
- [Defuddle](https://github.com/kepano/defuddle)
- [Hono](https://hono.dev)
