import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import convert from "./routes/convert.ts";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.route("/convert", convert);

app.get("/", (c) => {
	return c.json({
		name: "Obsidian Clipper API",
		endpoints: {
			convert: "POST /convert",
		},
	});
});

export default app;
