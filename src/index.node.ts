import { parseArgs } from "node:util";
import { serve } from "@hono/node-server";
import app from "./index.ts";

const { values } = parseArgs({
	options: {
		port: {
			type: "string",
			description: "Server port",
		},
	},
});

const port = parseInt(values.port || "3000", 10);

if (import.meta.url === `file://${process.argv[1]}`) {
	console.log(`Starting Obsidian Clipper API on port ${port}...`);
	const server = serve({
		fetch: app.fetch,
		port,
	});

	const shutdown = (signal: string) => {
		console.log(`\nReceived ${signal}, shutting down gracefully...`);
		server.close(() => {
			console.log("Server closed");
			process.exit(0);
		});

		setTimeout(() => {
			console.error("Forced shutdown after timeout");
			process.exit(1);
		}, 10000);
	};

	process.on("SIGTERM", () => shutdown("SIGTERM"));
	process.on("SIGINT", () => shutdown("SIGINT"));
}
