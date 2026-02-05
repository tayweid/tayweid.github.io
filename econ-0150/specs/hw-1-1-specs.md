# Homework 1.1: Pass/Not-Yet Specifications

## Format

Take-home assignment using the class survey dataset. Seven questions (Standard) plus one additional question (Advanced). Open-resource. Due Friday, January 23 at 5PM.

---

## Standard Tier

### Per-Question Specs

#### Q1. Data Selection
- **a) Who collected this data?**
  - **Pass**: Identifies the instructor and/or the class (e.g., "Professor Weidman," "our ECON 0150 class," "the instructor through a class survey"). One sentence sufficient.
  - **Not yet**: Blank, or names an outside source.

- **b) How was this data collected?**
  - **Pass**: Identifies the method as a survey, questionnaire, or Google Form (or equivalent). One sentence sufficient.
  - **Not yet**: Blank, vague ("from the internet"), or incorrect method.

#### Q2. Index Variable
- **Pass**: Names the correct column that uniquely identifies each row (likely a student ID, response number, or timestamp -- depends on the actual dataset distributed to students).
- **Not yet**: Names a non-unique variable, or names a substantive variable (like "major") as the index.

#### Q3. Data Structure
- **Pass**: States "cross-section" or "cross-sectional." The dataset captures multiple students at one point in time.
- **Not yet**: States "time series" or "panel," or leaves blank.

#### Q4. Variable Count
- **Pass**: States the correct number of variables in the dataset.
- **Minor error**: Off by one (likely due to including/excluding the index column). Does not fail the question but counts toward the overall minor error limit.
- **Not yet**: Off by more than one.

#### Q5. Variable Classification (6 sub-parts)

Each of the 6 variables is evaluated independently:

| Variable | Correct Classification | Notes |
|----------|----------------------|-------|
| "What is your favorite color?" | Nominal Categorical | Many unordered categories |
| "Approximately how many miles away from Pittsburgh is your hometown?" | Continuous Numerical | Measurable distance on a continuum |
| "What is your (primary) major?" | Nominal Categorical | Many unordered categories |
| "How much did you like your statistics class?" | Ordinal Categorical | Ordered rating scale |
| "How excited are you for this class?" | Ordinal Categorical | Ordered rating scale |
| "Do you feel confident in Excel?" | Ordinal Categorical | Ordered rating scale (if multi-level) or Binary Categorical (if Yes/No) |

**Notes on acceptable answers:**
- "Miles from Pittsburgh": Continuous Numerical is the primary correct answer. Discrete Numerical is a defensible minor error (since students likely round to whole numbers), not a failure.
- "Confident in Excel": Depends on how the survey question was formatted. If it uses a Likert scale (e.g., 1-5), Ordinal Categorical is correct. If it is strictly Yes/No, Binary Categorical is correct. Either passes if it matches the actual survey format.
- Likert-scale questions ("How much did you like..." and "How excited are you..."): Ordinal Categorical is correct. Discrete Numerical is a defensible response if students argue the scale is numeric, but it is technically a minor error.

**Classification errors:**
- **Minor error**: Confusing within categorical subtypes (nominal vs. ordinal vs. binary).
- **Major error**: Confusing categorical with numerical or vice versa.

**Q5 threshold**: At least **5 of 6** classifications must be correct (no major errors).

#### Q6. Summarizing "Do you feel confident in Excel?"
- **a) Visualization**:
  - **Pass**: Produces a bar chart or pie chart (appropriate for categorical data). Chart has a title and labeled axes (or slices). Data is represented correctly.
  - **Not yet**: Wrong chart type (histogram, line chart) for categorical data. Or chart is unlabeled and uninterpretable. Or data is clearly wrong.

- **b) Count of confident students**:
  - **Pass**: States the correct number (must match the actual dataset).
  - **Not yet**: Wrong number or blank.

#### Q7. Summarizing "What is your major?"
- **a) Visualization**:
  - **Pass**: Produces a bar chart or pie chart (appropriate for nominal categorical data). Chart has a title and labeled axes (or slices). Data is represented correctly.
  - **Not yet**: Wrong chart type for categorical data. Or chart is unlabeled and uninterpretable. Or data is clearly wrong.

- **b) Count of economics majors**:
  - **Pass**: States the correct number (must match the actual dataset).
  - **Not yet**: Wrong number or blank.

### Assignment-Level Pass (Standard)

**Pass**: All questions pass, with at most **1 minor error** total across the entire assignment.

**Not yet**: Two or more minor errors, or any question fails outright.

---

## Advanced Tier

### Prerequisite

Student must pass Standard to be evaluated for Advanced.

### Advanced Question

One additional question appended to the assignment:

> **Q8 (Advanced).** Using the class survey data, choose a question about our class that interests you.
>
> a) State your question in one sentence.
>
> b) Identify which variable(s) in the dataset are relevant to your question and classify their type(s).
>
> c) Create an appropriate visualization (labeled axes, title, appropriate chart type).
>
> d) Write 2-3 sentences interpreting what your visualization shows. Include one specific finding and one limitation.

### Advanced Pass Criteria

All four sub-parts must pass:

#### Part (a): Question
- **Pass**: Question is specific enough to answer with the variables available in the class survey dataset. It targets a describable pattern (not just "what does the data look like?").
- **Not yet**: Question is too vague ("tell me about the class"), unanswerable with available data, or missing.

#### Part (b): Variable Identification and Classification
- **Pass**: Names variable(s) that exist in the dataset and are relevant to the stated question. Type classification is correct for all named variables.
- **Not yet**: Names a variable not in the dataset. Or type classification has a major error (categorical/numerical confusion).

#### Part (c): Visualization
- **Pass**: Chart type is appropriate for the variable type(s) identified in part (b). Axes are labeled. Title is present. Data is represented correctly.
- **Not yet**: Chart type is inappropriate for the variable types. Or chart is missing labels/title. Or data representation is clearly wrong.

#### Part (d): Interpretation
- **Pass**: States at least one specific finding visible in the visualization (e.g., "most students in our class are economics majors" or "there is no clear relationship between distance and excitement"). Includes at least one genuine limitation (small sample size, non-representative sample, survey wording, missing context, etc.).
- **Not yet**: Interpretation is vague ("the data shows things") or does not reference the visualization. Or limitation is absent or generic ("the data could be wrong").

### Assignment-Level Pass (Advanced)

**Pass**: Standard pass **and** all four parts of Q8 pass.

---

## Applying These Specs to the Current HW 1.1

Reference: `parts/part-1-1/HW_1_1.md`

The specs above map directly to the 7 existing questions. The Advanced question (Q8) is new and would be appended to the assignment when distributing to students.

**Grading note**: Since Q6b and Q7b require counts from the actual class survey data, the answer key must be generated from the specific dataset each semester. The specs define what a correct answer looks like, not the specific numbers.
