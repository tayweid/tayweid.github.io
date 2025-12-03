**Name: ________________________________________________________________________________________________________ **                          **Student ID: ________________________________________________________________________________________________________ **

## ECON 0150 | MiniExam 09 | Demo

This MiniExam will take 8 minutes with a quick break to follow. MiniExams are designed to both test your knowledge and challenge you to apply familiar concepts in new environments. Treat it as if you're trying to show me that you understand the material. Answer clearly, completely, and concisely. 

#### Academic Conduct Code

The following academic conduct code is designed to protect the integrity of your work. Print your name/initials beside the three academic honesty agreements. I pledge to my fellow students, the university, and the instructor, that:

________ I will complete this MiniExam solely using my own work.
________ I will not use any digital resources unless explicitly allowed by the instructor.
________ I will not communicate directly or indirectly with others during the MiniExam.













## Consumer Spending Analysis

An economist is analyzing how various factors influence consumer spending patterns in different market segments. The dataset contains the following variables:

- `spending`: Monthly household spending in dollars
- `income`: Monthly household income in thousands of dollars
- `age`: Age of the primary household decision-maker
- `children`: Number of children in the household
- `online`: Percentage of purchases made online (0-100)
- `month`: Month of observation (1-12)
- `recession`: Dummy variable (1 if observation during economic recession, 0 otherwise)

###### Q1. The economist wants to test whether the relationship between income and spending is different during recessions. Which regression model would be most appropriate?

A) spending = β₀ + β₁·income + β₂·recession + ε  
B) spending = β₀ + β₁·income + β₂·recession + β₃·(income×recession) + ε  
C) spending = β₀ + β₁·income + β₂·age + β₃·children + ε  
D) log(spending) = β₀ + β₁·log(income) + β₂·recession + ε  

###### Q2. The economist wants to understand how the proportion of online purchases relates to overall spending while controlling for income. However, she suspects that different age groups may have different online spending patterns. Which approach would best capture this relationship?

A) spending = β₀ + β₁·income + β₂·online + β₃·age + ε  
B) spending = β₀ + β₁·income + β₂·online + β₃·(online×age) + ε  
C) spending = β₀ + β₁·income + β₂·online + β₃·age + β₄·(online×age) + ε  
D) spending = β₀ + β₁·income + β₂·log(online) + β₃·log(age) + ε  

###### Q3. The economist observes that the relationship between income and spending appears non-linear, with the marginal propensity to consume decreasing at higher income levels. Which transformation would best capture this relationship?

A) Including income² as an additional predictor  
B) Using log(income) instead of income  
C) Creating dummy variables for income quartiles  
D) Using first differences (Δincome) instead of income levels  

###### Q4. The data shows high autocorrelation in the residuals when modeling time series spending patterns. Which approach would most effectively address this issue?

A) Using robust standard errors  
B) Modeling changes in spending (Δspending) rather than levels  
C) Adding more demographic control variables  
D) Including lagged spending (spendingt-1) as a predictor variable  

###### Q5. The economist hypothesizes that the effect of having children on spending varies by both income level and whether purchases are made online. Write the complete regression specification (using β coefficients) that would test this relationship.

###### Q6. The data shows clear monthly seasonal patterns in spending throughout the year:

a) Write a regression model that would identify these seasonal patterns while controlling for income and age.

b) How would you interpret the coefficient on the December dummy variable in this model?

c) If you wanted to test whether the seasonal spending pattern differs between recession and non-recession periods, how would you modify your model from part a)?
