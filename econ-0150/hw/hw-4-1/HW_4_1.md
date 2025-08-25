## ECON 0150 | Spring 2025 | Homework 4.1

### Due: 

Homework is designed to both test your knowledge and challenge you to apply familiar concepts in new applications. Answer clearly and completely. You are welcomed and encouraged to work in groups so long as your work is your own. Use the provided datasets to answer the following questions. Then submit your figures and answers to Gradescope.

#### Q1. Linear Regression and the t-Test

Explain in your own words how a one-sample t-test can be represented as a linear regression model. What parameter in the regression corresponds to the mean being tested in a t-test? (1–2 sentences)




#### Q2. True or False? Explain your reasoning.

a) The intercept in a regression model with no predictors equals the sample mean of the outcome variable.



b) The p-value for the intercept in a regression with no predictors tests whether the population mean equals zero.



c) The standard error of the intercept in a regression with no predictors equals the standard deviation of the dependent variable divided by the square root of the sample size.



#### Q3. Study Hours

An economics professor claims that students spend 6 hours per week on average studying for their economics class. You survey 20 students and record the following number of hours they reported studying per week:

```python
study_hours = [5.2, 7.1, 4.8, 6.5, 8.0, 5.5, 7.3, 4.2, 6.7, 5.8, 
               7.5, 6.2, 5.0, 7.8, 6.3, 4.5, 6.9, 5.7, 7.2, 6.0]
```

a) Use a one-sample t-test to test whether the average study time differs from the claimed 6 hours per week. What is the p-value for this test?




b) Use a regression model with only an intercept to perform a test of the default null hypothesis on the intercept coefficient. What is the p-value for this test?




c) Explain why the p-values differ with these two approaches.




#### Q4. Real Data t-Test: Pennsylvania Household Income

According to USAFacts, the median household income in Pennsylvania was reported to be $73,824 in 2023.

You are provided with a sample of median household incomes for a set of Pennsylvania counties. Use this sample to test whether the average median household income in these counties differs from the statewide benchmark.

a) Using the provided dataset, conduct a one-sample t-test to assess whether the average median household income in the sample differs from $73,824. Clearly report:
- the sample mean and standard deviation,
- the t-statistic and degrees of freedom,
- the p-value and 95% confidence interval.

b) Based on your results, does the sample provide evidence that the average county income is significantly different from the statewide median? Briefly explain.