# Style

This repo follows **Graphite**, the visual system shared by the video series and every
course site: `~/Projects/Graphite`, github.com/tayweid/Graphite.

- Values live in `tokens.json` there. Change a color there first, run the checker, then
  propagate.
- The web surface (tokens, type, layout, figures in pages, slides) is `docs/web.md` there.
- This site is the canonical web home: `course-assets/course.css` and the self-hosted fonts live here and are loaded by every course site, so a token change lands here first, as a copy of `tokens.json` with a comment pointing back.

Open here: sweep the remaining hard-coded greys in `course.css` onto tokens, and adopt the raster wordmark when the channel work starts.
