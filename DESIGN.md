---
name: danieltoft.dk
description: Daniel Toft's career printed as a git log --graph on tunit mint.
colors:
  mint: "#d5f4e5"
  paper: "#f8fbf9"
  ink: "#214b3c"
  ink-body: "#365747"
  ink-muted: "#50695d"
  sage: "#8eb69f"
  sage-soft: "#aed0bc"
  lavender: "#e4def3"
  lavender-ink: "#51406e"
  sand: "#f5e2c8"
  sand-ink: "#6e4a1f"
typography:
  display:
    fontFamily: "Space Grotesk Variable, Space Grotesk, system-ui, sans-serif"
    fontSize: "calc(100cqi / 4.676)"
    fontWeight: 700
    lineHeight: 0.86
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Space Grotesk Variable, Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.4rem + 2.4vw, 3.25rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.04em"
  headline-remote:
    fontFamily: "Space Grotesk Variable, Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 0.85rem + 2.2vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.035em"
  lead:
    fontFamily: "Space Grotesk Variable, Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 1.3rem + 1.2vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Space Grotesk Variable, Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.2rem, 1.1rem + 0.5vw, 1.5rem)"
    fontWeight: 600
    lineHeight: "2rem"
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Space Grotesk Variable, Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.96rem + 0.2vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.55
  label-data:
    fontFamily: "Cascadia Code Variable, Cascadia Code, ui-monospace, Consolas, monospace"
    fontSize: "clamp(0.8rem, 0.78rem + 0.1vw, 0.875rem)"
    fontWeight: 400
    lineHeight: "1.5rem"
    fontFeature: "tnum, liga 0"
  label-ref:
    fontFamily: "Cascadia Code Variable, Cascadia Code, ui-monospace, Consolas, monospace"
    fontSize: "0.8rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0"
rounded:
  band: "2px"
  focus: "4px"
  key: "5px"
  pill: "999px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.5rem"
  "6": "2rem"
  "7": "3rem"
  "8": "4.5rem"
  gutter: "clamp(1rem, 4vw, 3rem)"
components:
  ref-head:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.ink}"
    typography: "{typography.label-ref}"
    rounded: "{rounded.pill}"
    padding: "0 0.55em"
    height: "1.5rem"
  ref-branch:
    backgroundColor: "{colors.lavender}"
    textColor: "{colors.lavender-ink}"
    typography: "{typography.label-ref}"
    rounded: "{rounded.pill}"
    padding: "0 0.55em"
    height: "1.5rem"
  ref-branch-2:
    backgroundColor: "{colors.sand}"
    textColor: "{colors.sand-ink}"
    typography: "{typography.label-ref}"
    rounded: "{rounded.pill}"
    padding: "0 0.55em"
    height: "1.5rem"
  log-row-head:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.mint}"
    rounded: "{rounded.band}"
    padding: "0 1rem"
  button-copy:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 1rem"
    height: "2.25rem"
  button-copy-done:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.mint}"
    rounded: "{rounded.pill}"
  kbd:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.key}"
    padding: "0 0.35em"
    height: "1.6em"
---

# Design System: danieltoft.dk

## Overview

**Creative North Star: "The Pager on Mint"**

The site is what `git log --graph` would print if the repository were a career: a pager's output, set as a readable page. The ground is a drenched mint taken from tunit.dev and never broken into panels; everything sits directly on it in dark green ink. Structure comes from typography, hairline rules and the commit graph itself, not from containers. It is quiet, flat and exact, a little nerdy because the type is. It doesn't dress up as a terminal.

Two voices share the page. Space Grotesk carries anything a person would say: the name, headings, company names, prose. Cascadia Code carries anything a machine would print: hashes, dates, durations, refs, commands, fact keys, remote names, key hints. Rank comes from inversion. The one ink-filled band on the page is HEAD, the current role, and nothing else is allowed to compete with it.

A few moments are deliberately fancy and all of them come from the world. The name decodes out of hex glyphs. The graph lanes draw in step with scroll position. A live uptime counter ticks. `(END)` and `git remote -v` close the page. Everything still reads without JavaScript and without motion.

