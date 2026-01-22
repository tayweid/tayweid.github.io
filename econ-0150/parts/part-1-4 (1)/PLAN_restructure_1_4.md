# Part 1.4 + 1.5 Restructure Plan

## Overview

**Goal:** Split the current Part 1.4 content into two parts:
- **Part 1.4:** Panel Data (Long Format) — comparing groups
- **Part 1.5:** Panel Data (Wide Format) — comparing time periods

**Narrative Arc:**
- Part 1.4: "How do we visualize data with multiple groups?" → long format, faceting, line graphs
- Part 1.5: "How do we visualize change over time?" → motivation to reshape, melt/pivot, wide format applications

---

## Current State

### Files in part-1-4/
| File | Purpose | Disposition |
|------|---------|-------------|
| `concept_1_4.qmd` | Current slides (~730 lines) | Split into 1.4 and 1.5 |
| `concept_1_4_sup.qmd` | Reshaping slides (~230 lines) | Integrate into 1.5, then delete |
| `Main_1_4.ipynb` | Figure generation | Keep for 1.4, copy relevant to 1.5 |
| `Main_1_4_sup.ipynb` | Reshaping figures | Move to 1.5, then delete from 1.4 |
| `Notes_1_4_Panel.md` | Reading notes | Split into 1.4 and 1.5 |
| `Homework_1_4.ipynb` | Homework | Review - may need to split |
| `HW_1_4.md` | Homework spec | Review - may need to split |
| `PLAN_1_4_sup.md` | Old plan | Delete |
| `custom.css` | Slide styling | Copy to 1.5 |

### Files to Create for part-1-5/
| File | Purpose |
|------|---------|
| `concept_1_5.qmd` | New slides |
| `Main_1_5.ipynb` | Figure generation |
| `Notes_1_5_Wide.md` | Reading notes |
| `Homework_1_5.ipynb` | Homework (if splitting) |
| `Exercise_1_5.ipynb` | In-class exercise |
| `custom.css` | Copy from 1.4 |
| `data/` | Symlink or copy needed data |
| `i/` | Figures directory |

### Data Files
| File | Format | Used In |
|------|--------|---------|
| `Coffee_Sales_Reciepts.csv` | Long | Part 1.4 |
| `Coffee_Per_Cap.csv` | Wide | Part 1.5 |
| `GDP_Population_2019.csv` | Wide | Part 1.5 |

### Figures Inventory
**Part 1.4 figures (keep in part-1-4/i/):**
- `i_01.png` - Bar chart by shop
- `i_02.png` - Histogram by hour
- `i_03.png` - Overlaid histogram
- `i_04.png` - Line histogram (poly, filled)
- `i_05.png` - Line graph (poly, no fill)
- `f_01.png` - Faceted histogram

**Part 1.5 figures (move/create in part-1-5/i/):**
- `i_06.png` - Single year histogram
- `i_07.png` - Two year histograms
- `i_08.png` - Boxplot 1999 vs 2019
- `i_09.png` through `i_18.png` - Multi-boxplot variations
- `i_19.png` through `i_23.png` - Scatterplots
- `i_pc_01.png` - Total GDP bar chart
- `i_pc_02.png` - GDP per capita bar chart
- `w_01.png` through `w_06.png` - Reshaping diagrams (**NEED TO GENERATE**)

---

# PART 1.4: Panel Data (Long Format)

## Learning Objectives
By the end of Part 1.4, students should be able to:
1. Recognize long-format panel data
2. Use `hue` to color by group
3. Use faceting to create small multiples
4. Create multi-line graphs to compare groups over time

## Slide-by-Slide Structure (~28 slides)

### Title & Introduction (3 slides)

| # | Slide Title | Content | Figure | Source |
|---|-------------|---------|--------|--------|
| 1 | Part 1.4 \| Panel Data (Long Format) | Title slide | - | New |
| 2 | What is Panel Data? | Data with repeated observations across groups or time | - | New |
| 3 | Long Format Panel Data | Each observation is a row; a column identifies the group | Code output | Existing (modified) |

**Slide 2 content:**
```
## What is Panel Data?
<p class="subheader">Data with repeated observations</p>

- **Cross-sectional data:** One observation per unit (e.g., one row per country)
- **Time series data:** One unit observed over time (e.g., US GDP each year)
- **Panel data:** Multiple units observed over time (e.g., many countries, many years)

*> panel data lets us compare across units AND across time*
```

