import type { Property, Template } from "obsidian-clipper/types/types";
import { renderTemplate as clipperRenderTemplate } from "obsidian-clipper/utils/renderer";
import type { ExtractedPageData } from "../types/api.ts";
import { generateFrontmatter } from "./frontmatter.ts";
import { buildVariableContext } from "./variables.ts";

export async function convertToMarkdown(
	pageData: ExtractedPageData,
	template: Template,
): Promise<string> {
	const variables = buildVariableContext(pageData);

	const renderedProperties: Property[] = [];
	for (const property of template.properties) {
		const renderedValue = await clipperRenderTemplate(
			property.value,
			variables,
			pageData.url,
		);
		renderedProperties.push({
			...property,
			value: renderedValue,
		});
	}

	const frontmatter = await generateFrontmatter(renderedProperties);

	const content = template.noteContentFormat
		? await clipperRenderTemplate(
				template.noteContentFormat,
				variables,
				pageData.url,
			)
		: "";

	if (frontmatter) {
		return `${frontmatter}\n${content}`;
	}

	return content;
}
