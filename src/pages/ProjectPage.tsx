import { Suspense, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PROJECT_REGISTRY } from '../projects'
import TopoBackground from '../components/TopoBackground'
import ThemeToggle from '../components/ThemeToggle'

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = PROJECT_REGISTRY.find(p => p.slug === slug)

  useEffect(() => {
    const prevTitle = document.title
    const metaDesc = document.querySelector('meta[name="description"]')
    const prevDesc = metaDesc?.getAttribute('content') ?? ''

    if (project) {
      document.title = `${project.name} — ${project.tag} | Daniel Vegara`
      if (metaDesc) metaDesc.setAttribute('content', project.description)
    } else {
      document.title = 'Project Not Found | Daniel Vegara'
    }

    return () => {
      document.title = prevTitle
      if (metaDesc) metaDesc.setAttribute('content', prevDesc)
    }
  }, [project])

  return (
    <main className="min-h-screen bg-bg">
      <ThemeToggle />
      <TopoBackground />

      {/* Back link */}
      <Link
        to="/"
        className="fixed top-6 left-6 z-20 font-mono text-label tracking-wide uppercase text-green-deep hover:opacity-70 transition-opacity"
      >
        ← Back
      </Link>

      {/* Content card */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-24 px-6">
        <div
          className="w-full max-w-2xl"
          style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-green-deep)',
          }}
        >
          {project ? (
            <>
            <h2 className="sr-only">{project.name}</h2>
            <Suspense fallback={
              <div className="p-16 font-mono text-label text-gray-muted tracking-wide">
                Loading...
              </div>
            }>
              <project.Component />
            </Suspense>
            </>
          ) : (
            <div className="p-16">
              <p className="font-mono text-label tracking-wide uppercase text-gray-muted mb-4">
                404
              </p>
              <h2 className="font-display font-bold text-title tracking-tight text-ink">
                Project not found.
              </h2>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