**Slide 3 content:**
```
## Long Format Panel Data
<p class="subheader">Each observation is a row</p>

{python code showing Coffee_Sales_Reciepts.csv head()}

*> each transaction is a row; the `Shop` column tells us which group*
```

---

### Coffee Shop Hiring Example (17 slides)

| # | Slide Title | Content | Figure | Source |
|---|-------------|---------|--------|--------|
| 4 | Hiring a Barista | Problem setup: 3 shops, where to hire? | - | Existing |
| 5 | Q. Which shop is busiest? | Question slide | - | Existing |
| 6 | Bar Charts Compare Groups | Bar chart answer | i_01.png | Existing |
| 7 | Q. What time is busiest? | Question slide | - | Existing |
| 8 | Histograms Show Time Distribution | Histogram answer | i_02.png | Existing |
| 9 | Q. Which shift is busiest? | Question slide | - | Existing |
| 10 | Overlaid Histograms | Hard to read | i_03.png | Existing |
| 11 | Solution 1: Faceting | Intro to faceting concept | - | Existing |
| 12 | Faceted Histograms | Each shop gets own panel | f_01.png | Existing |
| 13 | Faceting Q1 | Which shop busiest during morning rush? | f_01.png | Existing |
| 14 | Faceting Q2 | Which shop has most consistent traffic? | f_01.png | Existing |
| 15 | Solution 2: Line Graphs | Lines instead of bars | i_05.png | Existing |
| 16 | Summary: Comparing Groups | Long format + hue/faceting | - | New |

---

### Exercise 1.4 (8 slides)

| # | Slide Title | Content | Figure | Source |
|---|-------------|---------|--------|--------|
| 17 | Exercise 1.4 \| Coffee Shop Transactions | Exercise intro | - | Existing |
| 18 | Load the Data | Show data structure | Code | Existing |
| 19 | Bar Chart | `sns.countplot()` | i_01.png | Existing |
| 20 | Histogram | `sns.histplot()` | i_02.png | Existing |
| 21 | Multi-Histogram | `sns.histplot(..., hue='Shop')` | i_03.png | Existing |
| 22 | Faceted Histogram | `sns.displot(..., col='Shop')` | f_01.png | Existing |
| 23 | Groupby for Counts | `groupby(['Shop', 'Hours']).size()` | Code output | Existing |
| 24 | Multi-Line Graph | `sns.histplot(..., element='poly')` | i_05.png | Existing |

---

### Summary (2 slides)

| # | Slide Title | Content | Figure | Source |
|---|-------------|---------|--------|--------|
| 25 | Part 1.4 Summary | Key takeaways | - | New |
| 26 | Looking Ahead | Teaser for Part 1.5 | - | New |

**Slide 25 content:**
```
## Part 1.4 | Panel Data (Long Format)

#### Summary

::: {.incremental}
- **Long format:** Each observation is a row; a column identifies the group
- **Bar charts** compare totals across groups
- **Faceting** gives each group its own panel for easy comparison
- **Line graphs** simplify multiple groups on one plot
- Use `hue` and `col` parameters in seaborn
:::
```

**Slide 26 content:**
```
## Looking Ahead
<p class="subheader">Part 1.5: Panel Data (Wide Format)</p>

- What if we want to compare the **same units** across **different time periods**?
- Is the world drinking more coffee today than in 1999?
- We'll learn a different data format that makes this easy

*> next time: wide format and reshaping*
```

---

## Part 1.4 Files to Create/Modify

### concept_1_4.qmd (REWRITE)
- Keep slides 1-24 from current file (coffee shop content)
- Remove all wide format content (boxplots, scatterplots, per capita)
- Remove the early long vs wide comparison slides
- Add new intro slides (2-3)
- Add new summary slides (25-26)
- **Target: ~26 slides, ~300 lines**

### Notes_1_4_Panel.md (TRIM)
Keep only:
- The Busiest Shop
- The Busiest Time
- The Busiest Shift
- Summary
- Excel 1.4 Exercise | Multi-Linegraphs
- Python 1.4 Exercise | Multi-Linegraphs

Remove:
- Per Capita Transformations (move to 1.5)
- Scatterplots in Panel (move to 1.5)
- Comparing Boxplots (move to 1.5)

### Main_1_4.ipynb (TRIM)
Keep only cells that generate:
- i_01.png through i_05.png
- f_01.png

