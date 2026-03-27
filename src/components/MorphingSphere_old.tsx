import { useRef, useEffect } from "react";

const LAT = 22;
const LON = 30;
const STEPS = 120;

function ringPhi(u: number, theta: number, t: number, warp: number): number {
  const base = u * Math.PI;
  const wave =
    warp * 0.28 * Math.sin(2 * theta + t * 0.27 + u * 5.1) +
    warp * 0.15 * Math.sin(3 * theta - t * 0.19 + u * 8.3) +
    warp * 0.08 * Math.sin(4 * theta + t * 0.12 + u * 3.7);
  return Math.max(0.03, Math.min(Math.PI - 0.03, base + wave * Math.sin(base)));
}

function meridianTheta(
  v: number,
  phi: number,
  t: number,
  warp: number,
): number {
  const base = v * Math.PI * 2;
  const wave =
    warp * 0.3 * Math.sin(2 * phi + t * 0.24 + v * 6.8) +
    warp * 0.16 * Math.sin(3 * phi - t * 0.17 + v * 10.2) +
    warp * 0.08 * Math.sin(4 * phi + t * 0.10 + v * 4.4);
  return base + wave * Math.sin(phi);
}

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
  return { x, y, z };
}

function ss(x: number): number {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
}

const HOLE_DEFS = [
  {
    phi0: 1.1,
    th0: 0.9,
    phiSpd: 0.06,
    thSpd: 0.08,
    period: 13,
    off: 0.0,
    rad: 0.95,
    a: 0.0,
    b: 1.1,
    c: 2.3,
  },
  {
    phi0: 1.8,
    th0: 3.6,
    phiSpd: 0.05,
    thSpd: 0.11,
    period: 11,
    off: 3.0,
    rad: 1.05,
    a: 0.8,
    b: 2.0,
    c: 0.7,
  },
  {
    phi0: 2.3,
    th0: 1.5,
    phiSpd: 0.07,
    thSpd: 0.07,
    period: 15,
    off: 6.5,
    rad: 0.9,
    a: 1.5,
    b: 0.3,
    c: 1.8,
  },
  {
    phi0: 0.85,
    th0: 5.0,
    phiSpd: 0.04,
    thSpd: 0.13,
    period: 10,
    off: 10.0,
    rad: 1.0,
    a: 2.2,
    b: 1.7,
    c: 0.4,
  },
  {
    phi0: 1.55,
    th0: 2.3,
    phiSpd: 0.08,
    thSpd: 0.09,
    period: 17,
    off: 14.5,
    rad: 0.98,
    a: 0.5,
    b: 2.8,
    c: 1.3,
  },
  {
    phi0: 0.6,
    th0: 4.1,
    phiSpd: 0.05,
    thSpd: 0.1,
    period: 12,
    off: 19.0,
    rad: 1.02,
    a: 1.2,
    b: 0.9,
    c: 2.1,
  },
  {
    phi0: 2.0,
    th0: 0.4,
    phiSpd: 0.06,
    thSpd: 0.06,
    period: 14,
    off: 23.5,
    rad: 0.92,
    a: 0.3,
    b: 2.3,
    c: 0.8,
  },
] as const;

type Hole = {
  hx: number;
  hy: number;
  hz: number;
  e1: [number, number, number];
  e2: [number, number, number];
  str: number;
  rad: number;
  a: number;
  b: number;
  c: number;
  t: number;
};

