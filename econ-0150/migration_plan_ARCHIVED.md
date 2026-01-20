# ECON 0150 | Parts 1 & 2 Migration Plan

This document provides a detailed, file-by-file migration plan for transitioning the existing Part 1 and Part 2 materials to the new structure defined in `course_outline.md` and `work_plan_S26.md`.

---

## Executive Summary

**The key insight:** The new structure separates content by *data structure complexity*, not by *skill type*.

- **New Part 1:** Single-index, univariate data (cross-section categorical, cross-section numerical, time series, time series transforms)
- **New Part 2:** Multi-index OR bivariate data (relationships between variables, panel data, geographic)
- **New Part 6:** Data wrangling operations (cleaning, filtering, grouping, merging)

**What you can save:** Almost everything. Most content just moves to a new location.
**What you need to create:** 2.4 (Panel Format & Viz), 2.5 (Panel Relationships)

**Completed:**
- [x] Created `wrapup-1/` with univariate exercises (from part-1-6 wrap-up)
- [x] Created `wrapup-2/` with bivariate/panel exercises + data operations practice (from part-1-6 and part-2-5)
- [x] Added Anscombe's Quartet opener to Part 2.1
- [x] Added per capita transformation to Part 1.4
- [x] Added Simpson's Paradox opener to Part 5.1
- [x] Split Part 5.2 Interactions into its own file

---

## Current → Target Mapping Overview

| Current | Current Topic | Target | Action |
|---------|---------------|--------|--------|
| **part-1-1** | Categorical | **1.1** | Keep in place, update framing |
| **part-1-2** | Numerical | **1.2** | Keep in place, update framing |
| **part-1-3** | Time Series | **1.3** | Keep, integrate filtering from 2-3 |
| **part-1-4** | Panel Data | **2.3** | Move to Part 2 |
| **part-1-5** | Bivariate Relationships | **2.1** | Move to Part 2 |
| **part-1-6** | Geographic | **2.6** | Move to Part 2 |
| **part-2-1** | Data Cleaning | **Part 6** | Move to data workshop |
| **part-2-2** | Transformations | **1.4 + Part 6** | Split: transforms → 1.4, rest → 6 |
| **part-2-3** | Filtering | **Part 1** | Keep in Part 1 (as 1.5 or integrate with 1.3) |
| **part-2-4** | Grouping | **Part 2** | Keep in Part 2 (grouped visualizations) |
| **part-2-5** | Merging | **Part 6** | Move to data workshop |

---

## Detailed Migration: Part 1 Units

### part-1-1 → New 1.1 (Cross-section Categorical)

**Status:** Keep in place with minor updates

**Current content (concept_1_1.qmd):**
- Coffee shops by state example
- Bar charts for nominal categorical
- Pie charts for binary categorical
- Ordering, decluttering, annotation

**Files to keep:**
- `concept_1_1.qmd` - update title to "Part 1.1 | Cross-section Categorical"
- `concept_1_1.pdf` / `concept_1_1.html`
- `Notes_1_1_Categorical.md` / `.pdf`
- `Exercise_1_1.ipynb`
- `Homework_1_1.ipynb` / `Homework_1_1_sols.ipynb`
- `Main_1_1.ipynb`
- `data/` folder (Coffee_Shops.csv, etc.)
- `i/` folder (all images)

**Required updates:**
1. Add S-T-E framing at start of slides
2. Add "Building Blocks Updated" slide at end showing what was added
3. Consider adding "when to use which" guidance

**Estimated effort:** Low - mostly framing updates

---

### part-1-2 → New 1.2 (Cross-section Numerical)

**Status:** Keep in place with minor updates

**Current content (concept_1_2.qmd):**
- Starbucks customer age distribution
- Histograms (equal bins, bin width, noise vs resolution)
- Boxplots + stripplots
- Quartiles, outliers

