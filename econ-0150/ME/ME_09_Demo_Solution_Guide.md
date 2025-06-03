## ECON 0150 | MiniExam 09 Solution Guide | Spring 2025

#### Q1: B

To test whether the relationship between income and spending changes during recession periods, we need a model that includes an interaction term between income and recession. Option B includes this interaction term (income×recession), allowing the slope of income to differ between recession and non-recession periods.

#### Q2: C

To capture different online spending patterns across age groups, we need a model that includes both the main effects of online and age, as well as their interaction. Only option C includes all necessary terms: income as a control variable, plus online, age, and their interaction term.

#### Q3: A

When the relationship between income and spending is non-linear with decreasing marginal propensity to consume at higher income levels, this suggests a quadratic relationship. Including income² as a predictor (option A) would capture this concave relationship. Option B (log transformation) would model constant elasticity rather than decreasing marginal propensity.

#### Q4: B

To address autocorrelation in time series data, modeling first differences (Δspending) rather than levels (option B) is generally most effective. This approach removes the trend component that often causes autocorrelation. While including lagged variables (option D) can also address autocorrelation, it doesn't fully solve the underlying non-stationarity issue that first differencing addresses.

#### Q5:

A complete regression specification to test whether the effect of having children on spending varies by both income level and online purchasing would be:

spending = β₀ + β₁·income + β₂·children + β₃·online + β₄·(children×income) + β₅·(children×online) + β₆·(income×online) + β₇·(children×income×online) + β₈·age + ε

This specification includes:
- Main effects for income, children, and online
- All two-way interactions: children×income, children×online, and income×online
- The three-way interaction: children×income×online
- Age as a control variable

The coefficient β₇ on the three-way interaction term tests whether the effect of having children on spending varies jointly by income level and online purchasing percentage.

#### Q6:

#### a) 
A regression model to identify seasonal patterns while controlling for income and age:

spending = β₀ + β₁·income + β₂·age + β₃·Feb + β₄·Mar + β₅·Apr + β₆·May + β₇·Jun + β₈·Jul + β₉·Aug + β₁₀·Sep + β₁₁·Oct + β₁₂·Nov + β₁₃·Dec + ε

Where Feb through Dec are dummy variables for each month (with January as the reference category).

#### b)
The coefficient on the December dummy variable (β₁₃) represents the average difference in spending between December and January (the reference month), controlling for income and age. If positive, it indicates higher spending in December compared to January, after accounting for the effects of income and age.

#### c)
To test whether seasonal spending patterns differ between recession and non-recession periods, I would modify the model to include interactions between the recession dummy and each monthly dummy:

spending = β₀ + β₁·income + β₂·age + β₃·Feb + ... + β₁₃·Dec + β₁₄·recession + β₁₅·(Feb×recession) + ... + β₂₅·(Dec×recession) + ε

The coefficients β₁₅ through β₂₅ on the interaction terms test whether the seasonal spending pattern for each month (relative to January) differs between recession and non-recession periods.