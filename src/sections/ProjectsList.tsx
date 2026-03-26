import { Link } from 'react-router-dom'

// Temporary stub — will be replaced when Task 8 creates src/projects/index.ts
export interface ProjectMeta {
  slug: string
  name: string
  tag: string
  description: string
  featured: boolean
}

const PROJECT_REGISTRY: ProjectMeta[] = [
  { slug: 'odi', name: 'ODI', tag: 'AI · full-stack', description: 'Open Data Interpreter — natural language queries over public datasets', featured: true },
  { slug: 'footprints', name: 'Footprints', tag: 'GIS · Python', description: 'Biodiversity impact modelling from land use & supply chains', featured: false },
  { slug: 'notoecd', name: 'notoecd', tag: 'Python pkg', description: 'Published pip package for OECD SDMX dataset discovery', featured: false },
  { slug: 'tennis', name: 'Tennis', tag: 'Modelling', description: 'Bradley-Terry & ELO player rating systems', featured: false },
  { slug: 'movies', name: 'Movies', tag: 'Graph theory', description: 'Graph-based recommender over MovieLens data', featured: false },
  { slug: 'other', name: 'Chess · unReel · p5 · Budget', tag: 'Various', description: 'Smaller explorations across chess AI, iOS, generative art, and finance', featured: false },
]

export default function ProjectsList() {
  return (
    <div className="absolute inset-0 p-12 md:p-14 flex flex-col">
      <p className="font-mono text-[8px] tracking-[3px] uppercase text-green-deep mb-4">
        Projects
      </p>
      <div className="flex flex-col flex-1 justify-evenly overflow-hidden">
        {PROJECT_REGISTRY.map(({ slug, name, tag, description, featured }) => (
          <Link
            key={slug}
            to={`/projects/${slug}`}
            className="flex items-baseline gap-4 py-[7px] border-b border-[#ebe6dc] last:border-b-0 group"
          >
            <span
              className={`font-syne font-bold text-[16px] min-w-[100px] tracking-[-0.3px] transition-colors ${
                featured ? 'text-green-deep' : 'text-ink group-hover:text-green-deep'
              }`}
            >
              {name}
            </span>
            <span className="font-mono text-[7px] tracking-[1.5px] uppercase text-green-deep min-w-[90px]">
              {tag}
            </span>
            <span className="font-grotesk font-light text-[10px] text-[#aaa] flex-1 hidden md:block">
              {description}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
