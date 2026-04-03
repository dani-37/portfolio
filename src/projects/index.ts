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
    stack: ["Docker", "AWS", "Postgres", "Python", "TypeScript"],
    Component: lazy(() => import("./ODI")),
  },
  {
    slug: "footprints",
    name: "Footprints",
    tag: "Sustainability",
    description: "Biodiversity impact modelling from land use & supply chains",
    stack: ["Python", "GIS", "TypeScript", "Postgres", "AWS"],
    Component: lazy(() => import("./Footprints")),
  },
  {
    slug: "biases",
    name: "Biases",
    tag: "AI ethics",
    description:
      "Gender bias quantification in LLMs using variational autoencoders",
    stack: ["Python", "AI ethics", "SVAE", "NLP"],
    Component: lazy(() => import("./Biases")),
  },
  {
    slug: "uncertainty",
    name: "Uncertainty",
    tag: "Modelling",
    description: "Forest growth uncertainty under climate change scenarios",
    stack: ["Python", "PyTorch"],
    Component: lazy(() => import("./Uncertainty")),
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
