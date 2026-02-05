# Feedback Templates for Specs Grading

## Purpose

These templates provide reusable, consistent language for grading pass/not-yet assessments. Copy, paste, and customize as needed. The goal is efficient grading with clear, actionable feedback.

---

## General Pass/Not-Yet Framing

### Pass
> **Pass.** All components meet the published specifications.

### Pass with Minor Note
> **Pass.** Minor note: [specific observation]. This did not affect your pass but is worth keeping in mind.

### Not Yet
> **Not yet.** [Number] component(s) did not meet specifications. See notes below. You may revise using a token within 7 days.

---

## Data Structure Feedback

### Pass
> Data structure correctly identified.

### Not Yet -- Wrong Structure
> **Not yet (Data Structure).** This dataset is [correct answer] because [brief reason -- e.g., "it records multiple subjects at a single point in time"]. You identified it as [student's answer].

### Common Corrections
> This is a **cross-section**, not a time series. Even though one column contains dates, the data records many [subjects] at one snapshot, not one subject over time.

> This is a **panel**, not a cross-section. The data tracks [multiple subjects] across [multiple time periods].

> This is a **time series**, not a panel. There is only one subject being tracked over time.

---

## Variable Type Feedback

### Pass
> Variable types correctly classified.

### Minor Error -- Within-Categorical Confusion
> **Minor error (Variable Type).** [Variable name] is [correct type], not [student's answer]. Both are categorical, so this is a minor error. [Brief reason -- e.g., "The categories have a natural order (Very Dissatisfied < Dissatisfied < ... < Very Satisfied), making this ordinal."]

### Not Yet -- Categorical/Numerical Confusion
> **Not yet (Variable Type).** [Variable name] is [correct type], not [student's answer]. [Brief explanation -- e.g., "Although satisfaction is measured on a 1-5 scale, the numbers represent ordered categories, not quantities you would add or average meaningfully. This is ordinal categorical."]

---

## Variable Count Feedback

### Pass
> Variable count correct.

### Minor Error -- Off by One
> **Minor error (Variable Count).** The dataset has [correct number] variables. [ID/index column] is an identifier, not a variable. This is a common and minor error.

### Not Yet -- Off by More Than One
> **Not yet (Variable Count).** The dataset has [correct number] variables. Remember: count the columns that contain data you would analyze, not identifiers or row numbers.

---

## Visualization Feedback

### Pass
> Visualization is appropriate for the variable type(s).

### Not Yet -- Wrong Chart Type
> **Not yet (Visualization).** For [variable type], an appropriate chart is [correct options]. You drew/described [student's choice], which is used for [what that chart is actually for]. Review the visualization selection guide in your notes.

### Common Corrections
> A **bar chart** (not a histogram) is appropriate here because the variable is categorical. Histograms are for continuous numerical data and use bins on the x-axis.

> A **scatter plot** is appropriate here because you are showing the relationship between two numerical variables. A bar chart would only work if one variable were categorical.

> A **line chart** is appropriate here because the data shows change over time. A bar chart could work but a line chart better emphasizes the temporal trend.

---

## Advanced Tier Feedback

### Part (a) -- Variable Selection

#### Pass
> Variable selection is relevant and well-justified.

#### Not Yet -- Weak Justification
> **Not yet (Variable Selection).** You named [variable], which is relevant, but your justification needs to connect it to the question. Why would this variable help the nonprofit understand who receives assistance? A specific reason is needed (e.g., "Income likely correlates with need for assistance because...").

#### Not Yet -- Irrelevant Variable
> **Not yet (Variable Selection).** [Variable] is not directly relevant to understanding which households receive government assistance. Consider which variables would most plausibly predict or explain assistance receipt.

### Part (b) -- Visualization and Interpretation

#### Pass
> Visualization is appropriate and interpretation connects clearly to the question.

#### Not Yet -- Vague Interpretation
> **Not yet (Visualization).** Your chart choice is appropriate, but your interpretation needs to describe a specific pattern (e.g., "I would look for whether urban households have higher rates of assistance than suburban or rural ones") rather than a general statement like "look for a pattern."

#### Not Yet -- Wrong Chart for Types
> **Not yet (Visualization).** The variable(s) you chose in part (a) are [types], so [correct chart] would be more appropriate than [student's chart]. [Brief reason.]

### Part (c) -- Limitation

#### Pass
> Genuine limitation identified.

#### Not Yet -- Too Vague
> **Not yet (Limitation).** "The data might not be accurate" is too general. Name a specific gap: What variable is missing that would matter? What can correlation not tell us here? Is the sample representative of the population the nonprofit cares about?

---

## Assignment-Level Summary Templates

### Standard Pass
> **Standard: Pass.** You demonstrated competency in data identification and univariate visualization. All components met specifications.

### Standard Not Yet
> **Standard: Not yet.** [X] of [Y] questions did not meet specifications. Review the feedback on each question and revise within 7 days using a token. Focus on: [1-2 key areas].

### Advanced Pass
> **Advanced: Pass.** You demonstrated analytical thinking beyond procedure execution. Your variable selection, visualization choice, and limitation analysis all met the Advanced specifications.

### Advanced Not Yet
> **Advanced: Not yet.** Your Standard work passes, but the Advanced question needs revision in: [specific parts]. The key gap is [brief description of what's missing -- e.g., "connecting your visualization to the research question" or "identifying a specific rather than generic limitation"].

---

## Efficiency Tips

- Grade Standard first for all students. Only evaluate Advanced for students who pass Standard.
- Use the per-question answer key (in each specs document) to quickly check correctness.
- For variable type errors, check whether it's within-categorical (minor) or categorical-numerical (major) before writing feedback.
- For visualizations, the chart type matters most. Labeling issues are worth noting but don't fail a question on their own unless the chart is uninterpretable.
- Copy-paste these templates and fill in brackets. Don't write custom feedback for common errors.
