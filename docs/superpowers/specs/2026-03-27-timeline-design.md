# Timeline Section Design Spec

## Overview

A horizontal editorial timeline placed immediately after the Hero section, telling Daniel's life story through locations, education, and work experience. The timeline is static (no interactivity), rendered as SVG, and designed to demonstrate data visualization skill through careful craft rather than flashy effects.

## Visual Reference

The approved mockup is at `.superpowers/brainstorm/21828-1774611701/content/editorial-final.html`.

## Layout

### Structure

- Section header: `002 — TIMELINE` left, `2000 – NOW` right, connected by a thin line
- Single horizontal SVG containing: spine, location markers, event bars
- Legend at bottom: two items (studies = ink, experience = green)
- Placed inside the existing card layout, between Hero and Experience sections

### Spine

A horizontal line at the vertical center of the location row, running left to right with:

- **Breaks** (small gaps) before each major location change (before London, before Paris)
- **DC detour**: a shallow 3px dip in the spine during the Madrid period (2009–2012), with "DC" (bold) and "09–12" below the dip
- **Gap year**: a dotted/dashed segment (stroke-dasharray) with italic "gap year" above and "22–23" below the spine
- The spine runs to the right edge of the card for the Paris/current period

### Location Markers

Three main locations as circles on the spine, all with identical styling:
- Circle: r=5, fill=#fdfcf9, stroke=#1a6b5a, stroke-width=2
- Year above the circle (Space Mono, 8px, #999)
- City name below (Lora bold, 15px, #1a1a18)
- Coordinates below city name (Space Mono, 5px, #ccc)

| Location | Year | Coordinates |
|----------|------|-------------|
| Madrid | 2000 | 40.42°N · 3.70°W |
| London | 2018 | 51.51°N · 0.13°W |
| Paris | 2025 | 48.86°N · 2.35°E |

DC is handled as the spine detour, not a full location marker.

### Time Scale

Two-speed compressed scale:
- **Pre-gap (2018–2022.5)**: ~48px per year — squished, since early career is less dense
- **Gap year (2022.5–2023.75)**: ~48px per year
- **Post-gap (2023.75–2026.25)**: ~115px per year — expanded, overlapping events need room
- **Pre-2018**: heavily compressed (~6px per year), just enough for Madrid and DC detour

### Event Bars

Each event is rendered as three lines of text + a colored horizontal bar:

1. **Name** (Space Grotesk, 10px, #1a1a18, font-weight 500) — above the bar
2. **Colored bar** (2px height, positioned at the correct time span)
3. **Description** (Space Mono, 7px, #aaa) — below the bar
4. **Years** (Space Mono, 6.5px, #bbb) — below the description

Bar color: ink (#1a1a18) for studies, green (#1a6b5a) for experience.

Bar widths are proportional to actual duration using the time scale.

### Event Data

**Studies (ink):**

| Name | Description | Dates | Row |
|------|------------|-------|-----|
| Imperial College | MSci Mathematics & Statistics | 2018–22 | 1 |
| UCL | MSc AI for Sustainability | 2024–25 | 1 |

**Experience (green):**

| Name | Description | Dates | Row |
|------|------------|-------|-----|
| Graphext | Data viz intern | 2020 (summer) | 1 |
| Klere | Biodiversity footprints | 2023–25 | 1 |
| Toolip | Non-profit tech | 2020–22 | 2 |
| OECD | Regional data analysis | 2025–Now | 2 |

Row 1 events and Row 2 events are offset vertically to avoid overlap. Studies occupy their own row above experience.

### Vertical Layout (approximate y positions in SVG)

- y=50: Year labels above circles
- y=70: Spine + location circles
- y=92: City names below circles
- y=101: Coordinates
- y=120–143: Studies row (name, bar, description, years)
- y=160–183: Experience row 1 (Graphext, Klere)
- y=200–223: Experience row 2 (Toolip, OECD)

### Key Overlaps to Show

The time-proportional bars visually reveal:
- Graphext + Toolip + Imperial all overlap around 2020–2022 (studying while working)
- UCL + Klere + OECD overlap around 2024–2025 (masters while working two jobs)

This is one of the main storytelling points of the visualization.

## Typography

Matches the existing site:
- **Display**: Lora (serif) — city names
- **Body**: Space Grotesk (sans-serif) — event names
- **Mono**: Space Mono (monospace) — years, coordinates, descriptions

## Colors

From the existing palette:
- Spine/borders: #d8d4cc
- Studies bars: #1a1a18 (ink)
- Experience bars: #1a6b5a (deep green)
- City names: #1a1a18
- Years/descriptions: #aaa / #bbb
- Coordinates: #ccc
- Circle stroke: #1a6b5a
- Circle fill: #fdfcf9 (card background)

## Legend

Bottom of the section, separated by a 1px #ebe6dc border:
- Two items: "studies" (ink bar) and "experience" (green bar)
- Space Mono, 7.5px, #aaa

## Rendering

- Pure SVG — no canvas, no external libraries
- Static on load — no scroll-driven animation (may add subtle entrance animation later)
- No interactivity — read-only visualization
- Responsive: SVG viewBox scales with container width

## Mobile Considerations

The SVG viewBox (770×250) will scale down on mobile. At very narrow widths, text may become unreadable. Consider:
- Stacking the timeline vertically on mobile (breakpoint ~500px)
- Or keeping horizontal with the ability to scroll horizontally within the card

This decision can be made during implementation based on how the existing card handles mobile.

## Integration

- New component: `Timeline.tsx` in `/src/sections/`
- Placed in `Home.tsx` between Hero and Experience sections
- Should work within the existing card/scroll system (wipe card on desktop, snap scroll on mobile)
