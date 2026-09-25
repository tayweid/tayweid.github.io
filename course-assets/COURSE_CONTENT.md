# Course content: the format behind every course site

Each course site keeps its content in one file, `course-content.yaml.js`, and renders its
part pages in the browser with the shared code here. There is no build step: edit the
YAML, refresh the page. This document is the format. The rules it describes are enforced
by `course-schema.js`, which both the page and the checker use, so an error you see in the
browser is the same error `check-course` prints.

## The wrapper

The file is YAML inside a one-line JavaScript assignment:

    window.COURSE_CONTENT_YAML = String.raw`
    ...yaml...
    `;

Edit between the backtick lines and leave the wrapper alone. A backtick or the pair `${`
may not appear inside the YAML; the checker refuses both. The file is JavaScript rather
than plain YAML so a page opened by double-clicking can read it: a browser lets such a page
load a neighbouring `<script>` and nothing else.

## What lives where

| Where | What |
|---|---|
| `course-assets/course-schema.js` | the format, as code; shared by the page and the checker |
| `course-assets/course-page.js` | the renderer; a part page is a twenty-line shell that loads it |
| `course-assets/check-course` | the checker: `node course-assets/check-course <site>`; a site's `scripts/check-course` runs it |
| `course-assets/tests/` | the checker's and the editor's tests: `node --test course-assets/tests/*.test.js` |
| `course-assets/editor/` | a local form editor for the content file; see Editing with forms |
| `course-assets/icon.svg` | the course icon (the bumper's raster squares); every site page links it |
| `<site>/course-content.yaml.js` | the content |
| `<site>/part-<id>.html` | one shell per part, identical across sites except the part ID |
| `<site>/index.html` | optional: the same shell with `data-course-part="current"`, which shows the part under way today (below) |

A shell opened from disk loads the shared code from the sibling checkout,
`../tayweid.github.io/course-assets/`, so an unpushed change to the renderer or the
stylesheet can be previewed against a real site; when the sibling is missing, or the page
is served, it uses the published copy.

## Course header

```yaml
course:
  code: ECON 0100                  # page titles, and the wrapper class course-econ-0100
  title: Microeconomics
  brand: [MICRO, ECON]             # nameplate lines in the left nav
  home: econ-0150.html             # optional; the nameplate links here and the mobile nav gets Home
  nav:                             # optional extra left-nav entries
    - label: Office Hours          # a note: text lines above the buttons, nothing to click
      lines: ['*Taylor* Wed 2:30-3:30, Posvar 4702']   # quote a line that has a colon; *asterisks* italicise
    - label: Syllabus
      file: Syllabus/Syllabus.pdf
      button: true                 # a button above the parts (econ-0100); omit for an entry after them (econ-0150's Projects)
  checkpoint: MiniExam             # the word for the end-of-part assessment; default Checkpoint
  reading: Reading/Ch_{nn}.pdf     # optional; lets a block say reading.chapter: 3
  materials: Blocks                # optional; enables conventional PDF discovery under Blocks/<folder>/
  solutions: after_due             # optional; every block's solutions appear the day after they are due
```

## Parts

Part IDs name the pages: `A` renders `part-a.html`, `'1'` renders `part-1.html` (quote
numeric IDs). Each part has `title`, `tagline`, `introduction`, an ordered list of
`sections`, and optionally `links` (chips beside the title) and `homework_defaults`.

A section is exactly one of a **block**, a **checkpoint**, or a **project**.

## A block

```yaml
- block: A2
  folder: A2_Advantage             # with course.materials: the block's directory under Blocks/
  nav: Advantage                   # right-nav label, shown as "A2 | Advantage"
  title: Comparative advantage
  description: Why we specialize.  # *asterisks* italicize; no HTML anywhere
  episode:
    name: Episode A2               # optional; default "Episode <block>"
    video: po4kip5m_QY             # the eleven-character YouTube ID; the thumbnail is automatic
    description: The landscape of what's possible
    links: [{label: Animations, file: Blocks/A2_Advantage/media/, icon: fa-desktop}]
  reading:                         # optional
    chapter: 2                     # links course.reading with {nn} filled in, as an optional chip
    topic: Thinking like an economist
```

Then the practice path, in one of two forms.

**Explicit steps** list every step:

```yaml
  steps:
    - name: Exercise 1.1
      kind: exercise               # exercise (in class), vignette (recitation), homework (home), livestream (optional, drawn as an aside)
      sub: Coffee Shop Locations   # optional second line
      links: [{label: Notebook, file: https://colab.research.google.com/...}]
      video: fWk7LBDcfY8           # optional small thumbnail
      due: Sunday, September 4     # optional display text
      date: '2026-09-04'           # optional; once it has passed the step's dot turns blue
      where: recitation            # optional; overrides the label the kind supplies
```

**The conventional triad** writes nothing and gets Exercise, Vignette, and Homework steps,
with PDFs found on disk by the block's `folder`:

    Blocks/<folder>/Exercise/Exercise_<BLOCK>.pdf
    Blocks/<folder>/Vignette/Vignette_<BLOCK>.pdf
    Blocks/<folder>/Homework/Homework_<BLOCK>.pdf

Drop a conventionally named PDF in and its chip appears on the next load. Solutions are
opt-in: `solutions: true` under `vignette:` or `homework:` shows `..._sols.pdf`, and nothing
else does. `solutions: after_due` shows it only from the day after the step's date (the
recitation date for a vignette, the homework date for homework), the day its dot turns
blue, so a guide can be pushed early and appear on its own once the work is due. Set
`solutions: after_due` under `course:` to make that the default for every block; a block's
own `solutions:` (or a part's `homework_defaults`) still wins, and `false` keeps one hidden.
Append `?today=2026-09-28` to a page's URL to preview another day. Optional keys on the triad:

```yaml
  dates: {class: '2026-08-31', recitation: '2026-09-04', homework: '2026-09-06'}   # orders the steps; a passed date turns its dot blue
  exercise: {links: [...], video: ...}            # only when the exercise has downloads or a video
  vignette: {description: ..., files: A1, solutions: after_due, video: ...}       # files: overrides the base name; files: false hides it
  homework: {due: ..., file: A1, solutions: true, links: [...]}                    # file: A1 asks for the conventional Homework_A1.pdf
  practice: false                                 # no path at all
  extras: [{name: Simulating a Market, video: ...}]   # optional material above the episode; an extra with
                                                  # no video may carry an image (URL or local path) as its thumbnail, opening its first link
```

## A checkpoint

```yaml
- checkpoint:
    description: MiniExam 1 covers everything in Part 1.
    steps: [...]                   # optional; steps as under a block (a wrap-up session), drawn before the demo
    demo:
      name: Demo 1 Walkthrough     # optional; default "Demo <part> Walkthrough"
      video: b4d8l4QMu8E
      description: Practice exam.  # optional
      links: [{label: Demo, file: ME/ME_1/ME_1_Demo.pdf}, {label: Solutions, file: ME/ME_1/ME_1_Demo_sols.pdf}]
    links: [{label: Solutions, file: ME/ME_1/ME_1_sols.pdf}]   # optional; chips on the checkpoint step itself
    date: '2026-09-09'             # optional; shown as the checkpoint's day
    when: Week 4                   # optional; overrides the date's label
    reattempt: TBA                 # optional; adds a Reattempt step with this label
    reattempt_when: Thu Oct 8      # optional; the Reattempt step's day, drawn like the checkpoint's
    next: 2                        # optional; adds a faint "Part 2" step after the checkpoint
    extras: [...]                  # optional material between the demo and the checkpoint
```

The heading and the right-nav entry use `course.checkpoint`, so `MiniExam 1` on one site and
`Checkpoint A` on the other.

## A project

```yaml
- project:
    id: final-project              # the element id, for deep links
    nav: Final Project
    title: Final Project
    description: Here's where we tie it all together.
    prompts:
      - {label: Research Question., kind: research, text: What is interesting to you?}   # kinds: research, data, methods, finding
    requirements:
      - Prepare a 3-minute presentation with 1-2 slides.
    links: [{label: Guidelines, file: projects/project_guidelines.pdf}]
```

## Links

Every `links:` entry is `{label, file}` plus optional `icon` (a Font Awesome class such as
`fa-file-pdf-o`) and `optional: true` (a muted chip). `file` is a path relative to the site
root or an `https://` URL. Icons default by file type: PDF, notebook, data, page, external.

## Editing with forms

Double-click `Edit <code>.app` in a course folder (e.g. `econ-0100/Edit ECON 0100.app`), or
run `course-assets/editor/edit-course <site>`. The app opens whichever course folder it sits
in, so a new course gets one by copying another course's app into its folder and renaming it.
It starts a small local server and opens the editor in the browser: an outline of the
course on the left, a form for the selected block, part, checkpoint, project or the course
header in the middle (only fields in use are shown; the rest wait as chips, such as
"+ Video", that open the field when clicked; each exercise, vignette and homework card
carries its own date),
and the real part page on the right, showing unsaved edits. Fields
are checked as you type with `course-schema.js`; each block shows which of its
conventional PDFs are on disk. Save (⌘S) writes the file and runs `check-course`; Diff
shows what changed since the last commit. It picks up edits made to the file elsewhere,
and it stops itself a few minutes after the last editor tab closes (or at Quit).

Saving changes only what was edited. `editor/source.js` makes each edit as a small splice
of the YAML text (one value, one key's lines, one list item's lines) and re-parses the
result to confirm it; comments, quoting, alignment and indentation elsewhere are left as
they were. Keys the forms do not know are kept and listed under the form. An app runs
`../tayweid.github.io/course-assets/editor/edit-course`, so leave it in its course folder and
drag it to the Dock from there.
Courses opened are remembered in `~/Library/Application Support/Edit Course/`.

## The current part

A shell that declares `data-course-part="current"` (a site's `index.html`) shows the part
under way today, so the bare address needs no path. The current part is the first whose
last scheduled date (any block, step or checkpoint date) has not passed: a part stays
current through its checkpoint day, the next takes over the day after, and outside the
term it is the first or the last scheduled part. Add `?today=2026-10-06` to preview a day.

## Checking

Run the site's `scripts/check-course` before committing. It validates the wrapper, the YAML
syntax, every field, every YouTube ID, every local file the YAML names outright, that a
block with a directory on disk declares its `folder`, and that each `part-<id>.html` shell
exists and is wired to the renderer. Changing the renderer or the schema: run
`node --test course-assets/tests/*.test.js` here, then both sites' checkers.
