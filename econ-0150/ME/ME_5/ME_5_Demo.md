**Name: ________________________________________________________________________________________________________ **                          **Student ID: ________________________________________________________________________________________________________ **

## ECON 0150 | MiniExam 5 | Demo

This MiniExam will take 20 minutes with a quick break to follow. MiniExams are designed to both test your knowledge and challenge you to apply familiar concepts in new environments. Treat it as if you're trying to show me that you understand the material. Answer clearly, completely, and concisely. 

#### Academic Conduct Code

The following academic conduct code is designed to protect the integrity of your work. Print your name/initials beside the three academic honesty agreements. I pledge to my fellow students, the university, and the instructor, that:

________ I will complete this MiniExam solely using my own work.
________ I will not use any digital resources unless explicitly allowed by the instructor.
________ I will not communicate directly or indirectly with others during the MiniExam.

---

###### Q1. A researcher wants to examine how years of education affects hourly wages while controlling for years of work experience.

**a) Which regression model would answer this question? (circle one)**

A) `wages = β₀ + β₁·education + ε`

B) `wages = β₀ + β₁·education + β₂·experience + ε`

C) `wages = β₀ + β₁·education + β₂·(education × experience) + ε`

D) `wages = β₀ + β₁·experience + ε`

**b) In the correct model, what does the coefficient on `education` represent?**



**c) Why might controlling for `experience` change the estimated effect of `education` on wages?**



---

###### Q2. An economist is studying how coffee shop revenue differs between urban and rural locations. The variable `urban` is coded as 1 for urban locations and 0 for rural locations.

**a) Which regression model correctly tests whether urban locations have different revenue than rural locations? (circle one)**

A) `revenue = β₀ + β₁·urban + β₂·rural + ε`

B) `revenue = β₀ + β₁·urban + ε`

C) `revenue = β₀ + β₁·(urban × rural) + ε`

D) `revenue = β₀ + β₁·location + ε`

**b) In the correct model, what does the intercept (β₀) represent?**



**c) In the correct model, what does β₁ represent?**



**d) If β₁ equals 450, interpret this in context:**



---

###### Q3. A study examines whether the effect of advertising spending on sales differs between online and brick-and-mortar stores. The variable `online` is coded as 1 for online stores and 0 for brick-and-mortar stores.

**a) Write a regression model that allows the effect of `advertising` on `sales` to differ by store type (include an interaction term):**

__________________________ = __________________________ + __________________________ × __________________________ + __________________________ × __________________________ + __________________________ × __________________________ + __________________________

**b) In this model, what does the coefficient on `advertising` (without the interaction) represent?**



**c) What does the coefficient on the interaction term (`advertising × online`) represent?**



---

###### Q4. A researcher collected data on 200 houses and wants to understand how square footage and neighborhood affect housing prices. The regression output shows:

```
                            coef    std err          t      P>|t|      [0.025      0.975]
------------------------------------------------------------------------------
Intercept                 85.400     12.300      6.943      0.000      61.117     109.683
sqft                       0.125      0.018      6.944      0.000       0.090       0.160
Suburb                    25.600      8.200      3.122      0.002       9.417      41.783
Rural                    -18.300      9.100     -2.011      0.046     -36.262      -0.338
------------------------------------------------------------------------------
```
Note: `Urban` is the reference category for neighborhood; price is in thousands of dollars; sqft is in square feet.

**a) Interpret the coefficient on `sqft` (0.125) in context:**



**b) Interpret the coefficient on `Suburb` (25.600) in context:**



**c) What is the predicted price for a 2,000 sqft house in an Urban neighborhood?**

Show your work:



**d) What is the predicted price for a 2,000 sqft house in a Rural neighborhood?**

Show your work:



---

###### Q5. A labor economist wants to test whether the return to education differs for union vs. non-union workers.

**a) Which of the following models would test this hypothesis? (circle one)**

A) `wages = β₀ + β₁·education + β₂·union + ε`

B) `wages = β₀ + β₁·education + β₂·union + β₃·(education × union) + ε`

C) `wages = β₀ + β₁·education + β₂·experience + β₃·union + ε`

D) `wages = β₀ + β₁·(education × union) + ε`

**b) In the correct model, which coefficient would you examine to determine if the return to education differs by union status?**



**c) If that coefficient is positive, what would that tell us about the relationship?**



---

###### Q6. Consider the following regression output examining how temperature affects ice cream sales, with month fixed effects:

```
                            coef    std err          t      P>|t|
-----------------------------------------------------------------
Intercept                120.500     15.200      7.928      0.000
temperature                8.250      1.100      7.500      0.000
February                  -5.200      8.400     -0.619      0.537
March                     12.300      8.100      1.519      0.131
April                     28.400      7.900      3.595      0.000
May                       45.600      7.800      5.846      0.000
June                      62.100      8.200      7.573      0.000
...
-----------------------------------------------------------------
```
Note: January is the reference category for months; sales is in dollars.

**a) Why might we include month fixed effects when studying the effect of temperature on sales?**



**b) The coefficient on `temperature` is 8.250. What does this represent in this model?**



**c) The coefficient on `April` is 28.400. Interpret this in context:**
