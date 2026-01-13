## ECON 0150 | Spring 2025 | Homework 4.4

### Due: 

Homework is designed to both test your knowledge and challenge you to apply familiar concepts in new applications. Answer clearly and completely. You are welcomed and encouraged to work in groups so long as your work is your own. Use the provided datasets to answer the following questions. Then submit your figures and answers to Gradescope.

#### Q1. Social Media and Mental Health

A (fictional) economist studied the relationship between social media usage, mental health, and academic performance among college students. A regression using data from 150 students used `academic_score` as the outcome variable and produced the following (fictional) results:

**Regression of Academic Score on Social Media, Mental Health, and First-Generation Status**

| Variable | coef | std err | t | P>|t| | [0.025 | 0.975] |
|----------|------|---------|---|-------|--------|---------|
| const | 82.4516 | 2.631 | 31.338 | 0.000 | 77.256 | 87.647 |
| social_media_hrs | -0.9237 | 0.192 | -4.810 | 0.031 | -1.303 | -0.544 |
| mental_health_score | 0.6382 | 0.145 | 4.401 | 0.300 | 0.352 | 0.925 |
| first_gen_student | -4.1265 | 1.754 | -2.353 | 0.020 | -7.592 | -0.661 |

Where:

- `academic_score` is the student's overall GPA on a 0–100 scale
- `social_media_hrs` is the average daily hours spent on social media
- `mental_health_score` is a validated mental wellness score (0–50, higher is better)
- `first_gen_student` is a binary indicator (1 if first-generation college student, 0 otherwise)

a) Interpret the coefficient on `social_media_hrs`. How is academic performance associated with each additional hour spent on social media?



b) Use one sentence to interpret the p-value on `social_media_hrs`.



c) Use one sentence to interpret the coefficient on `mental_health_score`. What does the coefficient tell us about the relationship between mental health and academic performance?



d) Use one sentence to interpret the p-value on `mental_health_score`.



#### Q2. Mental Health and County Unemployment

In Homework 4.2, you estimated the relationship between county-level unemployment and self-reported mental health using 2011 BRFSS data. You now have an extended version of the dataset that includes additional individual-level control variables.

a) Estimate the following multiple regression model:
   $$
   \texttt{menthlth}_i = \beta_0 + \beta_1 \cdot \texttt{county\_unemp}_i + \beta_2 \cdot X_{i1} + \beta_3 \cdot X_{i2} + \beta_4 \cdot X_{i3} + \varepsilon_i
   $$
   where the additional variables $X_{i1}, X_{i2}, X_{i3}$ are provided in the dataset.

   Report the estimated coefficients, standard errors, $t$-statistics, and $p$-values. Attach your code and regression output.
   **answer:**
   
   **Regression of Mental Health Days on Unemployment Rate**
   
   | Variable | Coefficient | Std. Error | t-stat | p-value |
   |----------|-------------|------------|--------|---------|
   | Unemployment Rate | 0.063*** | (0.008) | | |
   | AGE | -0.045*** | (0.001) | | |
   | Female | 0.751*** | (0.034) | | |
   | INCOME2 | -0.715*** | (0.009) | | |
   | College | -0.118*** | (0.038) | | |
   | Married | -0.256*** | (0.037) | | |
   | Constant | 9.295*** | (0.100) | | |
   
   - Observations: 206,644
   - R²: 0.057
   - Adjusted R²: 0.057
   - Residual Std. Error: 7.433 (df = 206,637)
   - F Statistic: 2,077.856*** (df = 6; 206,637)
   
   Note: ***p<0.01
    
b) Interpret the coefficient on county unemployment rate. How does it compare to the simple regression you ran in Homework 4.2? Has the estimate changed in sign, magnitude, or significance?
   **answer:**
   The coefficient on county unemployment is 0.063, meaning that each 1 percentage point increase in county unemployment is associated with about 0.06 additional bad mental health days per month, holding other factors constant. Compared to the simple regression (0.137), the magnitude is about half as large, but the effect remains positive and statistically significant. This suggests that part of the association between unemployment and mental health in the simple regression was explained by other factors such as age, sex, income, education, and marital status.