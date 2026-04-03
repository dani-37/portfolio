import { useEffect, useRef } from "react";

export function sectionProgress(
  scrollP: number,
  sectionIndex: number,
  numSections: number,
): number {
  const phase = 1 / numSections;
  const start = sectionIndex * phase;
  return Math.max(0, Math.min(1, (scrollP - start) * numSections));
}

export function lineTopVh(progress: number): number {
  return 100 - progress * 100;
}

export function cardClipPercent(
  progress: number,
  cardTopVh: number,
  cardHeightVh: number,
): number {
  const lineVh = lineTopVh(progress);
  const cardBottomVh = cardTopVh + cardHeightVh;
  const wipeProgress = (cardBottomVh - lineVh) / cardHeightVh;
  const clamped = Math.max(0, Math.min(1, wipeProgress));
  return Math.max(0, 100 - clamped * 100);
}

/**
 * Drives all scroll animations via direct DOM writes — zero React re-renders.
 * Card clip-paths, wipe line, and scroll hint are all updated through refs.
 */
export function useScrollLayout(opts: {
  cardRef: React.RefObject<HTMLElement | null>;
  clipRefs: React.RefObject<(HTMLDivElement | null)[]>;
  wipeLineRef: React.RefObject<HTMLDivElement | null>;
  wipeLabelRef: React.RefObject<HTMLDivElement | null>;
  navRef: React.RefObject<HTMLDivElement | null>;
  scrollHintRef?: React.RefObject<HTMLDivElement | null>;
  labels: string[];
  enabled: boolean;
}) {
  const {
    cardRef,
    clipRefs,
    wipeLineRef,
    wipeLabelRef,
    navRef,
    scrollHintRef,
    labels,
    enabled,
  } = opts;
  // Cache card rect — only changes on resize, not scroll
  const cardRect = useRef({ topVh: 12, heightVh: 55 });
  const hintHidden = useRef(false);

  useEffect(() => {
    if (!enabled || typeof window === "undefined" || window.innerWidth < 1024)
      return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let labelsfit = false;
    function updateRect() {
      const el = cardRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      cardRect.current = {
        topVh: (r.top / window.innerHeight) * 100,
        heightVh: (r.height / window.innerHeight) * 100,
      };
      // Check if nav labels fit between card right edge and the nav bar.
      // Card is min(92vw, 1058px) wide, centred. Nav bar at right:20px, ~40px wide.
      // Labels (e.g. "TIMELINE") need ~100px + 8px gap to the bar.
      const vw = window.innerWidth;
      const cardW = Math.min(vw * 0.92, 1058);
      const cardRight = (vw + cardW) / 2;
      const navBarLeft = vw - 60;
      labelsfit = navBarLeft - cardRight > 108;
    }
    updateRect();
    window.addEventListener("resize", updateRect);

    let rafId = 0;
    let lastNavSection = 0;
    function onScroll() {
      if (!rafId) rafId = requestAnimationFrame(tick);
    }

    function tick() {
      rafId = 0;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollP = scrollable > 0 ? window.scrollY / scrollable : 0;
      const { topVh, heightVh } = cardRect.current;
      const clips = clipRefs.current;
      const numClips = clips ? clips.length : 0;

      // Update clip-paths (snap instantly when reduced motion is preferred)
      if (clips) {
        for (let i = 0; i < numClips; i++) {
          const el = clips[i];
          if (!el) continue;
          const p = sectionProgress(scrollP, i, numClips);
          if (prefersReduced) {
            el.style.clipPath =
              p > 0.5 ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)";
          } else {
            const clip = cardClipPercent(p, topVh, heightVh);
            el.style.clipPath = `inset(${clip.toFixed(1)}% 0 0 0)`;
          }
        }
      }

      // Wipe line + label (hidden when reduced motion)
      let activeIdx = -1,
        activeP = 0;
      for (let i = 0; i < numClips; i++) {
        const p = sectionProgress(scrollP, i, numClips);
        if (p > 0 && p < 1) {
          activeIdx = i;
          activeP = p;
          break;
        }
      }
      const wipeTop = lineTopVh(activeP);
      const isActive = activeIdx !== -1 && !prefersReduced;

      const line = wipeLineRef.current;
      if (line) {
        line.style.top = `${wipeTop}vh`;
        line.style.opacity = isActive ? "0.4" : "0";
      }
      const label = wipeLabelRef.current;
      if (label) {
        label.style.top = `${wipeTop}vh`;
        label.style.opacity = isActive ? "0.7" : "0";
        label.textContent = isActive ? labels[activeIdx] : "";
      }

      // Scroll hint — wiped away by the line, then hidden permanently
      const hint = scrollHintRef?.current;
      if (hint && !hintHidden.current) {
        const hintRect = hint.getBoundingClientRect();
        const lineY = (wipeTop / 100) * window.innerHeight;
        if (lineY >= hintRect.bottom) {
          hint.style.clipPath = "";
        } else if (lineY <= hintRect.top) {
          hint.style.display = "none";
          hintHidden.current = true;
        } else {
          const clip = Math.max(0, Math.min(100, ((hintRect.bottom - lineY) / hintRect.height) * 100));
          hint.style.clipPath = `inset(0 0 ${clip}% 0)`;
        }
      }

      // Nav indicator — switches when a section covers >60% of card,
      // otherwise holds the previous selection
      const nav = navRef.current;
      if (nav) {
        const numSections = numClips + 1;
        const progresses: number[] = [];
        for (let i = 0; i < numClips; i++) {
          progresses.push(sectionProgress(scrollP, i, numClips));
        }

        for (let i = 0; i < numSections; i++) {
          let vis: number;
          if (i === 0) {
            vis = 1 - (progresses[0] ?? 0);
          } else if (i < numSections - 1) {
            const prev = progresses[i - 1] ?? 0;
            const curr = progresses[i] ?? 0;
            vis = Math.min(prev, 1) - curr;
          } else {
            vis = progresses[i - 1] ?? 0;
          }
          vis = Math.max(0, Math.min(1, vis));
          if (vis >= 0.6) lastNavSection = i;
        }

        const groups = nav.children;
        for (let i = 0; i < groups.length; i++) {
          const group = groups[i] as HTMLElement;
          const bar = group.lastElementChild as HTMLElement;
          const label = group.querySelector(".nav-label") as HTMLElement;
          if (!bar) continue;
          const active = i === lastNavSection;
          if (active) {
            bar.style.width = "32px";
            bar.style.background = "var(--color-green-deep)";
          } else {
            bar.style.width = "20px";
            bar.style.background = "var(--color-green-muted)";
          }
          if (label && hoveredNav === -1) {
            label.style.opacity = active && labelsfit ? "1" : "0";
          }
        }
      }
    }

    // Hover listeners: show only the hovered label, hide all others
    let hoveredNav = -1;
    const nav = navRef.current;
    const enterHandlers: (() => void)[] = [];
    const leaveHandler = () => {
      hoveredNav = -1;
      if (!nav) return;
      for (let i = 0; i < nav.children.length; i++) {
        const label = (nav.children[i] as HTMLElement).querySelector(".nav-label") as HTMLElement;
        if (label) label.style.opacity = i === lastNavSection && labelsfit ? "1" : "0";
      }
    };

    if (nav) {
      for (let i = 0; i < nav.children.length; i++) {
        const handler = () => {
          hoveredNav = i;
          for (let j = 0; j < nav.children.length; j++) {
            const label = (nav.children[j] as HTMLElement).querySelector(".nav-label") as HTMLElement;
            if (label) label.style.opacity = j === i ? "1" : "0";
          }
        };
        enterHandlers.push(handler);
        (nav.children[i] as HTMLElement).addEventListener("mouseenter", handler);
        (nav.children[i] as HTMLElement).addEventListener("mouseleave", leaveHandler);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    tick(); // initial paint
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateRect);
      if (rafId) cancelAnimationFrame(rafId);
      if (nav) {
        for (let i = 0; i < nav.children.length; i++) {
          (nav.children[i] as HTMLElement).removeEventListener("mouseenter", enterHandlers[i]);
          (nav.children[i] as HTMLElement).removeEventListener("mouseleave", leaveHandler);
        }
      }
    };
  }, [cardRef, clipRefs, wipeLineRef, wipeLabelRef, navRef, labels, enabled]);
}
