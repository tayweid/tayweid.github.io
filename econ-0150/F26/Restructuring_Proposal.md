# ECON 0150 Restructuring Proposal: Organize Around Analytical Questions

## The Problem

The current course organizes Parts 1-2 around **data types** (categorical, numerical, time series, panel) and Parts 3-5 around **analytical questions** (what can we infer? how does y change with x?). These are two different organizing logics, and the seam between them is where students lose momentum. They spend ~8 blocks on "here's how to look at data" before encountering the big ideas of inference in Part 3 (around week 7). The visualization tools feel unmotivated because the interesting questions they'll eventually answer are weeks away.

Three specific symptoms:
1. **The long EDA plateau**: 8 blocks of description before any inference
2. **Redundant tools**: boxplots appear in 1.2, 1.5, and 2.2; scatterplots in 1.5 and 2.1; faceting in 1.4 and 2.3
3. **Low-stakes datasets**: coffee shop locations and Starbucks customer profiles don't carry enough intellectual weight to sustain student interest across 5 blocks

## The Proposal

**Organize the entire course around escalating analytical questions. Each part pairs the visualization tools with the statistical tools that answer the same question.**

The restructuring keeps all current content but resequences it so that students get intellectual payoff faster. The key move: instead of "all the EDA, then all the modeling," each unit delivers a complete arc from seeing to testing. Time is not quarantined into its own unit — it appears as a visualization tool (Part 1), a design strategy for causal reasoning (Part 2), and a cautionary tale about model assumptions (Part 2 diagnostics).

---

## Proposed Structure

### Part 0: Framework (1 block, Week 1)

**Unchanged.** Card & Krueger minimum wage study, data classification (x_it notation), variable types, data structures, S-T-E framework.

One addition: preview the full course arc explicitly so students know where they're heading.

---

### Part 1: Distributions (5 blocks, Weeks 2-4)

**Question: "What does this variable look like — and what can we learn about the truth?"**

This part is focused entirely on numerical data — one variable at a time. It opens by activating Part 0's x_it framework: the `i` subscript gives you a cross-section (histogram), the `t` subscript gives you a trajectory (line plot). Both are ways of seeing one numerical variable. Then students move from seeing to testing: populations, the CLT, confidence intervals, and the simplest model.

| Block | Title | Current Source | Content |
|-------|-------|---------------|---------|
| 1.1 | Numerical Variables | 1.2 + 1.3 (viz only) | Two ways to see one variable: histograms/boxplots for i-indexed data, line plots for t-indexed data. Five-number summary, mean, SD. Python: histplot(), boxplot(), lineplot(). |
| 1.2 | Populations and Samples | 3.1 | The bridge: "Your histogram is one sample. What about the truth?" Population vs sample, random variables as decks of cards. Building from range → mean deviation → variance → SD. |
| 1.3 | The Central Limit Theorem | 3.2 | Classroom dice simulation. x-bar ~ N(mu, sigma/sqrt(n)). Standard error. The key insight: we can learn about the population without knowing its distribution. |
| 1.4 | Confidence Intervals & Hypothesis Testing | 3.3 + 3.4 | The centerpoint flip. t-distribution for unknown sigma. CIs, p-values, interpreting significance. |
| 1.5 | The Simplest GLM | 3.5 | y ~ 1. The mean minimizes MSE. Variance as MSE. Testing the intercept. This is what CIs and hypothesis testing were building toward — our first formal model. |

**MiniExam 1** (~Week 5)

**What changed**: Block 1.1 now activates both subscripts from the Part 0 framework. Students see histograms (i-indexed) and line plots (t-indexed) as two lenses on the same kind of data. Line plots are available from week 2, unlocking temporal datasets for the rest of the course. Current 1.3's visualization content (line plots, basic transformations) is absorbed here; its analytical content (autocorrelation) moves to model diagnostics in Part 2.

**Why it works**: The Part 0 framework introduces x_it notation. Block 1.1 immediately puts both subscripts to work — "here are two ways to organize numerical data, depending on what your index means." Students don't just learn "here's a histogram"; they learn that the same variable looks different depending on whether you arrange it by unit or by time. Block 1.2 then asks: "but what if you had a different sample?" The CLT and CIs follow as the answer. The Simplest GLM is the capstone: the mean is the intercept, the CI is the confidence interval on the intercept, the t-test tests whether the intercept differs from zero. Students reach a complete model by week 4-5 instead of week 9-10.

---