**Files to keep:**
- `concept_1_2.qmd` - update framing
- `concept_1_2.pdf` / `concept_1_2.html`
- `Notes_1_2_Numerical.md` / `.pdf`
- `Exercise_1_2.ipynb` / `Exercise_1_2_sols.ipynb`
- `Homework_1_2.ipynb` / `Homework_1_2_sols.ipynb`
- `Main_1_2.ipynb`
- `data/` folder
- `i/` folder

**Required updates:**
1. Add S-T-E framing
2. Add "Building Blocks Updated" slide
3. Consider adding descriptive statistics discussion (mean, median, SD)

**Estimated effort:** Low

---

### part-1-3 → New 1.3 (Time Series)

**Status:** Keep with integration from part-2-3

**Current content (concept_1_3.qmd):**
- Coffee prices over time
- Line graphs for trends
- Seasonality using multi-boxplots (already excellent coverage)
- Background shading for periods

**Files to keep:**
- `concept_1_3.qmd` - update and extend
- `Notes_1_3_Timeseries.md` / `.pdf`
- `Homework_1_3.ipynb` / `Homework_1_3_sols.ipynb`
- `Main_1_3.ipynb`
- `data/` folder
- `i/` folder

**Content to integrate from part-2-3:**
- Basic time series filtering (filter for date ranges)
- Simple inequality filters for time series
- Keep advanced filtering for Part 6

**Specific slides to add from part-2-3:**
- Filter by inequality examples (e.g., prices after 2010)
- Simple date range filtering

**Required updates:**
1. Add basic filtering examples from 2-3
2. Add S-T-E framing
3. Add "Building Blocks Updated" slide
4. Consider adding "transactions by time of day" example (from 1-4)
5. Add foreshadowing for deseasonalization: "Later we'll learn to adjust for these patterns statistically" (after seasonality multi-boxplot section)

**Note:** Deseasonalization via fixed effects stays in Part 5 (requires regression knowledge). Part 1.3's multi-boxplot approach is the appropriate descriptive technique for this level.

**Estimated effort:** Medium - needs content integration

---

### part-2-2 (partial) → New 1.4 (Time Series Transforms)

**Status:** Create from part-2-2 transformation content

**Current content in part-2-2 (concept_2_2.qmd):**
- Inflation adjustment (nominal → real prices)
- ~~GMT timezone standardization~~ → **moves to part-1-bonus**
- Log transformation for scatterplots

**What moves to 1.4:**
- Inflation adjustment (real vs nominal prices) - **YES, primary content**
- Log transformation basics - **YES**
- Percentage change - **YES, needs to be made explicit**

**What moves to part-1-bonus:**
- GMT timezone / Starbucks global capacity example (interesting but confuses students - keep as optional content outside main progression)

**What needs to be created for 1.4:**
- ~~Year-over-year growth rates~~ (saved for Part 4)
- ~~Per capita adjustments~~ (done)

**Files to migrate:**
- `concept_2_2.qmd` → copy relevant sections to new `concept_1_4.qmd`
- `Notes_2_2_Transforming.md` → extract transform sections
- `data/Coffee_Prices_CPI.csv` → copy to part-1-4
- Relevant images from `i/` folder

**Naming note:** Current `part-1-4` is Panel Data. That directory needs to be renamed/moved first. Suggested approach:
1. Rename `part-1-4` → `part-1-4-old-panel` (temporary)
2. Create new `part-1-4` for transforms
3. Move panel content to `part-2-3`

**Estimated effort:** High - requires content creation and reorganization

---

## Detailed Migration: Part 2 Units

### part-1-5 → New 2.1 (Num × Num)

**Status:** Move to Part 2, add Anscombe's Quartet intro

**Current content (concept_1_5.qmd):**
- GDP vs coffee production scatterplots
- Log-log scales
- Filtering in scatterplots
- Multi-line time series comparisons
- Coffee vs oil price relationships

