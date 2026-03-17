## ECON 0150 | Spring 2025 | Homework 4.2

### Due: 

Homework is designed to both test your knowledge and challenge you to apply familiar concepts in new applications. Answer clearly and completely. You are welcomed and encouraged to work in groups so long as your work is your own. Use the provided datasets to answer the following questions. Then submit your figures and answers to Gradescope.

#### Q1. Working Hours and Weekly Income

An economist is studying the relationship between time spent working (hours per week) and weekly income (in dollars) for part-time employees. The data for 15 randomly selected employees is:

```python
hours_worked = [15, 22, 12, 25, 18, 10, 20, 28, 14, 16, 24, 19, 21, 17, 23]
weekly_income = [320, 465, 255, 510, 385, 210, 420, 570, 305, 340, 
                 490, 400, 445, 360, 475]
```

a) Create a scatter plot of weekly income versus hours worked. Does there appear to be a relationship?




b) Fit a linear regression model to predict weekly income based on hours worked. What is the interpretation of the intercept coefficient?




c) What is the interpretation of the slope coefficient?




d) What is the interpretation of the p-value of the slope coefficient?




#### Q2. County Unemployment and BMI
##### a)

Read the article: Zhang, Q., Lamichhane, R., & Wang, Y. (2014). Associations between US adult obesity and state and county economic conditions in the recession. Journal of clinical medicine, 3(1), 153-166.
[Link](https://pmc.ncbi.nlm.nih.gov/articles/PMC4449673/)

Based on your reading, answer the following questions:

1. What is the primary research question the authors are trying to answer?
   **answer:**
   The authors aim to investigate whether economic conditions at the state and county levels—particularly during the Great Recession—are associated with individual-level obesity.
2. What dataset(s) do the authors use for their analysis? Be specific about the years and key variables.
   **answer:**
   The authors use data from the Behavioral Risk Factor Surveillance System (BRFSS) pooled from the years 2007, 2009, and 2011. They link this individual-level health data to county-level and state-level economic indicators, primarily focusing on county unemployment rates, poverty rates, and median household income. 
    
3. What are the main outcome variables, and what are the key explanatory variables?
   **answer:**
   - **outcome variables:** BMI, Obesity, and Overweight
   - **explanatory variables:** state-unemployment rate, county-unemployment rate
    
4. Summarize the main findings in 2–3 sentences. What is the estimated effect of county unemployment on BMI?
   **answer:**
   The study finds that higher county-level unemployment is significantly associated with higher odds of individual obesity and physical inactivity. Specifically, a 1 percentage point increase in county unemployment is associated with a 0.4% increase in the odds of obesity (OR = 1.004, p < 0.05) and a 0.6% increase in the odds of physical inactivity (OR = 1.006, p < 0.01). These results are statistically significant and hold after adjusting for control variables.

##### b)

You are provided with a sample of individual-level data from the 2011 Behavioral Risk Factor Surveillance System (BRFSS), which includes the following variables:

- `bmi` – individual Body Mass Index (kg/m²)
- `Mental Healt` – days of Poor Mental Health in the Past 30 Days
- `county_unemp` – county-level unemployment rate (in percentage points)

Using this data, estimate the following linear regression model:

$$
\texttt{bmi}_i = \beta_0 + \beta_1 \cdot \texttt{county\_unemp}_i + \varepsilon_i
$$

1. Report the estimated coefficients $\hat\beta_0$ and $\hat\beta_1$, along with their standard errors, $t$-statistics, and $p$-values. Also attach the code you run.
   **answer:**
   
   **Regression of BMI on Unemployment Rate**
   
   | Variable | Coefficient | Std. Error | t-stat | p-value |
   |----------|-------------|------------|--------|---------|
   | Unemployment Rate | 0.090*** | (0.006) | | |
   | Constant | 26.647*** | (0.047) | | |
   
   - Observations: 229,655
   - R²: 0.001
   - Adjusted R²: 0.001
   - Residual Std. Error: 5.925 (df = 229,653)
   - F Statistic: 254.074*** (df = 1; 229,653)
   
   Note: ***p<0.01

2. Interpret the coefficient $\hat\beta_1$. What does it suggest about the relationship between county unemployment and individual BMI?
   **answer:**
   The coefficient indicates that county unemployment and BMI are positively correlated such that a 1 percentage point increase in county unemployment rate is associated with a 0.09 increase in BMI.

3. Identify the corresponding table and column in the Zhang et al. (2014) paper where a similar regression is reported. How does your estimated coefficient compare in magnitude, sign, and statistical significance?
   **answer:**
   A similar regression is shown in Table 2 column 7,8, and 9, specifically in the second row. The coefficient reported in the paper is very similar in magnitude and statistical significance.
    
##### c)

The 2011 BRFSS also includes information on mental health. The variable `menthlth` records the number of days in the past 30 days when the respondent's mental health was "not good."

1. Estimate the following regression model:
   $$
   \texttt{menthlth}_i = \beta_0 + \beta_1 \cdot \texttt{county\_unemp}_i + \varepsilon_i
   $$
   Report and interpret the estimated coefficient $\hat\beta_1$.

**answer:**

**Regression of Mental Health Days on Unemployment Rate**

| Variable | Coefficient | Std. Error | t-stat | p-value |
|----------|-------------|------------|--------|---------|
| Unemployment Rate | 0.137*** | (0.007) | | |
| Constant | 2.305*** | (0.059) | | |

- Observations: 238,881
- R²: 0.002
- Adjusted R²: 0.002
- Residual Std. Error: 7.637 (df = 238,879)
- F Statistic: 371.939*** (df = 1; 238,879)

Note: ***p<0.01

A 1 percentage point increase in the county unemployment rate is associated with 0.137 more bad mental health days per month, on average.