### Part 2: Relationships (6 blocks, Weeks 5-9)

**Question: "Are these variables related — and is the relationship real?"**

This part introduces bivariate analysis. It opens with categorical variables — not as an abstract data type, but because categories are what create the groups students will compare. The first half (2.1-2.4) escalates categorical comparisons: understand categories → see group differences → test group differences → compare changes over time (pre/post). The second half (2.5-2.6) extends to continuous relationships and model checking.

| Block | Title | Current Source | Content |
|-------|-------|---------------|---------|
| 2.1 | Categorical Variables | 1.1 | Bar charts, pie charts, frequency tables. Python: loading data, value_counts(), countplot(). Introduced here because categories are the building block for group comparisons — you need to understand what a category is before you can split data by one. |
| 2.2 | Numerical × Categorical | 2.2 | Grouped boxplots, log transformation, filtering. The Starbucks BOGO question: "Do bigger offers lead to more spending?" Seeing group differences visually. |
| 2.3 | Comparing Groups | 4.3 | Dummy variables, two-sample t-test as regression, ANOVA. "The difference you saw in 2.2 — is it real or noise?" Students test the group difference they just visualized. |
| 2.4 | Panel Data & Pre/Post | 1.4 + 1.5 | Panel structure: x_it with both indexes. Long format (groupby, multi-line, faceting), wide format (melt/pivot). Pre/post design: compare the *change* across groups. Card & Krueger payoff — "Remember the minimum wage study from day one? Here's how they did it: compare the change in NJ employment to the change in PA employment." |
| 2.5 | Scatterplots & Regression | 2.1 + 4.1 | **EDA**: Anscombe's Quartet, scatterplots, log scales, bubble/color encoding. **Modeling**: y = beta_0 + beta_1*x + epsilon. MSE minimization, slope sampling distribution, testing H0: beta_1 = 0. Happiness vs GDP per capita. "You made a scatterplot — now test whether the line is real." |
| 2.6 | Model Diagnostics | 4.2 + 4.4 (autocorrelation only) | Residuals, predicted values, the residual plot. Four OLS assumptions: linearity, homoskedasticity, normality, independence. Autocorrelation as the case study for independence violation — regress GDP on time, see the residual wave. "Time series data almost always breaks this assumption. Here's what it looks like, and here's why we won't try to fix it in this course." |

**MiniExam 2** (~Week 9-10)

**What changed**: Panel data and pre/post design (2.4) now sit between group comparisons and regression. The logic: 2.3 tests whether groups differ, 2.4 tests whether groups *changed differently* — a more powerful version of the same idea using the time dimension. Card & Krueger, introduced on day one, gets its analytical payoff here. Model diagnostics (2.6) absorbs autocorrelation from the old time series models block as the independence violation case study, giving students a vivid example without requiring a standalone time series unit.

**Why it works**: The first half of Part 2 is a single escalating arc of group comparisons: What's a group? (2.1) → Do groups look different? (2.2) → Is the difference real? (2.3) → Did groups *change* differently over time? (2.4). Pre/post is the most sophisticated version of "comparing groups," and it uses both the categorical tools from 2.1-2.3 and the time dimension from 1.1. The second half pairs scatterplots with regression (see then test) and immediately checks the work. Autocorrelation isn't its own unit — it's the most vivid example of an assumption violation, and students already have the regression framework to understand why it matters.

---

### Part 3: Controlling for Complexity (4 blocks, Weeks 10-13)

**Question: "Is it really X causing Y, or is something else going on?"**

This part opens with the elections analysis — a genuine research question where the relationship between income and voting *flips* when you condition on a third variable. That motivating example immediately leads into the tools for handling confounders: categorical controls, interactions, and numerical controls.

| Block | Title | Current Source | Content |
|-------|-------|---------------|---------|
| 3.1 | Conditional Relationships | 2.3 | The elections analysis: Has politics become divided along economic lines? Boxplots by year, scatter of income vs voting, scatter by category showing the relationship flipped. Merging datasets. Ends with: "Income and voting are related — but the direction depends on what you control for. How do we handle this?" |
| 3.2 | Categorical Controls | 5.1 | Simpson's Paradox. Fixed effects / multiple intercepts. Gender wage gap: the raw difference → controlling for education. |
| 3.3 | Interactions | 5.2 | Interaction terms, different slopes by group. Gender wage gap: different returns to education by gender. |
| 3.4 | Numerical Controls | 5.3 | Multiple continuous predictors, "holding constant." Gender wage gap: controlling for number of children. (Or Pittsburgh housing.) |

