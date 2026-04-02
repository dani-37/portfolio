import { type ComponentType, lazy } from "react";

export interface ProjectMeta {
  slug: string;
  name: string;
  tag: string;
  description: string;
  stack: string[];
  Component: ComponentType<{ stack?: string[] }>;
}

export const PROJECT_REGISTRY: ProjectMeta[] = [
  {
    slug: "odi",
    name: "ODI",
    tag: "Full-stack",
    description: "Agentic search and analysis across international public data",
    stack: ["Claude", "Docker", "AWS", "Postgres", "Python"],
    Component: lazy(() => import("./ODI")),
  },
  {
    slug: "footprints",
    name: "Footprints",
    tag: "Sustainability",
    description: "Biodiversity impact modelling from land use & supply chains",
    stack: ["Python", "GeoPandas", "PostGIS"],
    Component: lazy(() => import("./Footprints")),
  },
  {
    slug: "uncertainty",
    name: "Uncertainty",
    tag: "Modelling",
    description: "Understanding forest growth uncertainty under climate change",
    stack: ["Python", "PyTorch"],
    Component: lazy(() => import("./Uncertainty")),
  },
  {
    slug: "toolip",
    name: "Toolip",
    tag: "Non-profit",
    description: "Volunteer coordination and workflow automation for charities",
    stack: ["Python", "Google APIs", "Azure"],
    Component: lazy(() => import("./Toolip")),
  },
  {
    slug: "movies",
    name: "Movies",
    tag: "Graph theory",
    description: "Network-based recommendations that find common ground",
    stack: ["Python", "NetworkX"],
    Component: lazy(() => import("./Movies")),
  },
];
