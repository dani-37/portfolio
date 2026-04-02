import { useRef, useEffect, Suspense, useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import TopoBackground from "../components/TopoBackground";
import Card from "../components/Card";
import WipeLine from "../components/WipeLine";
import Hero from "../sections/Hero";
import Experience from "../sections/Experience";
import { EXPERIENCE_REGISTRY } from "../experiences";
import ProjectsList from "../sections/ProjectsList";
import Contact from "../sections/Contact";
import Timeline from "../sections/Timeline";
import { useScrollLayout } from "../hooks/useScrollProgress";
import { PROJECT_REGISTRY } from "../projects";
import ThemeToggle from "../components/ThemeToggle";
import ErrorBoundary from "../components/ErrorBoundary";

const LABELS = ["TIMELINE", "PROJECTS", "CONTACT"];

function MobileScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth >= 1024) return;
    let raf = 0;
    function onScroll() {
      if (!raf) raf = requestAnimationFrame(tick);
    }
    function tick() {
      raf = 0;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    tick();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="lg:hidden fixed top-0 left-0 right-0 h-[2px] z-50 origin-left"
      style={{
        background: "var(--color-green-deep)",
        transform: "scaleX(0)",
      }}
    />
  );
}

type DetailItem =
  | { type: "experience"; id: string }
  | { type: "project"; slug: string }
  | null;

type IntroPhase = "sphere" | "reveal" | "done";