**MiniExam 3** (~Week 13)

**Why it works**: Block 3.1 is the "wow" moment — students see a relationship reverse when they condition on category. That immediately motivates 3.2 (how to formally control for categories), 3.3 (what if the *slope* differs by group?), and 3.4 (what about continuous confounders?). The elections exercise is no longer a capstone looking backward — it's a launchpad looking forward.

---

### Part 4: Communicating With Data (2 blocks + Final Project, Weeks 14-15)

**Unchanged** from current Part 6.

| Block | Title | Current Source | Content |
|-------|-------|---------------|---------|
| 4.1 | Analysis Workflow | 6.1 | From question to data to model to interpretation. Replication folders. |
| 4.2 | Presenting Findings | 6.2 | Clear narratives, effective slides, student examples from prior semesters. |
| | Final Project | | 3-minute presentation, written report, replication folder. |

---

## Complete Content Mapping

Every current block mapped to its new location:

| Current | Current Title | New Location | Notes |
|---------|---------------|-------------|-------|
| 0 | Framework | **0** | Unchanged |
| 1.1 | Categorical Data | **2.1** | Moves to Part 2 as on-ramp for group comparisons |
| 1.2 | Numerical Data | **1.1** | Opens Part 1, expanded with line plots |
| 1.3 | Time Series | **1.1** (viz) + **2.6** (autocorrelation) | Split: line plots absorbed into 1.1, autocorrelation becomes diagnostics case study |
| 1.4 | Panel Long | **2.4** | Combined with 1.5, paired with pre/post design |
| 1.5 | Panel Wide | **2.4** | Combined with 1.4 |
| 2.1 | Num x Num (scatter) | **2.5** | Paired with regression (4.1) |
| 2.2 | Num x Cat (grouped boxplot) | **2.2** | See groups, then test them in 2.3 |
| 2.3 | Conditional Relationships | **3.1** | Opens Part 3 as motivating example for controls |
| 3.1 | Random Variables | **1.2** | Moves from week 7 to week 2-3 |
| 3.2 | CLT | **1.3** | Moves from week 8 to week 3 |
| 3.3 | Confidence Intervals | **1.4** | Moves from week 8-9 to week 3-4 |
| 3.4 | Hypothesis Testing | **1.4** | Merged with CIs (per Notes_3.md structure) |
| 3.5 | Simplest GLM | **1.5** | Capstone of Part 1 inference arc |
| 4.1 | Numerical Predictors | **2.5** | Paired with scatterplot EDA (2.1) |
| 4.2 | Model Residuals | **2.6** | Expanded with autocorrelation case study |
| 4.3 | Categorical Predictors | **2.3** | Tests the group differences seen in 2.2 |
| 4.4 | Time Series Models | **2.6** | Autocorrelation absorbed into diagnostics |
| 5.1 | Categorical Controls | **3.2** | Follows elections motivating example |
| 5.2 | Interactions | **3.3** | Unchanged content, renumbered |
| 5.3 | Numerical Controls | **3.4** | Unchanged content, renumbered |
| 6.1 | Analysis Workflow | **4.1** | Unchanged content, renumbered |
| 6.2 | Communication | **4.2** | Unchanged content, renumbered |

---

## What Changes and What Doesn't

### Unchanged content
- Part 0 (Framework) — identical
- Part 3/old 5 (Multivariate controls) — identical content, renumbered
- Part 4/old 6 (Communication) — identical content, renumbered
- All individual concepts, datasets, exercises, and techniques — nothing is dropped

### Resequenced content
- Statistical inference (current 3.1-3.5) moves forward ~3-4 weeks into Part 1
- Categorical variables (current 1.1) move from Part 1 to Part 2 where they're actually needed
- Line plots (from current 1.3) move into Part 1 alongside histograms, activating the t subscript from day one
- Panel data (current 1.4 + 1.5) moves to Part 2, paired with pre/post design and Card & Krueger
- Bivariate EDA and bivariate regression are adjacent (see then test)
- Model diagnostics immediately follows regression
- Autocorrelation (from current 4.4) absorbed into diagnostics as the independence case study
- Conditional relationships (elections) moves from Part 2 to Part 3 opener

### Compressed content
- Panel data long + wide (current 1.4 + 1.5): 2 blocks → 1 block
- CIs + hypothesis testing (current 3.3 + 3.4): already merged in Notes_3.md
- Time series visualization: absorbed into numerical variables (1.1)
- Time series models: autocorrelation absorbed into model diagnostics (2.6)

