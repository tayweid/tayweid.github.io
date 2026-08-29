# tayweid.github.io — Graphite Style Guide (web)

This site is the **desk** of the Graphite system — the same world as the
video stage, at reading distance. It is also the **canonical web home**:
`course-assets/course.css` and the self-hosted fonts live here and are loaded
by every course site (econ-0100, econ-0150, …), so a change here propagates
to all of them.

Authority chain: the brand's canonical values live in the **Graphite repo**
(`~/Projects/Graphite`, github.com/tayweid/Graphite — `tokens.json`, run
`node tools/check_palette.mjs` after any color change) → `course.css` here →
the course sites. This file is the application of those tokens to this
surface.

## Tokens (web surface)

| Role | Value | Notes |
|---|---|---|
| ground | `#212121` | same graphite as the video stage |
| body text | `#C8C8C8` | `--fg` |
| headings / emphasis | `#FFFFFF` | |
| link / accent | `#4A8FF0` | the brand azure — one blue everywhere. **Pending**: `course.css` still has `--link: #4C72B0` (3.3:1, below the text floor); update it |
| gold | `#E5C044` | available for defined terms in notes pages; sparingly |
| marks (figures) | teal `#128A9B` · orange `#E2803A` · green `#34B57A` · red `#C63944` · purple `#A99CF2` · pink `#C95AC0` | any chart or figure embedded in a page uses these, with the same meanings as the videos (demand teal, supply orange, …) |

Azure is reserved for the site's own voice (links, accents, the nameplate
hover) — never a data color. Gold is text, never a mark.

## Type

- **Headings: CMU Serif** (self-hosted woff2 in `course-assets/fonts/`) —
  the same face as the video stage's Tex output; this is the visual bridge
  between the sites and the videos.
- **Body and UI: Source Sans 3** (self-hosted). Source Sans is **web-only**;
  the stage's sans is CMU Sans and never appears here, and Source Sans never
  appears on stage.
- No other faces. Roboto Slab is retired (see econ-0100's migration).

## Layout

`course.css` conventions: 860px content column (`--column`), left nav with
the stacked serif nameplate, sticky at 50px; cards and carousel for content
rows. Keep new pages on these primitives rather than inventing new ones.

## The rules in brief

1. Every hue is a noun — color only appears because it means something.
2. Azure is the voice; never a curve or data series.
3. Gold is text, never a mark.
4. CMU Serif is the shared voice across stage and desk; Source Sans is the
   desk's interface.
5. Words as glyphs — prefer a colored word to an icon.

Full rationale: the Graphite design document,
https://claude.ai/code/artifact/24060dd6-bb64-4ebb-aa94-e9e81cab29f7

## Porting list (this repo)

- [ ] `course.css`: `--link` → `#4A8FF0`; add the six mark variables
      (`--demand`, `--supply`, `--gov`, `--guide`, `--total`, `--ext`) for
      embedded figures. Values from Graphite `tokens.json`.
- [ ] Sweep pages for hard-coded colors outside the token set.
- [ ] Favicon / header: adopt the raster wordmark when the channel work starts.
