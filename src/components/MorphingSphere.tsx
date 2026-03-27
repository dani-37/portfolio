import { useRef, useEffect } from "react";

const LAT = 18;
const LON = 24;
const STEPS = 30;
const SMOOTH_PASSES = 3;

function ringPhi(u: number, theta: number, t: number, warp: number): number {
  const base = u * Math.PI;
  if (warp < 1e-4) return base;
  const wave =
    warp * 0.28 * Math.sin(2 * theta + t * 0.27 + u * 5.1) +
    warp * 0.15 * Math.sin(3 * theta - t * 0.19 + u * 8.3) +
    warp * 0.08 * Math.sin(4 * theta + t * 0.12 + u * 3.7);
  return base + wave * Math.sin(base);
}

function meridianTheta(
  v: number,
  phi: number,
  t: number,
  warp: number,
): number {
  const base = v * Math.PI * 2;
  if (warp < 1e-4) return base;
  const wave =
    warp * 0.3 * Math.sin(2 * phi + t * 0.24 + v * 6.8) +
    warp * 0.16 * Math.sin(3 * phi - t * 0.17 + v * 10.2) +
    warp * 0.08 * Math.sin(4 * phi + t * 0.1 + v * 4.4);
  return base + wave * Math.sin(phi);
}

const _vr = { x: 0, y: 0, z: 0 };

function viewRotate(
  x: number,
  y: number,
  z: number,
  ry: number,
  rx: number,
  rz: number,
) {
  const cy = Math.cos(ry),
    sy = Math.sin(ry);
  const xr = x * cy + z * sy;
  z = -x * sy + z * cy;
  x = xr;
  const cx = Math.cos(rx),
    sx = Math.sin(rx);
  const yr = y * cx - z * sx;
  z = y * sx + z * cx;
  y = yr;
  const cz = Math.cos(rz),
    sz = Math.sin(rz);
  const xr2 = x * cz - y * sz;
  y = x * sz + y * cz;
  x = xr2;
  _vr.x = x;
  _vr.y = y;
  _vr.z = z;
  return _vr;
}

// --- Metaball hole field with irregular shapes ---

// All sources share a common quiet window via QUIET_PERIOD.
// sin(t/QUIET_PERIOD) is negative for ~half the cycle → all sources off → clean sphere.
const QUIET_PERIOD = 15; // seconds per full quiet cycle
const QUIET_DUTY = 0.01; // ~3s quiet

const SOURCE_DEFS = [
  // Large wandering holes — overlap and merge
  {
    phi0: 1.2,
    phiA: 0.6,
    phiW: 0.05,
    phiP: 0.0,
    th0: 0.8,
    thSpd: 0.04,
    thA: 0.5,
    thW: 0.07,
    thP: 0.0,
    period: 14,
    off: 1.0,
    sigma: 0.7,
    a: 0.0,
    b: 1.1,
    c: 2.3,
  },
  {
    phi0: 2.1,
    phiA: 0.3,
    phiW: 0.06,
    phiP: 1.0,
    th0: 5.0,
    thSpd: 0.07,
    thA: 0.4,
    thW: 0.05,
    thP: 2.0,
    period: 11,
    off: 2.5,
    sigma: 0.75,
    a: 2.2,
    b: 1.7,
    c: 0.4,
  },
  {
    phi0: 0.9,
    phiA: 0.5,
    phiW: 0.04,
    phiP: 4.2,
    th0: 1.6,
    thSpd: 0.04,
    thA: 0.6,
    thW: 0.06,
    thP: 3.0,
    period: 16,
    off: 1.8,
    sigma: 0.65,
    a: 1.5,
    b: 0.3,
    c: 1.8,
  },
  {
    phi0: 1.5,
    phiA: 0.5,
    phiW: 0.03,
    phiP: 3.5,
    th0: 2.3,
    thSpd: 0.05,
    thA: 0.5,
    thW: 0.07,
    thP: 4.5,
    period: 13,
    off: 3.5,
    sigma: 0.6,
    a: 0.5,
    b: 2.8,
    c: 1.3,
  },
  {
    phi0: 2.6,
    phiA: 0.2,
    phiW: 0.03,
    phiP: 4.5,
    th0: 3.8,
    thSpd: 0.03,
    thA: 0.7,
    thW: 0.04,
    thP: 0.3,
    period: 20,
    off: 3.2,
    sigma: 0.8,
    a: 0.2,
    b: 0.7,
    c: 3.5,
  },
  {
    phi0: 0.7,
    phiA: 0.7,
    phiW: 0.05,
    phiP: 5.0,
    th0: 4.2,
    thSpd: 0.05,
    thA: 0.4,
    thW: 0.08,
    thP: 1.0,
    period: 15,
    off: 5.0,
    sigma: 0.55,
    a: 1.2,
    b: 0.9,
    c: 2.1,
  },
] as const;

