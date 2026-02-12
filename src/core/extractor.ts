import Defuddle from "defuddle";
import { Window } from "happy-dom";
// FIXME: why `import { createMarkdownContent }` doesn't work?
import * as converter from "obsidian-clipper/src/utils/markdown-converter.ts";
import type { ExtractedPageData } from "../types/api";

// NOTE: Mock localStorage for obsidian-clipper modules
const localStorageMock = (() => {
	let store: Record<string, string> = {};
	return {
		getItem: (key: string) => store[key] || null,
		setItem: (key: string, value: string) => {
			store[key] = value;
		},
		removeItem: (key: string) => {
			delete store[key];
		},
		clear: () => {
			store = {};
		},
		get length() {
			return Object.keys(store).length;
		},
		key: (index: number) => {
			const keys = Object.keys(store);
			return keys[index] || null;
		},
	};
})();
global.localStorage = localStorageMock;
global.sessionStorage = localStorageMock;

// NOTE: Mock DOM environment for obsidian-clipper modules
const mockWindow = new Window();
Object.getOwnPropertyNames(mockWindow)
	.filter((prop) => !prop.startsWith("_") && !(prop in global))
	.forEach((prop) => {
		// @ts-expect-error: Dynamic global assignment for DOM APIs
		global[prop] = mockWindow[prop];
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

	const document = mockWindow.document;
	document.write(html);
	document.location.href = url;

	const defuddled = new Defuddle(document, { url }).parse();

	const domain = new URL(url).hostname.replace(/^www\./, "");
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
