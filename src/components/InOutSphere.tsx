import { useRef, useEffect } from "react";

const LAT = 18;
const LON = 24;
const STEPS = 30;
const A_MAX = 0.35;
const PERIOD = 16; // seconds per full eversion cycle

function smoothstep(a: number, b: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/**
 * Thurston corrugated sphere eversion — 8-lune, 5-phase.
 *
 * Phase 1 (ev 0.00→0.15): corrugation ramps up   — 8 ridges via sin(8θ')
 * Phase 2 (ev 0.15→0.40): push through           — north/south caps push toward equator
 * Phase 3 (ev 0.40→0.65): rotate + twist         — differential 180° longitude rotation
 * Phase 4 (ev 0.65→0.85): unloop                 — completes latitude morphing
 * Phase 5 (ev 0.85→1.00): decorrugate            — corrugation ramps back to zero
 *
 * Proven: at ev=1, φ_eff = π−φ (inverted sphere). Points move freely in 3D.
 */
function evertPoint(
  phi: number,
  theta: number,
  ev: number,
): { x: number; y: number; z: number } {
  const A = A_MAX * smoothstep(0, 0.15, ev) * (1 - smoothstep(0.85, 1.0, ev));

  const t2 = smoothstep(0.15, 0.4, ev);
  const t3 = smoothstep(0.4, 0.65, ev);
  const t4 = smoothstep(0.65, 0.85, ev);

  // Phase 3: differential longitude rotation (north +π, equator 0, south −π)
  const thetaRot = theta + t3 * Math.PI * Math.cos(phi);

  // Phases 2+4: latitude morphing — resolves to φ_eff = π−φ at ev=1
  const phiEff =
    phi +
    t2 * (Math.PI / 2) * Math.cos(phi) +
    t4 * (Math.PI - 2 * phi - (Math.PI / 2) * Math.cos(phi));

  // Corrugation tracks the rotated longitude
  const r = 1 + A * Math.sin(8 * thetaRot) * Math.sin(phi);

  _ep.x = r * Math.sin(phiEff) * Math.cos(thetaRot);
  _ep.y = r * Math.cos(phiEff);
  _ep.z = r * Math.sin(phiEff) * Math.sin(thetaRot);
  return _ep;
}
const _ep = { x: 0, y: 0, z: 0 };

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
  _ivr.x = x;
  _ivr.y = y;
  _ivr.z = z;
  return _ivr;
}
const _ivr = { x: 0, y: 0, z: 0 };

export default function InOutSphere({
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
    const ox = size / 2;
    const oy = size / 2;
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

    // Pre-allocate point arrays — zero GC pressure
    const N = STEPS + 1;
    const latPts = Array.from({ length: LAT + 1 }, () =>
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
      ctx.moveTo(ox + pts[0].x, oy - pts[0].y);
      for (let k = 1; k < n; k++) ctx.lineTo(ox + pts[k].x, oy - pts[k].y);
      ctx.stroke();
    }

    function draw() {
      animId = requestAnimationFrame(draw);
      if (!visible) return;
      const t = (performance.now() - start) / 1000;
      ctx.clearRect(0, 0, size, size);

      const ev = (1 - Math.cos((t / PERIOD) * Math.PI * 2)) / 2;
      const rotY = t * 0.04;
      const rotX = 0.45;
      const rotZ = 0.22;

      ctx.lineWidth = 0.7;
      ctx.strokeStyle = "#1a6b5a";

      // Latitude rings
      for (let i = 0; i <= LAT; i++) {
        const phi = (i / LAT) * Math.PI;
        const pts = latPts[i];
        for (let j = 0; j < N; j++) {
          const theta = (j / STEPS) * Math.PI * 2;
          const p = evertPoint(phi, theta, ev);
          const rv = viewRotate(R * p.x, R * p.y, R * p.z, rotY, rotX, rotZ);
          pts[j].x = rv.x;
          pts[j].y = rv.y;
          pts[j].z = rv.z;
        }
        let avgZ = 0;
        for (let j = 0; j < N; j++) avgZ += pts[j].z;
        avgZ /= N;
        drawLine(pts, N, 0.07 + 0.26 * ((avgZ / R + 1) / 2));
      }

      // Meridians — clipped from poles
      const phiStart = Math.PI / LAT;
      const phiEnd = (Math.PI * (LAT - 1)) / LAT;
      for (let j = 0; j < LON; j++) {
        const theta = (j / LON) * Math.PI * 2;
        const pts = merPts[j];
        for (let i = 0; i < N; i++) {
          const phi = phiStart + (i / STEPS) * (phiEnd - phiStart);
          const p = evertPoint(phi, theta, ev);
          const rv = viewRotate(R * p.x, R * p.y, R * p.z, rotY, rotX, rotZ);
          pts[i].x = rv.x;
          pts[i].y = rv.y;
          pts[i].z = rv.z;
        }
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
