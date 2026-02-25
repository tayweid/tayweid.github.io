## ECON 0150 | Work Plan | Next Steps

Sequential to-do list for course prep. Course structure is in `course_outline.md`.

---

## Part 1: Univariate EDA

### 1.1 Cross-section Categorical
- I think this should be much more interesting. Maybe make this and each of the Part 1 questions built off the minimum wage dataset.

### 1.2 Cross-section Numerical
- Consider adding inequality example (income distribution, Gini)

### 1.3 Time Series
- Encoding: make line type/pattern explicit (solid vs dashed for different series)
- Maybe do inequality here too

### 1.4 Long Format Panel Data
- Add Building Blocks summary slide (what's added: panel structure, facets, multi-line, reshape)

### 1.5 Wide Format Panel Data



---

## Part 2: Multivariate EDA

### 2.1 Bivariate (Num × Num)
- Add Building Blocks summary slide (what's added: scatter, bubble, correlation, log scale)
- Add S-T-E walkthrough for the example
- Consider adding inequality example (GDP vs life expectancy with Gini as size)

### 2.2 Grouping (Num × Cat)
- Add Building Blocks summary slide (what's added: grouped boxplot, group operation)
- Add S-T-E walkthrough for the example
- Consider adding: wages by education example (labor market thread)

### 2.3 Geographic
- Add Building Blocks summary slide (what's added: geographic structure, maps)
- Add S-T-E walkthrough for the example
- Encoding: sequential/diverging color scales — make explicit
- Simplify example (current one too difficult)
- Use PA income by county for exercise

---

## Part 3: Univariate GLM

- Maybe talk more about ethics in hypothesis testing. Motivate by having them do bad hypothesis testing.
- I think this can all be snappier. 

### 3.1 Random Variables


### 3.2 Sampling & CLT
- Add population vs sampling distribution visual

### 3.3 Confidence Intervals
### 3.4 Hypothesis Testing
- Add ethics in hypothesis testing section

### 3.5 Simplest GLM
---

## Part 4: Bivariate GLM

### 4.1 Numerical Predictors
### 4.2 Model Residuals
- Fix slide title (says "Part 4.3" should be "Part 4.2")

- Log scales used here — be better with describing the estimate with log predictor and/or log outcome

### 4.3 Categorical Predictors
### 4.4 Time Series Models
- Differencing transformation used here — be better with this

---

## Part 5: Multivariate GLM

I keep trying to have students think about control variables more. I think the way to pitch this is that we look at a simple bivarite relationship but we might wonder whether something else is going on impacting both variables. Think of Part 5 as starting from the Part 4 bivariate environment as the basic model, then we try to exclude other things. 

### 5.1 Categorical Controls
- Simpsons paradox
- Fixed effects
- Seaonalization

### 5.2 Interactions
- Build out the gender wage gap as a general model after doing it

### 5.3 Numerical Controls
- Use the gender wage gap and control for number of children. The idea is that if it's about being removed from the workforce, the more children one has, the larger the gender wage gap should be. 

### 5.4 Model Selection

- Use the Pittsburgh housing example
- Add explicit "holding constant" interpretation
- Add correlation ≠ causation discussion
- Build up the ideas in choosing the right model in the Brillian notes I have

---

## Part 6: Projects

- Review project templates
- Consider adding Tufte's visualization principles
- Data Operations Workshop: Cleaning, Merging

---

## Ideas (Low Priority)

**Examples to Consider Adding**

- FRED data example (unemployment, GDP, interest rates)

**Enhancements**

- "When to use which visualization" reference guide
- Visualization of the CLT with many different random variables
