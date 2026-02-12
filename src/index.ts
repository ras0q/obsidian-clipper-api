import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import convert from "./routes/convert.ts";
import health from "./routes/health.ts";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.route("/health", health);
app.route("/convert", convert);

app.get("/", (c) => {
	return c.json({
		name: "Obsidian Clipper API",
		version: "0.1.0",
		endpoints: {
			health: "GET /health",
			convert: "POST /convert",
		},
	});
});

const port = parseInt(process.env.PORT || "3000", 10);

if (import.meta.url === `file://${process.argv[1]}`) {
	console.log(`Starting Obsidian Clipper API on port ${port}...`);
	serve({
		fetch: app.fetch,
		port,
	});
}

export default app;
