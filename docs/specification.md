# Technical Specification

## Architecture

### Design Principles

- **Stateless**: No database, no sessions, no user accounts
- **Minimal scope**: URL + Template → Markdown
- **Clipper compatible**: Reuse official Clipper types and utilities via git submodule

### Tech Stack

See [package.json](../package.json) for exact versions.

- **Runtime**: Node.js (see `engines` in package.json)
- **Framework**: Hono
- **Dependencies**: jsdom, defuddle, dayjs
- **Submodule**: [obsidian-clipper](../vendor/obsidian-clipper) (types and utilities)

### Project Structure

See [src/](../src/) directory:

```
src/
├── core/           # Conversion logic
├── routes/         # API endpoints
├── types/          # Type definitions
└── index.ts        # App entry point
```

## API Specification

### GET `/`

Returns API metadata (see [src/index.ts](../src/index.ts)).

### POST `/convert`

Converts web page to Markdown using Clipper template.

**Request:**
```typescript
{
  url: string;        // HTTP/HTTPS URL
  template: Template; // Obsidian Clipper template
}
```

**Response:**
```typescript
// Success
{
  success: true;
  markdown: string;
  metadata: { title, author?, publishedDate?, domain, wordCount };
}

// Error
{
  success: false;
  error: string;
  code: 'INVALID_URL' | 'FETCH_ERROR' | 'TEMPLATE_ERROR' | 'EXTRACTION_ERROR';
}
```

See [src/types/api.ts](../src/types/api.ts) for complete type definitions.

## Template System

### Template Interface

Templates use the same interface as [Obsidian Clipper](https://github.com/obsidianmd/obsidian-clipper).

See [vendor/obsidian-clipper/src/types/types.ts](../vendor/obsidian-clipper/src/types/types.ts) for `Template` and `Property` interfaces.

Fields used by API:
- `noteContentFormat`: Main template for markdown output
- `properties`: Frontmatter properties

Fields not used (client responsibility):
- `noteNameFormat`, `path`, `vault`, `triggers`

### Variables

All variables from Obsidian Clipper are supported:

```yaml
# Page metadata
{{title}}, {{url}}, {{domain}}, {{author}}, {{published}}
{{description}}, {{image}}, {{favicon}}

# Content
{{content}}

# Dates
{{date}}, {{date:FORMAT}}, {{time}}

# Metadata
{{wordCount}}

# Schema.org
{{schema:propertyName}}
```

See [src/core/variables.ts](../src/core/variables.ts) for implementation.

### Filters

50+ filters from Obsidian Clipper:

```yaml
# String: uppercase, lowercase, capitalize, title
# Format: kebab, snake, camel, pascal
# Date: {{date:YYYY-MM-DD}}
# Content: strip_html, strip_md, truncate, trim
# Obsidian: wikilink, link, blockquote, callout
```

See [Obsidian Clipper filters](../vendor/obsidian-clipper/src/utils/filters.ts) for complete list.

### Advanced Features

**Conditionals:** `{{#if}}...{{else}}...{{/if}}`

**Loops:** `{{#for item in items}}...{{/for}}`

**Variable assignment:** `{{set var = value}}`

See [Obsidian Clipper renderer](../vendor/obsidian-clipper/src/utils/renderer.ts) for syntax.

### Property Types

- **text**, **multitext**, **number**, **checkbox**, **date**, **datetime**

See [src/core/frontmatter.ts](../src/core/frontmatter.ts) for implementation.

## Implementation Details

### Content Extraction Flow

1. Fetch HTML ([src/core/extractor.ts](../src/core/extractor.ts))
2. Parse with jsdom
3. Extract with Defuddle
4. Convert to markdown ([obsidian-clipper/utils/markdown-converter](../vendor/obsidian-clipper/src/utils/markdown-converter.ts))
5. Build variable context ([src/core/variables.ts](../src/core/variables.ts))
6. Render template ([obsidian-clipper/utils/renderer](../vendor/obsidian-clipper/src/utils/renderer.ts))
7. Generate frontmatter ([src/core/frontmatter.ts](../src/core/frontmatter.ts))
8. Combine ([src/core/converter.ts](../src/core/converter.ts))

### Clipper Integration

**Direct imports:**
```typescript
import type { Template, Property } from 'obsidian-clipper/types/types';
import { renderTemplate } from 'obsidian-clipper/utils/renderer';
import { escapeDoubleQuotes } from 'obsidian-clipper/utils/string-utils';
import { createMarkdownContent } from 'obsidian-clipper/utils/markdown-converter';
```

**Adapted for server:**
- [src/core/extractor.ts](../src/core/extractor.ts): Replaces browser DOM with jsdom
- [src/core/frontmatter.ts](../src/core/frontmatter.ts): Removes settings dependency
- [src/core/variables.ts](../src/core/variables.ts): Custom context builder

**Not used:** Browser extension specific code, UI, storage, LLM interpreter

## References

- [Obsidian Clipper Repository](https://github.com/obsidianmd/obsidian-clipper)
- [Obsidian Web Clipper Documentation](https://help.obsidian.md/web-clipper)
- [Obsidian URI Scheme](https://help.obsidian.md/Extending+Obsidian/Obsidian+URI)
- [Hono Framework](https://hono.dev)

