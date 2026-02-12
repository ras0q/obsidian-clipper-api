import type { Template } from "../../vendor/obsidian-clipper/src/types/types";

export interface ConvertRequest {
	url: string;
	template: Template;
}

export interface ConvertResponse {
	success: true;
	markdown: string;
	metadata: {
		title: string;
		author?: string;
		publishedDate?: string;
		domain: string;
		wordCount: number;
	};
}

export interface ErrorResponse {
	success: false;
	error: string;
	code: "INVALID_URL" | "FETCH_ERROR" | "TEMPLATE_ERROR" | "EXTRACTION_ERROR";
}

export interface HealthResponse {
	status: "ok";
	version: string;
	clipperVersion: string;
}

export interface ExtractedPageData {
	title: string;
	author?: string;
	description?: string;
	published?: string;
	domain: string;
	url: string;
	content: string;
	html: string;
	favicon?: string;
	image?: string;
	wordCount: number;
	schemaOrgData?: Record<string, unknown>;
}
