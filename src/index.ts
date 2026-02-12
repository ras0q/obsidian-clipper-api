import { readFile } from "node:fs/promises";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import convert from "./routes/convert.ts";

const packageJSON: {
	name: string;
	version: string;
	description: string;
} = await readFile(new URL("../package.json", import.meta.url), "utf-8").then(
	(data) => JSON.parse(data),
);

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.route("/convert", convert);

app.get("/", (c) => {
	return c.json({
		name: packageJSON.name,
		version: packageJSON.version,
		description: packageJSON.description,
		endpoints: {
			convert: "POST /convert",
		},
	});
});

export default app;
