# Hero Section Redesign

## Summary

Replace the three-item color legend with a single tagline sentence, add a staggered entrance animation on desktop, and make the scroll hint idle-triggered instead of always-visible.

## Current State

The hero section (`src/sections/Hero.tsx`) contains:
- Name wordmark: "daniel / Vegara." (top-left)
- Three-item color legend (bottom-left): Statistics & Mathematical Modelling, Sustainability & Environmental Analysis, Software Development
- Morphing sphere (desktop, center-right)
- Footer links: LinkedIn, CV, Email (bottom-left, below legend)

The scroll hint (`src/pages/Home.tsx:269-283`) is always visible on desktop with a bobbing animation.

## Changes

### 1. Remove legend, add tagline

Remove the three-item color legend entirely. Replace it with a single sentence in the same bottom-left position:

> I build data tools that help people make sense of complex problems. Currently at the OECD, Paris.

**Styling:** `font-grotesk font-light text-body text-gray` — the same visual register as the legend labels, but as a single flowing sentence.

**Mobile:** The tagline replaces the legend on mobile too. Same text, same styling.

### 2. Staggered entrance animation (desktop only)

Elements fade in with a slight upward translate, staggered:

| Element | Delay | Duration |
|---------|-------|----------|
| Name    | 0ms   | 400ms    |
| Tagline | 200ms | 400ms    |
| Links   | 400ms | 400ms    |

Animation: `opacity: 0 → 1` combined with `translateY(8px) → translateY(0)`. Easing: `ease-out`.

The morphing sphere has its own render-in behavior and is not modified.

**`prefers-reduced-motion`:** When the user prefers reduced motion, all elements appear instantly with no animation. The existing CSS rule in `index.css` (lines 14-19) already zeroes out animation/transition durations globally, so the staggered entrance will respect this automatically as long as it uses CSS animations or transitions (not JS-driven timers that bypass the media query).

**Mobile:** No entrance animation. All elements render immediately.

### 3. Idle-triggered scroll hint (desktop only)

Current behavior: The scroll hint ("scroll" label + pulsing line) is visible on load with a continuous bob animation.

New behavior:
- Hidden on initial load (`opacity: 0`)
- After 3 seconds with no scroll event detected, fade in over 500ms
- On any scroll event, fade out over 300ms and stay hidden for the remainder of the page load
- If the user scrolls before the 3-second timer fires, the hint never appears

Implementation: A `useEffect` in `Home.tsx` that sets a 3-second timeout on mount, listens for scroll events, and manages the hint's opacity via the existing `hintRef`.

### 4. Footer links unchanged

Links remain: LinkedIn, CV, Email. No change to order or content.

## Files Modified

- `src/sections/Hero.tsx` — remove legend, add tagline, add entrance animation classes
- `src/pages/Home.tsx` — idle-triggered scroll hint logic
- `src/index.css` — add keyframes for staggered entrance (if CSS-based approach)

## Out of Scope

- Morphing sphere changes
- Mobile layout restructuring (separate concern from portfolio review)
- CV PDF 404 fix
- OG meta tags
- Accessibility improvements beyond `prefers-reduced-motion`
