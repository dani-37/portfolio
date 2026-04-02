import { useRef, useEffect } from "react";

const LAT = 37;
const LON = 0;
const STEPS = 100;
const SMOOTH_PASSES = 16;

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

// --- Hole sources ---

const RAMP_IN = 4; // seconds per source to ramp up
const STAGGER = 3; // seconds between each source starting

const SOURCE_DEFS = [
  // Large irregular — upper right, elongated shape
  {
    phi0: 0.85,
    phiA: 0.3,
    phiW: 0.015,
    phiP: 0.0,
    th0: 0.2,
    thSpd: 0.02,
    thA: 0.8,
    thW: 0.025,
    thP: 0.0,
    period: 37,
    off: 0.0,
    sigma: 0.6,
    a: 0.5,
    b: 2.5,
    c: 3.1,
  },
  // Wide organic — lower left, very irregular boundary
  {
    phi0: 2.1,
    phiA: 0.3,
    phiW: 0.015,
    phiP: 1.5,
    th0: 4.5,
    thSpd: 0.02,
    thA: 0.6,
    thW: 0.03,
    thP: 3.2,
    period: 50,
    off: 3.14,
    sigma: 0.7,
    a: 0.2,
    b: 3.0,
    c: 0.5,
  },
  // Tall stretched — equatorial, strong 2nd harmonic
  {
    phi0: 1.4,
    phiA: 0.4,
    phiW: 0.02,
    phiP: 4.0,
    th0: 2.5,
    thSpd: 0.015,
    thA: 0.5,
    thW: 0.025,
    thP: 1.0,
    period: 45,
    off: 1.57,
    sigma: 0.65,
    a: 3.2,
    b: 0.3,
    c: 1.8,
  },
] as const;

type SourceData = {
  x: number;
  y: number;
  z: number;
  strength: number;
  sigma: number;
  e2s: number;
  e2c: number;
  e3s: number;
  e3c: number;
  e5s: number;
  e5c: number;
};

function getSources(t: number): SourceData[] {
  const out: SourceData[] = [];

  for (let idx = 0; idx < SOURCE_DEFS.length; idx++) {
    const s = SOURCE_DEFS[idx];
    // Each source ramps in at its own staggered time
    const sourceStart = idx * STAGGER;
    const ramp = Math.min(1, Math.max(0, (t - sourceStart) / RAMP_IN));
    const rampNorm = ramp * ramp * (3 - 2 * ramp); // smoothstep

    const phase = Math.sin((t / s.period) * Math.PI * 2 + s.off);
    const raw = Math.max(0, 0.3 + 0.7 * phase); // brief dip, mostly active
    const strength = raw * rampNorm;
    if (strength < 1e-6) continue;

    const phi = Math.max(
      0.2,
      Math.min(Math.PI - 0.2, s.phi0 + s.phiA * Math.sin(s.phiW * t + s.phiP)),
    );
    const theta = s.th0 + t * s.thSpd + s.thA * Math.sin(s.thW * t + s.thP);
    const sx = Math.sin(phi) * Math.cos(theta);
    const sy = Math.cos(phi);
    const sz = Math.sin(phi) * Math.sin(theta);
    const sigma =
      s.sigma *
      (1 + 0.3 * Math.sin(t * 0.15 + s.off) + 0.15 * Math.sin(t * 0.23 + s.a));

    // Fast-evolving envelope phases — shapes morph constantly
    const p2 = s.a + t * 0.18;
    const p3 = -(s.b + t * 0.13);
    const p5 = s.c + t * 0.09;

    out.push({
      x: sx,
      y: sy,
      z: sz,
      strength,
      sigma,
      e2s: Math.sin(p2),
      e2c: Math.cos(p2),
      e3s: Math.sin(p3),
      e3c: Math.cos(p3),
      e5s: Math.sin(p5),
      e5c: Math.cos(p5),
    });
  }
  return out;
}

