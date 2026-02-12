import { Hono } from "hono";

const health = new Hono();

health.get("/", (c) => {
	return c.json({
		status: "ok",
		version: "0.1.0",
		clipperVersion: "0.12.0",
	});
});

export default health;
