# ECON 0150 Restructuring Proposal: Organize Around Analytical Questions

## The Problem

The current course organizes Parts 1-2 around **data types** (categorical, numerical, time series, panel) and Parts 3-5 around **analytical questions** (what can we infer? how does y change with x?). These are two different organizing logics, and the seam between them is where students lose momentum. They spend ~8 blocks on "here's how to look at data" before encountering the big ideas of inference in Part 3 (around week 7). The visualization tools feel unmotivated because the interesting questions they'll eventually answer are weeks away.

Three specific symptoms:
1. **The long EDA plateau**: 8 blocks of description before any inference
2. **Redundant tools**: boxplots appear in 1.2, 1.5, and 2.2; scatterplots in 1.5 and 2.1; faceting in 1.4 and 2.3
3. **Low-stakes datasets**: coffee shop locations and Starbucks customer profiles don't carry enough intellectual weight to sustain student interest across 5 blocks

## The Proposal

**Organize the entire course around escalating analytical questions. Each part pairs the visualization tools with the statistical tools that answer the same question.**

The restructuring keeps all current content but resequences it so that students get intellectual payoff faster. The key move: instead of "all the EDA, then all the modeling," each unit delivers a complete arc from seeing to testing.

---

## Proposed Structure

### Part 0: Framework (1 block, Week 1)

**Unchanged.** Card & Krueger minimum wage study, data classification (x_it notation), variable types, data structures, S-T-E framework.

One addition: preview the full course arc explicitly so students know where they're heading.

---

### Part 1: Distributions (5 blocks, Weeks 2-4)

**Question: "What does this variable look like — and what can we learn about the truth?"**

This part is focused entirely on numerical data. Students go from their first histogram to their first statistical model in a single arc. Categorical variables aren't needed here — everything is about one numerical variable and what we can infer about the population it came from.

| Block | Title | Current Source | Content |
|-------|-------|---------------|---------|
| 1.1 | Numerical Variables | 1.2 | Histograms, boxplots, stripplots, five-number summary, mean, SD. Python: histplot(), boxplot(). |
| 1.2 | Populations and Samples | 3.1 | The bridge: "Your histogram is one sample. What about the truth?" Population vs sample, random variables as decks of cards. Building from range → mean deviation → variance → SD. |
| 1.3 | The Central Limit Theorem | 3.2 | Classroom dice simulation. x-bar ~ N(mu, sigma/sqrt(n)). Standard error. The key insight: we can learn about the population without knowing its distribution. |
| 1.4 | Confidence Intervals & Hypothesis Testing | 3.3 + 3.4 | The centerpoint flip. t-distribution for unknown sigma. CIs, p-values, interpreting significance. |
| 1.5 | The Simplest GLM | 3.5 | y ~ 1. The mean minimizes MSE. Variance as MSE. Testing the intercept. This is what CIs and hypothesis testing were building toward — our first formal model. |

**MiniExam 1** (~Week 5)

**What changed**: Categorical variables (old 1.1) move to Part 2 where categories are actually needed — as the thing that creates groups. Part 1 is now a pure numerical arc: see data → wonder about truth → CLT → test hypotheses → build first model. No detours.

**Why it works**: Block 1.1 teaches students to make histograms. Block 1.2 immediately asks: "but what if you had a different sample?" That question is natural — students just made a histogram and can immediately see that different data would produce a different shape. The CLT and CIs follow as the answer. The Simplest GLM is the capstone: the mean is the intercept, the CI is the confidence interval on the intercept, the t-test tests whether the intercept differs from zero. Students reach a complete model by week 4-5 instead of week 9-10.

---

### Part 2: Relationships (5 blocks, Weeks 5-9)

**Question: "Are these variables related — and is the relationship real?"**

This part introduces bivariate analysis. It opens with categorical variables — not as an abstract data type, but because categories are what create the groups students will compare. Students learn to *see* group differences (grouped boxplots), then to *test* them (categorical regression), then extend to continuous relationships (scatterplots, OLS).