// Compute raw push vector for a point (does NOT apply it)
function computePush(
  px: number,
  py: number,
  pz: number,
  sources: SourceData[],
  out: { x: number; y: number; z: number; mag: number },
) {
  const polarAngle = Math.acos(Math.abs(py));
  const polarFade = Math.min(1, polarAngle / 0.35);

  if (polarFade < 0.01) {
    out.x = 0;
    out.y = 0;
    out.z = 0;
    out.mag = 0;
    return;
  }

  let dirX = 0,
    dirY = 0,
    dirZ = 0;
  let totalMag = 0;

  for (const src of sources) {
    const dot = px * src.x + py * src.y + pz * src.z;
    const clampedDot = Math.min(1, Math.max(-1, dot));
    const angle = Math.acos(clampedDot);
    const influenceAngle = Math.min(src.sigma * 2.5, Math.PI * 0.45);
    if (angle >= influenceAngle) continue;

    let tx = px - dot * src.x;
    let ty = py - dot * src.y;
    let tz = pz - dot * src.z;
    const tLen = Math.sqrt(tx * tx + ty * ty + tz * tz);
    if (tLen < 1e-4) continue;
    tx /= tLen;
    ty /= tLen;
    tz /= tLen;

    const r2 = tx * tx + tz * tz;
    let envelope = 1;
    if (r2 > 1e-6) {
      const invR = 1 / Math.sqrt(r2);
      const ca = tx * invR,
        sa = tz * invR;
      const c2 = 2 * ca * ca - 1,
        s2 = 2 * sa * ca;
      const c3 = ca * c2 - sa * s2,
        s3 = sa * c2 + ca * s2;
      const c5 = c2 * c3 - s2 * s3,
        s5 = s2 * c3 + c2 * s3;
      envelope = Math.max(
        0.15,
        1 +
          0.55 * (s2 * src.e2c + c2 * src.e2s) +
          0.4 * (s3 * src.e3c + c3 * src.e3s) +
          0.25 * (s5 * src.e5c + c5 * src.e5s),
      );
    }

    const holeRadius = src.sigma * 1.2 * src.strength * envelope;
    let pushMag: number;
    if (angle < holeRadius) {
      pushMag = holeRadius - angle + holeRadius * 0.5;
    } else {
      const t = (angle - holeRadius) / (influenceAngle - holeRadius);
      const decay = (1 - t) * (1 - t) * (1 - t);
      pushMag = holeRadius * 0.5 * decay;
    }
    pushMag *= src.strength * 4;

    const w = pushMag * pushMag;
    dirX += w * tx;
    dirY += w * ty;
    dirZ += w * tz;
    totalMag += pushMag;
  }

  const dirLen = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
  if (dirLen < 1e-6 || totalMag < 1e-6) {
    out.x = 0;
    out.y = 0;
    out.z = 0;
    out.mag = 0;
    return;
  }

  out.x = (dirX / dirLen) * polarFade;
  out.y = (dirY / dirLen) * polarFade;
  out.z = (dirZ / dirLen) * polarFade;
  out.mag = totalMag * polarFade;
}

