import { type ComponentType, lazy } from 'react'

export interface ProjectMeta {
  slug: string
  name: string
  tag: string
  description: string
  featured: boolean
  Component: ComponentType
}

export const PROJECT_REGISTRY: ProjectMeta[] = [
  {
    slug: 'odi',
    name: 'ODI',
    tag: 'AI · full-stack',
    description: 'Open Data Interpreter — natural language queries over public datasets',
    featured: true,
    Component: lazy(() => import('./ODI')),
  },
  {
    slug: 'footprints',
    name: 'Footprints',
    tag: 'GIS · Python',
    description: 'Biodiversity impact modelling from land use & supply chains',
    featured: false,
    Component: lazy(() => import('./Footprints')),
  },
  {
    slug: 'notoecd',
    name: 'notoecd',
    tag: 'Python pkg',
    description: 'Published pip package for OECD SDMX dataset discovery',
    featured: false,
    Component: lazy(() => import('./Notoecd')),
  },
  {
    slug: 'tennis',
    name: 'Tennis',
    tag: 'Modelling',
    description: 'Bradley-Terry & ELO player rating systems',
    featured: false,
    Component: lazy(() => import('./Tennis')),
  },
  {
    slug: 'movies',
    name: 'Movies',
    tag: 'Graph theory',
    description: 'Graph-based recommender over MovieLens data',
    featured: false,
    Component: lazy(() => import('./Movies')),
  },
  {
    slug: 'other',
    name: 'Chess · unReel · p5 · Budget',
    tag: 'Various',
    description: 'Smaller explorations across chess AI, iOS, generative art, and finance',
    featured: false,
    Component: lazy(() => import('./Other')),
  },
]
