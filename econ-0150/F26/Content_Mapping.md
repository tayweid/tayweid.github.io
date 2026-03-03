# ECON 0150 F26 Content Mapping Reference

Quick-reference for where every current block lands in the proposed structure.

## Current → Proposed (sorted by current block)

| Current | Title | → | Proposed | New Title |
|---------|-------|---|----------|-----------|
| 0 | Framework | → | 0 | Framework |
| 1.1 | Categorical Data | → | 2.1 | Categorical Variables (opens Part 2) |
| 1.2 | Numerical Data | → | 1.1 | Numerical Variables (expanded with line plots) |
| 1.3 | Time Series | → | 1.1 + 2.6 | Split: viz → 1.1 (line plots), autocorrelation → 2.6 (diagnostics) |
| 1.4 | Panel Long | → | 2.4 | Panel Data & Pre/Post (merged with 1.5) |
| 1.5 | Panel Wide | → | 2.4 | Panel Data & Pre/Post (merged with 1.4) |
| 2.1 | Num × Num | → | 2.5 | Scatterplots & Regression (+ 4.1) |
| 2.2 | Num × Cat | → | 2.2 | Numerical × Categorical (EDA only) |
| 2.3 | Conditional | → | 3.1 | Conditional Relationships (opens Part 3) |
| 3.1 | Random Variables | → | 1.2 | Populations and Samples |
| 3.2 | CLT | → | 1.3 | The Central Limit Theorem |
| 3.3 | Confidence Intervals | → | 1.4 | CIs & Hypothesis Testing (+ 3.4) |
| 3.4 | Hypothesis Testing | → | 1.4 | CIs & Hypothesis Testing (+ 3.3) |
| 3.5 | Simplest GLM | → | 1.5 | The Simplest GLM (Part 1 capstone) |
| 4.1 | Numerical Predictors | → | 2.5 | Scatterplots & Regression (+ 2.1) |
| 4.2 | Model Residuals | → | 2.6 | Model Diagnostics (expanded with autocorrelation) |
| 4.3 | Categorical Predictors | → | 2.3 | Comparing Groups |
| 4.4 | Time Series Models | → | 2.6 | Model Diagnostics (autocorrelation as independence case study) |
| 5.1 | Categorical Controls | → | 3.2 | Categorical Controls |
| 5.2 | Interactions | → | 3.3 | Interactions |
| 5.3 | Numerical Controls | → | 3.4 | Numerical Controls |
| 6.1 | Analysis Workflow | → | 4.1 | Analysis Workflow |
| 6.2 | Communication | → | 4.2 | Presenting Findings |

## Proposed → Current (sorted by proposed block)

| Proposed | Title | ← | Source Blocks |
|----------|-------|---|---------------|
| 0 | Framework | ← | 0 |
| 1.1 | Numerical Variables | ← | 1.2 + 1.3 (viz only: line plots, basic transformations) |
| 1.2 | Populations and Samples | ← | 3.1 |
| 1.3 | The Central Limit Theorem | ← | 3.2 |
| 1.4 | CIs & Hypothesis Testing | ← | 3.3 + 3.4 |
| 1.5 | The Simplest GLM | ← | 3.5 |
| 2.1 | Categorical Variables | ← | 1.1 |
| 2.2 | Numerical × Categorical | ← | 2.2 (EDA only) |
| 2.3 | Comparing Groups | ← | 4.3 (modeling only) |
| 2.4 | Panel Data & Pre/Post | ← | 1.4 + 1.5 (wrangling) + pre/post design |
| 2.5 | Scatterplots & Regression | ← | 2.1 (EDA) + 4.1 (modeling) |
| 2.6 | Model Diagnostics | ← | 4.2 + 4.4 (autocorrelation only) |
| 3.1 | Conditional Relationships | ← | 2.3 |
| 3.2 | Categorical Controls | ← | 5.1 |
| 3.3 | Interactions | ← | 5.2 |
| 3.4 | Numerical Controls | ← | 5.3 |
| 4.1 | Analysis Workflow | ← | 6.1 |
| 4.2 | Presenting Findings | ← | 6.2 |

## File Directory Mapping

The `parts/` directories keep their current names. Only the HTML page organization changes.

| Proposed Block | References Files In |
|----------------|-------------------|
| 1.1 | `parts/part-1-2/` + `parts/part-1-3/` (viz only) |
| 1.2 | `parts/part-3-1/` |
| 1.3 | `parts/part-3-2/` |
| 1.4 | `parts/part-3-3/` + `parts/part-3-4/` |
| 1.5 | `parts/part-3-5/` |
| 2.1 | `parts/part-1-1/` |
| 2.2 | `parts/part-2-2/` |
| 2.3 | `parts/part-4-3/` |
| 2.4 | `parts/part-1-4/` + `parts/part-1-5/` |
| 2.5 | `parts/part-2-1/` + `parts/part-4-1/` |
| 2.6 | `parts/part-4-2/` + `parts/part-4-4/` (autocorrelation only) |
| 3.1 | `parts/part-2-3/` |
| 3.2 | `parts/part-5-1/` |
| 3.3 | `parts/part-5-2/` |
| 3.4 | `parts/part-5-3/` |
| 4.1 | `parts/part-6-1/` |
| 4.2 | `parts/part-6-2/` |

## Where Time Lives

Time is not a standalone unit. It appears in three places:

| Time concept | Location | Role |
|-------------|----------|------|
| Line plots, basic transformations | **1.1** Numerical Variables | The t-indexed way to visualize one numerical variable |
| Panel structure, pre/post design | **2.4** Panel Data & Pre/Post | Using time to strengthen group comparisons (Card & Krueger) |
| Autocorrelation | **2.6** Model Diagnostics | The independence assumption violation case study |