// Apply push via Rodrigues rotation (keeps point on sphere)
const _pp = { x: 0, y: 0, z: 0 };
function applyPush(
  px: number,
  py: number,
  pz: number,
  nx: number,
  ny: number,
  nz: number,
  mag: number,
): { x: number; y: number; z: number } {
  if (mag < 1e-6) {
    _pp.x = px;
    _pp.y = py;
    _pp.z = pz;
    return _pp;
  }
  const pushAngle = Math.min(mag, 1.5);
  const axX = py * nz - pz * ny;
  const axY = pz * nx - px * nz;
  const axZ = px * ny - py * nx;
  const axLen = Math.sqrt(axX * axX + axY * axY + axZ * axZ);
  if (axLen < 1e-8) {
    _pp.x = px;
    _pp.y = py;
    _pp.z = pz;
    return _pp;
  }
  const kx = axX / axLen,
    ky = axY / axLen,
    kz = axZ / axLen;
  const cosA = Math.cos(pushAngle),
    sinA = Math.sin(pushAngle);
  const crossX = ky * pz - kz * py;
  const crossY = kz * px - kx * pz;
  const crossZ = kx * py - ky * px;
  const kDotP = kx * px + ky * py + kz * pz;
  _pp.x = px * cosA + crossX * sinA + kx * kDotP * (1 - cosA);
  _pp.y = py * cosA + crossY * sinA + ky * kDotP * (1 - cosA);
  _pp.z = pz * cosA + crossZ * sinA + kz * kDotP * (1 - cosA);
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
    const cxc = size / 2;
    const cyc = size / 2;
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

    const N = STEPS + 1;
    type Pt = { x: number; y: number; z: number };

    // Sphere-space points (unit sphere, before view rotation)
    const latSphere = Array.from({ length: LAT + 1 }, () =>
      Array.from({ length: N }, (): Pt => ({ x: 0, y: 0, z: 0 })),
    );
    const merSphere = Array.from({ length: LON }, () =>
      Array.from({ length: N }, (): Pt => ({ x: 0, y: 0, z: 0 })),
    );
    // Previous frame positions for temporal smoothing
    const latPrev = Array.from({ length: LAT + 1 }, () =>
      Array.from({ length: N }, (): Pt => ({ x: 0, y: 0, z: 0 })),
    );
    const merPrev = Array.from({ length: LON }, () =>
      Array.from({ length: N }, (): Pt => ({ x: 0, y: 0, z: 0 })),
    );
    let firstFrame = true;
    const LERP = 0.06;
    const SCREEN_LERP = 0.1;

    // Previous frame screen positions for temporal line smoothing
    const latScreenPrev = Array.from({ length: LAT + 1 }, () =>
      Array.from({ length: N }, (): Pt => ({ x: 0, y: 0, z: 0 })),
    );
    const merScreenPrev = Array.from({ length: LON }, () =>
      Array.from({ length: N }, (): Pt => ({ x: 0, y: 0, z: 0 })),
    );

    // Screen-space points (after view rotation)
    const latScreen = Array.from({ length: LAT + 1 }, () =>
      Array.from({ length: N }, (): Pt => ({ x: 0, y: 0, z: 0 })),
    );
    const merScreen = Array.from({ length: LON }, () =>
      Array.from({ length: N }, (): Pt => ({ x: 0, y: 0, z: 0 })),
    );

    // Push vector arrays for along-line smoothing
    type PushVec = { x: number; y: number; z: number; mag: number };
    const pushBuf = Array.from(
      { length: N },
      (): PushVec => ({ x: 0, y: 0, z: 0, mag: 0 }),
    );
    // Propagate push directions along the line so adjacent points can't oppose each other.
    // Forward pass: each point inherits from its left neighbor.
    // Backward pass: each point inherits from its right neighbor.
    // This ensures a consistent direction carries through hole centers.
    const PROP_DECAY = 0.85; // how strongly direction propagates (0=none, 1=full)

    // Save original magnitudes before propagation
    const origMag = new Float64Array(N);

    function smoothPushes(pushes: PushVec[], n: number, wrap: boolean) {
      // Save original magnitudes — propagation should NOT amplify them
      for (let k = 0; k < n; k++) origMag[k] = pushes[k].mag;

      // Forward propagation — direction only
      for (let k = 1; k < n; k++) {
        const prev = pushes[k - 1];
        const curr = pushes[k];
        curr.x = curr.x + PROP_DECAY * prev.x;
        curr.y = curr.y + PROP_DECAY * prev.y;
        curr.z = curr.z + PROP_DECAY * prev.z;
      }
      // Backward propagation (slightly weaker to break symmetry)
      for (let k = n - 2; k >= 0; k--) {
        const next = pushes[k + 1];
        const curr = pushes[k];
        curr.x = curr.x + PROP_DECAY * 0.8 * next.x;
        curr.y = curr.y + PROP_DECAY * 0.8 * next.y;
        curr.z = curr.z + PROP_DECAY * 0.8 * next.z;
      }
      if (wrap) {
        const avg = {
          x: (pushes[n - 2].x + pushes[0].x) / 2,
          y: (pushes[n - 2].y + pushes[0].y) / 2,
          z: (pushes[n - 2].z + pushes[0].z) / 2,
        };
        pushes[0].x = avg.x;
        pushes[0].y = avg.y;
        pushes[0].z = avg.z;
        pushes[n - 1].x = avg.x;
        pushes[n - 1].y = avg.y;
        pushes[n - 1].z = avg.z;
      }
      // Normalize directions
      for (let k = 0; k < n; k++) {
        const p = pushes[k];
        const len = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
        if (len > 1e-6) {
          p.x /= len;
          p.y /= len;
          p.z /= len;
        }
      }
      // Smooth magnitudes by averaging — just 3 passes to spread slightly
      for (let pass = 0; pass < 3; pass++) {
        for (let k = 1; k < n - 1; k++) {
          origMag[k] = (origMag[k - 1] + 2 * origMag[k] + origMag[k + 1]) / 4;
        }
        if (wrap) {
          const avg = (origMag[n - 2] + 2 * origMag[0] + origMag[1]) / 4;
          origMag[0] = avg;
          origMag[n - 1] = avg;
        }
      }
      for (let k = 0; k < n; k++) {
        pushes[k].mag = origMag[k];
      }
    }

    // Smooth on the unit sphere — then re-normalize to stay on surface
    function smoothSphere(pts: Pt[], n: number, passes: number, wrap: boolean) {
      for (let p = 0; p < passes; p++) {
        for (let k = 1; k < n - 1; k++) {
          let sx = (pts[k - 1].x + 2 * pts[k].x + pts[k + 1].x) / 4;
          let sy = (pts[k - 1].y + 2 * pts[k].y + pts[k + 1].y) / 4;
          let sz = (pts[k - 1].z + 2 * pts[k].z + pts[k + 1].z) / 4;
          const len = Math.sqrt(sx * sx + sy * sy + sz * sz);
          if (len > 1e-8) {
            sx /= len;
            sy /= len;
            sz /= len;
          }
          pts[k].x = sx;
          pts[k].y = sy;
          pts[k].z = sz;
        }
        if (wrap) {
          let sx = (pts[n - 2].x + 2 * pts[0].x + pts[1].x) / 4;
          let sy = (pts[n - 2].y + 2 * pts[0].y + pts[1].y) / 4;
          let sz = (pts[n - 2].z + 2 * pts[0].z + pts[1].z) / 4;
          const len = Math.sqrt(sx * sx + sy * sy + sz * sz);
          if (len > 1e-8) {
            sx /= len;
            sy /= len;
            sz /= len;
          }
          pts[0].x = sx;
          pts[0].y = sy;
          pts[0].z = sz;
          pts[n - 1].x = sx;
          pts[n - 1].y = sy;
          pts[n - 1].z = sz;
        }
      }
    }

    // Light screen-space smoothing — just enough to soften kinks, not enough to distort the sphere
    function smoothScreen(pts: Pt[], n: number, passes: number, wrap: boolean) {
      for (let p = 0; p < passes; p++) {
        for (let k = 1; k < n - 1; k++) {
          pts[k] = {
            x: (pts[k - 1].x + 2 * pts[k].x + pts[k + 1].x) / 4,
            y: (pts[k - 1].y + 2 * pts[k].y + pts[k + 1].y) / 4,
            z: pts[k].z,
          };
        }
        if (wrap) {
          const ax = (pts[n - 2].x + 2 * pts[0].x + pts[1].x) / 4;
          const ay = (pts[n - 2].y + 2 * pts[0].y + pts[1].y) / 4;
          pts[0].x = ax;
          pts[0].y = ay;
          pts[n - 1].x = ax;
          pts[n - 1].y = ay;
        }
      }
    }

    // Max angular distance between adjacent points on sphere (~3x normal spacing)
    const maxAngularDist = ((2 * Math.PI) / STEPS) * 3;
    const maxDot = Math.cos(maxAngularDist);

    // Constrain adjacent points to not exceed max distance — multiple passes
    function constrainSpacing(pts: Pt[], n: number, wrap: boolean) {
      for (let pass = 0; pass < 8; pass++) {
        for (let k = 1; k < n; k++) {
          const dot =
            pts[k].x * pts[k - 1].x +
            pts[k].y * pts[k - 1].y +
            pts[k].z * pts[k - 1].z;
          if (dot < maxDot) {
            // Too far apart — pull them toward each other on the sphere
            const mx = (pts[k - 1].x + pts[k].x) / 2;
            const my = (pts[k - 1].y + pts[k].y) / 2;
            const mz = (pts[k - 1].z + pts[k].z) / 2;
            // Blend each point 30% toward midpoint
            const blend = 0.3;
            let ax = pts[k - 1].x + blend * (mx - pts[k - 1].x);
            let ay = pts[k - 1].y + blend * (my - pts[k - 1].y);
            let az = pts[k - 1].z + blend * (mz - pts[k - 1].z);
            let len = Math.sqrt(ax * ax + ay * ay + az * az);
            if (len > 1e-8) {
              ax /= len;
              ay /= len;
              az /= len;
            }
            pts[k - 1].x = ax;
            pts[k - 1].y = ay;
            pts[k - 1].z = az;

            let bx = pts[k].x + blend * (mx - pts[k].x);
            let by = pts[k].y + blend * (my - pts[k].y);
            let bz = pts[k].z + blend * (mz - pts[k].z);
            len = Math.sqrt(bx * bx + by * by + bz * bz);
            if (len > 1e-8) {
              bx /= len;
              by /= len;
              bz /= len;
            }
            pts[k].x = bx;
            pts[k].y = by;
            pts[k].z = bz;
          }
        }
        if (wrap && n > 1) {
          const dot =
            pts[0].x * pts[n - 2].x +
            pts[0].y * pts[n - 2].y +
            pts[0].z * pts[n - 2].z;
          if (dot < maxDot) {
            const mx = (pts[0].x + pts[n - 2].x) / 2;
            const my = (pts[0].y + pts[n - 2].y) / 2;
            const mz = (pts[0].z + pts[n - 2].z) / 2;
            const blend = 0.3;
            let ax = pts[0].x + blend * (mx - pts[0].x);
            let ay = pts[0].y + blend * (my - pts[0].y);
            let az = pts[0].z + blend * (mz - pts[0].z);
            let len = Math.sqrt(ax * ax + ay * ay + az * az);
            if (len > 1e-8) {
              ax /= len;
              ay /= len;
              az /= len;
            }
            pts[0].x = ax;
            pts[0].y = ay;
            pts[0].z = az;
            pts[n - 1].x = ax;
            pts[n - 1].y = ay;
            pts[n - 1].z = az;
          }
        }
      }
    }

    function drawLine(
      scr: Pt[],
      prevScr: Pt[],
      n: number,
      baseAlpha: number,
      wrap: boolean,
    ) {
      if (n < 2) return;
      smoothScreen(scr, n, 4, wrap);
      if (!firstFrame) {
        for (let k = 0; k < n; k++) {
          scr[k].x = prevScr[k].x + SCREEN_LERP * (scr[k].x - prevScr[k].x);
          scr[k].y = prevScr[k].y + SCREEN_LERP * (scr[k].y - prevScr[k].y);
        }
      }
      for (let k = 0; k < n; k++) {
        prevScr[k].x = scr[k].x;
        prevScr[k].y = scr[k].y;
      }
      ctx.globalAlpha = baseAlpha;
      ctx.beginPath();
      ctx.moveTo(cxc + scr[0].x, cyc - scr[0].y);
      for (let k = 1; k < n; k++) {
        ctx.lineTo(cxc + scr[k].x, cyc - scr[k].y);
      }
      ctx.stroke();
    }

    function draw() {
      animId = requestAnimationFrame(draw);
      if (!visible) return;
      const t = (performance.now() - start) / 1000;
      ctx.clearRect(0, 0, size, size);

      const rotY = t * 0.06;
      const rotX = 0.45;
      const rotZ = 0.22;
      const sources = getSources(t);

      ctx.lineWidth = 0.7;
      ctx.strokeStyle = "#1a6b5a";

      // Phase 1: Displace all latitude rings
      for (let i = 0; i <= LAT; i++) {
        const phi = (i / LAT) * Math.PI;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);
        const sph = latSphere[i];

        for (let j = 0; j < N; j++) {
          const theta = (j / STEPS) * Math.PI * 2;
          const bx = sinPhi * Math.cos(theta);
          const bz = sinPhi * Math.sin(theta);
          computePush(bx, cosPhi, bz, sources, pushBuf[j]);
        }
        smoothPushes(pushBuf, N, true);
        for (let j = 0; j < N; j++) {
          const theta = (j / STEPS) * Math.PI * 2;
          const bx = sinPhi * Math.cos(theta);
          const bz = sinPhi * Math.sin(theta);
          const p = pushBuf[j];
          const len = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
          if (len > 1e-6) {
            const pp = applyPush(
              bx,
              cosPhi,
              bz,
              p.x / len,
              p.y / len,
              p.z / len,
              p.mag,
            );
            sph[j].x = pp.x;
            sph[j].y = pp.y;
            sph[j].z = pp.z;
          } else {
            sph[j].x = bx;
            sph[j].y = cosPhi;
            sph[j].z = bz;
          }
        }
        smoothSphere(sph, N, SMOOTH_PASSES, true);
        constrainSpacing(sph, N, true);
      }

      // Phase 2: Physical ring ordering — rings push neighbors like dominoes
      // Each ring must maintain phi ordering: ring i's phi <= ring i+1's phi
      // Multiple passes to cascade pushes through many rings
      const minGap = (Math.PI / LAT) * 0.05;

      for (let pass = 0; pass < 6; pass++) {
        // North → South: ring i pushes ring i+1 downward
        for (let j = 0; j < N; j++) {
          for (let i = 0; i < LAT; i++) {
            const a = latSphere[i][j];
            const b = latSphere[i + 1][j];
            const phiA = Math.acos(Math.min(1, Math.max(-1, a.y)));
            const phiB = Math.acos(Math.min(1, Math.max(-1, b.y)));
            if (phiB < phiA + minGap) {
              const newPhi = Math.min(Math.PI - 0.01, phiA + minGap);
              const bTheta = Math.atan2(b.z, b.x);
              const sinP = Math.sin(newPhi);
              b.x = sinP * Math.cos(bTheta);
              b.y = Math.cos(newPhi);
              b.z = sinP * Math.sin(bTheta);
            }
          }
        }
        // South → North: ring i+1 pushes ring i upward
        for (let j = 0; j < N; j++) {
          for (let i = LAT - 1; i >= 0; i--) {
            const a = latSphere[i][j];
            const b = latSphere[i + 1][j];
            const phiA = Math.acos(Math.min(1, Math.max(-1, a.y)));
            const phiB = Math.acos(Math.min(1, Math.max(-1, b.y)));
            if (phiA > phiB - minGap) {
              const newPhi = Math.max(0.01, phiB - minGap);
              const aTheta = Math.atan2(a.z, a.x);
              const sinP = Math.sin(newPhi);
              a.x = sinP * Math.cos(aTheta);
              a.y = Math.cos(newPhi);
              a.z = sinP * Math.sin(aTheta);
            }
          }
        }
      }

      // Phase 3: Temporal smooth + project + draw each ring
      for (let i = 0; i <= LAT; i++) {
        const sph = latSphere[i];
        const prev = latPrev[i];
        if (!firstFrame) {
          for (let j = 0; j < N; j++) {
            let sx = prev[j].x + LERP * (sph[j].x - prev[j].x);
            let sy = prev[j].y + LERP * (sph[j].y - prev[j].y);
            let sz = prev[j].z + LERP * (sph[j].z - prev[j].z);
            const len = Math.sqrt(sx * sx + sy * sy + sz * sz);
            if (len > 1e-8) {
              sx /= len;
              sy /= len;
              sz /= len;
            }
            sph[j].x = sx;
            sph[j].y = sy;
            sph[j].z = sz;
          }
        }
        for (let j = 0; j < N; j++) {
          prev[j].x = sph[j].x;
          prev[j].y = sph[j].y;
          prev[j].z = sph[j].z;
        }

        const scr = latScreen[i];
        let avgZ = 0;
        for (let j = 0; j < N; j++) {
          const rv = viewRotate(
            R * sph[j].x,
            R * sph[j].y,
            R * sph[j].z,
            rotY,
            rotX,
            rotZ,
          );
          scr[j].x = rv.x;
          scr[j].y = rv.y;
          scr[j].z = rv.z;
          avgZ += rv.z;
        }
        avgZ /= N;
        drawLine(
          scr,
          latScreenPrev[i],
          N,
          0.07 + 0.26 * ((avgZ / R + 1) / 2),
          true,
        );
      }

      // Meridians: displace → smooth on sphere → project
      const phiStart = Math.PI / LAT;
      const phiEnd = (Math.PI * (LAT - 1)) / LAT;
      for (let j = 0; j < LON; j++) {
        const theta = (j / LON) * Math.PI * 2;
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);
        const sph = merSphere[j];
        for (let i = 0; i < N; i++) {
          const phi = phiStart + (i / STEPS) * (phiEnd - phiStart);
          const bx = Math.sin(phi) * cosTheta;
          const by = Math.cos(phi);
          const bz = Math.sin(phi) * sinTheta;
          computePush(bx, by, bz, sources, pushBuf[i]);
        }
        smoothPushes(pushBuf, N, false);
        for (let i = 0; i < N; i++) {
          const phi = phiStart + (i / STEPS) * (phiEnd - phiStart);
          const bx = Math.sin(phi) * cosTheta;
          const by = Math.cos(phi);
          const bz = Math.sin(phi) * sinTheta;
          const p = pushBuf[i];
          const len = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
          if (len > 1e-6) {
            const pp = applyPush(
              bx,
              by,
              bz,
              p.x / len,
              p.y / len,
              p.z / len,
              p.mag,
            );
            sph[i].x = pp.x;
            sph[i].y = pp.y;
            sph[i].z = pp.z;
          } else {
            sph[i].x = bx;
            sph[i].y = by;
            sph[i].z = bz;
          }
        }
        smoothSphere(sph, N, SMOOTH_PASSES, false);
        constrainSpacing(sph, N, false);

        // Temporal smoothing: lerp
        const prev = merPrev[j];
        if (!firstFrame) {
          for (let i = 0; i < N; i++) {
            let sx = prev[i].x + LERP * (sph[i].x - prev[i].x);
            let sy = prev[i].y + LERP * (sph[i].y - prev[i].y);
            let sz = prev[i].z + LERP * (sph[i].z - prev[i].z);
            const len = Math.sqrt(sx * sx + sy * sy + sz * sz);
            if (len > 1e-8) {
              sx /= len;
              sy /= len;
              sz /= len;
            }
            sph[i].x = sx;
            sph[i].y = sy;
            sph[i].z = sz;
          }
        }
        for (let i = 0; i < N; i++) {
          prev[i].x = sph[i].x;
          prev[i].y = sph[i].y;
          prev[i].z = sph[i].z;
        }

        const scr = merScreen[j];
        let avgZ = 0;
        for (let i = 0; i < N; i++) {
          const rv = viewRotate(
            R * sph[i].x,
            R * sph[i].y,
            R * sph[i].z,
            rotY,
            rotX,
            rotZ,
          );
          scr[i].x = rv.x;
          scr[i].y = rv.y;
          scr[i].z = rv.z;
          avgZ += rv.z;
        }
        avgZ /= N;
        drawLine(
          scr,
          merScreenPrev[j],
          N,
          0.07 + 0.26 * ((avgZ / R + 1) / 2),
          false,
        );
      }

      firstFrame = false;
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