Remove cells for:
- Per capita figures
- Boxplot figures
- Scatterplot figures

---

# PART 1.5: Panel Data (Wide Format)

## Learning Objectives
By the end of Part 1.5, students should be able to:
1. Recognize wide-format panel data
2. Understand when to use long vs wide format
3. Use `melt()` to convert wide → long
4. Use `pivot()` to convert long → wide
5. Create multi-boxplots to compare distributions across time
6. Create scatterplots with 45-degree lines to track individual changes
7. Perform per capita transformations

## Slide-by-Slide Structure (~48 slides)

### Title & Motivation (6 slides)

| # | Slide Title | Content | Figure | Source |
|---|-------------|---------|--------|--------|
| 1 | Part 1.5 \| Panel Data (Wide Format) | Title slide | - | New |
| 2 | Recap: Long Format | Quick reminder from 1.4 | - | New |
| 3 | New Question | Is the world drinking more coffee? | - | New |
| 4 | The Challenge | Comparing 1999 vs 2019 is awkward in long format | Code | New |
| 5 | What We Want | Each year as its own column | - | New |
| 6 | Introducing Wide Format | Each time period is a column | Code | New |

**Slide 4 content (THE KEY MOTIVATION SLIDE):**
```
## The Challenge
<p class="subheader">Comparing specific years in long format</p>

```{python}
# Long format: years are VALUES in a column
coffee_long.head(8)
```

*> to compare 1999 and 2019, we'd need to filter twice and merge...*

. . .

*> there must be a better way!*
```

**Slide 6 content:**
```
## Wide Format Panel Data
<p class="subheader">Each time period is a column</p>

```{python}
# Wide format: years are COLUMNS
coffee_wide.head()
```

*> now comparing 1999 vs 2019 is just comparing two columns!*
```

---

### Reshaping: Converting Between Formats (12 slides)

| # | Slide Title | Content | Figure | Source |
|---|-------------|---------|--------|--------|
| 7 | Two Formats, Same Data | Intro to reshaping | - | From _sup |
| 8 | Wide Format Visual | Table visualization | w_01.png | Generate |
| 9 | Long Format Visual | Table visualization | w_02.png | Generate |
| 10 | Reshaping: Two Directions | melt and pivot intro | - | From _sup |
| 11 | Melting: Wide → Long | Diagram | w_03.png | Generate |
| 12 | Melting: The Code | `df.melt()` syntax | Code | From _sup |
| 13 | Melting: The Result | Line plot from long format | w_04.png | Generate |
| 14 | Pivoting: Long → Wide | Diagram | w_05.png | Generate |
| 15 | Pivoting: The Code | `df.pivot()` syntax | Code | From _sup |
| 16 | Pivoting: The Result | Scatterplot from wide format | w_06.png | Generate |
| 17 | When to Use Which Format | Decision table | - | From _sup |
| 18 | Reshaping Summary | Key takeaways | - | From _sup |

**Slide 12 content:**
```
## Melting: The Code
<p class="subheader">Use `melt()` to reshape wide → long</p>

```{.python}
# Wide to Long
long_df = wide_df.melt(
    id_vars=['Code'],        # Keep as identifier columns
    var_name='Year',         # Name for former column headers
    value_name='Consumption' # Name for the values
)
```

. . .

*> `id_vars` = columns to keep; everything else gets "melted"*
```

**Slide 15 content:**
```
## Pivoting: The Code
<p class="subheader">Use `pivot()` to reshape long → wide</p>

```{.python}
# Long to Wide
wide_df = long_df.pivot(
    index='Code',           # What becomes rows
    columns='Year',         # What becomes columns
    values='Consumption'    # What fills the cells
)
```

. . .

*> we're back to our original wide format!*
```

**Slide 17 content:**
```
## When to Use Which Format
<p class="subheader">Choose based on your task</p>

| Task | Better Format | Why |
|------|---------------|-----|
| Line plot over time | Long | `hue='Country'` works naturally |
| Faceted plots by group | Long | `col='Country'` works naturally |
| Compare two specific years | Wide | Columns are directly accessible |
| Scatterplot (Year1 vs Year2) | Wide | Each axis is a column |

. . .

*> neither is "better" — it depends on what you're doing*
```

---

### Per Capita Transformations (6 slides)