| Block | Title | Current Source | Content |
|-------|-------|---------------|---------|
| 2.1 | Categorical Variables | 1.1 | Bar charts, pie charts, frequency tables. Python: loading data, value_counts(), countplot(). Introduced here because categories are the building block for group comparisons — you need to understand what a category is before you can split data by one. |
| 2.2 | Numerical × Categorical | 2.2 | Grouped boxplots, log transformation, filtering. The Starbucks BOGO question: "Do bigger offers lead to more spending?" Seeing group differences visually. |
| 2.3 | Comparing Groups | 4.3 | Dummy variables, two-sample t-test as regression, ANOVA. "The difference you saw in 2.2 — is it real or noise?" Students test the group difference they just visualized. |
| 2.4 | Scatterplots & Regression | 2.1 + 4.1 | **EDA**: Anscombe's Quartet, scatterplots, log scales, bubble/color encoding. **Modeling**: y = beta_0 + beta_1*x + epsilon. MSE minimization, slope sampling distribution, testing H0: beta_1 = 0. Happiness vs GDP per capita. "You made a scatterplot — now test whether the line is real." |
| 2.5 | Model Diagnostics | 4.2 | Residuals, predicted values, the residual plot. Four OLS assumptions: linearity, homoskedasticity, normality, independence. Diagnostic workflow. |

**MiniExam 2** (~Week 9-10)

**What changed**: Categorical variables (old 1.1) move here from Part 1 as the natural on-ramp for group comparisons. The see-then-test arc runs across three blocks: 2.1 (understand categories) → 2.2 (see group differences) → 2.3 (test them). Then the same logic extends to continuous variables: 2.4 (see + test scatterplots) → 2.5 (check your work).

**Why it works**: In the current course, students learn bar charts in week 2 and don't use categories analytically until grouped boxplots in week 6. Here, categories are introduced *because* they're needed — block 2.1 teaches what a category is, block 2.2 immediately uses categories to split numerical data, and block 2.3 tests whether the split is real. Every block motivates the next.

---

### Part 3: Time and Change (3 blocks, Weeks 10-11)

**Question: "How does data behave over time — and why does it need special treatment?"**

Time series data has unique properties (autocorrelation, trends, seasonality) that break standard regression assumptions. This part gives temporal data the focused attention it deserves.

| Block | Title | Current Source | Content |
|-------|-------|---------------|---------|
| 3.1 | Visualizing Time Series | 1.3 + parts of 2.1 | Line plots, trends, seasonality, multi-line/twin-axis plots. Transformations: log, inflation adjustment, per capita, differencing. Coffee prices, US GDP, coffee vs oil prices. |
| 3.2 | Time Series Models | 4.4 | Autocorrelation, lag plots. Levels → differences → growth rates. Interpretation changes at each level. GDP and unemployment. |
| 3.3 | Panel Data | 1.4 + 1.5 | Long format: groupby, multi-line, faceting. Wide format: reshape with melt()/pivot(), multi-boxplots across years, scatterplots with 45-degree lines. Coffee consumption per capita. |

**MiniExam 3** (~Week 12)

**Why it works**: Students already understand regression and model diagnostics from Part 2. They can appreciate WHY autocorrelation is a problem (it violates the independence assumption they learned in 2.5). The panel data tools (groupby, melt, pivot) make more sense when students have analytical context — they're preparing data for models they already know how to build.

**Tradeoff**: Students don't see line plots until week 10. If early homeworks require time series visualization, this is a constraint. But the gain is significant: the first 9 weeks maintain momentum because every unit delivers a complete see-then-test arc.

---

### Part 4: Controlling for Complexity (4 blocks, Weeks 12-14)

**Question: "Is it really X causing Y, or is something else going on?"**

This part opens with the elections analysis — a genuine research question where the relationship between income and voting *flips* when you condition on a third variable. That motivating example immediately leads into the tools for handling confounders: categorical controls, interactions, and numerical controls.