function getHoles(t: number): (Hole | null)[] {
  return HOLE_DEFS.map((h) => {
    const raw = Math.sin((t / h.period) * Math.PI * 2 + h.off);
    if (raw <= 0) return null;
    const str = raw * raw;
    const phi = h.phi0 + 0.5 * Math.sin(t * h.phiSpd + 1.7);
    const theta = h.th0 + t * h.thSpd;
    const hx = Math.sin(phi) * Math.cos(theta);
    const hy = Math.cos(phi);
    const hz = Math.sin(phi) * Math.sin(theta);
    const ref: [number, number, number] =
      Math.abs(hy) < 0.85 ? [0, 1, 0] : [1, 0, 0];
    const d = ref[0] * hx + ref[1] * hy + ref[2] * hz;
    const ex = ref[0] - d * hx,
      ey = ref[1] - d * hy,
      ez = ref[2] - d * hz;
    const L = Math.sqrt(ex * ex + ey * ey + ez * ez);
    const e1: [number, number, number] = [ex / L, ey / L, ez / L];
    const e2: [number, number, number] = [
      hy * e1[2] - hz * e1[1],
      hz * e1[0] - hx * e1[2],
      hx * e1[1] - hy * e1[0],
    ];
    return { hx, hy, hz, e1, e2, str, rad: h.rad, a: h.a, b: h.b, c: h.c, t };
  });
}

