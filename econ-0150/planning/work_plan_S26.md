## ECON 0150 | Spring 2026 | Work Plan

Everything needed to prepare the course for Spring 2026. Organized by part so you can work through it systematically. Target structure is defined in `course_outline.md`.

---

## Overall: Pedagogy & Delivery

Changes that apply across the whole course.

### The Learning Flow

Each unit follows a consistent arc:

```
Concept Video (before class)
    ↓
Quiz (start of class) — "Did you watch?"
    ↓
Exercise (in class) — Guided practice with support
    ↓
Homework (after class) — Independent practice
    ↓
Homework Demo (after due date) — Learn from mistakes
```

**Key framing:** Exercises are homework prep. The exercise and homework use the same skills, but:
- **Exercise:** Done with support (instructor, UTAs, peers). Scaffolded. Okay to struggle.
- **Homework:** Done independently. Similar structure to exercise. Demonstrates mastery.

Students should leave class thinking: "I just practiced exactly what I need to do for homework."

### Class Structure
- [ ] **Partial flip model:** record concept videos, do exercises in class
- [ ] **Class flow:** quiz → exercise → mention homework → UTA time between classes
- [ ] **End each part with a data project** using student's own data
- [ ] **Frame exercises as homework prep:** "This exercise prepares you for the homework"

### Exercise Design
- [ ] **Better questions:** "use this tool to answer a new question" not "repeat what I did"
- [ ] **Dual platform:** exercises in both Python and Excel
- [ ] **Exercise structure:** permanent blank version, in-class version, solutions version

### Building Blocks Tracking
- [ ] **Remind what's been added** to building blocks at each topic (explicit tracking in slides)

---

## Overall: Examples, Encodings & Transformations

Findings from systematic review of exercises and notebooks.

### Visual Encodings Audit

| Encoding | Currently Taught | Status | Recommendation |
|----------|------------------|--------|----------------|
| Position (x, y) | All parts | ✓ Strong | Keep |
| Color (categorical) | 1.1, 1.4, 5.3 | ✓ Strong | Keep |
| Color (sequential/diverging) | 2.4 heatmaps (target) | ✗ Missing | Add in 2.4 |
| Size (bubble charts) | Not taught | ✗ Missing | Add in 2.1 or 2.5 |
| Shape/marker type | Not taught | ✗ Missing | Add in 2.1 (distinguish groups) |
| Line type/pattern | Implicit only | ⚠ Weak | Make explicit in 1.3 |
| Faceting/small multiples | Implicit in 1.4 | ⚠ Weak | Make explicit in 2.4 or 2.5 |
| Log scales | 2.2, 4.2, 5.3 | ✓ Strong | Keep |
| Error bars | 3.3 | ✓ Strong | Keep |

