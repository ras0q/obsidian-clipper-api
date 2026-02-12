# Documentation Restructuring

## Context

User requested to reorganize documentation following Single Source of Truth (SSoT) principle, as there was too much duplication across README.md, docs/specification.md, and CONTRIBUTING.md.

## Problems Identified

1. **Massive duplication**: API usage examples, template syntax, deployment instructions repeated across multiple files
2. **No clear separation**: User-facing vs developer-facing information mixed together
3. **Specification had too much**: Implementation plans, success metrics, historical notes, hardcoded versions
4. **README too detailed**: Included deployment guides, full template reference, contribution guidelines
5. **Hardcoded values**: Node.js versions, package versions, schema definitions duplicated from code

## Solution Applied

### SSoT Principles

1. **No duplication of code/config**: Link to source files instead of copying
   - Versions → link to package.json
   - Types → link to src/types/
   - Obsidian Clipper specs → link to vendor/obsidian-clipper/
   - Config → link to tsconfig.json, biome.json, etc.

2. **Separation by audience**:
   - Users → README.md
   - Technical reference → docs/specification.md
   - Developers → CONTRIBUTING.md
   - Specific topics → dedicated docs/

3. **Minimal README**: Just enough to get started, links to detailed docs

4. **Current state only**: Removed implementation history, success metrics, future plans

### New Structure

**README.md** (114 lines)
- Quick Start only
- One API usage example
- Links to other docs

**docs/specification.md** (174 lines)
- Links to package.json for versions
- Links to src/ for implementations
- Links to vendor/obsidian-clipper/ for Clipper specs
- Technical reference only, no examples

**CONTRIBUTING.md** (235 lines)
- Links to config files (biome.json, tsconfig.json)
- Links to src/ for code examples
- Links to test/fixtures/ for templates
- Developer workflow only

**docs/deployment.md** (89 lines)
- Links to package.json for Node.js version
- Links to src/index.ts for env vars
- Deployment options only

**docs/ios-integration.md** (102 lines)
- Links to specification.md for template syntax
- Links to test/fixtures/ for examples
- iOS-specific guide only

## Key Changes

### Removed Hardcoded Values

**Before:**
```markdown
### Prerequisites
- Node.js >= 24.0.0
- pnpm >= 10.29.3
```

**After:**
```markdown
### Prerequisites
See [package.json](package.json) `engines` field for required versions.
```

### Removed Schema Duplication

**Before:** Full TypeScript interfaces copied in docs

**After:**
```markdown
See [src/types/api.ts](../src/types/api.ts) for complete type definitions.
```

### Removed Template Examples

**Before:** JSON examples in multiple places

**After:**
```markdown
For example templates, see [test/fixtures/](../test/fixtures/).
```

### Removed Obsidian Clipper Specs

**Before:** Listing all filters, variables, etc.

**After:**
```markdown
See [Obsidian Clipper filters](../vendor/obsidian-clipper/src/utils/filters.ts) for complete list.
```

## Benefits

1. **Single source of truth**: Update code/config once, docs stay current
2. **Less maintenance**: No need to sync versions, types, schemas
3. **Smaller docs**: 714 lines (was ~1700+)
4. **Clear navigation**: Users know where to look
5. **Force code reading**: Developers learn actual implementation

## Files Changed

- README.md (114 lines)
- docs/specification.md (174 lines, dramatically simplified)
- CONTRIBUTING.md (235 lines)
- docs/deployment.md (89 lines)
- docs/ios-integration.md (102 lines)

Total: 714 lines (was ~1700+ with massive duplication)

## Next Steps

When updating documentation:

1. **Ask**: "Does this exist in code/config?"
   - YES → Link to source file
   - NO → Write in docs

2. **Ask**: "Is this user-facing or developer-facing?"
   - User → README.md or docs/
   - Developer → CONTRIBUTING.md

3. **Ask**: "Does this already exist in another doc?"
   - YES → Link to that doc
   - NO → Write once

4. **Prefer**: File links over copy-paste

## Examples of SSoT

✅ **Good:**
```markdown
See [package.json](package.json) for exact versions.
```

❌ **Bad:**
```markdown
- @hono/node-server: ^1.19.9
- hono: ^4.11.9
- jsdom: ^28.0.0
```

✅ **Good:**
```markdown
See [vendor/obsidian-clipper/src/types/types.ts](../vendor/obsidian-clipper/src/types/types.ts) for `Template` interface.
```

❌ **Bad:**
```markdown
interface Template {
  id: string;
  name: string;
  ...
}
```
