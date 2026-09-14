/**
 * Bundles the test suite with the Obsidian API stubbed out, then hands the
 * result to Node's test runner.
 */
import esbuild from "esbuild";
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(here, ".build");
const outFile = path.join(outDir, "logic.test.cjs");
mkdirSync(outDir, { recursive: true });

await esbuild.build({
	entryPoints: [path.join(here, "logic.test.ts")],
	bundle: true,
	platform: "node",
	format: "cjs",
	target: "node18",
	outfile: outFile,
	external: ["node:test", "node:assert/strict"],
	alias: { obsidian: path.join(here, "obsidian-stub.ts") },
	logLevel: "warning",
});

const result = spawnSync(process.execPath, ["--test", outFile], { stdio: "inherit" });
process.exit(result.status ?? 1);
