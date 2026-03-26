import { Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PROJECT_REGISTRY } from '../projects'
import TopoBackground from '../components/TopoBackground'

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = PROJECT_REGISTRY.find(p => p.slug === slug)

  return (
    <div className="min-h-screen bg-bg">
      <TopoBackground />

      {/* Back link */}
      <Link
        to="/"
        className="fixed top-6 left-6 z-20 font-mono text-[8px] tracking-[3px] uppercase text-green-deep hover:opacity-70 transition-opacity"
      >
        ← Back
      </Link>

      {/* Content card */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-24 px-6">
        <div
          className="w-full max-w-2xl shadow-2xl"
          style={{
            background: 'rgba(253, 252, 249, 0.93)',
            backdropFilter: 'blur(6px)',
            borderLeft: '2px solid #1a6b5a',
          }}
        >
          {project ? (
            <Suspense fallback={
              <div className="p-16 font-mono text-[10px] text-[#aaa] tracking-[2px]">
                Loading...
              </div>
            }>
              <project.Component />
            </Suspense>
          ) : (
            <div className="p-16">
              <p className="font-mono text-[8px] tracking-[3px] uppercase text-[#aaa] mb-4">
                404
              </p>
              <h1 className="font-syne font-bold text-[32px] tracking-[-1px] text-ink">
                Project not found.
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
