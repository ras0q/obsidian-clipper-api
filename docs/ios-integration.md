# iOS Integration Guide

## Overview

Use iOS Shortcuts to clip web pages from Safari or in-app browsers that don't support extensions.

## Setup

### 1. Self-hosted API

Run the API locally or on your server:

```bash
# Local (accessible via Wi-Fi)
pnpm dev

# Server (Docker)
docker run -p 3000:3000 obsidian-clipper-api
```

### 2. Create iOS Shortcut

**Shortcut flow:**

1. Receive URL from Share Sheet
2. Load template JSON from iCloud Drive or embedded in shortcut
3. Make HTTP POST request to API
4. Parse Markdown response
5. Create Obsidian note via `obsidian://new?...` URI

### 3. Template Storage

**Option A: Embedded in Shortcut**

Store template JSON as text variable in shortcut.

**Option B: iCloud Drive**

Store template files in `iCloud Drive/Shortcuts/Templates/`:
- `default.json`
- `article.json`
- `bookmark.json`

Load with "Get File" action.

## Example Shortcut

### Basic Clip

1. Receive URL from Share Sheet
2. Set variable `url`
3. Get template file from iCloud Drive
4. POST to API `/convert` endpoint
5. Extract `markdown` from response
6. Open Obsidian URI: `obsidian://new?vault=MyVault&file=...&content=...`

### Template Selection

1. Receive URL from Share Sheet
2. Choose from Menu (Article / Bookmark / Default)
3. Load corresponding template
4. Continue with steps 4-6 above

## Template Examples

For template syntax reference, see [docs/specification.md](specification.md).

For example templates, see [test/fixtures/](../test/fixtures/).

## Troubleshooting

### API not accessible from iPhone

- Ensure iPhone and server are on same Wi-Fi network
- Use server's local IP (e.g., `http://192.168.1.100:3000`)
- Check firewall settings

### Obsidian URI not working

- Ensure Obsidian app is installed
- Check vault name matches exactly
- URL encode special characters in content

### Template parsing errors

- Validate JSON syntax (use JSONLint)
- Escape special characters in template strings
- Test template with curl first

## Security Notes

- API is stateless and has no authentication
- For public deployment, add API gateway with authentication
- For private use, run on local network or VPN

## Alternative: Local-only Processing

For maximum privacy, run API on your iPhone using:
- [a-Shell](https://holzschu.github.io/a-Shell_iOS/) (Node.js on iOS)
- [iSH](https://ish.app/) (Linux shell on iOS)

Requires technical setup but keeps all data on device.
