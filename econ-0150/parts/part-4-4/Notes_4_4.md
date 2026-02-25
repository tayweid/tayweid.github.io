## Part 4.4 | Model Diagnostics

### Overview

- Every model produces coefficients, standard errors, and p-values — but should we trust them?
- The answer depends on whether the model's assumptions are met
- Two diagnostic quantities: residuals ($\hat{\epsilon}_i = y_i - \hat{y}_i$) and predicted values ($\hat{y}_i$)
- The residual plot (residuals vs predicted values) is the single most important diagnostic tool
- Four OLS assumptions: (1) Linearity, (2) Homoskedasticity, (3) Normality, (4) Independence
- Checking linearity: U-shaped residuals → non-linear relationship → fix with transformations
- Checking homoskedasticity: fan-shaped residuals → unequal spread → fix with robust standard errors
- Checking normality: histogram of residuals should be roughly bell-shaped; CLT makes this less critical
- Checking independence: residual lag plot reveals autocorrelation → fix with differencing (connects to 4.3)
- The diagnostic workflow applies to all model types from 4.1–4.3

---

### Opening — Can We Trust Our Models?

We've built models with categorical predictors (4.1), numerical predictors (4.2), and time series (4.3). Every model gave us coefficients, standard errors, and p-values. Every model told us whether a relationship was "significant." But should we believe those numbers?

The honest answer: it depends. The p-values and confidence intervals our models produce are only valid if certain assumptions are met. When those assumptions are violated, the model still runs — it still gives you numbers — but those numbers can be misleading. We need a way to check.

---

### Two Models, One Misleading

*[Stage direction: 2-panel figure.*
- *Left panel: scatter plot of data where a linear model fits well. Blue data points with a red regression line through them. The points scatter randomly around the line with roughly constant spread. Title: "Model 1."*
- *Right panel: scatter plot of data with a curved relationship (exponential or quadratic). A red linear regression line is forced through the data. The line clearly misses the curvature — it under-predicts at the ends and over-predicts in the middle. Title: "Model 2."]*

Both models produce coefficients, standard errors, and p-values. Both give you a $\beta_1$ and a confidence interval. But Model 2 is wrong — it's fitting a straight line to curved data. Its predictions are systematically off. Its p-values don't mean what they claim.

How would you tell which model to trust just by looking at the data? You might see the curvature in the right panel. But with more variables and messier data, it's not always obvious. We need a systematic tool.

---

### Residuals and Predicted Values

Every model produces two quantities that are the raw material for diagnostics:

1. **Predicted values** ($\hat{y}_i$): the model's best guess for each observation — the point on the line.
2. **Residuals** ($\hat{\epsilon}_i = y_i - \hat{y}_i$): the gap between what we observe and what the model predicts — the vertical distance from the point to the line.

