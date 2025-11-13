**Name: ________________________________________________________________________________________________________ **                          **Student ID: ________________________________________________________________________________________________________ **

## ECON 0150 | MiniExam 4 | Fall 2025

This MiniExam will take 8 minutes with a quick break to follow. MiniExams are designed to both test your knowledge and challenge you to apply familiar concepts in new environments. Treat it as if you're trying to show me that you understand the material. Answer clearly, completely, and concisely. 

#### Academic Conduct Code

The following academic conduct code is designed to protect the integrity of your work. Print your name/initials beside the three academic honesty agreements. I pledge to my fellow students, the university, and the instructor, that:

________ I will complete this MiniExam solely using my own work.
________ I will not use any digital resources unless explicitly allowed by the instructor.
________ I will not communicate directly or indirectly with others during the MiniExam.



###### Q1. A study uses data from 80 employees to examine whether remote workers have different productivity scores than in-office workers. Remote workers have an average productivity score of 82 and in-office workers have an average score of 78.

**a) If we code `remote` as 1 for remote workers and 0 for in-office workers, write the regression model:**

__________________________ = __________________________ + __________________________ × __________________________ + __________________________

**b) Based on the information given, what would β₀ equal?**       β₀ = _____________

**c) Based on the information given, what would β₁ equal?**       β₁ = _____________

**d) What is the default null hypothesis for $\beta_1$?**     __________________________



###### Q2. You want to test whether temperature predicts ice cream sales using daily data from a local shop with variables `temperature` (in °F) and `sales` (in dollars).

**a) Write down a statistical model to test this question.**

__________________________ = __________________________ + __________________________ × __________________________ + __________________________

**b) What part of your statistical model would indicate that temperature affects sales?**



**c) Sketch (*to the right ->*) how you would visualize this model.**



###### Q3. You want to examine whether `age` predicts `hourly_wages` using a sample of n=250 workers.

**a) Write down a statistical model to test this relationship.**

__________________________ = __________________________ + __________________________ × __________________________ + __________________________

**b) If your regression yields β₁ = 0.85, interpret this coefficient in context:**



###### Q4. Draw the sampling distribution under the null hypothesis (H₀: β₁ = 0) for a slope coefficient that has an observed value of -2.3 with a p-value of 0.045. Mark our observed coefficient and shade the region(s) that represent the p-value.





###### Q5. A researcher collected data on 150 employees and wants to test whether having a graduate degree affects annual income. The regression output shows:

```
                            coef    std err          t      P>|t|      [0.025      0.975]
------------------------------------------------------------------------------
Intercept                 45.200      2.100     21.524      0.000      41.044      49.356
graduate_degree           18.500      5.250      3.524      0.001       8.129      28.871
------------------------------------------------------------------------------
```
Note: `graduate_degree` is coded as 1 = Yes, 0 = No; income is in thousands of dollars.

**a) Sketch (*to the right ->*) how you would visualize the fitted model. Label intercept and slope using the fitted values.**



**b) Interpret the Intercept coefficient (45.20) in context:**



**c) Interpret the coefficient on `graduate_degree` (18.50) in context:**



**d) What does the p-value of 0.001 for the graduate_degree coefficient mean? *(select one)***

□ Out of 1000 samples where graduate degrees truly matter, only 1 would show a coefficient this large
□ If graduate degrees are unrelated to income, 0.1% of samples would have a coefficient this far from zero
□ Only 0.1% of the income difference between groups is due to random chance
□ There's a 99.9% probability that the true coefficient is at least 18.5
□ The coefficient of 18.5 has a 0.1% margin of error

**e) Sketch (*to the right ->*) a residual plot showing heteroskedasticity in this model.**