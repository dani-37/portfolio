import React, { useCallback } from "react";

interface CardProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  clipRefs: React.RefObject<(HTMLDivElement | null)[]>;
  children: [
    React.ReactNode,
    React.ReactNode,
    React.ReactNode,
    React.ReactNode,
  ];
  overlay?: React.ReactNode;
}

export default function Card({
  cardRef,
  clipRefs,
  children,
  overlay,
}: CardProps) {
  const setClipRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      if (clipRefs.current) clipRefs.current[i] = el;
    },
    [clipRefs],
  );

  return (
    <div
      ref={cardRef}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 overflow-hidden animate-card-build"
      style={{
        width: "min(92vw, 1058px)",
        height: "min(80vh, 530px)",
        background: "var(--color-card, rgb(247, 246, 241))",
        border: "2px solid var(--color-green-deep, #1a6b5a)",
      }}>
      <div className="absolute inset-0" aria-hidden={!!overlay || undefined} inert={!!overlay || undefined}>{children[0]}</div>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          ref={setClipRef(i)}
          className="absolute inset-0"
          aria-hidden={!!overlay || undefined}
          inert={!!overlay || undefined}
          style={{
            clipPath: "inset(100% 0 0 0)",
            background: "var(--color-card, rgb(253, 252, 249))",
            zIndex: i + 1,
          }}>
          {children[i + 1]}
        </div>
      ))}
      {overlay && (
        <div
          className="absolute inset-0 z-50"
          style={{ background: "var(--color-card, rgb(253, 252, 249))" }}>
          {overlay}
        </div>
      )}
    </div>
  );
}
