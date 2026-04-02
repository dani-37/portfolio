import { useState, useEffect, useCallback, useRef } from "react";

type Phase = "idle" | "tug" | "caught" | "missed";

/* ── grayscale palette + red/green accents only ── */
const C = {
  black: "#111111",
  darkest: "#222222",
  dark: "#3a3a3a",
  mid: "#666666",
  midLight: "#888888",
  light: "#aaaaaa",
  lighter: "#cccccc",
  lightest: "#e0e0e0",
  white: "#f0f0f0",
  iceShadow: "#b0b0b0",
  hole: "#333333",
  holeDeep: "#1a1a1a",
  water: "#555555",
  waterLight: "#707070",
  pole: "#555555",
  poleDark: "#3a3a3a",
  line: "#888888",
  // only two colors in the whole scene
  exclaim: "#cc3333",
  plus: "#33aa55",
} as const;

/* ── pixel helpers ── */
function px(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

function line(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: string,
) {
  ctx.fillStyle = color;
  let dx = Math.abs(x1 - x0),
    dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1,
    sy = y0 < y1 ? 1 : -1;
  let err = dx + dy,
    cx = x0,
    cy = y0;
  for (;;) {
    ctx.fillRect(cx, cy, 1, 1);
    if (cx === x1 && cy === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      cx += sx;
    }
    if (e2 <= dx) {
      err += dx;
      cy += sy;
    }
  }
}

/* ── penguin sprite: 3/4 view turned slightly left, 16w × 18h ──
   0=transparent 1=black 2=darkest 3=dark 4=light(belly) 5=white 6=midLight(beak area) */
const PENGUIN = [
  //       0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15
  /* 0 */ [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  /* 1 */ [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  /* 2 */ [0, 0, 0, 1, 1, 4, 4, 4, 4, 4, 1, 1, 0, 0, 0, 0],
  /* 3 */ [0, 0, 0, 1, 4, 4, 1, 4, 4, 1, 4, 1, 0, 0, 0, 0],
  /* 4 */ [0, 0, 0, 1, 4, 4, 4, 4, 4, 4, 4, 1, 0, 0, 0, 0],
  /* 5 */ [0, 0, 0, 1, 4, 4, 6, 6, 4, 4, 4, 1, 0, 0, 0, 0],
  /* 6 */ [0, 0, 0, 0, 1, 4, 4, 4, 4, 4, 1, 0, 0, 0, 0, 0],
  /* 7 */ [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  /* 8 */ [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  /* 9 */ [0, 1, 2, 1, 4, 4, 4, 4, 4, 4, 1, 1, 2, 1, 0, 0],
  /*10 */ [1, 2, 2, 1, 4, 4, 5, 5, 4, 4, 1, 2, 2, 1, 0, 0],
  /*11 */ [1, 2, 3, 1, 4, 4, 5, 5, 4, 4, 1, 2, 3, 0, 0, 0],
  /*12 */ [0, 1, 3, 1, 1, 4, 4, 4, 4, 1, 1, 3, 1, 0, 0, 0],
  /*13 */ [0, 0, 1, 1, 1, 1, 4, 4, 1, 1, 1, 1, 0, 0, 0, 0],
  /*14 */ [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  /*15 */ [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
];

const SPRITE_COLORS: Record<number, string> = {
  1: C.black,
  2: C.darkest,
  3: C.dark,
  4: C.lighter,
  5: C.white,
  6: C.midLight,
};

// Feet waddle: two frames, only feet move — offsets from penguin origin
// Each frame: [leftX, leftY, rightX, rightY]
const FEET = [
  [3, 16, 8, 17], // frame 0: left foot forward
  [4, 17, 7, 16], // frame 1: right foot forward
];

function drawSprite(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
  for (let r = 0; r < PENGUIN.length; r++) {
    for (let c = 0; c < PENGUIN[r].length; c++) {
      const v = PENGUIN[r][c];
      if (v === 0) continue;
      ctx.fillStyle = SPRITE_COLORS[v];
      ctx.fillRect(ox + c, oy + r, 1, 1);
    }
  }
}

/* ── 3×5 pixel font (uppercase + digits + symbols) ── */
const FONT: Record<string, number[]> = {
  A: [0b010, 0b101, 0b111, 0b101, 0b101],
  B: [0b110, 0b101, 0b110, 0b101, 0b110],
  C: [0b011, 0b100, 0b100, 0b100, 0b011],
  D: [0b110, 0b101, 0b101, 0b101, 0b110],
  E: [0b111, 0b100, 0b110, 0b100, 0b111],
  F: [0b111, 0b100, 0b110, 0b100, 0b100],
  G: [0b011, 0b100, 0b101, 0b101, 0b011],
  H: [0b101, 0b101, 0b111, 0b101, 0b101],
  I: [0b111, 0b010, 0b010, 0b010, 0b111],
  K: [0b101, 0b110, 0b100, 0b110, 0b101],
  L: [0b100, 0b100, 0b100, 0b100, 0b111],
  O: [0b010, 0b101, 0b101, 0b101, 0b010],
  S: [0b011, 0b100, 0b010, 0b001, 0b110],
  T: [0b111, 0b010, 0b010, 0b010, 0b010],
  X: [0b101, 0b101, 0b010, 0b101, 0b101],
  "0": [0b111, 0b101, 0b101, 0b101, 0b111],
  "1": [0b010, 0b110, 0b010, 0b010, 0b111],
  "2": [0b111, 0b001, 0b111, 0b100, 0b111],
  "3": [0b111, 0b001, 0b111, 0b001, 0b111],
  "4": [0b101, 0b101, 0b111, 0b001, 0b001],
  "5": [0b111, 0b100, 0b111, 0b001, 0b111],
  "6": [0b111, 0b100, 0b111, 0b101, 0b111],
  "7": [0b111, 0b001, 0b010, 0b010, 0b010],
  "8": [0b111, 0b101, 0b111, 0b101, 0b111],
  "9": [0b111, 0b101, 0b111, 0b001, 0b111],
  " ": [0b000, 0b000, 0b000, 0b000, 0b000],
};

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  y: number,
  color: string,
) {
  const charW = 4; // 3px char + 1px gap
  const totalW = text.length * charW - 1;
  let x = cx - Math.floor(totalW / 2);
  ctx.fillStyle = color;
  for (const ch of text) {
    const glyph = FONT[ch.toUpperCase()];
    if (glyph) {
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 3; col++) {
          if (glyph[row] & (1 << (2 - col))) {
            ctx.fillRect(x + col, y + row, 1, 1);
          }
        }
      }
    }
    x += charW;
  }
}

/* ── scene ── */
const W = 80;
const H = 80;
const SCALE = 3;

// Fixed penguin position — body never moves
const PX = 44;
const PY = 38;

function drawScene(
  ctx: CanvasRenderingContext2D,
  waddleFrame: number,
  phase: Phase,
  tick: number,
  fish: number,
) {
  ctx.clearRect(0, 0, W, H);

  // Ice texture dots (no solid background — transparent)
  const dots: [number, number, string][] = [
    [8, 38, C.iceShadow],
    [22, 45, C.iceShadow],
    [50, 36, C.iceShadow],
    [65, 50, C.iceShadow],
    [35, 55, C.iceShadow],
    [12, 60, C.iceShadow],
    [58, 42, C.iceShadow],
    [40, 65, C.iceShadow],
    [72, 58, C.iceShadow],
  ];
  for (const [x, y, c] of dots) px(ctx, x, y, c);

  // Hole — below and to the left of penguin
  const hx = 30,
    hy = 60;
  for (let dy = -5; dy <= 5; dy++) {
    const hw = Math.round(8 * Math.sqrt(1 - (dy * dy) / 30));
    if (hw <= 0) continue;
    ctx.fillStyle = dy < 1 ? C.hole : C.holeDeep;
    ctx.fillRect(hx - hw, hy + dy, hw * 2 + 1, 1);
  }
  // Water shimmer
  const shimmer = Math.floor(tick / 15) % 3;
  px(ctx, hx - 3 + shimmer, hy - 1, C.waterLight);
  px(ctx, hx + 2 - shimmer, hy, C.water);
  px(ctx, hx - 1, hy + 1, C.waterLight);
  // Hole rim highlight
  for (let dy = -6; dy <= -5; dy++) {
    const hw = Math.round(8 * Math.sqrt(1 - (dy * dy) / 42));
    if (hw <= 0) continue;
    ctx.fillStyle = C.lighter;
    ctx.fillRect(hx - hw, hy + dy, hw * 2 + 1, 1);
  }

  // Penguin shadow
  ctx.fillStyle = C.iceShadow;
  for (let dy = 0; dy < 3; dy++) {
    const sw = 6 - dy;
    ctx.fillRect(PX + 3 - sw, PY + 17 + dy, sw * 2 + 1, 1);
  }

  // Fishing pole — from left flipper toward hole
  const poleBaseX = PX + 1;
  const poleBaseY = PY + 10;
  const poleDip = phase === "tug" || phase === "caught";
  const poleTipX = poleDip ? 28 : 24;
  const poleTipY = poleDip ? 48 : 42;

  line(ctx, poleBaseX, poleBaseY, poleTipX, poleTipY, C.pole);
  px(ctx, poleBaseX, poleBaseY, C.poleDark);

  // Fishing line into hole
  line(ctx, poleTipX, poleTipY, hx, hy - 2, C.line);

  // Penguin body — fixed position always
  drawSprite(ctx, PX, PY);

  // Feet — these are the only part that waddles
  const f = FEET[0];
  ctx.fillStyle = C.mid;
  ctx.fillRect(PX + f[0], PY + f[1], 3, 2);
  ctx.fillRect(PX + f[2], PY + f[3], 3, 2);

  // ── phase effects ──
  if (phase === "tug") {
    // Red ! above head
    const exX = PX + 6,
      exY = PY - 9;
    ctx.fillStyle = C.exclaim;
    ctx.fillRect(exX, exY, 2, 5);
    ctx.fillRect(exX, exY + 6, 2, 2);

    // Splash (gray)
    const sa = Math.floor(tick / 4) % 2;
    px(ctx, hx - 5 - sa, hy - 3, C.light);
    px(ctx, hx + 5 + sa, hy - 2, C.light);
    px(ctx, hx - 3, hy - 5 - sa, C.light);
    px(ctx, hx + 3, hy - 5 - sa, C.light);
  }

  if (phase === "caught") {
    // Green +1
    const tx = PX + 3,
      ty = PY - 11;
    ctx.fillStyle = C.plus;
    // +
    ctx.fillRect(tx, ty + 1, 3, 1);
    ctx.fillRect(tx + 1, ty, 1, 3);
    // 1
    ctx.fillRect(tx + 5, ty, 1, 3);

    // Fish silhouette (gray) jumping out
    const fishY = hy - 7 - (Math.floor(tick / 5) % 3);
    ctx.fillStyle = C.midLight;
    ctx.fillRect(hx - 2, fishY, 4, 2);
    ctx.fillRect(hx + 2, fishY, 1, 1);
    ctx.fillRect(hx - 3, fishY + 1, 1, 1);
    px(ctx, hx - 1, fishY, C.dark);
  }

  if (phase === "missed") {
    const dx = PX + 4,
      dy = PY - 6;
    ctx.fillStyle = C.midLight;
    px(ctx, dx, dy, C.midLight);
    px(ctx, dx + 3, dy, C.midLight);
    px(ctx, dx + 6, dy, C.midLight);
  }

  // HUD text centered on canvas, just above penguin head
  const textCx = W / 2;
  if (fish > 0) {
    drawText(ctx, `${fish} FISH`, textCx, PY - 22, C.mid);
  } else {
    drawText(ctx, "CLICK TO FISH", textCx, PY - 22, C.mid);
  }
}

/* ── typewriter text with pause on periods ── */
const END_TEXT =
  "Wow. Never expected anyone to get to the 404, much less fish 10 fish. But that's enough fishing for now. Have a nice day.";

function useTypewriter(text: string, active: boolean) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    indexRef.current = 0;
    setDisplayed("");

    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      const i = indexRef.current;
      if (i >= text.length) return;
      const char = text[i];
      indexRef.current = i + 1;
      setDisplayed(text.slice(0, i + 1));
      // Pause longer after periods (but not at end of string)
      const delay = char === "." && i < text.length - 1 ? 600 : 45;
      timeout = setTimeout(tick, delay);
    };
    timeout = setTimeout(tick, 300);
    return () => clearTimeout(timeout);
  }, [text, active]);

  return displayed;
}

