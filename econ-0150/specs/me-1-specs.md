# MiniExam 1: Pass/Not-Yet Specifications

## Format

20-minute in-class exam, closed-resource. Six questions. Each question presents a data table and asks students to (a) identify data dimensions and (b) draw or describe an appropriate visualization.

---

## Standard Tier

### Per-Question Specs

Each question has four components. Each component is evaluated pass/fail:

#### Data Structure
- Must use the correct term: **cross-section**, **time series**, or **panel**.
- Synonyms are acceptable ("cross-sectional" for "cross-section").
- Wrong term = question fails this component.

#### Variable Type(s)
- Must correctly classify **all** variables mentioned in the answer.
- Acceptable terms: binary categorical, nominal categorical, ordinal categorical, discrete numerical, continuous numerical.
- **Minor error**: Confusing within categorical subtypes (e.g., calling ordinal "nominal"). Does not fail the component but counts toward the minor error limit.
- **Major error**: Confusing categorical with numerical (e.g., calling an ordinal variable "discrete numerical"). Fails the component.

#### Variable Count
- Must state the correct number.
- **Minor error**: Off by one, likely due to counting/not counting an index or ID column. Does not fail the component but counts toward the minor error limit.
- **Major error**: Off by more than one. Fails the component.

#### Visualization
- Must be appropriate for the variable type(s) in the dataset.
- Acceptable mappings:

| Data Scenario | Passing Choices | Failing Choices |
|---------------|----------------|-----------------|
| Single categorical variable | Bar chart, pie chart | Histogram, line chart, scatter plot |
| Single numerical variable | Histogram, boxplot, strip/dot plot | Bar chart, pie chart, line chart |
| Numerical over time | Line chart, bar chart with time axis | Pie chart, histogram |
| Two numerical variables | Scatter plot | Bar chart, pie chart, line chart |
| Categorical + numerical | Grouped bar chart, side-by-side boxplots, faceted histograms | Scatter plot, single pie chart |
| Single binary variable | Bar chart, pie chart | Histogram, scatter plot |

- Visualization must be recognizable (labeled axes or clear description). A bare unlabeled sketch that is clearly the right chart type still passes. A vague description like "a chart" does not.

### Question-Level Pass

A question passes if:
- All four components pass, **OR**
- All components pass with at most **1 minor error** across the question.

A question fails if:
- Any component has a major error, **OR**
- The question accumulates 2 or more minor errors.

### Exam-Level Pass (Standard)

**Pass**: At least **5 of 6 questions** pass.

**Not yet**: Fewer than 5 questions pass.

---

## Advanced Tier

### Prerequisite

Student must pass Standard (5 of 6 questions) to be evaluated for Advanced.

### Advanced Question

One additional question appended to the exam (~5-7 extra minutes):

> **Advanced Q.** A survey of 200 Allegheny County households records: income ($), number of children, neighborhood (urban/suburban/rural), education level (less than HS / HS diploma / Bachelor's / Graduate), and whether the household received government assistance in the past year (Yes/No).
>
> A local nonprofit wants to understand **which households are most likely to receive government assistance and why**.
>
> a) Which variable(s) would you explore first? Justify your choice in 1-2 sentences.
>
> b) Choose and describe (or sketch) one visualization. Explain what pattern you would look for and what it would tell you about the question.
>
> c) Name one thing this dataset could NOT tell you about the question.

### Advanced Pass Criteria

All three sub-parts must pass:

#### Part (a): Variable Selection
- **Pass**: Names at least one variable from the dataset that is substantively relevant to the question. Justification connects the variable to the nonprofit's question with a specific reason (not just "it seems important").
- **Not yet**: Variable is not in the dataset. Or justification is absent/generic (e.g., "because it's related").

#### Part (b): Visualization and Interpretation
- **Pass**: Visualization type is appropriate for the variable type(s) chosen in part (a). Student describes a specific pattern to look for (e.g., "whether lower-income households have higher rates of assistance") and connects it to the question.
- **Not yet**: Visualization is inappropriate for the variable types. Or description is vague (e.g., "look for a pattern"). Or no connection to the nonprofit's question.

#### Part (c): Limitation
- **Pass**: Identifies a genuine, specific limitation. Acceptable examples: omitted variable (e.g., "doesn't include employment status"), correlation vs. causation, sample representativeness, measurement issues, temporal limitations.
- **Not yet**: Limitation is vague (e.g., "the data might be wrong") or is not actually a limitation of this dataset for this question.

### Exam-Level Pass (Advanced)

**Pass**: Standard pass (5 of 6) **and** all three parts of the Advanced question pass.

---

## Applying These Specs to the Current ME 1

Reference: `ME/ME_1/ME_1.md` (Version A)

| Question | Table | Expected Structure | Expected Variable Types | Expected Count | Appropriate Viz |
|----------|-------|-------------------|------------------------|----------------|-----------------|
| Q1 | Customer Satisfaction | Cross-section | Ordinal categorical (Satisfaction_Level) | 1 variable (Response_ID is index) | Bar chart or pie chart |
| Q2 | City Population | Panel | Continuous numerical (populations) | 3 variables (Year is index; Pittsburgh, Cleveland, Buffalo are variables) | Line chart (one line per city) |
| Q3 | Housing Market | Cross-section | Continuous numerical (Square_Feet, Sale_Price) | 2 variables (House_ID is index) | Scatter plot |
| Q4 | Unemployment Claims | Time series | Continuous numerical (Initial_Claims) | 1 variable (Week_Ending is index) | Line chart |
| Q5 | Loan Applications | Cross-section | Binary categorical (Decision) | 1 variable (Application_ID is index) | Bar chart or pie chart |
| Q6 | Test Performance | Cross-section | Nominal categorical (District), Continuous numerical (Math_Score) | 2 variables (School_ID is index) | Grouped bar chart or side-by-side boxplots |

**Note on Q2 variable count**: This is a potential ambiguity. The table has 4 columns (Year + 3 cities). If Year is treated as the index, there are 3 variables. If a student counts Year as a variable, that gives 4 -- this would be a minor error (off by one due to index treatment), not a failure. The key structural answer (panel) and visualization (line chart) are unambiguous.

**Note on Q6**: District could reasonably be called "nominal categorical" or simply "categorical." Either passes. The visualization should show the distribution of Math_Score across districts.
