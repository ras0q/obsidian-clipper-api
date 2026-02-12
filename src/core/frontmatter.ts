import type { Property } from "../../vendor/obsidian-clipper/src/types/types";
import { escapeDoubleQuotes } from "../../vendor/obsidian-clipper/src/utils/string-utils";

export async function generateFrontmatter(
	properties: Property[],
	propertyTypes?: Map<string, string>,
): Promise<string> {
	if (properties.length === 0) {
		return "";
	}

	let frontmatter = "---\n";

	for (const property of properties) {
		const needsQuotes =
			/[:\s{}[\],&*#?|<>=!%@-]/.test(property.name) ||
			/^[\d]/.test(property.name) ||
			/^(true|false|null|yes|no|on|off)$/i.test(property.name.trim());

		const propertyKey = needsQuotes
			? property.name.includes('"')
				? `'${property.name.replace(/'/g, "''")}'`
				: `"${property.name}"`
			: property.name;

		frontmatter += `${propertyKey}:`;

		const propertyType =
			property.type || propertyTypes?.get(property.name) || "text";

		switch (propertyType) {
			case "multitext": {
				let items: string[];
				if (
					property.value.trim().startsWith('["') &&
					property.value.trim().endsWith('"]')
				) {
					try {
						items = JSON.parse(property.value);
					} catch (_e) {
						items = property.value.split(",").map((item) => item.trim());
					}
				} else {
					items = property.value
						.split(/,(?![^[]*\]\])/)
						.map((item) => item.trim());
				}
				items = items.filter((item) => item !== "");
				if (items.length > 0) {
					frontmatter += "\n";
					items.forEach((item) => {
						frontmatter += `  - "${escapeDoubleQuotes(item)}"\n`;
					});
				} else {
					frontmatter += "\n";
				}
				break;
			}

			case "number": {
				const numericValue = property.value.replace(/[^\d.-]/g, "");
				frontmatter += numericValue ? ` ${parseFloat(numericValue)}\n` : "\n";
				break;
			}

			case "checkbox": {
				const isChecked =
					typeof property.value === "boolean"
						? property.value
						: property.value === "true";
				frontmatter += ` ${isChecked}\n`;
				break;
			}

			case "date":
			case "datetime":
				if (property.value.trim() !== "") {
					frontmatter += ` ${property.value}\n`;
				} else {
					frontmatter += "\n";
				}
				break;

			default: // Text
				frontmatter +=
					property.value.trim() !== ""
						? ` "${escapeDoubleQuotes(property.value)}"\n`
						: "\n";
		}
	}

	frontmatter += "---\n";

	if (frontmatter.trim() === "---\n---") {
		return "";
	}

	return frontmatter;
}