type Source = {
  x: number;
  y: number;
  z: number;
  strength: number;
  sigma: number;
  a: number;
  b: number;
  c: number;
  t: number;
  circular?: boolean;
};

function getSources(t: number): SourceWithEnv[] {
  const out: SourceWithEnv[] = [];
  const threshold = 1 - 2 * QUIET_DUTY;

  for (const s of SOURCE_DEFS) {
    const quietPhase = (t / QUIET_PERIOD) * Math.PI * 2 + s.off * 0.4;
    const cosVal = Math.cos(quietPhase);
    let quietNorm: number;
    if (cosVal > threshold) {
      quietNorm = 0;
    } else {
      const raw01 = Math.min(1, (threshold - cosVal) / 1.4);
      quietNorm = raw01 * raw01 * (3 - 2 * raw01);
    }

    const raw = Math.max(0, Math.sin((t / s.period) * Math.PI * 2 + s.off));
    const strength = raw * raw * raw * quietNorm;
    if (strength < 1e-6) continue;
    const phi = Math.max(
      0.2,
      Math.min(Math.PI - 0.2, s.phi0 + s.phiA * Math.sin(s.phiW * t + s.phiP)),
    );
    const theta = s.th0 + t * s.thSpd + s.thA * Math.sin(s.thW * t + s.thP);
    const sigma = s.sigma * (1 + 0.15 * Math.sin(t * 0.21 + s.off));
    const invSig2 = 1 / (sigma * sigma);

    const sx = Math.sin(phi) * Math.cos(theta);
    const sy = Math.cos(phi);
    const sz = Math.sin(phi) * Math.sin(theta);

    // Precompute envelope harmonic phases (once per source per frame, not per point)
    const p2 = s.a + t * 0.06;
    const p3 = -(s.b + t * 0.04);
    const p5 = s.c + t * 0.025;
    const p7 = s.a * 1.7 + t * 0.015;

    out.push({
      x: sx,
      y: sy,
      z: sz,
      strength,
      sigma,
      a: s.a,
      b: s.b,
      c: s.c,
      t,
      invSig2,
      cutoff: 5 * sigma * sigma,
      e2s: Math.sin(p2),
      e2c: Math.cos(p2),
      e3s: Math.sin(p3),
      e3c: Math.cos(p3),
      e5s: Math.sin(p5),
      e5c: Math.cos(p5),
      e7s: Math.sin(p7),
      e7c: Math.cos(p7),
    });
  }
  return out;
}

// Precomputed per-source envelope coefficients (set once per frame in getSources)
type SourceWithEnv = Source & {
  invSig2: number; // 1/σ²
  cutoff: number; // max oneMinusDot to consider
  // Precomputed envelope sin/cos pairs for the 4 harmonics
  e2s: number;
  e2c: number; // sin/cos for 2× harmonic phase
  e3s: number;
  e3c: number;
  e5s: number;
  e5c: number;
  e7s: number;
  e7c: number;
};

const _pp = { x: 0, y: 0, z: 0 };

