import { serve } from "@hono/node-server";
import app from "./index.ts";

const port = parseInt(process.env.PORT || "3000", 10);

if (import.meta.url === `file://${process.argv[1]}`) {
	console.log(`Starting Obsidian Clipper API on port ${port}...`);
	serve({
		fetch: app.fetch,
		port,
	});
}
