import { useState, useEffect, useCallback } from "react";
import firesMeta from "../data/fires_meta.json";

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const SENTENCES = [
  "This sphere is shaped by real wildfire data.",
  "Every day, satellite hotspots from the past week are fetched from NASA's VIIRS sensor.",
  "Each fire becomes a hole in the surface of the sphere.",
  "Denser fire regions carve larger holes.",
  `The data you are seeing was fetched today, ${formatDate(firesMeta.fetchedAt)}.`,
  `Over the last week, ${firesMeta.fireCount.toLocaleString()} wildfires were recorded.`,
];

const TYPE_SPEED = 35;
const HOLD_TIME = 2200;

type Phase = "typing" | "holding" | "idle";

export default function SphereInfo() {
  const [open, setOpen] = useState(false);
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");

  const reset = useCallback(() => {
    setSentenceIdx(0);
    setCharIndex(0);
    setPhase("idle");
  }, []);

  useEffect(() => {
    if (!open) {
      reset();
      return;
    }

    if (phase === "idle") {
      setPhase("typing");
      return;
    }

    if (sentenceIdx >= SENTENCES.length) {
      setPhase("idle");
      return;
    }

    if (phase === "typing") {
      if (charIndex < SENTENCES[sentenceIdx].length) {
        const timer = setTimeout(() => setCharIndex((c) => c + 1), TYPE_SPEED);
        return () => clearTimeout(timer);
      }
      setPhase("holding");
      return;
    }

    if (phase === "holding") {
      const timer = setTimeout(() => {
        setSentenceIdx((s) => s + 1);
        setCharIndex(0);
        setPhase("typing");
      }, HOLD_TIME);
      return () => clearTimeout(timer);
    }
  }, [open, sentenceIdx, charIndex, phase, reset]);

  if (open) {
    const done = sentenceIdx >= SENTENCES.length;
    return (
      <div className="h-5 font-grotesk font-light text-[11px] leading-relaxed text-gray max-w-[320px] text-center">
        {done ? (
          <span className="flex items-center justify-center gap-2">
            <a
              href="https://www.earthdata.nasa.gov/learn/find-data/near-real-time/firms/viirs-i-band-375-m-active-fire-data"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-deep hover:underline cursor-pointer">
              sources
            </a>
            <span className="text-gray-muted">·</span>
            <button
              onClick={() => {
                setSentenceIdx(0);
                setCharIndex(0);
                setPhase("typing");
              }}
              className="text-gray hover:text-green-deep hover:underline transition-colors cursor-pointer">
              read again
            </button>
          </span>
        ) : (
          <span className="relative">
            {SENTENCES[sentenceIdx].slice(0, charIndex)}
            <span
              className={`absolute ${phase === "holding" ? "animate-blink ml-1" : ""}`}>
              |
            </span>
          </span>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => setOpen(true)}
      className="group h-5 text-gray font-grotesk font-light text-[11px] leading-none opacity-60 hover:opacity-100 hover:text-green-deep transition-all cursor-pointer"
      aria-label="Learn about this sphere's live data">
      shaped by live data
      <svg
        width="7"
        height="7"
        viewBox="0 0 7 7"
        fill="none"
        className="inline ml-0.5 -translate-y-px transition-transform duration-200 group-hover:translate-x-0.5"
        aria-hidden="true">
        <path
          d="M2 1L5 3.5L2 6"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