| Block | Title | Current Source | Content |
|-------|-------|---------------|---------|
| 4.1 | Conditional Relationships | 2.3 | The elections analysis: Has politics become divided along economic lines? Boxplots by year, scatter of income vs voting, scatter by category showing the relationship flipped. Merging datasets. Ends with: "Income and voting are related — but the direction depends on what you control for. How do we handle this?" |
| 4.2 | Categorical Controls | 5.1 | Simpson's Paradox. Fixed effects / multiple intercepts. Gender wage gap: the raw difference → controlling for education. |
| 4.3 | Interactions | 5.2 | Interaction terms, different slopes by group. Gender wage gap: different returns to education by gender. |
| 4.4 | Numerical Controls | 5.3 | Multiple continuous predictors, "holding constant." Gender wage gap: controlling for number of children. (Or Pittsburgh housing.) |

**MiniExam 4** (~Week 14)

**Why it works**: Block 4.1 is the "wow" moment — students see a relationship reverse when they condition on category. That immediately motivates 4.2 (how to formally control for categories), 4.3 (what if the *slope* differs by group?), and 4.4 (what about continuous confounders?). The elections exercise is no longer a capstone looking backward — it's a launchpad looking forward.

---

### Part 5: Communicating With Data (2 blocks + Final Project, Weeks 14-15)

**Unchanged** from current Part 6.

| Block | Title | Current Source | Content |
|-------|-------|---------------|---------|
| 5.1 | Analysis Workflow | 6.1 | From question to data to model to interpretation. Replication folders. |
| 5.2 | Presenting Findings | 6.2 | Clear narratives, effective slides, student examples from prior semesters. |
| | Final Project | | 3-minute presentation, written report, replication folder. |

---

## Complete Content Mapping

Every current block mapped to its new location:

| Current | Current Title | New Location | Notes |
|---------|---------------|-------------|-------|
| 0 | Framework | **0** | Unchanged |
| 1.1 | Categorical Data | **2.1** | Moves to Part 2 as on-ramp for group comparisons |
| 1.2 | Numerical Data | **1.1** | Opens Part 1 |
| 1.3 | Time Series | **3.1** | Moves from week 3 to week 10 |
| 1.4 | Panel Long | **3.3** | Combined with 1.5, moves from week 4 to week 11 |
| 1.5 | Panel Wide | **3.3** | Combined with 1.4 |
| 2.1 | Num x Num (scatter) | **2.4** | Paired with regression (4.1) |
| 2.2 | Num x Cat (grouped boxplot) | **2.2** | See groups, then test them in 2.3 |
| 2.3 | Conditional Relationships | **4.1** | Opens Part 4 as motivating example for controls |
| 3.1 | Random Variables | **1.2** | Moves from week 7 to week 3 |
| 3.2 | CLT | **1.3** | Moves from week 8 to week 3-4 |
| 3.3 | Confidence Intervals | **1.4** | Moves from week 8-9 to week 4 |
| 3.4 | Hypothesis Testing | **1.4** | Merged with CIs (per Notes_3.md structure) |
| 3.5 | Simplest GLM | **1.5** | Capstone of Part 1 inference arc |
| 4.1 | Numerical Predictors | **2.4** | Paired with scatterplot EDA (2.1) |
| 4.2 | Model Residuals | **2.5** | Immediately follows regression |
| 4.3 | Categorical Predictors | **2.3** | Tests the group differences seen in 2.2 |
| 4.4 | Time Series Models | **3.2** | Paired with time series EDA (1.3) |
| 5.1 | Categorical Controls | **4.2** | Follows elections motivating example |
| 5.2 | Interactions | **4.3** | Unchanged content, renumbered |
| 5.3 | Numerical Controls | **4.4** | Unchanged content, renumbered |
| 6.1 | Analysis Workflow | **5.1** | Unchanged content, renumbered |
| 6.2 | Communication | **5.2** | Unchanged content, renumbered |

---

## What Changes and What Doesn't

