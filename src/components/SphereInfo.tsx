import { useState, useEffect, useCallback, useRef } from "react";
import firesMeta from "../data/fires_meta.json";


const SENTENCES = [
  "This sphere is shaped by real wildfire data.",
  "Every day, satellite hotspots from the past week are fetched from NASA's VIIRS sensor.",
  "Each fire becomes a hole in the surface of the sphere, matching the fire's longitude and latitude.",
  "Denser fire regions carve larger holes.",
  `Over the last week, ${firesMeta.fireCount.toLocaleString()} wildfires were recorded.`,
];

const TYPE_SPEED = 35;
const HOLD_TIME = 2200;

type Phase = "typing" | "holding" | "idle";

export default function SphereInfo({
  autoStart,
  onDone,
}: { autoStart?: boolean; onDone?: () => void } = {}) {
  const [open, setOpen] = useState(!!autoStart);
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");

  const doneRef = useRef(false);

  const reset = useCallback(() => {
    setSentenceIdx(0);
    setCharIndex(0);
    setPhase("idle");
    doneRef.current = false;
  }, []);

  useEffect(() => {
    if (autoStart) {
      reset();
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [autoStart, reset]);

  useEffect(() => {
    if (!open) {
      reset();
      return;
    }

    if (sentenceIdx >= SENTENCES.length) {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone?.();
      }
      return;
    }

    if (phase === "idle") {
      setPhase("typing");
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

  const done = open && sentenceIdx >= SENTENCES.length;

  return (
    <div className="h-[42px] flex items-center justify-center font-grotesk font-light text-[13px] leading-relaxed text-gray max-w-[350px] text-center">
      {open ? (
        done && !onDone ? (
          <span className="flex items-center justify-center gap-2">
            <a
              href="https://www.earthdata.nasa.gov/learn/find-data/near-real-time/firms/viirs-i-band-375-m-active-fire-data"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-deep hover:underline cursor-pointer">
              source
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
        ) : done ? (
          <span>{SENTENCES[SENTENCES.length - 1]}</span>
        ) : (
          <span>
            {SENTENCES[sentenceIdx].slice(0, charIndex)}
            <span
              className={`inline-block w-0 overflow-visible ${phase === "holding" ? "animate-blink" : ""}`}>
              |
            </span>
          </span>
        )
      ) : onDone ? null : (
        <div className="flex flex-col items-center gap-2">
          <span className="text-gray-muted opacity-80">
            shaped by live wildfire data
          </span>
          <span className="btn-brutalist-wrap btn-brutalist-sm transition-opacity duration-300">
            <button
              onClick={() => setOpen(true)}
              className="btn-brutalist block font-grotesk font-light text-[12px] text-green-deep border border-green-deep px-2.5 py-0.5 bg-card cursor-pointer">
              learn how
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