*[Stage direction: scatter plot with a regression line. Data points in blue, line in red. For a few representative points, draw green dashed segments from the data point vertically to the line. Label one segment: "$y_i$" at the data point, "$\hat{y}_i$" where the segment meets the line, and "$\epsilon_i$" as the length of the segment. Fade the data and line slightly, and highlight the green segments to emphasize that residuals are what we're analyzing.]*

If the model is good, the residuals should be random noise — no pattern, no structure. If the residuals have a pattern, the model is missing something.

---

### The Residual Plot

The single most important diagnostic: plot the residuals (y-axis) against the predicted values (x-axis).

*[Stage direction: 2-panel figure.*
- *Left panel: residual plot from a well-specified model. Residuals scatter randomly around zero with roughly constant spread. No visible pattern. A horizontal red line at zero. Title: "Good: Random Scatter."*
- *Right panel: residual plot from a mis-specified model (linear fit to curved data). Residuals show a clear U-shape — negative at low predicted values, positive in the middle, negative at high predicted values. A horizontal red line at zero. Title: "Bad: U-Shaped Pattern."]*

If the residual plot looks like random noise — points scattered evenly around zero — the model is well-specified. If there's a pattern — a curve, a fan, clusters — something is wrong.

Why do we plot residuals against predicted values rather than against $x$? Because with more complicated models (multiple predictors), there's no single $x$ to plot against. The predicted value $\hat{y}$ is a single number that captures the entire model's output. This approach scales to any model complexity.

---

### The Four OLS Assumptions

For our hypothesis tests to be valid, four things need to be true about the errors:

1. **Linearity**: The relationship between $X$ and $Y$ is linear
2. **Homoskedasticity**: The spread of errors is constant across all values of $X$
3. **Normality**: The errors are normally distributed
4. **Independence**: The errors are independent from each other

These aren't just technicalities. Each violation affects our results in a specific way. Let's check each one.

---

### Assumption 1 — Linearity

A linear model assumes the relationship between $x$ and $y$ is a straight line. If the true relationship is curved, the linear model will be systematically wrong — over-predicting in some regions and under-predicting in others.

**Example**: age and income. Income tends to rise with age through mid-career, then flatten or decline near retirement. The relationship is an inverted U, not a straight line.

*[Stage direction: 2-panel figure.*
- *Left panel: scatter plot of age (x-axis) vs income (y-axis) with 150 data points. A red linear regression line is overlaid. A green dashed curve shows the true quadratic relationship. The linear line misses the curvature. Title: "Linear Regression: Age vs Income."*
- *Right panel: residual plot (residuals vs fitted values) from the linear model. Clear U-shaped pattern — negative residuals at low and high fitted values, positive in the middle. A red LOWESS smooth line confirms the curve. An annotation arrow points to the U-shape: "Clear U-shaped pattern in residuals." Title: "Residuals vs Fitted Values (Linear Model)."]*

The residual plot reveals the problem. The U-shape tells us: the model under-predicts for young and old workers and over-predicts for middle-aged workers. The relationship is not linear.

**Handling non-linearity**: Transform the variables. Common fixes:
- Add a squared term: $income = \beta_0 + \beta_1 \cdot age + \beta_2 \cdot age^2 + \epsilon$
- Take logs: $\log(income) = \beta_0 + \beta_1 \cdot age + \epsilon$

The goal is to make the residual plot look like random noise. If the pattern disappears after the transformation, you've fixed the problem.

---

### Assumption 2 — Homoskedasticity

"Homoskedasticity" means "same spread." The errors should have roughly equal variance across the range of predicted values. The opposite — **heteroskedasticity** ("different spread") — means the model is more wrong in some regions than others.

**Example**: education and wages. A high school graduate might earn $30,000-$50,000, a range of $20,000. A PhD might earn $50,000-$200,000, a range of $150,000. More education → more variability in wages.

*[Stage direction: 2-panel figure.*
- *Left panel: scatter plot of education (x-axis) vs wages (y-axis). Red regression line overlaid. The spread of points clearly increases with education — tight clustering at low education, wide fan at high education. Grey shaded regions at three education levels show the increasing spread. Annotations: "High school (less spread)" near x=12, "Bachelor's (medium spread)" near x=16, "PhD (more spread)" near x=20. Title: "Education vs Wages: Increasing Spread."*
- *Right panel: residual plot. Clear fan or funnel shape — residuals are tightly clustered at low fitted values and widely spread at high fitted values. Grey dashed envelope lines and shaded region emphasize the expanding spread. Annotations: "Smaller errors" at left, "Larger errors" at right with double-headed arrows showing the spread. Title: "Residuals vs Fitted Values: Heteroskedasticity."]*

Which of these residual plots shows homoskedasticity?

*[Stage direction: 2-panel figure.*
- *Left panel: residual plot with constant spread — points scatter evenly around zero at all fitted values. Title: (unlabeled).*
- *Right panel: residual plot with fan-shaped spread — tight at left, wide at right. Title: (unlabeled).]*

The left panel shows constant variability (homoskedasticity). The right panel shows increasing variability (heteroskedasticity). The residual plot should show that the model is equally wrong everywhere.

**Why it matters**: The coefficient estimates ($\beta_0$, $\beta_1$) are still unbiased — they're still centered on the truth. But the standard errors are wrong. With heteroskedasticity, the usual standard errors are typically too small, making us overconfident. P-values are unreliable.

**Handling heteroskedasticity**: The fix is **robust standard errors**. These adjust for the changing spread without changing the coefficient estimates. The $\beta$'s stay the same; only the standard errors (and therefore the p-values) change.

Conceptually, robust standard errors let the "ruler" we use to measure uncertainty stretch or shrink depending on the local spread of the data. In practice, this is a one-line change when fitting the model: specify `cov_type='HC3'`.

---

### Assumption 3 — Normality

The errors should be approximately normally distributed — the histogram of residuals should look roughly bell-shaped.

*[Stage direction: 2-panel figure.*
- *Left panel: histogram of residuals that looks roughly normal — symmetric, bell-shaped, centered at zero. A KDE (kernel density estimate) curve overlaid. Title: "Roughly Normal."*
- *Right panel: histogram of residuals that is clearly skewed — long right tail, not symmetric. A KDE curve shows the asymmetry. Title: "Not Normal."]*

This assumption matters most with small samples. With small $n$, our t-tests and confidence intervals rely on the errors being close to normal. With large samples, the CLT saves us — the sampling distribution of the coefficients approaches normal regardless of the error distribution, just like the sampling distribution of the mean approaches normal regardless of the population shape (3.2).

In practice, normality is the least critical assumption. Check it, but don't panic about minor departures — especially with reasonable sample sizes.

---

### Assumption 4 — Independence

Observations should be independent from each other. One observation's error should tell us nothing about another observation's error.

This is where timeseries models (4.3) run into trouble. In cross-sectional data (different cities, different people), independence is usually reasonable — one city's temperature doesn't affect another's. But in time series, today's error is correlated with yesterday's.

*[Stage direction: 2-panel figure comparing residual lag plots.*
- *Left panel: "Levels Model" — residual lag plot from a time series regression in levels. Current residual (y-axis) vs lagged residual (x-axis). Strong positive relationship. Red regression line slopes clearly upward. Text: "Autocorrelation = 0.65." Title: "Residual Lag Plot: Levels Model."*
- *Right panel: "Differenced Model" — residual lag plot from the first-differences specification. The relationship is much weaker — points form a diffuse cloud. Text: "Autocorrelation = 0.12." Title: "Residual Lag Plot: Differenced Model."]*

The left panel is the signature of autocorrelation: if the residual was positive last period, it tends to be positive this period too. The right panel shows the fix — differencing removes most of the autocorrelation.

**Handling non-independence**: Use the techniques from 4.3 — first differences or growth rates. These transform the data so that the residuals are approximately independent. Always check the residual lag plot after differencing to confirm the fix worked.

---

### The Diagnostic Workflow

For every model you build — whether it has categorical, numerical, or time-based predictors — follow the same diagnostic steps:

1. **Fit the model** and extract residuals and predicted values
2. **Make a residual plot** (residuals vs predicted values)
3. **Check for linearity**: is there a curved pattern?
4. **Check for homoskedasticity**: does the spread change?
5. **Check for normality**: are the residuals roughly bell-shaped?
6. **Check for independence**: (for time series) does the residual lag plot show autocorrelation?

If a problem appears, apply the appropriate fix:
- Non-linearity → transform variables ($x^2$, $\log x$, $\log y$)
- Heteroskedasticity → use robust standard errors
- Non-normality → less concerning with large samples; consider transformations if severe
- Autocorrelation → difference the data

Students have been doing "Step 4: Check the residuals" in every exercise throughout Part 4. Now they understand the full theory behind that step — what they're checking for, why it matters, and what to do when problems appear.

---

### Exercise Preview

*Exercise 4.4: Full Diagnostic Checks.* Students revisit models from earlier exercises — the environmental justice model (4.1), the happiness/GDP model (4.2), and the GDP/unemployment model (4.3). For each, they produce the full set of diagnostics: residual plots, residual histograms, and (for timeseries) residual lag plots. They identify which assumptions are met and which are violated, and apply the appropriate fixes (robust standard errors, variable transformations, differencing).

---

### Looking Ahead — Part 5

We've built and validated bivariate models — models with one predictor and one outcome. In Part 5, we extend to the full multivariate framework. We'll add numerical controls (5.1), categorical controls (5.2), interaction effects (5.3), and model selection (5.4). The diagnostic tools from this section apply to every model we'll build going forward. The residual plot remains the essential check, no matter how many predictors we add.

All of this is built on the same OLS foundation from Parts 3 and 4: minimize MSE, estimate coefficients, test them with t-distributions, and check assumptions with residual diagnostics.
