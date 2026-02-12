import { builtinModules } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const __dirname = dirname(fileURLToPath(import.meta.url));
const isWatch = process.argv.includes("--watch");

const config: esbuild.BuildOptions = {
	entryPoints: [
		resolve(__dirname, "../src/index.ts"),
		resolve(__dirname, "../src/index.node.ts"),
	],
	outdir: resolve(__dirname, "../dist/"),
	bundle: true,
	platform: "node",
	format: "esm",
	sourcemap: isWatch ? "inline" : false,
	minify: !isWatch,
	external: [
		...builtinModules,
		...builtinModules.map((m) => `node:${m}`),
		"jsdom",
		"defuddle",
	],

	// NOTE: polyfills for obsidian-clipper dependencies
	alias: {
		"webextension-polyfill": resolve(
			__dirname,
			"../vendor/obsidian-clipper/src/utils/__mocks__/webextension-polyfill.ts",
		),
	},
	define: {
		DEBUG_MODE: "false",
	},
};

if (isWatch) {
	const context = await esbuild.context(config);
	await context.watch();
	console.log("Watching for changes...");
} else {
	await esbuild.build(config);
	console.log("Build complete");
}
