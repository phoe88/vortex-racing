/**
 * Writes the Atlassian Design System token themes to a static stylesheet.
 *
 * `@atlaskit/tokens` ships its themes as JavaScript strings meant to be injected
 * at runtime. A static file is cached by the CDN and keeps every page
 * prerenderable, so we extract them once at build time instead.
 *
 * Run automatically by `pnpm dev` and `pnpm build`.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "src/app/atlassian-tokens.css");

// Light and dark colour themes plus the spacing, typography, shape and motion foundations.
const THEMES = [
  "atlassian-light",
  "atlassian-dark",
  "atlassian-spacing",
  "atlassian-typography",
  "atlassian-shape",
  "atlassian-motion",
];

const pkgDir = dirname(require.resolve("@atlaskit/tokens/package.json"));
const { version } = JSON.parse(readFileSync(resolve(pkgDir, "package.json"), "utf8"));

const css = THEMES.map((id) => {
  const mod = require(resolve(pkgDir, `dist/cjs/artifacts/themes/${id}.js`));
  return `/* ${id} */\n${String(mod.default ?? mod).trim()}`;
}).join("\n\n");

const banner = `/*
 * GENERATED FILE — do not edit. Source: @atlaskit/tokens@${version}
 * Regenerate with \`pnpm tokens\` (scripts/build-ads-tokens.mjs).
 */\n\n`;

mkdirSync(dirname(out), { recursive: true });
const next = banner + css + "\n";
let prev = "";
try { prev = readFileSync(out, "utf8"); } catch {}
if (prev !== next) writeFileSync(out, next);
console.log(`atlassian-tokens.css ${prev === next ? "up to date" : "written"} (@atlaskit/tokens@${version}, ${(next.length / 1024).toFixed(1)} kB)`);
