## Part 4 | Bivariate GLM

Part 3 ended with the intercept-only model -- a horizontal line through data where the optimal parameter is the sample mean. We could test whether that parameter is zero. But in general we don't ask many questions about vertical intercepts. More interesting questions involve relationships between variables: does green space lower temperatures? Do wealthier countries have happier citizens? Does unemployment move with GDP? To answer these, we need to add a real predictor variable. Instead of a horizontal line, we fit lines with slopes. The slope gets its own sampling distribution, standard error, and p-value. We can now test whether relationships exist between variables.

The arc is: (4.1) numerical predictors -- fitting lines through scatter plots and testing whether slopes are zero; (4.2) categorical predictors -- the special case where the predictor is binary, turning group comparisons into regression; (4.3) model assumptions -- checking whether our model's assumptions hold and what to do when they don't (with timeseries as an independence violation example); (4.4) causality -- the distinction between correlation and causation, confounding variables, and control variables.

---

### Part 4.1 | Numerical Predictors

#### Outline

- Natural extension from the intercept-only model: the horizontal line gets a slope
- The bivariate model: $y_i = \beta_0 + \beta_1 x_i + \epsilon_i$
- MSE minimization with two parameters: compare three candidate lines (too steep, too flat, just right)
- MSE as a function of $\beta_1$ -- another U-shaped curve with a clear minimum
- Sampling error in the slope: many samples give many different $\beta_1$ values
- Distribution of $\beta_1$: histogram of slopes follows a t-distribution centered on the true slope
- Hypothesis testing: $H_0: \beta_1 = 0$ -- is there a relationship?
- Null slopes visualization: many lines drawn from the null distribution overlaid on data
- Predictions: plug in $x$ to get $\hat{y}$; moving one unit right changes $\hat{y}$ by $\beta_1$
- Interpretation: $\beta_1$ is the change in $y$ for a one-unit change in $x$
- Exercise: happiness and GDP

#### Narrative

In 3.4 the model was a horizontal line -- a single number predicting every observation. Now we tilt that line. The predictor is a continuous number, and the line runs through a full scatter plot. We write $y_i = \beta_0 + \beta_1 x_i + \epsilon_i$ and minimize MSE to find the best-fitting slope and intercept. Three candidate lines through the scatter -- one too steep, one too flat, one just right -- show visually what MSE minimization does.

Just like the intercept had sampling variability in 3.4, the slope has sampling variability here. Take many samples, fit a line to each, and the slopes form a t-distribution centered on the true population slope. The default null hypothesis is $H_0: \beta_1 = 0$ -- no relationship between $x$ and $y$. The p-value tells us how surprising our observed slope would be if the true slope were zero. A null slopes visualization -- many grey lines from the null distribution overlaid on the data, with the observed slope in red -- makes this intuitive.

Predictions follow directly: plug any $x$ into the equation to get $\hat{y}$. The slope $\beta_1$ tells us how much $y$ changes for a one-unit change in $x$. By the end, students can fit a line, test whether the slope is significant, and interpret the result in context.

---

### Part 4.2 | Categorical Predictors

#### Outline

- Special case of regression: the predictor is 0 or 1 instead of continuous
- Code the category as a dummy variable (0/1)
- $\beta_0$ = mean of the reference group (where $x = 0$)
- $\beta_1$ = difference between the two group means
- The p-value on $\beta_1$ tests whether the difference is significant -- this is a two-sample t-test expressed in regression language
- Null slopes visualization: many grey lines from the null distribution, observed red line stands out
- Exercise: environmental justice -- pollution in low-income vs high-income neighborhoods
- More than two groups: create a dummy for each group (minus one reference), each $\beta$ measures the difference from the reference -- this is ANOVA
- Reference group coding: changing the reference changes which differences the coefficients directly estimate, but the model is equivalent
- GLM summary table: one-sample t-test, two-sample t-test, ANOVA, regression -- all the same framework

#### Narrative

In 4.1 the predictor was a continuous number -- the line tilted through a scatter plot. Now consider the special case where the predictor is binary: 0 or 1. "High greenspace" = 1, "Low greenspace" = 0. The model is $Temperature = \beta_0 + \beta_1 \cdot HighGreen + \epsilon$, and the line only touches two x-values. So $\beta_0$ is the mean of the reference group and $\beta_1$ is the difference between the two group means. The p-value on $\beta_1$ tests whether that difference is statistically significant. This is exactly the two-sample t-test, expressed in regression language.

