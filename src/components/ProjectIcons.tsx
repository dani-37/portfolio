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

/** Bell curve with dashed confidence bounds — statistical uncertainty */
function Uncertainty() {
  return (
    <Icon>
      <path d="M2 19C5 19 8 5 12 5s7 14 10 14" />
      <path d="M5 19C7 19 9 9 12 9s5 10 7 10" strokeDasharray="2.5 2.5" />
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

/** Two people linked by a line — volunteer coordination */
function Toolip() {
  return (
    <Icon>
      <circle cx="7" cy="7" r="3" />
      <circle cx="17" cy="7" r="3" />
      <path d="M10 7h4" />
      <path d="M4 21v-2a4 4 0 014-4h1" />
      <path d="M20 21v-2a4 4 0 00-4-4h-1" />
    </Icon>
  );
}

export const PROJECT_ICONS: Record<string, React.FC> = {
  odi: ODI,
  footprints: Footprints,
  uncertainty: Uncertainty,
  toolip: Toolip,
  movies: Movies,
};