function processPoint(
  px: number,
  py: number,
  pz: number,
  sources: SourceWithEnv[],
): { x: number; y: number; z: number } {
  let x = px,
    y = py,
    z = pz;

  let pushX = 0,
    pushY = 0,
    pushZ = 0;

  for (const src of sources) {
    const dot = x * src.x + y * src.y + z * src.z;
    const oneMinusDot = 1 - dot;
    if (oneMinusDot > src.cutoff) continue;

    const tx = x - dot * src.x;
    const ty = y - dot * src.y;
    const tz = z - dot * src.z;

    // Fast envelope using precomputed sin/cos and angle-addition
    // angle = atan2(tz, tx) — but we only need sin(n*angle) and cos(n*angle)
    // sin(n*angle + phase) = sin(n*angle)*cos(phase) + cos(n*angle)*sin(phase)
    // For n=2: sin(2a) = 2*tx*tz/(tx²+tz²), cos(2a) = (tx²-tz²)/(tx²+tz²)
    // Faster: just use tx,tz directly as proxies since we only need the shape
    const r2 = tx * tx + tz * tz;
    let envelope = 1;
    if (r2 > 1e-10) {
      const invR = 1 / Math.sqrt(r2);
      const ca = tx * invR; // cos(angle)
      const sa = tz * invR; // sin(angle)
      // Double-angle: cos2a = 2c²-1, sin2a = 2sc
      const c2 = 2 * ca * ca - 1,
        s2 = 2 * sa * ca;
      // Triple: cos3a = c*c2 - s*s2, sin3a = s*c2 + c*s2
      const c3 = ca * c2 - sa * s2,
        s3 = sa * c2 + ca * s2;
      // 5x: cos5 = c2*c3 - s2*s3, sin5 = s2*c3 + c2*s3
      const c5 = c2 * c3 - s2 * s3,
        s5 = s2 * c3 + c2 * s3;
      // 7x: cos7 = c2*c5 - s2*s5, sin7 = s2*c5 + c2*s5
      const c7 = c2 * c5 - s2 * s5,
        s7 = s2 * c5 + c2 * s5;
      envelope = Math.max(
        0.12,
        1 +
          0.5 * (s2 * src.e2c + c2 * src.e2s) +
          0.35 * (s3 * src.e3c + c3 * src.e3s) +
          0.22 * (s5 * src.e5c + c5 * src.e5s) +
          0.14 * (s7 * src.e7c + c7 * src.e7s),
      );
    }

    // Fast exp approximation: 1/(1 + x + x²/2) for x = oneMinusDot * invSig2
    const ex = oneMinusDot * src.invSig2;
    const fi = src.strength * (1 / (1 + ex + 0.5 * ex * ex)) * envelope;

    if (fi > 0.001) {
      pushX += fi * tx;
      pushY += fi * ty;
      pushZ += fi * tz;
    }
  }

  const pushLen = Math.sqrt(pushX * pushX + pushY * pushY + pushZ * pushZ);
  if (pushLen > 1e-5) {
    const f = Math.min(3.5, 14.0 * pushLen);
    x += (f * pushX) / pushLen;
    y += (f * pushY) / pushLen;
    z += (f * pushZ) / pushLen;
    const inward = 1 - 0.11 * Math.min(1, pushLen * 3);
    const L = Math.sqrt(x * x + y * y + z * z);
    x = (x / L) * inward;
    y = (y / L) * inward;
    z = (z / L) * inward;
  }

  _pp.x = x;
  _pp.y = y;
  _pp.z = z;
  return _pp;
}