### Eliminated as standalone
- Time series / temporal data no longer has its own Part
- Time appears in three places: as a visualization tool (1.1 line plots), as a design strategy (2.4 pre/post), and as a cautionary tale (2.6 autocorrelation)

### Assessment
- 3 MiniExams + Final Project
- MiniExam after each of Parts 1, 2, 3

---

## Block Count Comparison

| | Current | Proposed |
|---|---------|----------|
| Framework | 1 | 1 |
| Part 1 | 5 | 5 |
| Part 2 | 3 | 6 |
| Part 3 | 5 | 4 |
| Part 4 | 4 | 2 + project |
| Part 5 | 3 | — |
| Part 6 | 2 | — |
| **Total** | **~23** | **~18** |

The 5-block reduction comes from: compressing panel data (2→1), compressing CIs + hypothesis testing, absorbing time series visualization into numerical variables, absorbing autocorrelation into diagnostics, and eliminating the standalone time/panel unit.

---

## Tradeoffs To Consider

### What's gained
1. **Inference by week 4** instead of week 7-8
2. **Complete model by week 4-5** — the Simplest GLM capstones Part 1
3. **Both subscripts activated from day one** — Part 0's x_it framework immediately used in Part 1
4. **Line plots available from week 2** — temporal datasets unlocked for the entire course
5. **Card & Krueger payoff in Part 2** — the motivating study from day one gets its analytical answer
6. **No standalone data-type unit** — every part organized around an analytical question
7. **Categories introduced when needed** — as the building block for group comparisons, not as abstract data types
8. **BOGO question** asked AND answered within adjacent blocks
9. **Elections exercise opens Part 3** — motivates controls directly
10. **Each unit delivers a complete "see then test" payoff**

### What's lost or at risk
1. **Less time series depth**: Students see line plots and learn autocorrelation exists, but don't do time series regression (differencing, growth rates, lag models). This is intentional — the course isn't about time series analysis.
2. **The clean "data type → visualization" taxonomy**: Students currently get a systematic treatment of each data type. The new structure teaches visualization tools in context. Mitigation: Part 0 framework tables provide the map; could add a reference card.
3. **Shorter Python warm-up**: Students get 1 block of pure EDA before hitting statistical concepts. But 1.2-1.3 involve Python simulation, and Part 2 is hands-on coding. The ramp is steeper but still gradual.
4. **Part 2 is long**: 6 blocks spanning weeks 5-9. Could consider a mid-part check-in or splitting the MiniExam.
5. **Block 2.4 is dense**: Panel wrangling (long/wide, melt/pivot) plus pre/post design in one block. May need careful scoping — if pre/post only needs long format, the wide-format tools could be lighter.

### Open questions
1. **Should 1.1 split into two blocks?** Cross-section (histograms) and time (line plots) might each need a full session, especially with Python basics. If split, Part 1 becomes 6 blocks.
2. **How much panel wrangling does 2.4 need?** If pre/post only needs long format, melt/pivot could be lighter. If students need wide format for final projects, it stays.
3. **Should Part 2 have a mid-part exam?** At 6 blocks, it's the longest part. Could split: MiniExam 2a after 2.4 (group comparisons + pre/post), MiniExam 2b after 2.6 (regression + diagnostics).
4. **Dataset choices**: The restructuring is a natural time to anchor each part around a compelling economic question.
5. **Final project start**: Scatterplots arrive in Block 2.5 (week 7-8). Students could begin project thinking after that.

---

## The Arc of the Restructured Course

| Part | Question | Weeks | What students can do after |
|------|----------|-------|---------------------------|
| 0 | What tools do we need? | 1 | Classify data, identify structures, both i and t subscripts |
| 1 | What does this variable look like? | 2-4 | Visualize distributions (histograms AND line plots), construct CIs, test hypotheses, build simplest model |
| 2 | Are these variables related? | 5-9 | Compare groups, analyze pre/post designs, fit/test regression, diagnose models (including why time series breaks assumptions) |
| 3 | Is it really X causing Y? | 10-13 | See confounding in action, control for confounders, test interactions |
| 4 | How do I tell someone about this? | 14-15 | Present a complete analysis |

**Every part delivers both the "seeing" and the "testing." Time isn't quarantined — it appears as a visualization tool (Part 1), a design strategy (Part 2 pre/post), and a cautionary tale (Part 2 diagnostics).**