**Tasks:**
- [ ] Add explicit **size encoding** example (bubble chart: GDP × population × life expectancy)
- [ ] Add explicit **shape encoding** example (distinguish groups when color isn't enough)
- [ ] Add explicit **faceting/small multiples** lesson in 2.4 or 2.5
- [ ] Add **sequential/diverging color scales** for heatmaps in 2.4

### Data Transformations Audit

| Transformation | Currently Taught | Where | Recommendation |
|----------------|------------------|-------|----------------|
| Log transform | ✓ Yes | 2.2, 4.2, 5.3 | Keep — essential |
| Inflation adjustment | ✓ Yes | 2.2 | Keep — essential |
| Differencing | ✓ Yes | 5.1, 6.1 | Keep — essential |
| Per capita | ✓ Yes | 1.2 (coffee) | Keep — essential |
| Aggregation/groupby | ✓ Yes | Throughout | Keep |
| Z-scores/standardization | ✓ Yes | 3.1, 3.3 | Keep |
| Percentage change | ⚠ Implicit | 1.4, 6.1 | Make explicit |
| Moving averages | ✗ Missing | — | Add to 1.4 |
| Seasonal adjustment | ⚠ Exists but orphaned | 5.1-seasons | Move to 1.4 |
| Index (base year = 100) | ✗ Missing | — | Add to 1.4 or 2.2 |
| Year-over-year growth | ✗ Missing | — | Add to 1.4 |

**Tasks:**
- [ ] Add **moving averages** example in 1.4 (smooth noisy time series)
- [ ] Add **index construction** (set base year = 100) in 1.4 — common in economics
- [ ] Add **year-over-year growth rates** calculation in 1.4
- [ ] Make **percentage change** explicit (not just implicit)
- [ ] Decide: integrate seasonal adjustment from 5.1-seasons into 1.4, or cut

### Economic Examples Audit

**Strong examples (keep and emphasize):**
| Example | Part | Why It's Strong |
|---------|------|-----------------|
| Coffee prices (real vs nominal) | 2.2 | Classic inflation adjustment |
| Pittsburgh housing prices | 5.3 | Hedonic pricing model — real estate econ |
| Gender wage gap | 5.1, 5.5 | Major labor economics topic |
| Unemployment & voter turnout | 6.1 | Political economy, real research |
| Life satisfaction vs GDP | 4.2 | Development economics |
| Starbucks sales patterns | 1.4 | Business operations, labor scheduling |

**Moderate examples (consider improving):**
| Example | Part | Issue | Suggestion |
|---------|------|-------|------------|
| Coffee shops by state | 1.1 | Interesting but not core econ | Keep — good for categorical |
| Customer age distribution | 1.2 | Consumer data, fine | Keep |
| Amazon book sales | 2.3 | Tangential to econ | Replace with labor/trade data? |
| Marriage rates | 2.3 | Social science, not core econ | Replace or reframe |
| Wait times | 4.1 | Service operations | Keep — good for regression intro |

**Missing economics examples to consider adding:**
- [ ] **Trade data** (imports/exports by country) — very relevant, good for panel
- [ ] **Inequality measures** (Gini coefficient, income shares) — major policy topic
- [ ] **Labor force participation** (beyond employment/unemployment)
- [ ] **Minimum wage** (Card & Krueger style) — you mention this in Part 0!
- [ ] **Interest rates / Fed data** — macro relevance
- [ ] **Stock returns** or financial data — if appropriate for course level

**Tasks:**
- [ ] Consider replacing Amazon book sales example with trade or labor data
- [ ] Add **minimum wage example** somewhere (natural follow-up to Part 0 hook)
- [ ] Add **inequality** example (income distribution, Gini) — could fit in 1.2 or 2.1
- [ ] Consider adding **FRED data** example (unemployment, GDP, interest rates)

### Example Consistency & Threads

Currently, **coffee** is a running thread (shops, prices, sales, production). This is good for continuity.

**Suggestion:** Create a second thread using **labor market data** that builds across parts:
- Part 1: Employment rates by state (categorical), wage distributions (numerical)
- Part 2: Wages over time, real vs nominal wages
- Part 3: Sampling from CPS/census data
- Part 4: Wage regression on education
- Part 5: Gender wage gap with controls
- Part 6: Project using IPUMS/CPS data

**Tasks:**
- [ ] Consider adding **labor market thread** as second running example
- [ ] Ensure Card & Krueger minimum wage hook in Part 0 connects to later content

---

## Overall: Content per Unit

Each unit should have the following content. Use the checklist below to track progress.

| Content | When | Purpose |
|---------|------|---------|
| Concept video (~10 min) | Before class | Core ideas, students watch at home |
| Quiz (2-3 questions) | Start of class | Confirms watching, replaces attendance |
| Exercise | During class | Apply concepts with support |
| Exercise video | After class | Recorded exercise or class livestream |
| Homework demo | After due date | Learn from mistakes, exam prep |

*Note: If no separate exercise recording, use the class livestream as the exercise video.*

### Naming Convention
```
1.1_concept.mp4
1.1_exercise.mp4
1.1_homework_demo.mp4
```

### Content Checklist by Unit

**Part 0**
- [ ] Day 1 slides + recording
- [ ] Day 2 concept video
- [ ] Day 2 quiz
- [ ] Day 2 exercise video

**Part 1**
| Unit | Concept | Quiz | Exercise Video | HW Demo |
|------|---------|------|----------------|---------|
| 1.1 | [ ] | [ ] | [ ] | [ ] |
| 1.2 | [ ] | [ ] | [ ] | [ ] |
| 1.3 | [ ] | [ ] | [ ] | [ ] |
| 1.4 | [ ] | [ ] | [ ] | [ ] |

**Part 2**
| Unit | Concept | Quiz | Exercise Video | HW Demo |
|------|---------|------|----------------|---------|
| 2.0 | [ ] | [ ] | [ ] | [ ] |
| 2.1 | [ ] | [ ] | [ ] | [ ] |
| 2.2 | [ ] | [ ] | [ ] | [ ] |
| 2.3 | [ ] | [ ] | [ ] | [ ] |
| 2.4 | [ ] | [ ] | [ ] | [ ] |
| 2.5 | [ ] | [ ] | [ ] | [ ] |
| 2.6 | [ ] | [ ] | [ ] | [ ] |

**Part 3**
| Unit | Concept | Quiz | Exercise Video | HW Demo |
|------|---------|------|----------------|---------|
| 3.1 | [ ] | [ ] | [ ] | [ ] |
| 3.2 | [ ] | [ ] | [ ] | [ ] |
| 3.3 | [ ] | [ ] | [ ] | [ ] |
| 3.4 | [ ] | [ ] | [ ] | [ ] |
| 3.5 | [ ] | [ ] | [ ] | [ ] |

**Part 4**
| Unit | Concept | Quiz | Exercise Video | HW Demo |
|------|---------|------|----------------|---------|
| 4.1 | [ ] | [ ] | [ ] | [ ] |
| 4.2 | [ ] | [ ] | [ ] | [ ] |
| 4.3 | [ ] | [ ] | [ ] | [ ] |
| 4.4 | [ ] | [ ] | [ ] | [ ] |

**Part 5**
| Unit | Concept | Quiz | Exercise Video | HW Demo |
|------|---------|------|----------------|---------|
| 5.1 | [ ] | [ ] | [ ] | [ ] |
| 5.2 | [ ] | [ ] | [ ] | [ ] |
| 5.3 | [ ] | [ ] | [ ] | [ ] |

---

## Overall: Priority Tasks (from Curriculum Audit)

Tasks identified from systematic review of parts directory against target structure.

### High Priority (Core Curriculum Gaps)
- [ ] **Create Anscombe's Quartet content** for 2.0 — key motivation for "why visualize relationships"
- [ ] **Create Simpson's Paradox intro** for Part 5 opener — motivates controls/confounding
- [ ] **Create explicit Interactions content** for 5.2 — currently no content exists
- [ ] **Migrate 1-4, 1-5, 1-6 content** to Part 2 structure (Panel → 2.3, Relationships → 2.1, Geographic → 2.6)
- [ ] **Relocate current Part 2** (data wrangling) to Part 6 or integrate at point-of-need

### Medium Priority (Pedagogical Improvements)
- [ ] **Add S-T-E pattern to Part 0 slides** — framework exists in docs but not operationalized
- [ ] **Add x_it notation to Part 0 slides** — powerful organizing concept not in current materials
- [ ] **Create "Building Blocks Updated" slide template** — use at end of each unit to show what was added
- [ ] **Add "when to use which visualization" guidance** — currently teach *how* but not *when*
- [ ] **Add correlation ≠ causation discussion** in Part 5 — common student misconception
- [ ] **Create long vs wide format content** for 2.4 — mentioned in target but not clearly taught

### Lower Priority (Cleanup & Technical Debt)
- [ ] **Consolidate duplicate datasets** — same CSVs copied across 4-5 directories
- [ ] **Fix Part 4-5 numbering mismatches** — e.g., concept_4_2.qmd says "Part 4.3" in title
- [ ] **Decide fate of seasonal analysis content** (part-5-1-seasons) — doesn't fit multivariate GLM focus
- [ ] **Archive old R code** if not being used (HW_4.1.R, HW_4.4.R, etc.)
- [ ] **Clean up .ipynb_checkpoints** and archived versions scattered throughout
- [ ] **Remove or use orphaned datasets** (e.g., GlobalLandTemperaturesByCity.csv)

---

## Overall: Cleanup Tasks

Technical debt to address.

- [ ] Clean up unused datasets (many in data folders aren't used)
- [ ] Clean up old image naming convention (i_xx → c_xx)
- [ ] MiniExams don't cover enough material — decide what to add

---

## Part 0: Framework (Week 1)

### Structure: Day 1 = Show, Day 2 = Name and Do

**Day 1: Introduction + Preview**
- [ ] Course intro and logistics
- [ ] Preview with **past semester survey data**: "Here's what students looked like last semester..."
  - Show bar charts, histograms, etc. without formally naming them
  - Informally surface variable types—they see before they name
  - Build anticipation: "We'll look at your data on Day 2"

**Day 2: Motivation + Framework + Their Data**
- [ ] **Card & Krueger hook** (10 min): "In 1992, New Jersey raised minimum wage... economists predicted X... data showed Y... this course is about learning to do that kind of analysis"
  - **Note:** Consider returning to minimum wage data later in course (Part 4 or 5) to show how the analysis actually works — connects opener to payoff
- [ ] Transition: "To get there, we need a framework..."
- [ ] **Framework concepts:**
  - What is data? (realizations of random variables)
  - x_it notation, substantive vs index variables
  - Building blocks introduction (variables, structures, operations, visualizations)
  - SELECT-TRANSFORM-ENCODE pattern
  - Course arc overview
- [ ] **Variable types** formally named (categorical: binary, nominal, ordinal; numerical: discrete, continuous)
- [ ] **Exercises:** Current semester survey data (their own class)
  - Use different variables than shown in slides so students can't copy

### Content to Prepare
- [ ] Past semester survey visualizations (for Day 1 preview)
- [ ] Card & Krueger slides (brief, motivating)
- [ ] Framework slides (building blocks, S-T-E, x_it)
- [ ] Current semester survey data ready for exercises

---

## Part 1: Exploring Variables

### Current → Target

| Current | → | Target |
|---------|---|--------|
| 1.0 Variable Types | → | Part 0 (Framework) |
| 1.1 Summarizing Categorical | → | 1.1 Cross-section Categorical |
| 1.2 Summarizing Numerical | → | 1.2 Cross-section Numerical |
| 1.3 Relationships Through Time | → | 1.3 Time Series |
| (new from old 2.2, 2.3) | → | 1.4 Time Series Transforms |
| 1.4 Panel Data | → | Move to Part 2 |
| 1.5 Bivariate Relationships | → | Move to Part 2 |
| 1.6 Relationships In Space | → | Move to Part 2 |

*Note: Variable types (old 1.0) now covered in Part 0. Part 1 starts at 1.1.*

### Unit 1.1: Cross-section Categorical
- [ ] Update framing to emphasize S-T-E pattern
- [ ] Add examples: binary (employed/not), nominal (coffee shops by state), ordinal (economic optimism)
- [ ] Add visualization guidelines:
  - Pie charts only for binary
  - Bar charts for nominal
  - Ordered bar for ordinal
  - Remove clutter, put info near objects
- [ ] Add tables vs figures discussion

### Unit 1.2: Cross-section Numerical
- [ ] Update framing to emphasize S-T-E pattern
- [ ] Keep current example (already good)
- [ ] Consider: where does descriptive statistics (centrality/dispersion) go?

### Unit 1.3: Time Series
- [ ] Integrate filtering content from old 2.3
- [ ] Add example: transactions by time of day

### Unit 1.4: Time Series Transforms
- [ ] Create from old 2.2 content (log, inflation adjustment, difference)
- [ ] Add more transformations:
  - [ ] **Moving averages** — smooth noisy time series (e.g., 7-day rolling average)
  - [ ] **Index construction** — set base year = 100, compare to baseline
  - [ ] **Year-over-year growth rates** — percentage change from same period last year
  - [ ] **Per capita adjustments** — divide by population
  - [ ] **Seasonal adjustment** — integrate content from part-5-1-seasons if keeping
- [ ] Consider: use **FRED data** (GDP, unemployment) as primary example
- [ ] Cut: GMT timezone parsing, complex string manipulation

---

## Part 2: Exploring Relationships

### Current → Target

| Current | → | Target |
|---------|---|--------|
| (new) | → | 2.0 Relationships Framework |
| 1.5 Bivariate Relationships | → | 2.1 Num × Num |
| (new from old 2.4) | → | 2.2 Num × Cat |
| 1.4 Panel Data | → | 2.3 Panel Structure |
| (new) | → | 2.4 Panel Format & Viz |
| (new) | → | 2.5 Panel Relationships |
| 1.6 Relationships In Space | → | 2.6 Geographic |

### Unit 2.0: Relationships Framework
- [ ] Create new: Anscombe's quartet motivation
- [ ] Frame: "why visualize relationships? correlation isn't everything"
- [ ] **Note:** No content currently exists for this — must be created from scratch

### Unit 2.1: Num × Num
- [ ] Move old 1.5 content here
- [ ] Find more interesting example (current age vs distance is boring)
  - Consider: **GDP vs life expectancy** (development economics)
  - Consider: **Education vs wages** (labor economics)
- [ ] Convert Jana's R code to Python
- [ ] Add **size encoding** example (bubble chart: show third variable as bubble size)
- [ ] Add **shape encoding** example (distinguish groups when color isn't enough)

### Unit 2.2: Num × Cat
- [ ] Create using old 2.4 grouping content
- [ ] May need new examples showing grouped comparison
  - Consider: **Wages by education level** (grouped boxplot)
  - Consider: **Income distribution by region** (inequality angle)

### Unit 2.3: Panel Structure
- [ ] Move old 1.4 content here
- [ ] Introduce long vs wide format

### Unit 2.4: Panel Format & Viz
- [ ] Create new: heatmaps, format determines visualization
- [ ] Add **sequential/diverging color scales** for heatmaps
- [ ] Add explicit **faceting/small multiples** lesson
- [ ] Consider: **trade data** example (countries × years × import/export value)
- [ ] Review what exists, determine what's needed

### Unit 2.5: Panel Relationships
- [ ] Create new: scatter by group, small multiples
- [ ] Review what exists, determine what's needed

### Unit 2.6: Geographic
- [ ] Move old 1.6 content here
- [ ] Use PA income by county dataset for exercise
- [ ] Simplify example (current one is too difficult)

---

## Part 3: Univariate GLM

### Current State
- 3.1 (Sampling & Populations) ✓ exists
- 3.2 (CLT) ✓ exists with good examples
- 3.3 (Confidence Intervals) ✓ exists with detailed notes
- 3.4 (Hypothesis Testing) ✓ exists
- 3.5 (Simplest GLM) ✓ exists — introduces y = β₀ + ε framework

### Tasks
- [ ] Add **population vs sampling distribution** visual to slides — currently not explicit
- [ ] Add **ethics in hypothesis testing** section
  - Have students do bad hypothesis testing first
  - Then discuss what went wrong
- [ ] Consider adding explicit "Assumptions of inference" slide (independence, random sampling)

---

## Part 4: Bivariate GLM

### Current State & Issues
- 4.1 (Numerical Predictors) ✓ exists — wait time regression example
- 4.2 directory contains residuals/diagnostics content (good)
- 4.3 directory contains categorical predictors content (good)
- 4.4 (Time Series) ✓ exists — autocorrelation, lag plots

**File naming issue:** `concept_4_2.qmd` title says "Part 4.3 | Model Residuals and Diagnostics"
- Need to fix slide titles to match target numbering

### Tasks
- [ ] Fix slide title numbering to match target structure
- [ ] Review for any needed updates (no major changes identified)
- [ ] Consider: add explicit "checking assumptions" checklist slide

---

## Part 5: Multivariate GLM

### Current State & Issues
- 5.1 (Categorical Controls) ✓ exists — Gender Wage Gap example, good content
- 5.2 (Interactions) ✗ **NO CONTENT EXISTS** — must be created
- 5.3 (Numerical Controls) ✓ exists — Pittsburgh housing example
- 5.4 exists but is "Using GLM Appropriately" (capstone/review, not target content)
- 5.1-seasons exists but doesn't fit multivariate focus

**Content to relocate or cut:**
- `part-5-1-seasons`: Seasonal decomposition content — consider moving to 1.4 or cutting
- `part-5-4`: "Using GLM Appropriately" — could become review/capstone or merge into Part 6

### Reframing
- [ ] **New arc:** Start with bivariate relationship, wonder if something else impacts both variables → that's what Part 5 is about
- [ ] Open with **Simpson's paradox** to motivate the whole part — **must create this content**
- [ ] Add explicit **correlation ≠ causation** discussion

### Unit 5.1: Categorical Controls
- [ ] Simpson's paradox, fixed effects, seasons
- [ ] Use more than 2 categories in example
- [ ] Current content uses Gender Wage Gap — can extend naturally

### Unit 5.2: Interactions
- [ ] **Must create from scratch** — no content currently exists
- [ ] Use **gender wage gap** as main example (natural extension from 5.1)
- [ ] Show: "Does the return to education differ by gender?"
- [ ] Interpret interaction coefficients

### Unit 5.3: Numerical Controls
- [ ] Gender wage gap with controls
- [ ] Then Pittsburgh housing example (content exists in current part-5-3)
- [ ] Interpret "holding constant"

---

## Part 6: Projects & Data Operations

### Content to Migrate Here
Current Part 2 (data wrangling) needs a new home. Options:
1. **Move to Part 6** as "Data Operations Workshop" before projects
2. **Integrate at point-of-need** throughout Parts 1-2

| Current Location | Content | Recommended Destination |
|------------------|---------|------------------------|
| part-2-1 | Data Cleaning | Part 6 (workshop) |
| part-2-2 | Transformations | Part 1.4 (what's needed), Part 6 (rest) |
| part-2-3 | Filtering | Integrate into Part 1.3 |
| part-2-4 | Advanced Manipulation | Part 6 (workshop) |
| part-2-5 | Applied Wrangling / Merging | Part 6 (workshop) |

### Tasks
- [ ] Move data cleaning content here (from old 2.1)
- [ ] Move merging content here (from old 2.5)
- [ ] Add **Tufte's principles** for visualization
- [ ] Create **Data Operations Workshop:** Cleaning, Merging, Reshaping
- [ ] Consider: move "Using GLM Appropriately" (current 5.4) here as capstone
- [ ] Video resource: https://youtu.be/IHZHujXKQb0

### Current Project Content (Keep)
- part-6-1: Exercise_6.ipynb, project templates
- part-6-2: Presentation guidelines, Fall 2024 examples

---

## Content to Cut

| Content | Source | Reason |
|---------|--------|--------|
| GMT timezone parsing | Old 2.2 | Too specialized |
| Complex string manipulation | Old 2.2 | Too specialized |

---

## Final Cleanup

- [ ] Archive or delete old Part 2 units (2.1–2.5)
- [ ] Update course website navigation
- [ ] Update any references in homework/readings

---

## Appendix: Full Directory → Target Mapping

Complete mapping of current directories to target structure.

| Current Directory | Current Topic | Target Location | Action |
|-------------------|---------------|-----------------|--------|
| part-0 | Welcome, Survey | Part 0 | Keep, add framework content |
| part-1-0 | Data Structures | Part 0 | Merge into Part 0 Framework |
| part-1-1 | Categorical Viz | 1.1 | Keep, update framing |
| part-1-2 | Numerical Viz | 1.2 | Keep, update framing |
| part-1-3 | Time Series | 1.3 | Keep, integrate filtering |
| part-1-4 | Panel Data | 2.3 | Move to Part 2 |
| part-1-5 | Bivariate Relationships | 2.1 | Move to Part 2 |
| part-1-6 | Geographic | 2.6 | Move to Part 2 |
| part-2-1 | Data Cleaning | Part 6 | Move to workshop |
| part-2-2 | Transformations | 1.4 + Part 6 | Split: transforms to 1.4, rest to 6 |
| part-2-3 | Filtering | 1.3 | Integrate into 1.3 |
| part-2-4 | Advanced Manipulation | Part 6 | Move to workshop |
| part-2-5 | Merging | Part 6 | Move to workshop |
| part-3-1 | Sampling | 3.1 | Keep |
| part-3-2 | CLT | 3.2 | Keep |
| part-3-3 | Confidence Intervals | 3.3 | Keep |
| part-3-4 | Hypothesis Testing | 3.4 | Keep |
| part-3-5 | Simplest GLM | 3.5 | Keep |
| part-4-1 | Numerical Predictors | 4.1 | Keep |
| part-4-2 | Residuals/Diagnostics | 4.2 | Keep, fix title |
| part-4-3 | Categorical Predictors | 4.3 | Keep |
| part-4-4 | Time Series Regression | 4.4 | Keep |
| part-5-1 | Categorical Controls | 5.1 | Keep |
| part-5-1-seasons | Seasonal Analysis | 1.4 or Cut | Decide: move or remove |
| part-5-2 | (empty) | 5.2 | Create Interactions content |
| part-5-3 | Numerical Controls | 5.3 | Keep |
| part-5-4 | GLM Review | Part 6? | Relocate as capstone |
| part-6-1 | Project Planning | Part 6 | Keep |
| part-6-2 | Presentations | Part 6 | Keep |

### Content to Create from Scratch
- [ ] **2.0**: Anscombe's Quartet — why visualize relationships
- [ ] **2.4**: Panel Format & Viz — heatmaps, long vs wide
- [ ] **2.5**: Panel Relationships — scatter by group, small multiples
- [ ] **5.2**: Interactions — different slopes by group
- [ ] **Simpson's Paradox** opener for Part 5

---

## Notes

*Use this space to track decisions, issues, or ideas as you work.*