export default function MorphingSphere({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const R = size * 0.38;
    const cx = size / 2;
    const cy = size / 2;
    const start = performance.now();
    let animId: number;
    let visible = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    // Mouse tracking — smoothed screen coords relative to canvas center

    function smoothLine(
      pts: { x: number; y: number; z: number }[],
      passes: number,
      wrap: boolean,
    ) {
      const n = pts.length;
      for (let p = 0; p < passes; p++) {
        for (let k = 1; k < n - 1; k++) {
          pts[k] = {
            x: (pts[k - 1].x + 2 * pts[k].x + pts[k + 1].x) / 4,
            y: (pts[k - 1].y + 2 * pts[k].y + pts[k + 1].y) / 4,
            z: (pts[k - 1].z + 2 * pts[k].z + pts[k + 1].z) / 4,
          };
        }
        if (wrap) {
          const avg0 = {
            x: (pts[n - 2].x + 2 * pts[0].x + pts[1].x) / 4,
            y: (pts[n - 2].y + 2 * pts[0].y + pts[1].y) / 4,
            z: (pts[n - 2].z + 2 * pts[0].z + pts[1].z) / 4,
          };
          pts[0] = avg0;
          pts[n - 1] = avg0;
        }
      }
    }

    let smoothWarp = 0; // smoothed warp, persists across frames

    // Pre-allocate point arrays — reused every frame (zero GC pressure)
    const N = STEPS + 1;
    const latCount = LAT + 1;
    const latPts = Array.from({ length: latCount }, () =>
      Array.from({ length: N }, () => ({ x: 0, y: 0, z: 0 })),
    );
    const merPts = Array.from({ length: LON }, () =>
      Array.from({ length: N }, () => ({ x: 0, y: 0, z: 0 })),
    );

    function drawLine(
      pts: { x: number; y: number; z: number }[],
      n: number,
      baseAlpha: number,
    ) {
      if (n < 2) return;
      ctx.globalAlpha = baseAlpha;
      ctx.beginPath();
      ctx.moveTo(cx + pts[0].x, cy - pts[0].y);
      for (let k = 1; k < n; k++) {
        ctx.lineTo(cx + pts[k].x, cy - pts[k].y);
      }
      ctx.stroke();
    }

    function draw() {
      animId = requestAnimationFrame(draw);
      if (!visible) return;
      const t = (performance.now() - start) / 1000;
      ctx.clearRect(0, 0, size, size);

      const rotY = t * 0.09;
      const rotX = 0.45;
      const rotZ = 0.22;
      const sources = getSources(t);

      const totalStrength = sources.reduce((sum, s) => sum + s.strength, 0);
      const targetWarp = 0.35 * Math.min(1, totalStrength * 0.3);
      smoothWarp += (targetWarp - smoothWarp) * 0.03; // slow lerp prevents snapping
      const warp = smoothWarp;

      ctx.lineWidth = 0.7;
      ctx.strokeStyle = "#1a6b5a";

      // Latitude rings
      for (let i = 0; i <= LAT; i++) {
        const u = i / LAT;
        const pts = latPts[i];
        for (let j = 0; j < N; j++) {
          const theta = (j / STEPS) * Math.PI * 2;
          const phi = ringPhi(u, theta, t, warp);
          const pp = processPoint(
            Math.sin(phi) * Math.cos(theta),
            Math.cos(phi),
            Math.sin(phi) * Math.sin(theta),
            sources,
          );
          const rv = viewRotate(R * pp.x, R * pp.y, R * pp.z, rotY, rotX, rotZ);
          pts[j].x = rv.x;
          pts[j].y = rv.y;
          pts[j].z = rv.z;
        }
        smoothLine(pts, SMOOTH_PASSES, true);
        let avgZ = 0;
        for (let j = 0; j < N; j++) avgZ += pts[j].z;
        avgZ /= N;
        drawLine(pts, N, 0.07 + 0.26 * ((avgZ / R + 1) / 2));
      }

      // Meridians — clipped from poles
      const phiStart = Math.PI / LAT;
      const phiEnd = (Math.PI * (LAT - 1)) / LAT;
      for (let j = 0; j < LON; j++) {
        const v = j / LON;
        const pts = merPts[j];
        for (let i = 0; i < N; i++) {
          const phi = phiStart + (i / STEPS) * (phiEnd - phiStart);
          const theta = meridianTheta(v, phi, t, warp);
          const pp = processPoint(
            Math.sin(phi) * Math.cos(theta),
            Math.cos(phi),
            Math.sin(phi) * Math.sin(theta),
            sources,
          );
          const rv = viewRotate(R * pp.x, R * pp.y, R * pp.z, rotY, rotX, rotZ);
          pts[i].x = rv.x;
          pts[i].y = rv.y;
          pts[i].z = rv.z;
        }
        smoothLine(pts, SMOOTH_PASSES, false);
        let avgZ = 0;
        for (let i = 0; i < N; i++) avgZ += pts[i].z;
        avgZ /= N;
        drawLine(pts, N, 0.07 + 0.26 * ((avgZ / R + 1) / 2));
      }
    }

    draw();
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className={className}
    />
  );
}