**Key Characteristics:**
- Drenched mint ground, dark green ink, no card surfaces.
- Two type voices with a hard boundary: Space Grotesk for people, Cascadia Code for machine data.
- The commit graph is the page's structure: 3px lanes, ring nodes, a lavender and a sand branch.
- HEAD is the single inverted band. Rank is shown by inversion.
- Motion is bound to the world (hex decode, scroll-drawn lanes) and is fully removed under reduced motion.

## Colors

A low-contrast, single-hue green world (tunit mint and its inks), with two branch accents, lavender and sand, held back for the parallel branches.

### Primary
- **Pine Ink** (`ink`): headings, company names, fact values, link text, graph lanes and ring nodes on the main line, focus outlines, selection background, and the fill of the HEAD band and of the copied state.

### Tertiary
- **Branch Lavender** (`lavender`): fill of the branch ref pill only.
- **Branch Ink** (`lavender-ink`): the branch lane, its fork and merge curves, its ring node, and the pill text. Nothing else.
- **Branch Sand** (`sand`): fill of the second branch lane's ref pill only.
- **Sand Ink** (`sand-ink`): the second branch lane, its fork and merge curves, its ring node, and the pill text. Nothing else. 6.2:1 on its pill, 6.7:1 on mint.

### Neutral
- **Tunit Mint** (`mint`): the page ground, drenched edge to edge (also `theme-color`). It is also the text colour inside the HEAD band, the HEAD ref pill fill, and the hollow fill inside ring nodes.
- **Paper** (`paper`): small raised controls on the ground only, meaning keyboard keys and the copy button.
- **Moss Body** (`ink-body`): running prose (bio, role summaries).
- **Lichen Muted** (`ink-muted`): secondary machine data such as hashes, durations, the command prompt text, fact keys, remote names, merge messages, `(END)`, the colophon and the uptime clock.
- **Sage** (`sage`): resting link underlines, key and button borders, scrollbar thumb.
- **Soft Sage** (`sage-soft`): hairline row rules between log entries, link lists and remotes. Inside the HEAD band it becomes the muted text colour for hash and duration.

### Named Rules
**The Inversion Rule.** Only one element on a page may be ink-filled with mint text at rest: the HEAD row. The copied state of the copy button is the only other inversion, and it is transient feedback, not a surface.

**The Branch Lane Rule.** Lavender (lane 1) and sand (lane 2) exist for the parallel branches: their lanes, curves and nodes, and their pills. The colour belongs to the lane, not to the kind of branch. Never use either as a general accent, a hover colour or a highlight.

**The Drenched Ground Rule.** Mint is the page. Don't lay tinted panels or cards over it. Paper appears only at control scale (keys, the copy button).

## Typography

**Display Font:** Space Grotesk Variable (fallback Space Grotesk, system-ui, sans-serif). Pinned by the owner.
**Body Font:** Space Grotesk Variable.
**Label/Mono Font:** Cascadia Code Variable (fallback Cascadia Code, ui-monospace, Consolas, monospace), with tabular numerals and ligatures off. The exception is ref pills, where contextual ligatures turn `->` into an arrow.

**Character:** A tight, geometric grotesk for human names and sentences next to a programmer's mono for everything the machine prints. The boundary between the two is what makes the page read as a log without turning it into a terminal costume.

### Hierarchy
- **Display** (700, fitted to the column, 0.86, -0.04em): the wordmark only. It is sized as `100cqi / 4.676` inside an inline-size container, with a -0.047em left offset for the D's side bearing, so the ink spans the content column edge to edge at every width. Only the f–t pair tightens to -0.062em, so the two crossbars fuse. It never wraps.
- **Headline** (600, clamp 2rem to 3.25rem, 1, -0.04em): section headings (Erfaring, Kontakt).
- **Headline, remote** (600, clamp 1.25rem to 2.5rem, 1.15, -0.035em): contact URLs in the `git remote -v` list. They are big because they are the call to action.
- **Lead** (600, step-2, 1.15, -0.03em): the one-line role statement under the wordmark.
- **Title** (600, step-1, 2rem line, -0.02em): company names in log rows. The role title under a company name is body size at 500 in ink.
- **Body** (400, step-0, 1.55): bio (max 40rem) and role summaries (max 58ch), in Moss Body.
- **Label, data** (Cascadia, step--1, 1.5rem line on mobile, 2rem on desktop rows): hashes, dates, durations, facts, commands, remote names, merge messages.
- **Label, ref** (Cascadia 600, 0.8rem, 0 tracking): ref pills.

