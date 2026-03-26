import { useRef } from 'react'
import TopoBackground from '../components/TopoBackground'
import Card from '../components/Card'
import WipeLine from '../components/WipeLine'
import Hero from '../sections/Hero'
import Experience from '../sections/Experience'
import ProjectsList from '../sections/ProjectsList'
import Contact from '../sections/Contact'
import { useScrollProgress, useCardRect, sectionProgress } from '../hooks/useScrollProgress'

const LABELS: [string, string, string] = ['EXPERIENCE', 'PROJECTS', 'CONTACT']

export default function Home() {
  const cardRef = useRef<HTMLDivElement>(null)
  const scrollProgress = useScrollProgress()
  const { topVh, heightVh } = useCardRect(cardRef)

  const progresses: [number, number, number] = [
    sectionProgress(scrollProgress, 0, 3),
    sectionProgress(scrollProgress, 1, 3),
    sectionProgress(scrollProgress, 2, 3),
  ]

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
      >
        <Hero />
        <Experience />
        <ProjectsList />
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
