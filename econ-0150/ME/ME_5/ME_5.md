**Name: ________________________________________________________________________________________________________ **                          **Student ID: ________________________________________________________________________________________________________ **

## ECON 0150 | MiniExam 5 | Fall 2025

This MiniExam will take 20 minutes with a quick break to follow. MiniExams are designed to both test your knowledge and challenge you to apply familiar concepts in new environments. Treat it as if you're trying to show me that you understand the material. Answer clearly, completely, and concisely. 

#### Academic Conduct Code

The following academic conduct code is designed to protect the integrity of your work. Print your name/initials beside the three academic honesty agreements. I pledge to my fellow students, the university, and the instructor, that:

________ I will complete this MiniExam solely using my own work.
________ I will not use any digital resources unless explicitly allowed by the instructor.
________ I will not communicate directly or indirectly with others during the MiniExam.

---

###### Q1. A researcher studies how study hours affect exam scores while controlling for prior GPA.

**a) Which regression model answers this question? (circle one)**

A) `score = β₀ + β₁·hours + ε`

B) `score = β₀ + β₁·GPA + ε`

C) `score = β₀ + β₁·hours + β₂·GPA + ε`

D) `score = β₀ + β₁·hours + β₂·(hours × GPA) + ε`

**b) Interpret the coefficient on `hours` in one sentence:**



###### Q2. A company wants to test whether employees who work remotely have different productivity scores than those who work in-office, while controlling for years of experience. The variable `remote` is coded as 1 for remote workers and 0 for in-office workers.

**a) Write the regression model:**

__________________________ = β₀ + β₁ · __________________________ + β₂ · __________________________ + ε

**b) Interpret the coefficient on `remote` in one sentence:**



**c) Why might we want to control for experience when studying the effect of remote work on productivity?**

###### Q3. A researcher collected data on 120 apartments and estimated the following model:

```
rent = β₀ + β₁·sqft + β₂·pets_allowed + ε
```

Where `rent` is in dollars per month, `sqft` is in square feet, and `pets_allowed` = 1 for apartments that allow pets and `pets_allowed` = 0 for those that don't. The regression output shows:

```
                   coef    std err       t      P>|t|
-----------------------------------------------------
Intercept       250.000     45.000    5.556     0.000
sqft              0.800      0.035   22.857     0.000
pets_allowed    150.000     38.000    3.947     0.000
-----------------------------------------------------
```
**a) What is the predicted monthly rent for a 900 sqft apartment that does NOT allow pets?**


Answer: $______________ per month

**b) What is the predicted monthly rent for a 900 sqft apartment that DOES allow pets?**


Answer: $______________ per month

**c) Interpret the coefficient on `pets_allowed` (150.000) in one sentence:**



###### Q4. A firm estimates how training hours affect employee performance, allowing the effect to differ based on whether the employee has a college degree (1 for those with a college degree; 0 for those without).

```
performance = β₀ + β₁·training + β₂·degree + β₃·(training × degree) + ε
```

 The estimated coefficients are: β₀ = 50, β₁ = 2.0, β₂ = 10, β₃ = 0.8.

**a) What is the effect of one additional hour of training on performance for employees without a degree?**

Answer: ______________

**b) What is the effect of one additional hour of training on performance for employees with a degree?**


Answer: ______________

**c) The interaction coefficient (β₃ = 0.8) tells us:** (circle one)

A) Employees with degrees have 0.8 higher performance scores

B) An additional hour of training increases performance by 0.8 more for employees with degrees than those without

C) Training is 0.8 times as effective for degree holders

D) Employees with degrees complete 0.8 more training hours
