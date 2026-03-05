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

According to USAFacts [Link](https://usafacts.org/answers/what-is-the-income-of-a-us-household/state/pennsylvania/), the median household income in Pennsylvania was reported to be $73,824 in 2023.

You are provided with a sample of median household incomes for a set of Pennsylvania census tracts. Use this sample to test whether the average median household income in these counties differs from the statewide benchmark.

a) Using the provided dataset, conduct a one-sample t-test to assess whether the average median household income in the sample differs from $73,824. Clearly report:
- the sample mean and standard deviation,
- the t-statistic and degrees of freedom,
- the p-value and 95% confidence interval.

**answer:**
- Sample size (n): 60
- Sample mean: 81252.18 
- Standard deviation: 41140.58
- t-statistic: 1.399 
- Degrees of freedom: 59
- p-value:  0.1672  
- 95% Confidence Interval: 70624.44 to 91879.92

b) Based on your results, does the sample provide evidence that the average county income is significantly different from the statewide median? Briefly explain.

**answer:**
The one-sample t-test yields a t-statistic of  1.399  with 59 degrees of freedom and a p-value of 0.1672. Since this p-value is not less than the conventional significance level of 0.05, we cannot reject the null hypothesis.

This means that there isn't enough statistical evidence to conclude that the average median household income across the sampled counties is significantly different from the statewide median of $73,824. The 95% confidence interval for the sample mean ranges from 70624.44 to 91879.92, which includes the benchmark value.

**County example for class**
a) Using the provided dataset, conduct a one-sample t-test to assess whether the average median household income in the sample differs from $73,824. Clearly report:
- the sample mean and standard deviation,
- the t-statistic and degrees of freedom,
- the p-value and 95% confidence interval.

**answer:**
- Sample size (n): 30 
- Sample mean: 65699.87 
- Standard deviation: 10435.93 
- t-statistic: -4.264 
- Degrees of freedom: 29 
- p-value: 0.0002 
- 95% Confidence Interval: 61803.03 to 69596.71 

b) Based on your results, does the sample provide evidence that the average county income is significantly different from the statewide median? Briefly explain.

**answer:**
The one-sample t-test yields a t-statistic of -4.264 with 29 degrees of freedom and a p-value of 0.0002. Since this p-value is less than the conventional significance level of 0.05, we reject the null hypothesis.

This means that there is enough statistical evidence to conclude that the average median household income across the sampled counties is significantly different from the statewide median of $73,824. The 95% confidence interval for the sample mean ranges from 61803.03 to 69596.71, which does not includes the benchmark value.