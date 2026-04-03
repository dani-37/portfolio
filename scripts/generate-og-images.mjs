/**
 * Generates OG images (1200×630) for each project route.
 * Uses the site's own fonts, colour palette, and project icons.
 * Output: public/og/{slug}.png
 */

import { createCanvas, GlobalFonts } from "@napi-rs/canvas";
import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const FONTS = resolve(ROOT, "public/fonts");
const OUT = resolve(ROOT, "public/og");

// Register fonts
GlobalFonts.registerFromPath(resolve(FONTS, "lora.woff2"), "Lora");
GlobalFonts.registerFromPath(
  resolve(FONTS, "space-grotesk.woff2"),
  "Space Grotesk",
);
GlobalFonts.registerFromPath(
  resolve(FONTS, "space-mono-400.woff2"),
  "Space Mono",
);

// Palette (light mode)
const BG = "#d0d9ce";
const CARD = "#f7f6f1";
const INK = "#2c2c28";
const GREEN = "#3d6b4e";
const GRAY = "#6b6b63";

// Icon SVG paths per slug (from ProjectIcons.tsx, viewBox 0 0 24 24)
const ICONS = {
  odi: (ctx) => {
    ctx.moveTo(4, 4);
    ctx.lineTo(20, 4);
    ctx.lineTo(20, 16);
    ctx.lineTo(8, 16);
    ctx.lineTo(4, 20);
    ctx.lineTo(4, 4);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    line(ctx, 9, 13, 9, 10);
    line(ctx, 12, 13, 12, 8);
    line(ctx, 15, 13, 15, 11);
  },
  footprints: (ctx) => {
    drawCurve(ctx, "M3 8c3-2 6 2 9 0s6-2 9 0");
    drawCurve(ctx, "M3 13c3-2 6 2 9 0s6-2 9 0");
    drawCurve(ctx, "M3 18c3-2 6 2 9 0s6-2 9 0");
  },
  biases: (ctx) => {
    line(ctx, 5, 9, 19, 9);
    line(ctx, 5, 15, 19, 15);
    line(ctx, 18, 4, 6, 20);
  },
  uncertainty: (ctx) => {
    drawBezier(ctx, 3, 17, 7, 15, 13, 9, 21, 7);
    ctx.stroke();
    ctx.setLineDash([2.5, 2.5]);
    ctx.beginPath();
    drawBezier(ctx, 3, 13, 7, 11, 13, 5, 21, 3);
    ctx.stroke();
    ctx.beginPath();
    drawBezier(ctx, 3, 21, 7, 19, 13, 13, 21, 11);
  },
  movies: (ctx) => {
    ctx.beginPath();
    ctx.arc(6, 6, 2.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(18, 8, 2.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(10, 19, 2.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    line(ctx, 8, 7.5, 16, 7);
    line(ctx, 7, 8.5, 9, 17);
    line(ctx, 12.5, 18, 16, 10);
  },
};

function line(ctx, x1, y1, x2, y2) {
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
}

function drawBezier(ctx, x1, y1, cx1, cy1, cx2, cy2, x2, y2) {
  ctx.moveTo(x1, y1);
  ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x2, y2);
}

// Approximate SVG cubic shorthand curves for the contour lines
function drawCurve(ctx, d) {
  // Parse the wavy contour paths: M3 Yc3-2 6 2 9 0s6-2 9 0
  const match = d.match(/M(\d+)\s+(\d+)/);
  if (!match) return;
  const startX = +match[1];
  const startY = +match[2];
  ctx.moveTo(startX, startY);
  // First curve: c3,-2 6,2 9,0
  ctx.bezierCurveTo(
    startX + 3,
    startY - 2,
    startX + 6,
    startY + 2,
    startX + 9,
    startY,
  );
  // Smooth curve: s6,-2 9,0 (reflects previous control point)
  const prevCx = startX + 6;
  const prevCy = startY + 2;
  const reflectCx = 2 * (startX + 9) - prevCx;
  const reflectCy = 2 * startY - prevCy;
  ctx.bezierCurveTo(
    reflectCx,
    reflectCy,
    startX + 9 + 6,
    startY - 2,
    startX + 9 + 9,
    startY,
  );
}

// Parse projects from registry
const src = readFileSync(resolve(ROOT, "src/projects/index.ts"), "utf-8");
const re =
  /\{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*tag:\s*"([^"]+)",\s*description:\s*"([^"]+)"/g;
const projects = [];
let m;
while ((m = re.exec(src))) {
  projects.push({ slug: m[1], name: m[2], tag: m[3], description: m[4] });
}
const reMl =
  /\{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*tag:\s*"([^"]+)",\s*description:\s*\n\s*"([^"]+)"/g;
while ((m = reMl.exec(src))) {
  if (!projects.find((p) => p.slug === m[1])) {
    projects.push({ slug: m[1], name: m[2], tag: m[3], description: m[4] });
  }
}

if (projects.length === 0) {
  console.error("generate-og: no projects found");
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });

const W = 1200;
const H = 630;

function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let l = "";
  for (const word of words) {
    const test = l ? `${l} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && l) {
      lines.push(l);
      l = word;
    } else {
      l = test;
    }
  }
  if (l) lines.push(l);
  return lines;
}

for (const { slug, name, tag, description } of projects) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  // Card
  const cardX = 60;
  const cardY = 50;
  const cardW = W - 120;
  const cardH = H - 100;
  ctx.fillStyle = CARD;
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.strokeStyle = GREEN;
  ctx.lineWidth = 2;
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  // Draw icon (scaled from 24x24 viewBox to ~120px, positioned right side)
  const iconDraw = ICONS[slug];
  if (iconDraw) {
    const iconScale = 5.5;
    const iconX = cardX + cardW - 60 - 24 * iconScale;
    const iconY = cardY + cardH / 2 - (24 * iconScale) / 2;

    ctx.save();
    ctx.translate(iconX, iconY);
    ctx.scale(iconScale, iconScale);
    ctx.strokeStyle = GREEN;
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = "none";
    ctx.globalAlpha = 0.25;
    ctx.setLineDash([]);
    ctx.beginPath();
    iconDraw(ctx);
    ctx.stroke();
    ctx.restore();
  }

  const px = cardX + 60;
  let py = cardY + 80;

  // Tag
  ctx.font = '500 16px "Space Mono"';
  ctx.fillStyle = GREEN;
  ctx.letterSpacing = "2px";
  ctx.fillText(tag.toUpperCase(), px, py);
  ctx.letterSpacing = "0px";

  // Name
  py += 50;
  ctx.font = 'bold 64px "Lora"';
  ctx.fillStyle = INK;
  ctx.fillText(name, px, py);

  // Green dot after name
  const nameWidth = ctx.measureText(name).width;
  ctx.fillStyle = GREEN;
  ctx.fillText(".", px + nameWidth + 2, py);

  // Description
  py += 50;
  ctx.font = '300 24px "Space Grotesk"';
  ctx.fillStyle = GRAY;
  const maxDescWidth = iconDraw ? cardW - 160 - 24 * 5.5 - 20 : cardW - 160;
  const lines = wrapText(ctx, description, maxDescWidth);
  for (const ln of lines) {
    ctx.fillText(ln, px, py);
    py += 36;
  }

  // Author line at bottom
  const bottomY = cardY + cardH - 40;
  ctx.font = '300 18px "Space Grotesk"';
  ctx.fillStyle = GRAY;
  ctx.fillText("Daniel Vegara", px, bottomY);

  // Site URL on the right
  ctx.font = '400 16px "Space Mono"';
  ctx.fillStyle = GREEN;
  const url = "daniel.vegarabalsa.com";
  const urlWidth = ctx.measureText(url).width;
  ctx.fillText(url, cardX + cardW - 60 - urlWidth, bottomY);

  const buf = canvas.toBuffer("image/png");
  writeFileSync(resolve(OUT, `${slug}.png`), buf);
  console.log(`  ✓ og/${slug}.png`);
}

console.log(`generate-og: created ${projects.length} OG image(s)`);
