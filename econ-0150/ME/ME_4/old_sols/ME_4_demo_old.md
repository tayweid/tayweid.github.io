**Name: ________________________________________________________________________________________________________ **                          **Student ID: ________________________________________________________________________________________________________ **

## ECON 0150 | MiniExam 4 | Demo

This MiniExam will take 8 minutes with a quick break to follow. MiniExams are designed to both test your knowledge and challenge you to apply familiar concepts in new environments. Treat it as if you're trying to show me that you understand the material. Answer clearly, completely, and concisely. 

#### Academic Conduct Code

The following academic conduct code is designed to protect the integrity of your work. Print your name/initials beside the three academic honesty agreements. I pledge to my fellow students, the university, and the instructor, that:

________ I will complete this MiniExam solely using my own work.
________ I will not use any digital resources unless explicitly allowed by the instructor.
________ I will not communicate directly or indirectly with others during the MiniExam.



###### Q2. Consider a simple linear regression model: y = β₀ + β₁x + ε, where β₁ = 0.75 with standard error 0.25.

**a)** The interpretation of the coefficient β₁ is:

□ For every one-unit increase in y, x increases by 0.75 units on average  
□ For every one-unit increase in x, y increases by 0.75 units on average  
□ When x = 0, y equals 0.75 on average  
□ 75% of the variation in y is explained by x  

**b)** To test whether there's a statistically significant relationship between x and y, we test:

□ H₀: β₀ = 0 versus H₁: β₀ ≠ 0  
□ H₀: β₁ = 0 versus H₁: β₁ ≠ 0  
□ H₀: β₁ = 0.75 versus H₁: β₁ ≠ 0.75  
□ H₀: y = 0 versus H₁: y ≠ 0  

**c)** The null distribution for testing the above hypothesis follows a:

□ Normal distribution with mean 0 and standard deviation 0.25  
□ Normal distribution with mean 0.75 and standard deviation 0.25  
□ t-distribution with mean 0 and standard error 0.25  
□ t-distribution with mean 0.75 and standard error 0.25  

###### Q3. A researcher conducted a study on climate action, running a regression model predicting a city's carbon emission reduction (percentage points) based on renewable energy investment (millions of dollars), with the following results:

```
                            coef    std err          t      P>|t|      [0.025    0.975]
intercept                  2.750      0.931      2.954      0.007      0.857      4.643
investment                 1.246      0.325      3.834      0.001      0.586      1.906
```

**a)** The most accurate interpretation of the intercept coefficient is:

□ The average emission reduction across all cities is 2.75 percentage points  
□ When renewable investment is zero, the predicted emission reduction is 2.75 percentage points  
□ The emission reduction increases by 2.75 percentage points for each million dollars invested  
□ 2.75% of the variation in emission reduction is explained by renewable investment  

**b)** The 95% confidence interval for the investment coefficient tells us that:

□ We are 95% confident that renewable investment has a statistically significant effect on emission reduction  
□ If we took many samples, 95% of the calculated confidence intervals would contain the true investment coefficient  
□ 95% of cities have an investment effect between 0.586 and 1.906  
□ The true investment coefficient is between 0.586 and 1.906 with 95% probability  

**c)** Which statement about the regression results is correct?

□ Both the intercept and investment have statistically significant effects at α=0.05  
□ The effect of the intercept is exactly 2.954 times larger than the effect of investment  
□ The p-value on investment indicates there's a 0.1% chance that renewable investment increases emission reduction  
□ We've proven that renewable investment causes emission reduction 



1. The following figure shows two residual plots. 

![](/Users/taylorjweidman/Library/CloudStorage/GoogleDrive-plusdirt@gmail.com/Other computers/Macbook Air/PROJECTS/tayweid.github.io/econ-0150/ME/ME_4/ME_07_demo_residual_plots.png)

a) Plot A shows a violation of:
   □ Linearity
   □ Normality
   □ Homoskedasticity
   □ Independence

b) The appropriate fix for the issue in Plot A would be:
   □ Transform the dependent variable
   □ Add a squared term to the model
   □ Use robust standard errors
   □ Remove outliers

c) If residuals show increasing spread with larger fitted values, this violates:
   □ Linearity
   □ Normality
   □ Homoskedasticity
   □ Independence

2. A labor economist analyzes the relationship between years of education, work experience (in years), and hourly wages (in dollars) using data from 60 workers. Here are the regression results:

```
                          OLS Regression Results                          
===========================================================================
                 coef    std err        t      P>|t|    [0.025    0.975]
---------------------------------------------------------------------------
Intercept      5.427     1.203      4.512     0.000     3.019     7.836
education      1.238     0.182      6.803     0.000     0.874     1.602
experience     0.452     0.073      6.189     0.000     0.306     0.598
===========================================================================
```

a) Write the estimated regression equation for this model.
   □ wage = 5.427 + 1.238 × education + 0.452 × experience
   □ wage = 5.427 + 0.452 × education + 1.238 × experience
   □ education = 5.427 + 1.238 × wage + 0.452 × experience
   □ wage = 5.427 × (1.238 × education) × (0.452 × experience)

b) Interpret the coefficient for experience in this model.
   □ For each additional year of experience, hourly wage increases by $0.452, holding education constant
   □ For each additional year of experience, hourly wage increases by 0.452%, holding education constant
   □ Experience is 0.452 times more important than education in determining wages
   □ The correlation between experience and wages is 0.452

3. An education researcher wants to study whether student performance on standardized tests differs between schools with different levels of per-pupil funding. They have data on test scores (0-100 scale) and funding levels (in hundreds of dollars per student) for 70 schools.

a) What regression model would be most appropriate to answer this question if the researcher wants to directly measure the relationship between funding levels and test scores?
   □ TestScore = β₀ + β₁ × Funding + ε
   □ TestScore = β₀ + β₁ × I(Funding > median) + ε
   □ Funding = β₀ + β₁ × TestScore + ε
   □ log(TestScore) = β₀ + β₁ × log(Funding) + ε

b) The researcher fits a model and obtains a statistically significant positive coefficient for funding. After checking the residuals, they notice a curved pattern rather than a random cloud. This indicates:
   □ The relationship between funding and test scores is non-linear
   □ The model has better predictive power than expected
   □ The R-squared value must be very high
   □ There is no significant relationship between funding and test scores
