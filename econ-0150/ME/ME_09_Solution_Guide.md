# ECON 0150 | MiniExam 09 Solutions | Spring 2025

## Housing Market Analysis

### Q1. The researcher wants to examine whether the relationship between property size and price differs between urban and suburban areas. Which regression model would be most appropriate?

**Answer: B) price = β₀ + β₁·sqft + β₂·urban + β₃·(sqft×urban) + ε**

**Explanation:** This model includes an interaction term between property size (sqft) and the urban dummy variable, which allows the relationship between size and price to differ between urban and suburban areas. The coefficient β₃ will capture this differential effect - if positive, it indicates that an additional square foot adds more value in urban areas than in suburban areas. If negative, it suggests that space is less valuable in urban settings compared to suburban ones.

### Q2. The researcher suspects that the effect of distance to city center on housing prices varies with property age. Which approach would best capture this relationship?

**Answer: C) price = β₀ + β₁·distance + β₂·age + β₃·bedrooms + β₄·(distance×age) + ε**

**Explanation:** This model includes all relevant variables and the interaction term between distance and age. The interaction coefficient β₄ will show how the effect of distance on price changes with the age of the property. It's important to include bedrooms as well since it's a key housing characteristic that could otherwise confound the relationship we're examining.

### Q3. The researcher observes that the relationship between property size and price appears non-linear, with each additional square foot contributing less to the price at larger house sizes. Which transformation would best capture this relationship?

**Answer: B) Using log(sqft) instead of sqft**

**Explanation:** A logarithmic transformation of the property size is appropriate when the effect of additional square footage diminishes as the property gets larger. In a log-transformed model, the coefficient represents the percentage change in price for a percentage change in square footage (elasticity), which accounts for the diminishing marginal value of additional space in larger properties.

### Q4. The data shows significant heteroskedasticity when modeling housing prices across different metropolitan areas. Which approach would most effectively address this issue?

**Answer: A) Using robust standard errors**

**Explanation:** Robust standard errors are specifically designed to correct for heteroskedasticity (variance in error terms). While option D (log transformation) might also help address heteroskedasticity in some cases, robust standard errors directly tackle the issue without changing the interpretation of the model coefficients.

### Q5. The researcher hypothesizes that the effect of number of bedrooms on housing prices varies by property size. Write the complete regression specification (using β coefficients) that would test this relationship.

**Answer:** 
```
price = β₀ + β₁·sqft + β₂·bedrooms + β₃·(sqft×bedrooms) + β₄·age + β₅·distance + β₆·urban + ε
```

**Explanation:** This specification includes the key interaction term (sqft×bedrooms) to test whether the relationship between number of bedrooms and price depends on the property size. The coefficient β₃ captures this interactive effect. The model also controls for other important factors (age, distance to city center, and urban location) that could influence housing prices.

### Q6. The data shows clear quarterly patterns in housing prices throughout the year:

**a) Write a regression model that would identify these seasonal patterns while controlling for property size and age.**

**Answer:**
```
price = β₀ + β₁·sqft + β₂·age + β₃·Q2 + β₄·Q3 + β₅·Q4 + ε
```
Where Q2, Q3, and Q4 are dummy variables for the second, third, and fourth quarters respectively (Q1 is the reference category).

**Explanation:** This model includes quarterly dummy variables to capture seasonal patterns while controlling for the key property characteristics. Quarter 1 serves as the reference category against which the effects of other quarters are measured.

**b) How would you interpret the coefficient on the Quarter 2 dummy variable in this model?**

**Answer:** The coefficient on the Quarter 2 dummy variable (β₃) represents the average difference in housing prices between Quarter 2 and Quarter 1 (the reference category), holding property size and age constant. For instance, if β₃ = 15, it would indicate that, on average, housing prices in Quarter 2 are $15,000 higher than in Quarter 1 for properties of the same size and age.

**Explanation:** This interpretation focuses on the dummy variable coefficient as representing the average difference in the dependent variable (price) between the category of interest (Q2) and the reference category (Q1), while holding other variables in the model constant.
