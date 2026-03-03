**Name: ________________Taylor :)_____________________________ **                          **Student ID: ________________________________________________________________________________________________________ **

## ECON 0150 | MiniExam 10 | Spring 2025

This MiniExam will take 8 minutes with a quick break to follow. This cumulative exam covers the entire economic data analysis pipeline. Answer clearly, completely, and concisely.

#### Academic Conduct Code

The following academic conduct code is designed to protect the integrity of your work. Print your name/initials beside the three academic honesty agreements. I pledge to my fellow students, the university, and the instructor, that:

________ I will complete this MiniExam solely using my own work.
________ I will not use any digital resources unless explicitly allowed by the instructor.
________ I will not communicate directly or indirectly with others during the MiniExam.



###### Q1. You are consulting for a government agency studying educational outcomes. Rewrite the following vague question into a specific, actionable economic research question: "How do schools affect student success?" 

**Solution:** What is the relationship between school funding per pupil and standardized test scores in public high schools, controlling for socioeconomic factors? (A good answer specifies measurable variables, relationship of interest, and context).



###### Q2. You have a dataset of quarterly GDP values (in billions) for 45 countries over 15 years. Which transformation would be most appropriate for each analytical goal:

a) To compare economic growth rates across countries of different sizes:

***A) Calculate year-over-year percentage changes***
*B) Divide each country's GDP by its population
C) Standardize values by subtracting the mean and dividing by standard deviation
D) Calculate the natural logarithm and then take first differences*

**Solution:** A. Year-over-year percentage changes directly measure growth rates in a way that allows for comparison between countries of different economic sizes.

b) To compare GDP values over time while removing the effects of inflation:

*A) Subtract the mean GDP from each country's value
**B) Convert nominal GDP values to real GDP using price deflators or CPI data***
*C) Divide each country's GDP by the current exchange rate
D) Calculate a centered moving average for each country*

**Solution:** B. Converting nominal GDP to real GDP using price indices/deflators directly removes the effect of price level changes over time, allowing for meaningful comparison of economic output across different years.

###### Q3. You have a dataset containing unemployment rates (%), minimum wage levels ($), and industry composition (% manufacturing jobs) for 120 cities at two time points: 2020 and 2023. Which visualization would best show the relationship between changes in minimum wage and changes in unemployment between these years?

*A) Parallel coordinate plot showing trajectories for each city  
**B) Scatter plot with change in minimum wage on x-axis and change in unemployment on y-axis***  
*C) Grouped bar chart comparing minimum wage and unemployment by year  
D) Dual-axis line chart with minimum wage and unemployment over time*  

**Solution:** B. A scatter plot directly shows the relationship between the changes in both variables, with each point representing a city, allowing easy identification of patterns across all 120 cities.

###### Q4. You analyze commuting times in a city and find they follow a right-skewed distribution with mean μ = 35 minutes and standard deviation σ = 15 minutes. If you take 400 random samples each containing 100 commuters, which statement about the sampling distribution of means is correct?

*A) It will have a mean of 35 minutes and standard deviation of 15 minutes  
**B) It will have a mean of 35 minutes and standard deviation of 1.5 minutes***  
*C) It will have a mean of 35 minutes and standard deviation of 0.75 minutes  
D) It will be right-skewed with the same shape as the original distribution*  

**Solution:** B. The sampling distribution of means will have the same mean as the population (35 minutes) with standard error = σ/√n = 15/√100 = 1.5 minutes, regardless of the original distribution's shape (Central Limit Theorem).

###### Q5. An economist runs a regression to study how education and experience affect log hourly wages:

```
          OLS Regression Results                            
==============================================================================
                 coef    std err          t      P>|t|      [0.025      0.975]
------------------------------------------------------------------------------
Intercept      1.842      0.214      8.607      0.002       1.422       2.262
education      0.107      0.015      7.133      0.013       0.078       0.136
experience     0.053      0.010      5.300      0.027       0.033       0.073
==============================================================================
```

a) Based on the regression results, what percentage increase in hourly wages is associated with each additional year of education?

*A) 1.07%  
**B) 10.7%***  
*C) 0.107%  
D) 11.3%*  

**Solution:** B. When the dependent variable is in natural log form, each coefficient multiplied by 100 gives the percentage change in the outcome variable, so 0.107 × 100 = 10.7%. 

b) If the null hypothesis is that experience has no effect on wages, what is the interpretation of the p-value for experience?

*A) There is a 0% chance that experience has no effect on wages*
*B) If we were to repeat this study many times, we would expect to get a coefficient this large or larger in 2.7% of samples even if experience truly had no effect*
*C) The probability that the effect of experience is exactly zero is 2.7%*
***D) If experience truly had no effect on wages, the probability of observing an estimate at least as extreme as 0.053 by random chance is about 2.7%***  

**Solution:** D. This is the correct technical definition of a p-value: the probability of observing a test statistic at least as extreme as the one calculated, assuming the null hypothesis is true.