| # | Slide Title | Content | Figure | Source |
|---|-------------|---------|--------|--------|
| 19 | Per Capita Transformations | Intro | - | Existing |
| 20 | Which country has largest economy? | Total GDP | i_pc_01.png | Existing |
| 21 | Is largest = richest? | Question | i_pc_01.png | Existing |
| 22 | GDP Per Capita | Transformed data | i_pc_02.png | Existing |
| 23 | Per Capita Changes the Picture | Analysis | i_pc_02.png | Existing |
| 24 | Exercise: Per Capita | Code exercise | Code | Existing |

---

### Multi-Boxplots (15 slides)

| # | Slide Title | Content | Figure | Source |
|---|-------------|---------|--------|--------|
| 25 | Coffee Consumption Analysis | Is world drinking more coffee? | - | Existing |
| 26 | Single Year Histogram | 1999 distribution | i_06.png | Existing |
| 27 | Two Year Histograms | 1999 vs 2019 | i_07.png | Existing |
| 28 | Multi-Boxplots | Better comparison tool | i_08.png | Existing |
| 29 | Five Year Boxplots | Full time series | i_09.png | Existing |
| 30 | Reading Boxplots: Medians | Focus on medians | i_10.png | Existing |
| 31 | Median Jump | 2009-2014 increase | i_11.png | Existing |
| 32 | Reading Boxplots: Minimums | Focus on mins | i_12.png | Existing |
| 33 | Reading Boxplots: Maximums | Focus on maxes | i_13.png | Existing |
| 34 | Half Below 5kg? | Median < 5 | i_14.png | Existing |
| 35 | 25% Below 5kg? | Q1 < 5 | i_15.png, i_16.png | Existing |
| 36 | Greatest Range? | Range comparison | i_17.png, i_18.png | Existing |
| 37 | Boxplot Limitation | Can't track individuals | - | Existing |
| 38 | Exercise: Multi-Boxplots | Code exercise | i_09.png | Existing |

---

### Scatterplots: Tracking Individual Changes (8 slides)

| # | Slide Title | Content | Figure | Source |
|---|-------------|---------|--------|--------|
| 39 | Scatterplots for Change | New approach | - | Existing |
| 40 | 1999 vs 2019 Scatterplot | Basic plot | i_19.png | Existing |
| 41 | The 45-Degree Line | No-change reference | i_20.png | Existing |
| 42 | Above the Line | Increased consumption | i_21.png | Existing |
| 43 | Below the Line | Decreased consumption | i_22.png | Existing |
| 44 | Color by Direction | Full visualization | i_23.png | Existing |
| 45 | Exercise: Scatterplots | Code exercise | Code | Existing |

---

### Summary (3 slides)

| # | Slide Title | Content | Figure | Source |
|---|-------------|---------|--------|--------|
| 46 | Part 1.5 Summary | Key takeaways | - | New |
| 47 | Long vs Wide: Complete Picture | When to use each | - | New |
| 48 | Looking Ahead | Teaser for Part 2 | - | New |

**Slide 46 content:**
```
## Part 1.5 | Panel Data (Wide Format)

#### Summary

::: {.incremental}
- **Wide format:** Each time period is a column
- **melt()** converts wide → long (columns become rows)
- **pivot()** converts long → wide (rows become columns)
- **Per capita** transformations divide by population
- **Multi-boxplots** compare distributions across time
- **Scatterplots with 45° lines** track individual changes
:::
```

**Slide 47 content:**
```
## Long vs Wide: The Complete Picture
<p class="subheader">Choose format based on your task</p>

**Long Format (Part 1.4)**

- Comparing groups at a point in time
- Faceting, line graphs, groupby
- `hue='Group'`, `col='Group'`

**Wide Format (Part 1.5)**

- Comparing time periods for the same units
- Boxplots, scatterplots, correlations
- Each column is a time period
```

---

## Part 1.5 Files to Create

### Directory Structure
```
part-1-5/
├── concept_1_5.qmd          # Slides
├── Main_1_5.ipynb           # Figure generation
├── Notes_1_5_Wide.md        # Reading notes
├── Exercise_1_5.ipynb       # In-class exercise
├── Homework_1_5.ipynb       # Homework (if separate)
├── custom.css               # Copy from 1.4
├── data/
│   ├── Coffee_Per_Cap.csv   # Copy or symlink
│   └── GDP_Population_2019.csv
└── i/
    ├── i_06.png through i_23.png  # Copy from 1.4
    ├── i_pc_01.png, i_pc_02.png   # Copy from 1.4
    └── w_01.png through w_06.png  # Generate new
```

