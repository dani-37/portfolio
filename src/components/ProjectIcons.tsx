const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" {...S}>
      {children}
    </svg>
  );
}

/** Chat bubble with ascending bar chart — data + conversation */
function ODI() {
  return (
    <Icon>
      <path d="M4 4h16v12H8l-4 4V4z" />
      <line x1="9" y1="13" x2="9" y2="10" />
      <line x1="12" y1="13" x2="12" y2="8" />
      <line x1="15" y1="13" x2="15" y2="11" />
    </Icon>
  );
}

/** Contour lines — GIS / topo, echoes the site background */
function Footprints() {
  return (
    <Icon>
      <path d="M3 8c3-2 6 2 9 0s6-2 9 0" />
      <path d="M3 13c3-2 6 2 9 0s6-2 9 0" />
      <path d="M3 18c3-2 6 2 9 0s6-2 9 0" />
    </Icon>
  );
}

/** Trend line with dashed confidence bounds — uncertainty */
function Uncertainty() {
  return (
    <Icon>
      <path d="M3 17C7 15 13 9 21 7" />
      <path d="M3 13C7 11 13 5 21 3" strokeDasharray="2.5 2.5" />
      <path d="M3 21C7 19 13 13 21 11" strokeDasharray="2.5 2.5" />
    </Icon>
  );
}

/** Three connected nodes — graph theory */
function Movies() {
  return (
    <Icon>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="8" r="2.5" />
      <circle cx="10" cy="19" r="2.5" />
      <line x1="8" y1="7.5" x2="16" y2="7" />
      <line x1="7" y1="8.5" x2="9" y2="17" />
      <line x1="12.5" y1="18" x2="16" y2="10" />
    </Icon>
  );
}

/** Slashed equal sign — inequality / bias */
function Biases() {
  return (
    <Icon>
      <line x1="5" y1="9" x2="19" y2="9" />
      <line x1="5" y1="15" x2="19" y2="15" />
      <line x1="18" y1="4" x2="6" y2="20" />
    </Icon>
  );
}

export const PROJECT_ICONS: Record<string, React.FC> = {
  odi: ODI,
  footprints: Footprints,
  uncertainty: Uncertainty,
  biases: Biases,
  movies: Movies,
};