export default function Home() {
  const cardRef = useRef<HTMLDivElement>(null);
  const clipRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const wipeLineRef = useRef<HTMLDivElement>(null);
  const wipeLabelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const savedSection = useRef(-1);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const mobileSectionRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const overlayScrollRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  // Mobile intro animation
  const [introPhase, setIntroPhase] = useState<IntroPhase>(() => {
    if (typeof window === "undefined" || window.innerWidth >= 768) return "done";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "done";
    return "sphere";
  });
  // Track if intro actually ran (vs skipped for desktop/reduced-motion)
  const introRan = useRef(introPhase !== "done");
  // Track if user has navigated away from sections (disables intro animations on return)
  const hasNavigated = useRef(false);


  const handleSphereDrawn = useCallback(() => {
    setIntroPhase("reveal");
    setTimeout(() => setIntroPhase("done"), 950);
  }, []);

  const detail: DetailItem = useMemo(() => {
    const exp = searchParams.get("experience");
    if (exp) return { type: "experience", id: exp };
    const proj = searchParams.get("project");
    if (proj) return { type: "project", slug: proj };
    return null;
  }, [searchParams]);

  // Single rAF loop → direct DOM writes. Zero React re-renders on scroll.
  useScrollLayout({
    cardRef,
    clipRefs,
    wipeLineRef,
    wipeLabelRef,
    navRef,
    scrollHintRef,
    labels: LABELS,
    enabled: detail === null,
  });

  useEffect(() => {
    document.body.style.overflow = detail ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [detail]);

  // Escape key closes detail overlay
  useEffect(() => {
    if (!detail) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleBack();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [detail]);

  // Forward wheel events to overlay scroll container when detail is open (desktop only)
  useEffect(() => {
    if (!detail || window.innerWidth < 1024) return;
    function onWheel(e: WheelEvent) {
      const el = overlayScrollRef.current;
      if (!el) return;
      el.scrollTop += e.deltaY;
      e.preventDefault();
    }
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [detail]);

  const scrollToSection = useCallback((sectionIndex: number, smooth = true) => {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const numClips = clipRefs.current ? clipRefs.current.length : 4;
    const target = (sectionIndex + 1) / numClips;
    window.scrollTo({
      top: target * scrollable,
      behavior: smooth ? "smooth" : "instant",
    });
  }, []);

  // Arrow key navigation between sections (desktop only)
  useEffect(() => {
    if (detail) return;
    if (typeof window === "undefined" || window.innerWidth < 1024) return;

    const numClips = clipRefs.current ? clipRefs.current.length : 3;
    const numSections = numClips + 1; // Hero + clip sections

    function getCurrentSection() {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return 0;
      const scrollP = window.scrollY / scrollable;
      // Section 0 = Hero (scrollP 0 to 1/numClips), etc.
      return Math.min(numSections - 1, Math.floor(scrollP * numClips + 0.5));
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      e.preventDefault();
      const current = getCurrentSection();
      const next = e.key === "ArrowDown" ? current + 1 : current - 1;
      if (next < 0 || next >= numSections) return;
      if (next === 0) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        scrollToSection(next - 1);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [detail, scrollToSection]);

  function openDetail(item: DetailItem, sectionIndex: number) {
    savedSection.current = sectionIndex;
    hasNavigated.current = true;
    if (item?.type === "experience") {
      setSearchParams({ experience: item.id }, { replace: false });
    } else if (item?.type === "project") {
      setSearchParams({ project: item.slug }, { replace: false });
    }
  }

  function handleBack() {
    document.body.style.overflow = "";
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop) {
      const idx = savedSection.current;
      setSearchParams({});
      if (idx === 0) {
        window.scrollTo({ top: 0, behavior: "instant" });
      } else if (idx > 0) {
        scrollToSection(idx - 1, false);
      }
    } else {
      history.back();
    }
  }

  let overlay: React.ReactNode = null;

  // Compute prev/next for detail navigation
  let prevDetail: DetailItem = null;
  let nextDetail: DetailItem = null;
  let prevLabel = "";
  let nextLabel = "";

  if (detail?.type === "experience") {
    const idx = EXPERIENCE_REGISTRY.findIndex((r) => r.name === detail.id);
    if (idx < EXPERIENCE_REGISTRY.length - 1) {
      prevDetail = {
        type: "experience",
        id: EXPERIENCE_REGISTRY[idx + 1].name,
      };
      prevLabel = EXPERIENCE_REGISTRY[idx + 1].name;
    }
    if (idx > 0) {
      nextDetail = {
        type: "experience",
        id: EXPERIENCE_REGISTRY[idx - 1].name,
      };
      nextLabel = EXPERIENCE_REGISTRY[idx - 1].name;
    }
  }
  if (detail?.type === "project") {
    const idx = PROJECT_REGISTRY.findIndex((p) => p.slug === detail.slug);
    if (idx < PROJECT_REGISTRY.length - 1) {
      prevDetail = { type: "project", slug: PROJECT_REGISTRY[idx + 1].slug };
      prevLabel = PROJECT_REGISTRY[idx + 1].name;
    }
    if (idx > 0) {
      nextDetail = { type: "project", slug: PROJECT_REGISTRY[idx - 1].slug };
      nextLabel = PROJECT_REGISTRY[idx - 1].name;
    }
  }

  function navigateDetail(item: DetailItem) {
    if (!item) return;
    if (item.type === "experience") {
      setSearchParams({ experience: item.id });
    } else if (item.type === "project") {
      setSearchParams({ project: item.slug });
    }
  }

  if (detail?.type === "experience") {
    const role = EXPERIENCE_REGISTRY.find((r) => r.name === detail.id);
    if (role) {
      overlay = (
        <div className="absolute inset-0">
          <span
            className="btn-brutalist-wrap hidden lg:inline-block absolute top-10 z-10"
            style={{ left: "calc((100% - 672px) / 4)", transform: "translateX(-50%)" }}>
            <button
              onClick={handleBack}
              className="btn-brutalist block font-grotesk text-caption text-green-deep border border-green-deep px-3 py-0.5 bg-card cursor-pointer">
              ← back
            </button>
          </span>
          <div ref={overlayScrollRef} className="absolute inset-0 overflow-y-auto">
          <article className="max-w-2xl mx-auto px-6 pt-10 pb-16 font-grotesk font-light text-ink">
            <h2 className="sr-only">{role.name} — Experience</h2>
            <p className="font-display font-bold text-title tracking-tight leading-none mb-2" aria-hidden="true">
              {role.name}
            </p>
            <p className="font-grotesk font-light text-caption text-gray-muted mb-1">
              {role.title} · {role.description}
            </p>
            <p className="font-mono text-label tracking-wide uppercase text-gray-muted mb-8">
              {role.years}
            </p>
            <div className="space-y-5 text-body leading-relaxed text-gray-strong">
              <ErrorBoundary>
              <Suspense fallback={
                <p className="font-mono text-label text-gray-muted tracking-wide">loading...</p>
              }>
                <role.Component />
              </Suspense>
              </ErrorBoundary>
            </div>
          </article>
          </div>
        </div>
      );
    }
  }

  if (detail?.type === "project") {
    const project = PROJECT_REGISTRY.find((p) => p.slug === detail.slug);
    if (project) {
      overlay = (
        <div className="absolute inset-0">
          <span
            className="btn-brutalist-wrap hidden lg:inline-block absolute top-10 z-10"
            style={{ left: "calc((100% - 672px) / 4)", transform: "translateX(-50%)" }}>
            <button
              onClick={handleBack}
              className="btn-brutalist block font-grotesk text-caption text-green-deep border border-green-deep px-3 py-0.5 bg-card cursor-pointer">
              ← back
            </button>
          </span>
          <div ref={overlayScrollRef} className="absolute inset-0 overflow-y-auto">
          <h2 className="sr-only">{project.name} — Project</h2>
          <ErrorBoundary>
          <Suspense
            fallback={
              <p className="max-w-2xl mx-auto px-6 pt-8 font-mono text-label text-gray-muted tracking-wide">
                loading...
              </p>
            }>
            <project.Component stack={project.stack} />
          </Suspense>
          </ErrorBoundary>
          </div>
        </div>
      );
    }
  }

  return (
    <>
      <ThemeToggle />
      {/* Desktop: scroll space (150vh per clip section) */}
      <div className="hidden lg:block" style={{ height: "450vh" }} />

      <TopoBackground />
      <main id="main-content">

      {/* Prev/next arrows — below the card */}
      {detail && (
        <div
          className="fixed z-20 hidden lg:flex justify-between pointer-events-none"
          style={{
            top: "calc(50% + min(80vh, 530px) / 2 + 14px)",
            left: "calc(50% - min(92vw, 1058px) / 2)",
            width: "min(92vw, 1058px)",
          }}>
          {prevDetail ? (
            <span className="btn-brutalist-wrap pointer-events-auto">
              <button
                onClick={() => navigateDetail(prevDetail)}
                className="btn-brutalist block font-grotesk text-caption text-green-deep border border-green-deep px-3 py-0.5 bg-card cursor-pointer">
                ← {prevLabel}
              </button>
            </span>
          ) : (
            <span />
          )}
          {nextDetail ? (
            <span className="btn-brutalist-wrap pointer-events-auto">
              <button
                onClick={() => navigateDetail(nextDetail)}
                className="btn-brutalist block font-grotesk text-caption text-green-deep border border-green-deep px-3 py-0.5 bg-card cursor-pointer">
                {nextLabel} →
              </button>
            </span>
          ) : (
            <span />
          )}
        </div>
      )}

      {/* Desktop: scroll-driven wipe card */}
      <div className="hidden lg:block">
        <Card cardRef={cardRef} clipRefs={clipRefs} overlay={overlay}>
          <Hero />
          <Timeline
            onSelect={(id) => openDetail({ type: "experience", id }, 1)}
          />
          <ProjectsList
            onSelect={(slug) => openDetail({ type: "project", slug }, 2)}
          />
          <Contact />
        </Card>

        {/* Scroll hint — below card, wiped away by the line */}
        <div
          ref={scrollHintRef}
          className="fixed z-0 flex flex-col items-center animate-hero-in [animation-delay:1000ms] group cursor-default"
          style={{
            top: "calc((50% + min(80vh, 530px) / 2 + 100vh) / 2 - 10px)",
            left: "calc(50% - min(92vw, 1058px) / 2)",
            width: "min(92vw, 1058px)",
          }}>
          <span className="font-mono font-light text-caption tracking-wide text-green-mid">
            <span className="group-hover:hidden">scroll to see more</span>
            <span className="hidden group-hover:inline">don't click — just scroll!</span>
          </span>
          <svg
            width="16"
            height="10"
            viewBox="0 0 16 10"
            fill="none"
            stroke="var(--color-green-mid)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-2 animate-chevron-pulse"
            aria-hidden="true">
            <path d="M1 1l7 7 7-7" />
          </svg>
        </div>

        {!detail && (
          <>
            <WipeLine wipeLineRef={wipeLineRef} wipeLabelRef={wipeLabelRef} />
            <nav
              ref={navRef}
              aria-label="Page navigation"
              className="fixed z-20 flex flex-col items-end animate-hero-in [animation-delay:1000ms]"
              style={{
                top: "50%",
                right: "20px",
                transform: "translateY(-50%)",
              }}>
              {["Home", "Timeline", "Projects", "Contact"].map((label, i) => (
                <button
                  key={i}
                  aria-label={`Navigate to ${label}`}
                  className="flex items-center gap-2 cursor-pointer group bg-transparent border-none px-1 py-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-deep focus-visible:outline-offset-2 rounded-sm"
                  onClick={() => {
                    if (i === 0) {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    } else {
                      scrollToSection(i - 1);
                    }
                  }}>
                  <span className="nav-label font-mono text-label tracking-wide uppercase text-gray opacity-0 transition-opacity duration-300 pointer-events-none select-none">
                    {label}
                  </span>
                  <div
                    style={{
                      width: i === 0 ? "40px" : "28px",
                      height: "1.5px",
                      background: i === 0 ? "var(--color-green-deep)" : "var(--color-green-muted)",
                      transition:
                        "width 0.5s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                </button>
              ))}
            </nav>
          </>
        )}
      </div>

      {/* Mobile: scroll progress bar */}
      <MobileScrollProgress />

      {/* Mobile: separate cards with native page scroll */}
      <div
        className="lg:hidden relative z-10 flex flex-col items-center px-3"
        style={{
          paddingTop: "max(6vh, 24px)",
          paddingBottom: "max(6vh, 24px)",
          gap: "max(4vh, 16px)",
        }}>
        {detail ? (
          <div className="w-full flex flex-col gap-3" style={{ maxWidth: "min(calc(100vw - 24px), calc(60vw + 150px), 1058px)" }}>
            {/* Back button — outside card, on topo background */}
            <div>
              <span className="btn-brutalist-wrap">
                <button
                  onClick={handleBack}
                  className="btn-brutalist flex items-center min-h-[44px] min-w-[80px] font-grotesk text-caption text-green-deep border border-green-deep px-4 py-1.5 bg-card cursor-pointer">
                  ← back
                </button>
              </span>
            </div>

            {/* Card with scrollable content */}
            <div
              ref={mobileScrollRef}
              className="overflow-y-auto overscroll-contain touch-pan-y"
              style={{
                maxHeight: "calc(100vh - 200px)",
                WebkitOverflowScrolling: "touch",
                background: "var(--color-card)",
                border: "1px solid var(--color-green-deep)",
              }}>
            {detail.type === "experience" &&
              (() => {
                const role = EXPERIENCE_REGISTRY.find(
                  (r) => r.name === detail.id,
                );
                if (!role) return null;
                return (
                  <div className="p-8 pt-6 pb-10">
                    <h2 className="font-display font-bold text-heading tracking-tight text-ink leading-none mb-2">
                      {role.name}
                    </h2>
                    <p className="font-grotesk font-light text-caption text-gray-muted mb-2">
                      {role.title} · {role.description}
                    </p>
                    <p className="font-mono text-label tracking-wide uppercase text-gray-muted mb-6">
                      {role.years}
                    </p>
                    <div className="space-y-4 font-grotesk font-light text-body text-ink leading-relaxed [&_img]:max-w-[45%] [&_img]:float-right [&_img]:ml-3">
                      <ErrorBoundary>
                      <Suspense fallback={
                        <p className="font-mono text-label text-gray-muted tracking-wide">loading...</p>
                      }>
                        <role.Component />
                      </Suspense>
                      </ErrorBoundary>
                    </div>
                  </div>
                );
              })()}
            {detail.type === "project" &&
              (() => {
                const project = PROJECT_REGISTRY.find(
                  (p) => p.slug === detail.slug,
                );
                if (!project) return null;
                return (
                  <div className="pt-2 [&_article]:pt-4 [&_article]:pb-6 [&_img]:max-w-[45%] [&_img]:float-right [&_img]:ml-3">
                    <ErrorBoundary>
                    <Suspense
                      fallback={
                        <p className="p-8 font-mono text-label text-gray-muted tracking-wide">
                          loading...
                        </p>
                      }>
                      <project.Component stack={project.stack} />
                    </Suspense>
                    </ErrorBoundary>
                  </div>
                );
              })()}
            </div>

            {/* Prev/next navigation — outside card, on topo background */}
            <div className="flex justify-between items-center">
              {prevDetail ? (
                <span className="btn-brutalist-wrap">
                  <button
                    onClick={() => navigateDetail(prevDetail)}
                    className="btn-brutalist flex items-center min-h-[44px] font-grotesk text-caption text-green-deep border border-green-deep px-3 py-1 bg-card cursor-pointer">
                    ← {prevLabel}
                  </button>
                </span>
              ) : (
                <span />
              )}
              {nextDetail ? (
                <span className="btn-brutalist-wrap">
                  <button
                    onClick={() => navigateDetail(nextDetail)}
                    className="btn-brutalist flex items-center min-h-[44px] font-grotesk text-caption text-green-deep border border-green-deep px-3 py-1 bg-card cursor-pointer">
                    {nextLabel} →
                  </button>
                </span>
              ) : (
                <span />
              )}
            </div>
          </div>
        ) : (
          <>
            {[
              <Hero key="hero" mobile introPhase={introPhase} onSphereDrawn={handleSphereDrawn} />,
              <Timeline
                key="timeline"
                mobile
                introReady={introPhase === "done"}
                onSelect={(id) => openDetail({ type: "experience", id }, 1)}
              />,
              <ProjectsList
                key="proj"
                mobile
                onSelect={(slug) => openDetail({ type: "project", slug }, 2)}
              />,
              <Contact key="contact" mobile />,
            ].map((section, i) => {
              const hidden = introPhase === "sphere";
              // If intro ran, the pseudo handles bg/shadow permanently (no handoff flash)
              // After navigating to a detail and back, skip all intro animations
              const usesPseudo = introRan.current && !hidden && !hasNavigated.current;
              return (
                <div
                  key={i}
                  ref={(el) => { mobileSectionRefs.current[i] = el; }}
                  className={`w-full overflow-hidden relative ${
                    usesPseudo ? "card-intro-reveal" : ""
                  }`}
                  style={{
                    maxWidth: "min(calc(100vw - 24px), calc(60vw + 150px), 1058px)",
                    background: usesPseudo || hidden
                      ? "transparent"
                      : "var(--color-card)",
                    border: usesPseudo || hidden ? "1px solid transparent" : "1px solid var(--color-green-deep)",
                    // Non-hero cards invisible during sphere phase
                    ...(i > 0 && hidden ? { opacity: 0 } : {}),
                  }}>
                  {section}
                </div>
              );
            })}
          </>
        )}
      </div>

      </main>
    </>
  );
}