### concept_1_5.qmd (CREATE NEW)
- ~48 slides, ~550 lines
- Combine:
  - New motivation slides (1-6)
  - Reshaping content from concept_1_4_sup.qmd (7-18)
  - Per capita slides from concept_1_4.qmd (19-24)
  - Boxplot slides from concept_1_4.qmd (25-38)
  - Scatterplot slides from concept_1_4.qmd (39-45)
  - New summary slides (46-48)

### Main_1_5.ipynb (CREATE NEW)
Combine:
- Relevant cells from Main_1_4.ipynb (boxplots, scatterplots, per capita)
- All cells from Main_1_4_sup.ipynb (reshaping figures)
- New cells for motivation section figures

### Notes_1_5_Wide.md (CREATE NEW)
Content from Notes_1_4_Panel.md:
- Per Capita Transformations
- Scatterplots in Panel
- Boxplots section

Plus new content:
- Reshaping section (melt/pivot)
- When to use long vs wide

### Exercise_1_5.ipynb (CREATE NEW)
In-class exercises for:
- melt() practice
- pivot() practice
- Multi-boxplot creation
- Scatterplot with 45° line

---

## Homework Considerations

### Current Homework_1_4.ipynb Structure
Need to review what's in the current homework. Options:

**Option A: Keep all homework in 1.4**
- Pro: Less reorganization
- Con: Homework doesn't match content split

**Option B: Split homework**
- Homework_1_4: Coffee shop analysis (long format)
- Homework_1_5: Coffee consumption analysis (wide format)
- Pro: Matches content split
- Con: More files to manage

**Recommendation:** Review current homework, likely split to match content.

---

## Figures to Generate

### Must generate before creating slides:

**Run Main_1_4_sup.ipynb** to create in part-1-5/i/:
- [ ] `w_01.png` - Wide format table visualization
- [ ] `w_02.png` - Long format table visualization
- [ ] `w_03.png` - Melt operation diagram
- [ ] `w_04.png` - Line plot from long format
- [ ] `w_05.png` - Pivot operation diagram
- [ ] `w_06.png` - Scatterplot from wide format

**Verify exist or generate:**
- [ ] `i_pc_01.png` - Total GDP bar chart
- [ ] `i_pc_02.png` - GDP per capita bar chart

**Copy from part-1-4/i/ to part-1-5/i/:**
- [ ] `i_06.png` through `i_23.png`

---

## Execution Order

### Phase 1: Setup Part 1.5 Directory
1. Create `part-1-5/` directory
2. Create `part-1-5/data/` and `part-1-5/i/` subdirectories
3. Copy `custom.css` from part-1-4
4. Copy/symlink data files

### Phase 2: Generate Figures
1. Copy Main_1_4_sup.ipynb to part-1-5/Main_1_5.ipynb
2. Update paths in notebook
3. Run notebook to generate w_*.png figures
4. Copy i_06.png through i_23.png from part-1-4/i/
5. Verify i_pc_*.png exist, generate if needed

### Phase 3: Create Part 1.5 Slides
1. Create concept_1_5.qmd with new structure
2. Test that slides render correctly

### Phase 4: Create Part 1.5 Notes
1. Create Notes_1_5_Wide.md
2. Move relevant content from Notes_1_4_Panel.md
3. Add reshaping section

### Phase 5: Trim Part 1.4
1. Rewrite concept_1_4.qmd to remove wide format content
2. Trim Notes_1_4_Panel.md
3. Trim Main_1_4.ipynb

### Phase 6: Handle Homework
1. Review current homework structure
2. Split if needed

### Phase 7: Cleanup
1. Delete concept_1_4_sup.qmd
2. Delete Main_1_4_sup.ipynb
3. Delete PLAN_1_4_sup.md
4. Delete this plan file
5. Verify all links work

---

## Questions Before Proceeding

1. **Homework split:** Should we review the current homework structure before starting, or handle it at the end?

2. **Exercise notebooks:** Do you want separate Exercise_1_4.ipynb and Exercise_1_5.ipynb files, or are the exercise slides in the .qmd sufficient?

3. **Data files:** Copy data files to part-1-5/data/, or use symlinks, or reference ../part-1-4/data/?

4. **Figure numbering:** Keep existing figure names (i_06.png, etc.) in part-1-5, or renumber starting from i_01.png?