### Named Rules
**The Machine Voice Rule.** Cascadia Code is for data a machine would print: hashes, dates, durations, refs, commands, key-value facts, remote names, kbd. Names, headings and prose are never set in mono.

**The Fitted Wordmark Rule.** The name is fitted to the column rather than sized on a type step. If the name or weight changes, re-measure the ink width and the side bearing. Don't approximate them with a vw clamp.

## Layout

A single column in a wrapper up to 88rem wide, with fluid side gutters (`gutter`). The spacing rhythm is one scale, `spacing.1` to `spacing.8` (0.25rem to 4.5rem), and all gaps and paddings come from it.

- **Hero:** the fitted wordmark on top. Under it, at 48rem and up, a 7fr / 4fr grid puts the lead and bio on the left and the facts plus the contact link list on the right, with a `spacing.8` gap. Below 48rem the grid stacks in one column with a `spacing.6` gap. Facts are a two-column key/value grid with 7.5ch keys.
- **Log rows:** on desktop (48rem and up) each row is a four-column grid: graph gutter (3.5rem), hash (5.5rem), message (1fr), and right-aligned when/duration (13rem). On mobile the graph gutter narrows to 2.75rem and the metadata becomes two lines above the message. Line one is hash plus range, and line two is the duration, indented by 7ch plus `spacing.3` so it sits under the range.
- **Contact:** remotes use a 9ch name column, a URL column and a trailing action column on desktop, and stack on mobile.
- **Key hints** (kbd next to links) show only on hover-capable fine pointers. The colophon's shortcut legend shows only on `(hover: hover) and (pointer: fine)`.
- Breakpoint: a single 48rem breakpoint.

### Named Rules
**The Hairline Rule.** Entries are divided by 1px Soft Sage rules, never boxed. In the log, the rule starts after the graph gutter and never crosses the lanes. It is also omitted directly under the HEAD band.

## Elevation & Depth

Flat. There are no shadows anywhere. Depth is expressed in two ways only: the tonal inversion of the HEAD band, and the physical-key hint on `kbd`, which has a 1px sage border with a 2px bottom edge on paper. The copy button's active state nudges down 1px, and that is the only positional depth.

### Named Rules
**The Flat Pager Rule.** Pager output has no elevation. Don't add box-shadows, blurs or floating surfaces. Rank comes from inversion and weight.

## Shapes

The form language comes from the git graph: vertical 3px strokes, circles for commits and soft S-curves for the fork and merge. The shapes are:

- ring nodes (circles with a 3px border and a mint fill), about 0.875rem across;
- the merge node, smaller (0.625rem) and filled solid with the lane colour;
- pills (`rounded.pill`) for refs and the copy button;
- gently eased keys (`rounded.key`);
- the HEAD band, nearly square (`rounded.band`);
- focus outlines, 2px ink with a 3px offset and a slight round (`rounded.focus`).

The favicon repeats the graph: a main lane, a lavender fork, a filled head node and ring nodes on a mint rounded square.

## Components

### Buttons
Tactile but quiet. The only button is copy-email.
- **Shape:** full pill (`rounded.pill`), 2.25rem high.
- **Default:** Paper fill, 1px Sage border, ink text in Space Grotesk 600 at step--1, a 1rem inline SVG copy icon (stroke 1.5, round caps), and a "Kopiér" label.
- **Hover / Active:** on hover the border darkens to ink. On active it translates down 1px. Transitions run 160ms on the shared ease-out curve.
- **Done:** it inverts to an ink fill with mint text, swaps to a check icon, reads "Kopieret" for 2.2s, and announces through a polite live region.

### Chips (ref pills)
- **HEAD ref:** "HEAD -> main" in a mint pill with ink text. It lives only inside the inverted HEAD band.
- **Branch ref:** the branch name in its lane's pill (lavender with lavender-ink text, or sand with sand-ink text), on the branch commit only.
- Both are Cascadia 600 at 0.8rem, 1.5rem high, and carry a screen-reader prefix that explains the ref.

