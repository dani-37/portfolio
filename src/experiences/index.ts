import { type ComponentType, lazy } from "react";

export interface ExperienceMeta {
  name: string;
  title: string;
  description: string;
  years: string;
  Component: ComponentType;
}

export const EXPERIENCE_REGISTRY: ExperienceMeta[] = [
  {
    name: "OECD",
    title: "Consultant",
    description: "regional policy data analysis",
    years: "2025 – now",
    Component: lazy(() => import("./OECD")),
  },
  {
    name: "Klere",
    title: "Analyst",
    description: "nature data science",
    years: "2023 – 26",
    Component: lazy(() => import("./Klere")),
  },
  {
    name: "Toolip",
    title: "Co-Founder",
    description: "non-profit software",
    years: "2020 – 22",
    Component: lazy(() => import("./Toolip")),
  },
  {
    name: "Graphext",
    title: "Data Science Stories",
    description: "data visualisation",
    years: "2020",
    Component: lazy(() => import("./Graphext")),
  },
];
