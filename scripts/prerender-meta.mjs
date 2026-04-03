/**
 * Post-build script: generates static HTML per project route with correct
 * <head> meta tags so social-media crawlers (LinkedIn, Twitter, Facebook)
 * see project-specific previews instead of the generic homepage OG tags.
 *
 * Also injects:
 * - JSON-LD structured data (Person schema on homepage, CreativeWork on projects)
 * - <noscript> fallback content for LLM crawlers and no-JS clients
 * - Generates sitemap.xml from the project registry
 *
 * Reads project metadata from src/projects/index.ts and experience metadata
 * from src/experiences/index.ts.
 */

import { readFileSync, mkdirSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const BASE_URL = "https://daniel.vegarabalsa.com";
const TODAY = new Date().toISOString().slice(0, 10);

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

// ── Parse experience metadata from source ───────────────────────────

const expSrc = readFileSync(
  resolve(ROOT, "src/experiences/index.ts"),
  "utf-8",
);

const expRe =
  /\{\s*name:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*description:\s*"([^"]+)",\s*years:\s*"([^"]+)"/g;

const experiences = [];
while ((m = expRe.exec(expSrc))) {
  experiences.push({ name: m[1], title: m[2], description: m[3], years: m[4] });
}

// ── Parse stack arrays for projects ─────────────────────────────────

const stackRe =
  /slug:\s*"([^"]+)"[\s\S]*?stack:\s*\[([^\]]+)\]/g;

const stacks = {};
while ((m = stackRe.exec(registrySrc))) {
  stacks[m[1]] = m[2].match(/"([^"]+)"/g).map((s) => s.replace(/"/g, ""));
}

// ── JSON-LD: Person schema ──────────────────────────────────────────

const personJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Daniel Vegara",
  jobTitle: "Data Scientist",
  worksFor: { "@type": "Organization", name: "OECD" },
  url: BASE_URL,
  email: "dani@vegarabalsa.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Paris",
    addressCountry: "FR",
  },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Imperial College London" },
    { "@type": "CollegeOrUniversity", name: "UCL" },
  ],
  sameAs: [
    "https://linkedin.com/in/dvegarabalsa",
    "https://github.com/dani-37",
  ],
  knowsAbout: [
    "Python", "TypeScript", "SQL", "Docker", "AWS", "PostgreSQL",
    "GIS", "PyTorch", "Machine Learning", "Data Science",
    "Statistics", "Data Visualisation",
  ],
});

const personJsonLdTag = `<script type="application/ld+json">${personJsonLd}</script>`;

// ── <noscript>: homepage fallback ───────────────────────────────────

const noscriptHome = `<noscript>
<div>
<h1>Daniel Vegara</h1>
<p>Data Scientist at the OECD, Paris. I build data tools for teams working on climate, nature, and policy.</p>
<p>Education: MSci Mathematics &amp; Statistics, Imperial College London · MSc AI for Sustainability, UCL</p>
<h2>Experience</h2>
<ul>
${experiences.map((e) => `<li><strong>${e.name}</strong> — ${e.title} (${e.years}): ${e.description}</li>`).join("\n")}
</ul>
<h2>Projects</h2>
<ul>
${projects.map((p) => `<li><a href="/projects/${p.slug}">${p.name}</a> — ${p.description}</li>`).join("\n")}
</ul>
<p>Contact: <a href="mailto:dani@vegarabalsa.com">dani@vegarabalsa.com</a> · <a href="https://linkedin.com/in/dvegarabalsa">LinkedIn</a> · <a href="https://github.com/dani-37">GitHub</a></p>
</div>
</noscript>`;

// ── Read the built index.html template ──────────────────────────────

let template = readFileSync(resolve(DIST, "index.html"), "utf-8");

// Inject JSON-LD before </head>
template = template.replace("</head>", `${personJsonLdTag}\n</head>`);

// Inject <noscript> after <div id="root"></div>
template = template.replace(
  '<div id="root"></div>',
  `<div id="root"></div>\n${noscriptHome}`,
);

// Write back the updated homepage
writeFileSync(resolve(DIST, "index.html"), template);
console.log("  ✓ / (JSON-LD + noscript)");

// Also update 404.html if it exists
const fourOhFour = resolve(DIST, "404.html");
if (existsSync(fourOhFour)) {
  writeFileSync(fourOhFour, template);
  console.log("  ✓ /404.html (synced)");
}

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

  // Inject project-specific JSON-LD (CreativeWork)
  const stack = stacks[slug] || [];
  const projectJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description,
    url,
    author: { "@type": "Person", name: "Daniel Vegara" },
    keywords: stack.join(", "),
  });
  html = html.replace(
    personJsonLdTag,
    `${personJsonLdTag}\n<script type="application/ld+json">${projectJsonLd}</script>`,
  );

  // Replace <noscript> with project-specific content
  const noscriptProject = `<noscript>
<div>
<h1>${name}</h1>
<p>${description}</p>
${stack.length ? `<p>Stack: ${stack.join(", ")}</p>` : ""}
<p><a href="/">← Back to Daniel Vegara's portfolio</a></p>
</div>
</noscript>`;
  html = html.replace(noscriptHome, noscriptProject);

  const outDir = resolve(DIST, "projects", slug);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, "index.html"), html);
  console.log(`  ✓ /projects/${slug}/`);
}

// ── Generate sitemap.xml ────────────────────────────────────────────

const sitemapUrls = [
  { loc: `${BASE_URL}/`, priority: "1.0" },
  ...projects.map((p) => ({
    loc: `${BASE_URL}/projects/${p.slug}`,
    priority: "0.8",
  })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;

writeFileSync(resolve(DIST, "sitemap.xml"), sitemap);
console.log(`  ✓ sitemap.xml (${sitemapUrls.length} URLs)`);

console.log(
  `prerender-meta: generated ${projects.length} static route(s)`,
);