### Links
- Inline links are underlined with a 2px Sage underline at a 0.22em offset. On hover the underline takes the text colour.
- Hero contact links and remote URLs are ink at 600 with a transparent underline at rest, which becomes an ink underline on hover. Remote URLs use a 3px underline.

### Keys (kbd)
Cascadia at 0.78em (0.72rem in the hero list), at least 1.6em square, Paper fill, a 1px Sage border with a 2px bottom edge, and `rounded.key`. Each key corresponds to a live shortcut (e, g, l).

### Commit Log (signature component)
A `git log --graph --author` pager output. It is introduced by a muted mono command line with a bold ink `$`.
- **Lanes:** 3px vertical strokes. The main lane is ink; branch lanes are lavender ink (lane 1) and sand ink (lane 2). The fork and merge are SVG S-curves with round caps. Lanes are handed out top-down like git's columns, each branch taking the lowest lane free for its whole span, and the gutter widens with the lane count. `systemaweb` and `uddannelse` interleave, so the `uddannelse` merge curve crosses the `systemaweb` lane, as git's own graph would.
- **Nodes:** ring nodes at every role commit. The merge commit gets a smaller, filled node and a mono "Merge branch '…'" message in muted ink.
- **Root:** the log bottoms out in a ring-node `Initial commit` on the owner's birth date (the one day-precise date), in the same mono muted voice as a merge. Education dates are years only and show no duration.
- **Rows:** hash, company (title role) with refs, role title, and an optional summary, then the range and duration on the right. Rows are separated by hairlines, per the Hairline Rule.
- **HEAD:** the current role is the single inverted band. It has an ink fill, mint text and mint lanes, Soft Sage for the hash and duration, a `rounded.band` corner, and it bleeds out by `spacing.4` on desktop (`spacing.2` on mobile) past the text column.
- **Motion:** each row is a named view-timeline. Lanes scale in from the top, nodes pop in (scale 0, then 1.25, then 1), and curves are revealed top-down with `clip-path` (a dash offset under-draws once a non-scaling stroke is stretched), all as a pure function of scroll position, so the drawing reverses when you scroll back. It is gated behind `@supports (animation-timeline: view())` and `prefers-reduced-motion: no-preference`. Otherwise the graph renders static and complete.
- **Close:** a muted mono `(END)` aligned to the message column.

### Wordmark (signature component)
The fitted display name described under Typography. On load (after fonts are ready) and on mouse hover, each glyph cycles through hex characters and settles left to right. The hex pool is limited per slot to glyphs no wider than the letter they replace, so no glyph spills into its neighbour. It does nothing under reduced motion.

### Facts and Uptime
A mono key/value list with muted keys and ink values. The uptime value ticks every second as "år / mdr / d" followed by an HH:MM:SS clock in muted ink. A spelled-out screen-reader version is provided alongside.

## Do's and Don'ts

### Do:
- **Do** keep the mint ground drenched edge to edge and set all text in the ink family on it.
- **Do** set every machine-printed datum (hashes, dates, durations, refs, commands, fact keys, remote names, keys) in Cascadia Code with tabular numerals, and every name, heading and sentence in Space Grotesk.
- **Do** separate entries with 1px Soft Sage hairlines that stop short of the graph gutter.
- **Do** keep HEAD as the one inverted ink band, with mint text and mint lanes.
- **Do** bind decorative motion to the world (hex decode, scroll-drawn lanes), and give it a complete static fallback that removes it under reduced motion.
- **Do** use one 160ms ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`) for state transitions.

### Don't:
- **Don't** turn it into a terminal costume: no black screen, no green-on-black prompt applied across the page.
- **Don't** put log entries or content in cards, tinted panels or shadowed boxes.
- **Don't** use lavender or sand anywhere other than the branch lanes and their pills.
- **Don't** add a second inverted band or another ink-filled surface at rest.
- **Don't** set names, headings or prose in Cascadia Code.
- **Don't** add box-shadows.