With more than two groups -- say, four climate regions -- we create a dummy variable for each group except one (the reference). Each coefficient measures the difference between that group and the reference. This is ANOVA, and it's still just regression with dummy variables. The choice of reference group changes which differences the coefficients directly estimate, but the overall model is equivalent.

By the end, the GLM summary table spans one-sample t-tests ($y \sim 1$), two-sample t-tests ($y \sim Group$), ANOVA ($y \sim Group_1 + Group_2 + ...$), and regression ($y \sim x$) -- all the same framework, all minimizing MSE, all testing coefficients with t-distributions.

---

### Part 4.3 | Model Assumptions

#### Outline

- Can we trust our models? Coefficients, standard errors, and p-values depend on assumptions being met
- Two models side by side: one well-specified, one misleading -- both produce numbers, but one is wrong
- Residuals ($\hat{\epsilon}_i = y_i - \hat{y}_i$) and predicted values ($\hat{y}_i$) are the raw material for diagnostics
- The residual plot: residuals vs predicted values -- the single most important diagnostic tool
- Four OLS assumptions: (1) Linearity, (2) Homoskedasticity, (3) Normality, (4) Independence
- Checking linearity: curved residuals reveal non-linear relationships; fix with transformations ($x^2$, $\log$)
- Checking homoskedasticity: fan-shaped residuals mean unequal spread; fix with robust standard errors
- Checking normality: histogram of residuals; CLT makes this less critical with large samples
- Checking independence: residual lag plots reveal autocorrelation; fix with differencing (timeseries as a violation-of-independence example)
- The diagnostic workflow applies to all model types from 4.1--4.2
- Exercise: revisit earlier models with full diagnostic checks

#### Narrative

We've built models with numerical predictors (4.1) and categorical predictors (4.2). Every model gave us coefficients, standard errors, and p-values. But should we trust those numbers? The answer depends on whether the model's assumptions are met. Two scatter plots side by side -- one where a linear model fits well, one where it doesn't -- both produce coefficients and p-values, but one of them is misleading.

The key diagnostic tool is the residual plot: residuals against predicted values. If the model is well-specified, this looks like random noise. Patterns reveal problems. A U-shape means non-linearity -- fix with transformations. A fan or funnel shape means heteroskedasticity -- fix with robust standard errors. Autocorrelation in the residuals means the independence assumption is violated -- fix with differencing. Timeseries data serves as a concrete example of how independence violations arise and how to address them.

Students have been doing "check the residuals" in every exercise since 4.1 -- now they understand the full theory behind it. The diagnostic workflow (fit the model, extract residuals, make residual plots, check for patterns) applies to every model type.

---

### Part 4.4 | Causality

#### Outline

- A significant $\beta_1$ means there's a relationship -- but does $X$ cause $Y$?
- The ice cream and drowning example: a strong positive correlation that is entirely spurious
- Three possible explanations for any correlation: direct causation, reverse causation, confounding
- Confounding variables create spurious correlations by affecting both $X$ and $Y$
- The regression still finds the "least wrong" predictions -- but prediction is not causation
- The fix: add the confounding variable to the model as a control variable
- Multiple regression: each coefficient represents the effect of that variable holding others constant
- Domain knowledge is essential -- statistics alone cannot establish causation
- This previews the multivariate framework in Part 5

#### Narrative

We've learned to test whether relationships exist. We've found significant slopes. The p-value on $\beta_1$ told us that the relationship between $X$ and $Y$ is unlikely to be zero. But does a significant $\beta_1$ mean $X$ causes $Y$? The ice cream and drowning example shows a strong positive correlation that is entirely spurious -- confounding variables can create correlations where no causal relationship exists. The fix is control variables: adding the confounder to the model isolates the true relationship. This previews the multivariate framework in Part 5.

---

### Summary

| Part | Core Idea | Key Result |
|------|-----------|------------|
| 4.1 | Numerical predictors | Slopes have sampling distributions and p-values; test whether relationships exist |
| 4.2 | Categorical predictors | Dummy variables turn group comparisons into regression; two-sample t-test and ANOVA are special cases of the GLM |
| 4.3 | Model assumptions | Residual plots check linearity, homoskedasticity, normality, independence; timeseries as independence violation example |
| 4.4 | Causality | Correlation vs causation; confounding variables; control variables preview multivariate framework |