### Unchanged content
- Part 0 (Framework) — identical
- Part 5/old 6 (Communication) — identical content, renumbered
- All individual concepts, datasets, exercises, and techniques — nothing is dropped

### Resequenced content
- Statistical inference (current 3.1-3.5) moves forward ~3 weeks, all into Part 1
- Categorical variables (current 1.1) move from Part 1 to Part 2 where they're actually needed
- Time series and panel data (current 1.3-1.5) move back ~5 weeks into Part 3
- Bivariate EDA and bivariate regression are adjacent (see then test)
- Model diagnostics moves to right after regression
- Conditional relationships (elections) moves from Part 2 to Part 4 opener

### Compressed content
- Panel data long + wide (current 1.4 + 1.5): 2 blocks → 1 block
- CIs + hypothesis testing (current 3.3 + 3.4): already merged in Notes_3.md

### Assessment
- 4 MiniExams + Final Project
- MiniExam after each of Parts 1, 2, 3, 4

---

## Block Count Comparison

| | Current | Proposed |
|---|---------|----------|
| Framework | 1 | 1 |
| Part 1 | 5 | 5 |
| Part 2 | 3 | 5 |
| Part 3 | 5 | 3 |
| Part 4 | 4 | 4 |
| Part 5 | 3 | 2 + project |
| Part 6 / Communication | 2 | — (renumbered as Part 5) |
| **Total** | **~23** | **~20** |

---

## Tradeoffs To Consider

### What's gained
1. **Inference by week 4** instead of week 7-8
2. **Complete model by week 4-5** — the Simplest GLM capstones Part 1
3. **Part 1 is pure and focused** — one variable, one question, no detours into categories
4. **Categories introduced when needed** — as the building block for group comparisons, not as abstract data types
5. **BOGO question** asked AND answered within adjacent blocks
6. **Elections exercise opens Part 4** — motivates controls directly
7. **Each unit delivers a complete payoff** — no "hold your breath" stretches
8. **Redundancy eliminated**: tools taught once in context

### What's lost or at risk
1. **The clean "data type → visualization" taxonomy**: Students currently get a systematic treatment. The new structure teaches tools in context. Mitigation: Part 0 framework tables provide the map; could add a reference card.
2. **Shorter Python warm-up**: Students get 1 block of pure EDA before hitting statistical concepts. But 1.2-1.3 involve Python simulation, and Part 2 is hands-on coding. The ramp is steeper but still gradual.
3. **Time series and panel data move later**: Students don't see line plots until week 10 or learn melt/pivot until week 11.
4. **Geographic data (current 2.5 in Course_Outline)**: No natural home. Could be an optional block or homework extension.

### Open questions
1. **Should 1.4 be split?** CIs and hypothesis testing might each need a full session. If split, Part 1 becomes 6 blocks.
2. **Python onboarding**: With only 1 EDA block before inference, should Part 0 include more Python setup? Or should 1.1 have extra time for Python basics alongside histograms?
3. **Dataset choices**: The restructuring is a natural time to anchor each unit around a compelling economic question.
4. **Final project start**: Scatterplots arrive in Block 2.4 (week 7-8). Students could begin project thinking after that.

---

## The Arc of the Restructured Course

| Part | Question | Weeks | What students can do after |
|------|----------|-------|---------------------------|
| 0 | What tools do we need? | 1 | Classify data, identify structures |
| 1 | What does this variable look like? | 2-4 | Visualize numerical distributions, construct CIs, test hypotheses, build simplest model |
| 2 | Are these variables related? | 5-9 | Understand categories, compare groups, fit/test regression, diagnose models |
| 3 | How does data behave over time? | 10-11 | Handle temporal and panel data with proper techniques |
| 4 | Is it really X causing Y? | 12-14 | See confounding in action, control for confounders, test interactions |
| 5 | How do I tell someone about this? | 14-15 | Present a complete analysis |

The key difference from the current arc: **every row in this table delivers both the "seeing" and the "testing."** Students never spend more than 1-2 blocks on pure description before getting to test something.
