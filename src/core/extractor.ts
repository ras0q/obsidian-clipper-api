import Defuddle from "defuddle";
import { JSDOM } from "jsdom";
// FIXME: why `import { createMarkdownContent }` doesn't work?
import * as converter from "../../vendor/obsidian-clipper/src/utils/markdown-converter.ts";
import type { ExtractedPageData } from "../types/api";

const initDom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
const { window } = initDom;
Object.getOwnPropertyNames(window)
	.filter((prop) => !prop.startsWith("_") && !(prop in global))
	.forEach((prop) => {
		// @ts-expect-error: Dynamic global assignment for DOM APIs
		global[prop] = window[prop];
	});

export async function fetchAndExtractPage(
	url: string,
): Promise<ExtractedPageData> {
	const response = await fetch(url, {
		headers: {
			"User-Agent": "Mozilla/5.0 (compatible; ObsidianClipperAPI/0.1.0)",
		},
	});

	if (!response.ok) {
		throw new Error(
			`Failed to fetch URL: ${response.status} ${response.statusText}`,
		);
	}

	const html = await response.text();
	const dom = new JSDOM(html, { url });
	const document = dom.window.document;

	const defuddled = new Defuddle(document, { url }).parse();

	const domain = new URL(url).hostname.replace(/^www\./, "");
	// const content = turndownService.turndown(defuddled.content);
	const content = converter.createMarkdownContent(defuddled.content, url);

	return {
		title: defuddled.title,
		author: defuddled.author,
		description: defuddled.description,
		published: defuddled.published,
		domain,
		url,
		content,
		html: defuddled.content,
		favicon: defuddled.favicon,
		image: defuddled.image,
		wordCount: defuddled.wordCount,
		schemaOrgData: defuddled.schemaOrgData,
	};
}