// Returns modified position + alpha multiplier.
//
// INSIDE hole:  alpha fades to 0 toward centre — NO position change.
//               Keeping inside points stationary prevents the jump: points on
//               opposite sides of the centre would otherwise be pushed in
//               opposite directions, making the line snap across the hole.
//
// OUTSIDE hole: repulsion pushes the mesh away. Force peaks right at the
//               boundary and fades over one hole-radius outward, giving the
//               "harder near the edge, fading out" behaviour.
function processPoint(
  px: number,
  py: number,
  pz: number,
  holes: (Hole | null)[],
): { x: number; y: number; z: number; alpha: number } {
  let x = px,
    y = py,
    z = pz;
  let alpha = 1;

  for (const h of holes) {
    if (!h) continue;
    const dot = x * h.hx + y * h.hy + z * h.hz;
    const dist = Math.acos(Math.max(-1, Math.min(1, dot)));
    if (dist >= h.rad * 2.5) continue;

    const tx = x - dot * h.hx,
      ty = y - dot * h.hy,
      tz = z - dot * h.hz;
    const tLen = Math.sqrt(tx * tx + ty * ty + tz * tz);

    const angle =
      tLen > 1e-5
        ? Math.atan2(
            tx * h.e2[0] + ty * h.e2[1] + tz * h.e2[2],
            tx * h.e1[0] + ty * h.e1[1] + tz * h.e1[2],
          )
        : 0;

    const effRad = Math.max(
      0.12,
      h.rad *
        h.str *
        (1 +
          0.4 * Math.sin(2 * angle + h.a + h.t * 0.06) +
          0.24 * Math.sin(3 * angle - h.b - h.t * 0.04) +
          0.14 * Math.sin(5 * angle + h.c + h.t * 0.025)),
    );

    if (dist < effRad) {
      // Inside: fade alpha only — position untouched so no jumping
      // Steep fade: inner 60% is nearly invisible, outer 40% ramps up
      const a = ss((dist / effRad - 0.4) / 0.6);
      if (a < alpha) alpha = a;
    } else if (tLen > 1e-5) {
      // Outside: push away from hole, strongest at boundary, fading outward
      const beyond = (dist - effRad) / effRad; // 0 at boundary, grows outward
      if (beyond < 1.2) {
        const f = h.str * 0.65 * ss(1 - beyond / 1.2);
        x += (f * tx) / tLen;
        y += (f * ty) / tLen;
        z += (f * tz) / tLen;
        const L = Math.sqrt(x * x + y * y + z * z);
        x /= L;
        y /= L;
        z /= L;
      }
    }
  }

  return { x, y, z, alpha };
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

    // Laplacian smooth — removes kinks from repulsion without changing overall shape
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
          // Handle seam for closed rings
          const avg0 = {
            x: (pts[n - 2].x + 2 * pts[0].x + pts[1].x) / 4,
            y: (pts[n - 2].y + 2 * pts[0].y + pts[1].y) / 4,
            z: (pts[n - 2].z + 2 * pts[0].z + pts[1].z) / 4,
          };
          pts[0] = avg0;
          pts[n - 1] = avg0; // ring is closed — keep endpoints identical
        }
      }
    }

    function smoothAlphas(alphas: number[], passes: number) {
      for (let p = 0; p < passes; p++) {
        for (let k = 1; k < alphas.length - 1; k++) {
          alphas[k] = (alphas[k - 1] + 2 * alphas[k] + alphas[k + 1]) / 4;
        }
      }
    }

    function drawLine(
      pts: { x: number; y: number; z: number }[],
      alphas: number[],
      baseAlpha: number,
    ) {
      const n = pts.length;
      if (n < 2) return;

      let segStart = 0;
      let curBucket = Math.round(alphas[0] * 20) / 20; // 5% steps

      const flushSeg = (end: number) => {
        const a = curBucket * baseAlpha;
        if (a < 0.008 || end - segStart < 1) return;
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.moveTo(cx + pts[segStart].x, cy - pts[segStart].y);
        for (let k = segStart + 1; k < end; k++) {
          ctx.lineTo(cx + pts[k].x, cy - pts[k].y);
        }
        ctx.stroke();
      };

      for (let k = 1; k < n; k++) {
        const bucket = Math.round(alphas[k] * 20) / 20;
        if (bucket !== curBucket) {
          flushSeg(k);
          segStart = k - 1;
          curBucket = bucket;
        }
      }
      flushSeg(n);
    }

    function draw() {
      const t = (performance.now() - start) / 1000;
      ctx.clearRect(0, 0, size, size);

      const rotY = t * 0.09;
      const rotX = 0.52;
      const rotZ = 0.38;
      const holes = getHoles(t);
      const holeActivity = holes.reduce((sum, h) => sum + (h ? h.str : 0), 0);
      const warp = 1 + 0.35 * Math.min(1, holeActivity * 0.5);

      ctx.lineWidth = 0.7;
      ctx.strokeStyle = "#1a6b5a";

      // Latitude rings (closed loops)
      for (let i = 0; i <= LAT; i++) {
        const u = i / LAT;
        const pts: { x: number; y: number; z: number }[] = [];
        const alphas: number[] = [];
        for (let j = 0; j <= STEPS; j++) {
          const theta = (j / STEPS) * Math.PI * 2;
          const phi = ringPhi(u, theta, t, warp);
          const { x, y, z, alpha } = processPoint(
            Math.sin(phi) * Math.cos(theta),
            Math.cos(phi),
            Math.sin(phi) * Math.sin(theta),
            holes,
          );
          alphas.push(alpha);
          pts.push(viewRotate(R * x, R * y, R * z, rotY, rotX, rotZ));
        }
        smoothLine(pts, 4, true);
        smoothAlphas(alphas, 6);
        const avgZ = pts.reduce((s, p) => s + p.z, 0) / pts.length;
        drawLine(pts, alphas, 0.07 + 0.26 * ((avgZ / R + 1) / 2));
      }

      // Meridians — clipped to first/last parallel so they don't converge at poles
      const phiStart = Math.PI / LAT;
      const phiEnd = (Math.PI * (LAT - 1)) / LAT;
      for (let j = 0; j < LON; j++) {
        const v = j / LON;
        const pts: { x: number; y: number; z: number }[] = [];
        const alphas: number[] = [];
        for (let i = 0; i <= STEPS; i++) {
          const phi = phiStart + (i / STEPS) * (phiEnd - phiStart);
          const theta = meridianTheta(v, phi, t, warp);
          const { x, y, z, alpha } = processPoint(
            Math.sin(phi) * Math.cos(theta),
            Math.cos(phi),
            Math.sin(phi) * Math.sin(theta),
            holes,
          );
          alphas.push(alpha);
          pts.push(viewRotate(R * x, R * y, R * z, rotY, rotX, rotZ));
        }
        smoothLine(pts, 4, false);
        smoothAlphas(alphas, 6);
        const avgZ = pts.reduce((s, p) => s + p.z, 0) / pts.length;
        drawLine(pts, alphas, 0.07 + 0.26 * ((avgZ / R + 1) / 2));
      }

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className={className}
    />
  );
}
