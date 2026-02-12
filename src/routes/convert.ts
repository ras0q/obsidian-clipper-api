import { Hono } from "hono";
import { convertToMarkdown } from "../core/converter.ts";
import { fetchAndExtractPage } from "../core/extractor.ts";
import type {
	ConvertRequest,
	ConvertResponse,
	ErrorResponse,
} from "../types/api.ts";

const convert = new Hono();

convert.post("/", async (c) => {
	try {
		const body = await c.req.json<ConvertRequest>();

		if (!body.url) {
			return c.json<ErrorResponse>(
				{
					success: false,
					error: "URL is required",
					code: "INVALID_URL",
				},
				400,
			);
		}

		if (!body.template) {
			return c.json<ErrorResponse>(
				{
					success: false,
					error: "Template is required",
					code: "TEMPLATE_ERROR",
				},
				400,
			);
		}

		let url: URL;
		try {
			url = new URL(body.url);
			if (!["http:", "https:"].includes(url.protocol)) {
				throw new Error("Invalid protocol");
			}
		} catch {
			return c.json<ErrorResponse>(
				{
					success: false,
					error: "Invalid URL format. Must be http:// or https://",
					code: "INVALID_URL",
				},
				400,
			);
		}

		const pageData = await fetchAndExtractPage(body.url);
		const markdown = await convertToMarkdown(pageData, body.template);

		return c.json<ConvertResponse>({
			success: true,
			markdown,
			metadata: {
				title: pageData.title,
				author: pageData.author,
				publishedDate: pageData.published,
				domain: pageData.domain,
				wordCount: pageData.wordCount,
			},
		});
	} catch (error) {
		console.error("Error converting URL:", error);

		if (error instanceof Error) {
			if (error.message.includes("fetch")) {
				return c.json<ErrorResponse>(
					{
						success: false,
						error: `Failed to fetch URL: ${error.message}`,
						code: "FETCH_ERROR",
					},
					502,
				);
			}

			if (
				error.message.includes("template") ||
				error.message.includes("render")
			) {
				return c.json<ErrorResponse>(
					{
						success: false,
						error: `Template error: ${error.message}`,
						code: "TEMPLATE_ERROR",
					},
					400,
				);
			}
		}

		return c.json<ErrorResponse>(
			{
				success: false,
				error:
					error instanceof Error ? error.message : "Unknown error occurred",
				code: "EXTRACTION_ERROR",
			},
			500,
		);
	}
});

export default convert;