**Files to move:**
- `concept_1_5.qmd` → `part-2-1/concept_2_1.qmd` (replaces current 2-1)
- `Notes_1_5_Bivariate.md` / `.pdf`
- `Exercise_1_5.ipynb`
- `Homework_1_5.ipynb` / `Homework_1_5_sols.ipynb`
- `Main_1_5.ipynb`
- `data/Beans_GDP_2019.csv`, `Coffee_Oil.csv`, etc.
- `i/` folder

**Current part-2-1 content (Data Cleaning):** Move to Part 6

**New intro content to add (Anscombe's Quartet):**
- Anscombe's quartet demonstration
- "Why visualize relationships? Correlation isn't everything"
- Motivate the rest of Part 2
- Key slides:
  1. Show 4 datasets with identical summary statistics
  2. Reveal dramatically different scatterplots
  3. Message: "Numbers aren't enough, you need to look at the data"
- Files needed: `data/Anscombes_Quartet.csv`

**Required updates:**
1. Change title from "Part 1.5 | Bivariate Relationships" to "Part 2.1 | Numerical × Numerical"
2. Add Anscombe's Quartet as opening motivation
3. Add S-T-E framing
4. Consider finding more interesting example than age vs distance
5. Add size encoding example (bubble chart) - **needs creation**
6. Add shape encoding example - **needs creation**

**Estimated effort:** Medium - move plus additions

---

### part-2-4 → New 2.2 (Num × Cat / Grouping)

**Status:** Keep entire unit in Part 2 as Part 2.2

**Current content in part-2-4 (concept_2_4.qmd):**
- Starbucks promotional offers
- Filter → Group → Aggregate workflow
- Grouped bar charts (numerical values by category)
- Aggregation functions (sum, count, mean)
- Mean revenue by category visualizations

**Rationale:** The entire lesson supports visualizing numerical data across categorical groups. The groupby mechanics are in service of the visualization goal, so keeping them together makes sense.

**Files to move:**
- `part-2-4/` → rename to `part-2-2/` (after current part-2-2 content moves to 1.4)

**Required updates:**
1. Update title to "Part 2.2 | Numerical × Categorical" or "Part 2.2 | Grouping"
2. Add S-T-E framing
3. Consider adding grouped boxplot examples alongside the bar charts

**Estimated effort:** Low - mostly renaming and framing updates

---

### part-1-4 → New 2.3 (Panel Structure)

**Status:** Move to Part 2

**Current content (concept_1_4.qmd):**
- Long format vs wide format (excellent coverage)
- Coffee shop transactions by shop and hour
- Multi-line plots
- Coffee consumption per capita across countries and years
- Multi-boxplots comparing distributions across years
- Scatterplots for change over time

**Files to move:**
- `concept_1_4.qmd` → `part-2-3/concept_2_3.qmd`
- `Part_1_4_Panel.md` / `.pdf`
- `Exercise_1_4.ipynb`
- `Homework_1_4.ipynb` / `Homework_1_4_sols.ipynb`
- `Main_1_4.ipynb`
- `data/Coffee_Sales_Reciepts.csv`, `Coffee_Per_Cap.csv`
- `i/` folder

**Current part-2-3 content (Filtering):** Parts go to 1.3 and Part 6

**Required updates:**
1. Change title to "Part 2.3 | Panel Structure"
2. Emphasize long vs wide format more prominently
3. Add S-T-E framing
4. Position as "making both i and t active"

**Estimated effort:** Medium - mostly reorganization

---

### NEW 2.4 (Panel Format & Viz)

**Status:** Create from scratch with some content from 1-4

**Content to create:**
- Heatmaps for panel data
- Format determines visualization (long → multiline, wide → heatmap)
- Explicit faceting/small multiples lesson
- Sequential/diverging color scales

**Content that exists (in part-1-4):**
- Some multi-boxplot content could extend here

**Files needed:**
- `concept_2_4.qmd` - new slides
- `Exercise_2_4.ipynb`
- Consider trade data example (countries × years × import/export)

**Estimated effort:** High - mostly new creation

---

### NEW 2.5 (Panel Relationships)

**Status:** Create from scratch

**Content to create:**
- Scatter by group
- Small multiples for relationships
- How relationships vary across panel units
- Connecting to Part 4/5 (foreshadowing regression by group)

**Some content exists (in part-1-4):**
- Scatterplot of 1999 vs 2019 coffee consumption (useful starting point)
- Country-level comparisons

**Files needed:**
- `concept_2_5.qmd` - new slides
- `Exercise_2_5.ipynb`

**Current part-2-5 content (Merging):** Move to Part 6

**Estimated effort:** High - mostly new creation

---

### part-1-6 → New 2.6 (Geographic)

**Status:** Move to Part 2

**Current content (concept_1_6.qmd):**
- Pittsburgh restaurants by zipcode
- Maps with shapes and points
- Color encoding on maps
- Distance calculations
- Nunn (2008) and Weidman (2024) examples
- ~~Part 1 Wrap Up exercises~~ **DONE: Extracted to wrapup-1/ and wrapup-2/**

**Files to move:**
- `concept_1_6.qmd` → `part-2-6/concept_2_6.qmd`
- `Homework_1_6.ipynb` / `Homework_1_6_sols.ipynb`
- `Main_1_6.ipynb`
- `data/` folder (shapefiles, etc.)
- `i/` folder

**Required updates:**
1. Change title to "Part 2.6 | Geographic"
2. ~~Separate "Part 1 Wrap Up" exercises into own file or move to review~~ **DONE**
3. Simplify Pittsburgh example if too complex for students
4. Consider using PA income by county as main exercise

**Estimated effort:** Medium - move plus some simplification

---

## Detailed Migration: Data Wrangling → Part 6

### part-2-1 (Data Cleaning) → Part 6

**Current content (concept_2_1.qmd):**
- String parsing (birthday → year)
- Type conversion (text → numbers)
- Missing values (drop vs fill)

**Action:** Move entire unit to Part 6 as "Data Cleaning Workshop"

**Files to move:**
- All files from `part-2-1/` → `part-6-?/`

---

### part-2-3 (Filtering) → Part 1

**Status:** Keep in Part 1 (as 1.5 or integrate with 1.3)

**Current content (concept_2_3.qmd):**
- Filter by single category: `df[df['country'] == 'US']`
- Filter by multiple categories: `.isin(['US', 'CA'])` or using `|`
- Boolean logic (AND `&`, OR `|`, NOT `~`)
- Filter by inequality: `df[df['open'] < 7]`
- Combining category + inequality filters
- Starbucks coffee shop hours example

**Rationale:** Filtering is fundamental - students need it to visualize subsets of data. The content builds progressively through one coherent example with no natural "basic vs advanced" split. All of it belongs in Part 1.

**Placement options:**
1. Integrate into Part 1.3 (Time Series) - filtering by date range is natural there
2. Create Part 1.5 (Filtering) as standalone unit after transforms

**Required updates:**
1. Update title/numbering based on placement decision
2. Add S-T-E framing

---

### part-2-4 (Grouping) → Part 2

**Status:** Keep in Part 2 (grouped visualizations)

**Current content (concept_2_4.qmd):**
- Group by categorical variables
- Aggregation functions (sum, count, mean, max, min)
- Filter → Group → Aggregate workflow
- Starbucks promotional offers analysis
- Output: bar charts showing numerical values by category

**Rationale:** The outputs are grouped bar charts - visualizing numerical data by categorical groups. This is exactly what Part 2.2 (Num × Cat) should cover. The groupby mechanics support the visualization goal.

**Placement:** This becomes Part 2.2 (Numerical × Categorical) or stays as a standalone grouping unit in Part 2.

**Required updates:**
1. Update title/numbering based on final Part 2 structure
2. Frame around "visualizing numerical data across categories"
3. Add S-T-E framing

---

### part-2-5 (Merging) → Part 6

**Current content (concept_2_5.qmd):**
- Merge types (1:1, 1:m, m:1)
- Join types (inner, left, right, outer)
- Common merge issues
- Election + income merge example
- ~~Practice Problems for MiniExam 2~~ **DONE: Moved to wrapup-2/**

**Action:** Move entire unit to Part 6 as "Data Merging Workshop"

**Completed:** Practice problems (Practice 1-6 + Tips slides) extracted and moved to `wrapup-2/concept_wrapup_2.qmd`

---

## Directory Renaming Plan

Execute in this order to avoid conflicts:

```
# Phase 1: Move current Part 1 content that's changing location
mv part-1-4 part-1-4-panel-OLD      # Panel → will become 2.3
mv part-1-5 part-1-5-bivariate-OLD  # Bivariate → will become 2.1
mv part-1-6 part-1-6-geo-OLD        # Geographic → will become 2.6

# Phase 2: Handle current Part 2 content
mv part-2-1 part-6-cleaning         # Cleaning → Part 6
mv part-2-2 part-2-2-transforms-OLD # Transforms → split to 1.4 and part-1-bonus
mv part-2-3 part-1-5                # Filtering → stays in Part 1 as 1.5
mv part-2-4 part-2-4-grouping-OLD   # Grouping → will become new 2.2
mv part-2-5 part-6-merging          # Merging → Part 6

# Phase 3: Create new Part 2 structure
mkdir part-2-0   # NEW: Anscombe's quartet
mv part-1-5-bivariate-OLD part-2-1  # Bivariate → 2.1
mv part-2-4-grouping-OLD part-2-2   # Grouping → 2.2 (Num × Cat)
mv part-1-4-panel-OLD part-2-3      # Panel → 2.3
mkdir part-2-4   # NEW: Panel Format & Viz
mkdir part-2-5   # NEW: Panel Relationships
mv part-1-6-geo-OLD part-2-6        # Geographic → 2.6
mkdir part-1-bonus  # GMT timezone / Starbucks example (optional, outside main progression)

# Phase 4: Create new 1.4 (Time Series Transforms)
mkdir part-1-4   # NEW: from old 2-2 transform content
```

---

## Content Creation Checklist

### Must Create (No existing content)

- [ ] **2.4 Panel Format & Viz** - Heatmaps, faceting, color scales
- [ ] **2.5 Panel Relationships** - Scatter by group, small multiples

### Must Create (Expand existing)

- [x] **1.4 Time Series Transforms** - Copied from 2-2, added per capita transformation (complete)

### Update Framing Only

- [ ] **1.1** - Add S-T-E, building blocks
- [ ] **1.2** - Add S-T-E, building blocks
- [ ] **1.3** - Add S-T-E, building blocks
- [x] **1.5** - Renamed from 2-3 (Filtering), files renamed to 1_5
- [x] **2.1** - Renamed from 1.5, files renamed to 2_1, Anscombe's Quartet added (still need encodings)
- [x] **2.2** - Renamed from 2-4 (Grouping), files renamed to 2_2
- [x] **2.3** - Renamed from 1.4, files renamed to 2_3
- [x] **2.6** - Renamed from 1.6, files renamed to 2_6

---

## Execution Plan: Phased Approach

### Phase 1: Structural Migration (Directory Renames) ✅ COMPLETE

Execute directory renames only - no content changes. This establishes the new structure.

**Part 1 directories staying in place:**
- `part-1-1` - stays (Categorical)
- `part-1-2` - stays (Numerical)
- `part-1-3` - stays (Time Series)

**Part 1 directories moving to Part 2:**
- [x] `part-1-4` → `part-1-4-panel-OLD` → `part-2-3` (Panel)
- [x] `part-1-5` → `part-1-5-bivariate-OLD` → `part-2-1` (Bivariate)
- [x] `part-1-6` → `part-1-6-geo-OLD` → `part-2-6` (Geographic)

**Part 2 directories reorganized:**
- [x] `part-2-1` → `part-6-1-cleaning` (Data Cleaning → Part 6)
- [x] `part-2-2` → `part-2-2-transforms-OLD` (temporary, content for 1.4)
- [x] `part-2-3` → `part-1-5` (Filtering → Part 1)
- [x] `part-2-4` → `part-2-4-grouping-OLD` → `part-2-2` (Grouping)
- [x] `part-2-5` → `part-6-2-merging` (Merging → Part 6)

**New Part 2 structure created:**
- [x] `part-2-1` populated (Bivariate, from old 1-5) - will add Anscombe's Quartet as intro
- [x] `part-2-2` populated (Grouping, from old 2-4)
- [x] `part-2-3` populated (Panel, from old 1-4)
- [x] `part-2-4` created (empty - for Panel Format)
- [x] `part-2-5` created (empty - for Panel Relationships)
- [x] `part-2-6` populated (Geographic, from old 1-6)

**New Part 1 structure created:**
- [x] `part-1-4` created (empty - for Time Series Transforms)
- [x] `part-1-5` populated (Filtering, from old 2-3)
- [x] `part-1-bonus` created (GMT timezone content)

---

### Phase 2: Update Titles & Framing ✅ COMPLETE (partial)

After structural migration, update file contents to reflect new numbering.

**Part 1 updates:**
- [ ] `part-1-1/concept_1_1.qmd` - Add S-T-E framing, building blocks slide (future)
- [ ] `part-1-2/concept_1_2.qmd` - Add S-T-E framing, building blocks slide (future)
- [ ] `part-1-3/concept_1_3.qmd` - Add S-T-E framing, building blocks slide (future)
- [x] `part-1-5/` - Renamed all files from 2_3 → 1_5, updated title to "Part 1.5 | Filtering Data"

**Part 2 updates (titles + file renaming):**
- [x] `part-2-1/` - Renamed all files from 1_5 → 2_1, updated title to "Part 2.1 | Bivariate Relationships"
- [x] `part-2-2/` - Renamed all files from 2_4 → 2_2, updated title to "Part 2.2 | Grouping Data"
- [x] `part-2-3/` - Renamed all files from 1_4 → 2_3, updated title to "Part 2.3 | Panel Data"
- [x] `part-2-6/` - Renamed all files from 1_6 → 2_6, updated title to "Part 2.6 | Relationships In Space"

**TODO: Content scrub needed (for later)**
File names and main slide titles have been updated, but internal references within the content may still use old part numbers. During a future content review pass, check and update:
- References to other parts (e.g., "as we saw in Part 1.4" → "Part 2.3")
- Cross-references in homework/exercise instructions
- Any internal slide references to part numbers
- Notes files that may reference old numbering

---

### Phase 3: Create New Content

After structure is in place, create content for new units.

**High priority (needed for course flow):**
- [x] `part-1-4/` - Time Series Transforms (copied from part-2-2-transforms-OLD)
  - Files copied and renamed from 2_2 → 1_4
  - Title updated to "Part 1.4 | Transforming Data"
  - Exercise references updated to "Exercise 1.4"
  - GMT/timezone content removed (lives in part-1-bonus)
  - Per capita transformation added
  - YoY growth saved for Part 4 (regression context)
- [x] `part-2-1/` - Added Anscombe's Quartet as opening section
  - 8 slides demonstrating why visualization matters
  - Shows 4 datasets with identical summary statistics but different patterns
  - Data file: `data/Anscombes_Quartet.csv`
  - Figures: `i/a_01.png` through `i/a_08.png`

**Lower priority (can be added incrementally):**
- [ ] `part-2-4/` - Panel Format & Viz (heatmaps, faceting)
- [ ] `part-2-5/` - Panel Relationships (scatter by group)
- [ ] Add bubble charts, shape encoding to 2.1
- [ ] Add grouped boxplots to 2.2

---

## Completed Work

### Part 1 Bonus Created

**part-1-bonus/** (optional content, outside main progression):
- `concept_1_bonus.qmd` - Starbucks GMT timezone standardization example
  - Shows how to standardize local times to GMT for global comparisons
  - Uses modulo to handle negative hours
  - Connects to broader standardization concept (like inflation adjustment)
- `Main_1_bonus.ipynb` - Code to generate figures
- `Exercise_1_bonus.ipynb` - Student exercise
- `custom.css`
- `data/` - Starbucks_Location_Hours.csv (and raw/simple versions)
- `i/` - i_01.png, i_02.png, i_03.png (opening time histograms)

---

### Wrapup Directories Created

**wrapup-1/** (after Part 1 - univariate data):
- `concept_wrapup_1.qmd` - 5 exercises
  - Exercise 1: Employment Status (cross-sectional, binary categorical)
  - Exercise 2: Employment Industry (cross-sectional, nominal categorical)
  - Exercise 3: Educational Attainment (cross-sectional, ordinal categorical)
  - Exercise 4: Annual Income (cross-sectional, numerical)
  - Exercise 5: GDP After 2015 (timeseries, numerical)
- `custom.css`
- `data/` - wrapup_01.csv through wrapup_04.csv, wrapup_08.csv
- `i/` - corresponding images

**wrapup-2/** (after Part 2 - bivariate/panel data):
- `concept_wrapup_2.qmd` - 5 exercises + 6 practice problems + tips
  - Exercise 1: Employment by Education (categorical × categorical)
  - Exercise 2: Income by Education (numerical × categorical)
  - Exercise 3: Income by Age (numerical × numerical)
  - Exercise 4: Inflation and Unemployment (timeseries bivariate)
  - Exercise 5: GDP Growth by Country (panel)
  - Practice 1-6: Data operations (filtering, grouping, cleaning, transforms)
  - Tips slides for Part 2
- `custom.css`
- `data/` - wrapup_05.csv through wrapup_07.csv, wrapup_09.csv, wrapup_10.csv
- `i/` - corresponding images

---

### Part 2 Anscombe's Quartet Added (January 2026)

**part-2-1/** (opener added to existing Bivariate content):
- Added 8 slides introducing Anscombe's Quartet at start of concept_2_1.qmd
- Demonstrates why visualization matters: 4 datasets with identical summary statistics
  - All have same mean X (9.0), mean Y (7.5), correlation (0.816), regression line
  - But plots reveal: linear, curved, outlier, and vertical cluster patterns
- Key message: "Always look at your data" - motivates the entire Part 2 focus on relationships
- Data file: `data/Anscombes_Quartet.csv`
- Figures: `i/a_01.png` through `i/a_08.png`
- Generated by `Main_2_1.ipynb`

---

### Part 1.4 Per Capita Added (January 2026)

**part-1-4/** (transformation content expanded):
- Added per capita transformation section to concept_1_4.qmd
- Uses GDP comparison example: US vs Luxembourg
  - Raw GDP: US = $23T, Luxembourg = $81B
  - Per capita: US = $70K, Luxembourg = $125K
- Shows how per capita normalization changes the story
- Complements existing inflation adjustment content

---

### Part 5 Content Created (January 2026)

**part-5-1/** (Simpson's Paradox opener added):
- Added 7 slides demonstrating Simpson's Paradox using hospital survival rates
- Hospital A has 86% overall survival vs Hospital B's 68%
- But Hospital B performs better in both mild (98% vs 95%) and severe (60% vs 50%) cases
- Confounding variable: patient severity mix (Hospital A gets mostly mild, Hospital B gets mostly severe)
- Data file: `data/Hospital_Survival.csv`
- Figures: `i/s_01.png` through `i/s_06.png`
- Notebook: `Main_5_1.ipynb` generates all figures

**part-5-2/** (split from part-5-1):
- Created separate file for Interaction Models content
- `concept_5_2.qmd` contains Models 3-4 (different slopes by group), Comparison, Key Takeaways
- Copied `custom.css` for consistent styling
- Original `concept_5_1.qmd` now covers Simpson's Paradox + Fixed Effects (Models 1-2) only

---

## Notes

- The new structure makes the course arc clearer: single variables → relationships → models
- Consider creating a "Building Blocks Tracker" document that shows what's been added at each point
