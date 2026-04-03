/**
 * Post-build script: generates static HTML per project route with correct
 * <head> meta tags so social-media crawlers (LinkedIn, Twitter, Facebook)
 * see project-specific previews instead of the generic homepage OG tags.
 *
 * Reads project metadata from src/projects/index.ts and stamps it into
 * copies of dist/index.html at dist/projects/{slug}/index.html.
 */

import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const BASE_URL = "https://daniel.vegarabalsa.com";

// ── Parse project metadata from source ──────────────────────────────

const registrySrc = readFileSync(
  resolve(ROOT, "src/projects/index.ts"),
  "utf-8",
);

// Match each object literal in the PROJECT_REGISTRY array
const entryRe =
  /\{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*tag:\s*"([^"]+)",\s*description:\s*"([^"]+)"/g;

const projects = [];
let m;
while ((m = entryRe.exec(registrySrc))) {
  projects.push({ slug: m[1], name: m[2], tag: m[3], description: m[4] });
}

// Also handle multi-line description (e.g. description:\n   "...")
const entryMlRe =
  /\{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*tag:\s*"([^"]+)",\s*description:\s*\n\s*"([^"]+)"/g;
while ((m = entryMlRe.exec(registrySrc))) {
  if (!projects.find((p) => p.slug === m[1])) {
    projects.push({ slug: m[1], name: m[2], tag: m[3], description: m[4] });
  }
}

if (projects.length === 0) {
  console.error("prerender-meta: no projects found in registry — aborting");
  process.exit(1);
}

// ── Read the built index.html template ──────────────────────────────

const template = readFileSync(resolve(DIST, "index.html"), "utf-8");

// ── Generate one HTML file per project route ────────────────────────

for (const { slug, name, tag, description } of projects) {
  const title = `${name} — ${tag} | Daniel Vegara`;
  const url = `${BASE_URL}/projects/${slug}`;

  let html = template;

  // Replace <title>
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${title}</title>`,
  );

  // Replace meta description
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${description}" />`,
  );

  // Replace canonical
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${url}" />`,
  );

  // Replace OG tags
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${title}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${description}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${url}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:type" content="article" />`,
  );

  // Replace OG image
  const ogImage = `${BASE_URL}/og/${slug}.png`;
  html = html.replace(
    /<meta\s+property="og:image"[\s\S]*?\/?\s*>/,
    `<meta property="og:image" content="${ogImage}" />`,
  );

  // Replace Twitter tags
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${title}" />`,
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${description}" />`,
  );
  html = html.replace(
    /<meta\s+name="twitter:image"[\s\S]*?\/?\s*>/,
    `<meta name="twitter:image" content="${ogImage}" />`,
  );

  const outDir = resolve(DIST, "projects", slug);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, "index.html"), html);
  console.log(`  ✓ /projects/${slug}/`);
}

console.log(
  `prerender-meta: generated ${projects.length} static route(s)`,
);
