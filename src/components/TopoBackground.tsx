import { PEAKS, peakPaths } from "../utils/topo";

const prefersReduced =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function TopoBackground() {
  return (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      viewBox="0 0 1440 900"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      role="presentation">
      <defs>
        <filter id="topo-flow" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.007 0.005"
            numOctaves={4}
            seed={7}
            result="noise"
          >
            {!prefersReduced && (
              <animate
                attributeName="baseFrequency"
                values="0.007 0.005; 0.008 0.006; 0.007 0.005"
                dur="40s"
                repeatCount="indefinite"
              />
            )}
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={9}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      <rect width="1440" height="900" fill="var(--color-bg)" />

      <g
        id="contours"
        filter={
          typeof window !== "undefined" && window.innerWidth >= 768 && !prefersReduced
            ? "url(#topo-flow)"
            : undefined
        }
        stroke="var(--color-green-topo)"
        fill="none"
        strokeWidth={0.6}
        opacity={0.85}>
        {PEAKS.map((peak, pi) => {
          const paths = peakPaths(peak.cx, peak.cy, peak.bands, peak.harmonics);
          const [minO, maxO] = peak.opacityRange;
          return paths.map((d, bi) => {
            const opacity =
              paths.length > 1
                ? minO + (bi / (paths.length - 1)) * (maxO - minO)
                : minO;
            return (
              <path key={`${pi}-${bi}`} d={d} opacity={opacity.toFixed(2)} />
            );
          });
        })}
      </g>
    </svg>
  );
}
