import dayjs from "dayjs";
import type { ExtractedPageData } from "../types/api";

export interface VariableContext {
	[key: string]: string | number | undefined;
}

export function buildVariableContext(
	pageData: ExtractedPageData,
): VariableContext {
	const now = dayjs();

	return {
		// Page metadata
		title: pageData.title,
		url: pageData.url,
		domain: pageData.domain,
		author: pageData.author,
		published: pageData.published,
		description: pageData.description,
		image: pageData.image,
		favicon: pageData.favicon,

		// Content
		content: pageData.content,

		// Dates
		date: now.toISOString(),
		time: now.format("HH:mm:ss"),

		// Word count
		wordCount: pageData.wordCount,

		// Schema.org data (flattened)
		...(pageData.schemaOrgData && flattenSchemaOrg(pageData.schemaOrgData)),
	};
}

function flattenSchemaOrg(
	data: Record<string, unknown>,
): Record<string, string> {
	const result: Record<string, string> = {};

	for (const [key, value] of Object.entries(data)) {
		if (key.startsWith("@")) continue;

		if (typeof value === "string") {
			result[`schema:${key}`] = value;
		} else if (typeof value === "number") {
			result[`schema:${key}`] = String(value);
		} else if (value && typeof value === "object" && "name" in value) {
			result[`schema:${key}`] = String((value as { name: unknown }).name);
		}
	}

	return result;
}
