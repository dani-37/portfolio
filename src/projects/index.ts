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
    tag: "AI · full-stack",
    description:
      "Open Data Interpreter — natural language queries over public datasets",
    stack: ["Claude", "Docker", "AWS", "Postgres", "Python"],
    Component: lazy(() => import("./ODI")),
  },
  {
    slug: "footprints",
    name: "Footprints",
    tag: "GIS · Python",
    description: "Biodiversity impact modelling from land use & supply chains",
    stack: ["Python", "GeoPandas", "PostGIS"],
    Component: lazy(() => import("./Footprints")),
  },
  {
    slug: "uncertainty",
    name: "Uncertainty",
    tag: "ML · Research",
    description: "Modelling forest growth uncertainty under climate change",
    stack: ["Python", "PyTorch"],
    Component: lazy(() => import("./Chess")),
  },
  {
    slug: "movies",
    name: "Movies",
    tag: "Graph theory",
    description: "Graph-based recommender over MovieLens data",
    stack: ["Python", "NetworkX"],
    Component: lazy(() => import("./Movies")),
  },
  {
    slug: "tennis",
    name: "Tennis",
    tag: "Modelling",
    description: "Bradley-Terry & ELO player rating systems",
    stack: ["R", "Stan"],
    Component: lazy(() => import("./Tennis")),
  },
  {
    slug: "notoecd",
    name: "notoecd",
    tag: "Python pkg",
    description: "Published pip package for OECD SDMX dataset discovery",
    stack: ["Python", "PyPI"],
    Component: lazy(() => import("./Notoecd")),
  },
];
