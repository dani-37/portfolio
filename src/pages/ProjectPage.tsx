import { Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { PROJECT_REGISTRY } from '../projects'
import TopoBackground from '../components/TopoBackground'
import ThemeToggle from '../components/ThemeToggle'

const BASE_URL = 'https://daniel.vegarabalsa.com'

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = PROJECT_REGISTRY.find(p => p.slug === slug)

  const title = project
    ? `${project.name} — ${project.tag} | Daniel Vegara`
    : 'Project Not Found | Daniel Vegara'
  const description = project?.description ?? ''
  const url = `${BASE_URL}/projects/${slug}`
  const ogImage = `${BASE_URL}/og/${slug}.png`

  return (
    <main className="min-h-screen bg-bg">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
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
            <h1 className="sr-only">{project.name}</h1>
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
