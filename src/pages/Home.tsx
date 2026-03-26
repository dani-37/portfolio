import { useState, useRef, useEffect, Suspense } from 'react'
import TopoBackground from '../components/TopoBackground'
import Card from '../components/Card'
import WipeLine from '../components/WipeLine'
import Hero from '../sections/Hero'
import Experience, { ROLES } from '../sections/Experience'
import ProjectsList from '../sections/ProjectsList'
import Contact from '../sections/Contact'
import { useScrollProgress, useCardRect, sectionProgress } from '../hooks/useScrollProgress'
import { PROJECT_REGISTRY } from '../projects'

const LABELS: [string, string, string] = ['EXPERIENCE', 'PROJECTS', 'CONTACT']

type DetailItem =
  | { type: 'experience'; id: string }
  | { type: 'project'; slug: string }
  | null

export default function Home() {
  const cardRef = useRef<HTMLDivElement>(null)
  const scrollProgress = useScrollProgress()
  const { topVh, heightVh } = useCardRect(cardRef)
  const [detail, setDetail] = useState<DetailItem>(null)

  // Lock page scroll while detail is open
  useEffect(() => {
    document.body.style.overflow = detail ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [detail])

  function handleBack() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight
    document.body.style.overflow = ''
    if (detail?.type === 'experience') {
      window.scrollTo({ top: scrollable * 0.2, behavior: 'instant' })
    } else if (detail?.type === 'project') {
      window.scrollTo({ top: scrollable * 0.55, behavior: 'instant' })
    }
    setDetail(null)
  }

  const progresses: [number, number, number] = [
    sectionProgress(scrollProgress, 0, 3),
    sectionProgress(scrollProgress, 1, 3),
    sectionProgress(scrollProgress, 2, 3),
  ]

  let overlay: React.ReactNode = null

  if (detail?.type === 'experience') {
    const role = ROLES.find(r => r.name === detail.id)
    if (role) {
      overlay = (
        <div className="absolute inset-0 overflow-y-auto p-10 md:p-12">
          <button
            onClick={handleBack}
            className="font-mono text-[10px] tracking-[3px] uppercase text-green-deep hover:opacity-60 transition-opacity mb-8 block"
          >
            ← back
          </button>
          <p className="font-mono text-[8px] tracking-[3px] uppercase text-[#aaa] mb-2">{role.years}</p>
          <h2 className="font-display font-bold text-[clamp(28px,4vw,40px)] tracking-[-1px] text-ink leading-none mb-2">
            {role.name}
          </h2>
          <p className="font-grotesk font-light text-[12px] text-[#999] mb-8">{role.role}</p>
          <p className="font-grotesk font-light text-[14px] text-ink leading-relaxed">{role.detail}</p>
        </div>
      )
    }
  }

  if (detail?.type === 'project') {
    const project = PROJECT_REGISTRY.find(p => p.slug === detail.slug)
    if (project) {
      overlay = (
        <div className="absolute inset-0 overflow-y-auto">
          <div className="px-10 pt-10 md:px-12 md:pt-12 pb-4">
            <button
              onClick={handleBack}
              className="font-mono text-[10px] tracking-[3px] uppercase text-green-deep hover:opacity-60 transition-opacity block"
            >
              ← back
            </button>
          </div>
          <Suspense fallback={
            <p className="px-12 font-mono text-[9px] text-[#aaa] tracking-[2px]">loading...</p>
          }>
            <project.Component />
          </Suspense>
        </div>
      )
    }
  }

  return (
    <>
      {/* 500vh scroll space */}
      <div style={{ height: '500vh' }} />

      <TopoBackground />

      <Card
        scrollProgress={scrollProgress}
        cardRef={cardRef}
        cardTopVh={topVh}
        cardHeightVh={heightVh}
        overlay={overlay}
      >
        <Hero />
        <Experience onSelect={(id) => setDetail({ type: 'experience', id })} />
        <ProjectsList onSelect={(slug) => setDetail({ type: 'project', slug })} />
        <Contact />
      </Card>

      <WipeLine sectionProgresses={progresses} sectionLabels={LABELS} />

      {/* Scroll hint */}
      <div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 font-mono text-[7px] tracking-[3px] uppercase text-[#6a9a88] pointer-events-none transition-opacity duration-300"
        style={{ opacity: scrollProgress > 0.04 ? 0 : 0.7 }}
      >
        scroll
      </div>
    </>
  )
}