/* ── component ── */
export default function PenguinFishing() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [fish, setFish] = useState(0);
  const [done, setDone] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tugTimeout = useRef<ReturnType<typeof setTimeout>>();
  const phaseRef = useRef(phase);
  const fishRef = useRef(fish);
  const tickRef = useRef(0);
  const waddleRef = useRef(0);
  const doneRef = useRef(done);
  phaseRef.current = phase;
  fishRef.current = fish;
  doneRef.current = done;

  const typewriterText = useTypewriter(END_TEXT, done);

  // Trigger done state at 10 fish
  useEffect(() => {
    if (fish >= 10 && !done) {
      clearTimeout(tugTimeout.current);
      setPhase("idle");
      setDone(true);
    }
  }, [fish, done]);

  const scheduleNextTug = useCallback(() => {
    clearTimeout(tugTimeout.current);
    if (doneRef.current) return;
    const delay = 2000 + Math.random() * 4000;
    tugTimeout.current = setTimeout(() => {
      if (doneRef.current) return;
      setPhase("tug");
      tugTimeout.current = setTimeout(() => {
        if (phaseRef.current === "tug") {
          setPhase("missed");
          tugTimeout.current = setTimeout(() => {
            setPhase("idle");
            scheduleNextTug();
          }, 800);
        }
      }, 700);
    }, delay);
  }, []);

  useEffect(() => {
    let raf: number;
    let lastWaddle = 0;
    const animate = (time: number) => {
      tickRef.current++;
      if (time - lastWaddle > 600) {
        waddleRef.current = 1 - waddleRef.current;
        lastWaddle = time;
      }
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx)
          drawScene(
            ctx,
            waddleRef.current,
            phaseRef.current,
            tickRef.current,
            fishRef.current,
          );
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!done) {
      scheduleNextTug();
      return () => clearTimeout(tugTimeout.current);
    }
  }, [scheduleNextTug, done]);

  const handleClick = () => {
    if (done) return;
    if (phase === "tug") {
      clearTimeout(tugTimeout.current);
      setFish((f) => f + 1);
      setPhase("caught");
      setTimeout(() => {
        setPhase("idle");
        scheduleNextTug();
      }, 1000);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="select-none relative"
      style={{ cursor: !done && phase === "tug" ? "pointer" : "default" }}
      role="button"
      tabIndex={0}
      aria-label={
        done
          ? END_TEXT
          : `Penguin fishing game. Fish caught: ${fish}. ${phase === "tug" ? "Click now to catch a fish!" : "Wait for a tug..."}`
      }
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") handleClick();
      }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="mx-auto"
        style={{
          width: W * SCALE,
          height: H * SCALE,
          imageRendering: "pixelated",
          opacity: done ? 0.15 : 1,
          transition: "opacity 1.5s ease",
        }}
      />
      {done && (
        <p className="absolute inset-0 flex items-center justify-center px-6 font-mono text-caption text-ink leading-relaxed text-center">
          {typewriterText}
        </p>
      )}
    </div>
  );
}
