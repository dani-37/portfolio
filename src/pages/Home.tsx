import { useState, useRef, useEffect, Suspense } from 'react'
import TopoBackground from '../components/TopoBackground'
import Card from '../components/Card'
import WipeLine from '../components/WipeLine'
import Hero from '../sections/Hero'
import Timeline from '../sections/Timeline'
import Experience, { ROLES } from '../sections/Experience'
import ProjectsList from '../sections/ProjectsList'
import Contact from '../sections/Contact'
import { useScrollLayout } from '../hooks/useScrollProgress'
import { PROJECT_REGISTRY } from '../projects'

const LABELS = ['TIMELINE', 'EXPERIENCE', 'PROJECTS', 'CONTACT']

type DetailItem =
  | { type: 'experience'; id: string }
  | { type: 'project'; slug: string }
  | null

export default function Home() {
  const cardRef = useRef<HTMLDivElement>(null)
  const clipRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null])
  const wipeLineRef = useRef<HTMLDivElement>(null)
  const wipeLabelRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const [detail, setDetail] = useState<DetailItem>(null)
  const savedScroll = useRef(0)

  // Single rAF loop → direct DOM writes. Zero React re-renders on scroll.
  useScrollLayout({
    cardRef, clipRefs, wipeLineRef, wipeLabelRef, hintRef,
    labels: LABELS,
    enabled: detail === null,
  })

  useEffect(() => {
    document.body.style.overflow = detail ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [detail])

  function openDetail(item: DetailItem) {
    savedScroll.current = window.scrollY
    setDetail(item)
  }

  function handleBack() {
    document.body.style.overflow = ''
    window.scrollTo({ top: savedScroll.current, behavior: 'instant' })
    setDetail(null)
  }

  let overlay: React.ReactNode = null

  if (detail?.type === 'experience') {
    const role = ROLES.find(r => r.name === detail.id)
    if (role) {
      overlay = (
        <div className="absolute inset-0 overflow-y-auto">
          <article className="max-w-2xl mx-auto px-6 pt-8 pb-16 font-grotesk font-light text-ink">
            <p className="font-mono text-[8px] tracking-[3px] uppercase text-[#aaa] mb-2">{role.years}</p>
            <h1 className="font-syne font-bold text-[40px] tracking-[-1.5px] leading-none mb-4">
              {role.name}
            </h1>
            <p className="font-grotesk font-light text-[12px] text-[#999] mb-8">{role.role}</p>
            <div className="space-y-5 text-[15px] leading-relaxed text-[#444]">
              <p>{role.detail}</p>
            </div>
          </article>
        </div>
      )
    }
  }

  if (detail?.type === 'project') {
    const project = PROJECT_REGISTRY.find(p => p.slug === detail.slug)
    if (project) {
      overlay = (
        <div className="absolute inset-0 overflow-y-auto">
          <Suspense fallback={
            <p className="p-10 font-mono text-[9px] text-[#aaa] tracking-[2px]">loading...</p>
          }>
            <project.Component stack={project.stack} />
          </Suspense>
        </div>
      )
    }
  }

  return (
    <>
      {/* Desktop: 500vh scroll space */}
      <div className="hidden md:block" style={{ height: '650vh' }} />

      <TopoBackground />

      {/* Back button — floats above the top-left corner of the card */}
      {detail && (
        <button
          onClick={handleBack}
          className="fixed z-50 font-mono text-[10px] tracking-[3px] uppercase text-green-deep hover:opacity-60 transition-opacity"
          style={{
            top: 'calc(50% - min(80vh, 460px) / 2 - 28px)',
            left: 'calc(50% - min(92vw, 920px) / 2)',
          }}
        >
          ← back
        </button>
      )}

      {/* Desktop: scroll-driven wipe card */}
      <div className="hidden md:block">
        <Card cardRef={cardRef} clipRefs={clipRefs} overlay={overlay}>
          <Hero />
          <Timeline />
          <Experience onSelect={(id) => openDetail({ type: 'experience', id })} />
          <ProjectsList onSelect={(slug) => openDetail({ type: 'project', slug })} />
          <Contact />
        </Card>

        {!detail && <WipeLine wipeLineRef={wipeLineRef} wipeLabelRef={wipeLabelRef} />}

        <div
          ref={hintRef}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 font-mono text-[7px] tracking-[3px] uppercase text-[#6a9a88] pointer-events-none transition-opacity duration-300"
          style={{ opacity: 0.7 }}
        >
          scroll
        </div>
      </div>

      {/* Mobile: snap-scroll inside centered card */}
      <div className="md:hidden fixed inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <div
          className="overflow-hidden shadow-2xl relative pointer-events-auto"
          style={{
            width: 'min(92vw, 920px)',
            height: 'min(80vh, 460px)',
            background: 'rgba(253, 252, 249, 0.91)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            borderLeft: '2px solid #1a6b5a',
          }}
        >
          {detail ? (
            <div className="absolute inset-0 overflow-y-auto" style={{ background: 'rgb(253, 252, 249)' }}>
              {detail.type === 'experience' && (() => {
                const role = ROLES.find(r => r.name === detail.id)
                if (!role) return null
                return (
                  <div className="p-8 pb-10">
                    <p className="font-mono text-[8px] tracking-[3px] uppercase text-[#aaa] mb-2">{role.years}</p>
                    <h2 className="font-display font-bold text-[28px] tracking-[-1px] text-ink leading-none mb-2">{role.name}</h2>
                    <p className="font-grotesk font-light text-[12px] text-[#999] mb-6">{role.role}</p>
                    <p className="font-grotesk font-light text-[14px] text-ink leading-relaxed">{role.detail}</p>
                  </div>
                )
              })()}
              {detail.type === 'project' && (() => {
                const project = PROJECT_REGISTRY.find(p => p.slug === detail.slug)
                if (!project) return null
                return (
                  <Suspense fallback={<p className="p-8 font-mono text-[9px] text-[#aaa] tracking-[2px]">loading...</p>}>
                    <project.Component stack={project.stack} />
                  </Suspense>
                )
              })()}
            </div>
          ) : (
            <div className="h-full overflow-y-auto snap-y snap-mandatory">
              {[
                <Hero key="hero" />,
                <Timeline key="timeline" />,
                <Experience key="exp" onSelect={(id) => openDetail({ type: 'experience', id })} />,
                <ProjectsList key="proj" onSelect={(slug) => openDetail({ type: 'project', slug })} />,
                <Contact key="contact" />,
              ].map((section, i) => (
                <div key={i} className="snap-start relative shrink-0" style={{ height: 'min(80vh, 460px)' }}>
                  <div className="absolute inset-0">{section}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
