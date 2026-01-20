## ECON 0150 | Spring 2026 | Work Plan

Sequential to-do list for course prep. Course structure is in `course_outline.md`.

---

## Part 0: Framework

**Slides & Content**
- [x] Framework slides (building blocks, S-T-E, x_it)
- [ ] Card & Krueger hook slides (minimum wage motivation)
- [ ] Variable types slides (binary, nominal, ordinal, discrete, continuous)
- [ ] Past semester survey visualizations (Day 1 preview)

**Exercises & Data**
- [ ] Current semester survey data ready
- [ ] Exercise using survey data (different variables than slides)

---

## Part 1: Exploring Variables

### 1.1 Cross-section Categorical
- [ ] Add Building Blocks summary slide (what's added: categorical variables, bar/pie)
- [ ] Add S-T-E walkthrough for the example
- [ ] Add visualization guidelines (pie for binary, bar for nominal, ordered bar for ordinal)
- [ ] Add tables vs figures discussion
- [ ] Encoding: color (categorical) is introduced here — make explicit

### 1.2 Cross-section Numerical
- [ ] Add Building Blocks summary slide (what's added: numerical variables, histogram/boxplot)
- [ ] Add S-T-E walkthrough for the example
- [ ] Decide where descriptive statistics (centrality/dispersion) goes
- [ ] Consider adding inequality example (income distribution, Gini)

### 1.3 Time Series
- [ ] Add Building Blocks summary slide (what's added: time series structure, line plot)
- [ ] Add S-T-E walkthrough for the example
- [ ] Encoding: make line type/pattern explicit (solid vs dashed for different series)
- [ ] Add example: transactions by time of day

### 1.4 Transforming Data
- [x] Inflation adjustment, log transformation, per capita — complete
- [ ] Add Building Blocks summary slide (what's added: log, inflation adjust, per capita, difference)
- [ ] Add S-T-E walkthrough for the example
- [ ] Make percentage change calculation explicit

### 1.5 Filtering Data
- [x] Content exists
- [ ] Add Building Blocks summary slide (what's added: filter operation)
- [ ] Add S-T-E walkthrough for the example

---

## Part 2: Exploring Relationships

### 2.1 Bivariate (Num × Num)
- [x] Anscombe's Quartet opener — complete
- [x] Size encoding (bubble chart) — complete
- [x] Shape encoding — complete
- [ ] Add Building Blocks summary slide (what's added: scatter, bubble, correlation)
- [ ] Add S-T-E walkthrough for the example
- [ ] Consider adding inequality example (GDP vs life expectancy with Gini as size)

### 2.2 Grouping (Num × Cat)
- [x] Content exists
- [ ] Add Building Blocks summary slide (what's added: grouped boxplot, group operation)
- [ ] Add S-T-E walkthrough for the example
- [ ] Consider adding: wages by education example (labor market thread)

### 2.3 Panel (Long Format)
- [x] Multi-line plots, faceting — complete
- [ ] Add Building Blocks summary slide (what's added: panel structure, multi-line, facets)
- [ ] Add S-T-E walkthrough for the example
- [ ] Consider replacing marriage rates example with labor/trade data

### 2.4 Reshaping
- [x] melt() and pivot() content — complete
- [ ] Add Building Blocks summary slide (what's added: reshape operations - melt, pivot)
- [ ] Add S-T-E walkthrough for the example

### 2.5 Geographic
- [x] Content exists
- [ ] Add Building Blocks summary slide (what's added: geographic structure, maps)
- [ ] Add S-T-E walkthrough for the example
- [ ] Encoding: sequential/diverging color scales — make explicit
- [ ] Simplify example (current one too difficult)
- [ ] Use PA income by county for exercise

---

## Part 3: Univariate GLM

### 3.1 Random Variables
- [x] Content exists
- [ ] Z-scores/standardization taught here — verify it's explicit

### 3.2 Sampling & CLT
- [x] Content exists
- [ ] Add population vs sampling distribution visual

### 3.3 Confidence Intervals
- [x] Content exists
- [ ] Encoding: error bars introduced here — verify it's explicit
- [ ] Z-scores/standardization reinforced here

### 3.4 Hypothesis Testing
- [x] Content exists
- [ ] Add ethics in hypothesis testing section

### 3.5 Simplest GLM
- [x] Content exists

---

## Part 4: Bivariate GLM

### 4.1 Numerical Predictors
- [x] Content exists

### 4.2 Model Residuals
- [x] Content exists
- [ ] Fix slide title (says "Part 4.3" should be "Part 4.2")
- [ ] Log scales used here — verify it's explicit

### 4.3 Categorical Predictors
- [x] Content exists

### 4.4 Time Series Models
- [x] Content exists
- [ ] Differencing transformation used here — verify it's explicit

---

## Part 5: Multivariate GLM

### 5.1 Categorical Controls
- [x] Simpson's Paradox opener — complete
- [x] Models 1-2 (fixed effects) — complete
- [ ] Differencing may appear here — verify

### 5.2 Interactions
- [x] Models 3-4 — complete

### 5.3 Numerical Controls
- [x] Pittsburgh housing example exists
- [ ] Add explicit "holding constant" interpretation
- [ ] Add correlation ≠ causation discussion
- [ ] Log scales used here — verify it's explicit
- [ ] Color (categorical) used here — verify it's explicit

---

## Part 6: Projects

- [ ] Review project templates
- [ ] Consider adding Tufte's visualization principles
- [ ] Differencing may appear in 6.1 — verify

---

## Cleanup Tasks

**Files to Delete**
- [ ] Delete `part-2-2-transforms-OLD` (content is in part-1-4)
- [ ] Archive `part-5-1-seasons` (seasonal analysis cut)
- [ ] Clean up `.ipynb_checkpoints` scattered throughout
- [ ] Remove orphaned datasets (e.g., GlobalLandTemperaturesByCity.csv)

**Fixes**
- [ ] Fix Part 4-5 slide title numbering mismatches
- [ ] Consolidate duplicate datasets across directories

---

## Ideas (Low Priority)

**Examples to Consider Adding**
- [ ] Minimum wage example (connects to Part 0 hook) — could go in Part 4 or 5
- [ ] FRED data example (unemployment, GDP, interest rates)
- [ ] Trade data for panel examples (imports/exports by country)

**Running Threads**
- [x] Coffee thread exists throughout
- [ ] Consider adding labor market thread as second running example:
  - 1.1: Employment by state (categorical)
  - 1.2: Wage distributions (numerical)
  - 2.2: Wages by education (grouped)
  - 4.1: Wage regression on education
  - 5.1/5.3: Gender wage gap with controls

**Enhancements**
- [ ] "When to use which visualization" reference guide
