## Part 4 | Bivariate GLM

Part 3 ended with the intercept-only model — a horizontal line through data where the optimal parameter is the sample mean. We could test whether that parameter is zero. But in general we don't ask many questions about vertical intercepts. More interesting questions involve relationships between variables: does green space lower temperatures? Do wealthier countries have happier citizens? Does unemployment move with GDP? To answer these, we need to add a real predictor variable. Instead of a horizontal line, we fit lines with slopes. The slope gets its own sampling distribution, standard error, and p-value. We can now test whether relationships exist between variables.

The arc is: (4.1) categorical predictors — the simplest extension from the intercept-only model, comparing group means using dummy variables; (4.2) numerical predictors — fitting lines through scatter plots and testing whether slopes are zero; (4.3) timeseries predictors — handling data that unfolds over time, where observations depend on their past values; (4.4) model diagnostics — checking whether our model's assumptions hold and what to do when they don't.

---

### Part 4.1 | Categorical Predictors

#### Outline

- Simplest extension from the intercept-only model: instead of one mean, compare two means
- Code the category as a dummy variable (0/1)
- $\beta_0$ = mean of the reference group (where $x = 0$)
- $\beta_1$ = difference between the two group means
- The p-value on $\beta_1$ tests whether the difference is significant — this is a two-sample t-test expressed in regression language
- Null slopes visualization: many grey lines from the null distribution, observed red line stands out
- Exercise: environmental justice — pollution in low-income vs high-income neighborhoods
- More than two groups: create a dummy for each group (minus one reference), each $\beta$ measures the difference from the reference — this is ANOVA
- Reference group coding: changing the reference changes which differences the coefficients directly estimate, but the model is equivalent
- Transition: we've compared group means; next, continuous predictors

#### Narrative

The intercept-only model from 3.4 estimates a single mean and tests whether it's zero. But many economic questions involve comparing groups. Do neighborhoods with green space have lower temperatures than neighborhoods without? Do low-income areas face higher pollution? These are questions about differences between groups — and they're the most natural first step beyond the intercept-only model.

The idea is simple: code the category as a number. "High greenspace" = 1, "Low greenspace" = 0. Now the predictor is a number, and we can write the model as $Temperature = \beta_0 + \beta_1 \cdot HighGreen + \epsilon$. The line only touches two x-values — 0 and 1 — so $\beta_0$ is the mean of the reference group and $\beta_1$ is the difference between the two group means. The p-value on $\beta_1$ tests whether that difference is statistically significant. This is exactly the two-sample t-test, expressed in regression language.

With more than two groups — say, four climate regions — we create a dummy variable for each group except one (the reference). Each coefficient measures the difference between that group and the reference. This is ANOVA, and it's still just regression with dummy variables. The choice of reference group changes which differences the coefficients directly estimate, but the overall model is equivalent. At the end, students see that the GLM framework now encompasses one-sample t-tests ($y \sim 1$), two-sample t-tests ($y \sim Group$), and ANOVA ($y \sim Group_1 + Group_2 + ...$) — all minimizing MSE, all testing coefficients with t-distributions.

---

### Part 4.2 | Numerical Predictors

#### Outline

- Transition from categorical to continuous predictor: instead of 0 and 1, $x$ takes any value
- The bivariate model: $y_i = \beta_0 + \beta_1 x_i + \epsilon_i$
- MSE minimization with two parameters: compare three candidate lines (too steep, too flat, just right)
- MSE as a function of $\beta_1$ — another U-shaped curve with a clear minimum
- Sampling error in the slope: many samples give many different $\beta_1$ values
- Distribution of $\beta_1$: histogram of slopes follows a t-distribution centered on the true slope
- Hypothesis testing: $H_0: \beta_1 = 0$ — is there a relationship?
- Null slopes visualization: many lines drawn from the null distribution overlaid on data
- Predictions: plug in $x$ to get $\hat{y}$; moving one unit right changes $\hat{y}$ by $\beta_1$
- Interpretation: $\beta_1$ is the change in $y$ for a one-unit change in $x$
- GLM summary table: one-sample t-test, two-sample t-test, ANOVA, regression — all the same framework
- Exercise: happiness and GDP

#### Narrative

In 4.1, the predictor was 0 or 1 — the line connected two group means. Now the predictor is a continuous number. The line tilts through a full scatter plot. We write $y_i = \beta_0 + \beta_1 x_i + \epsilon_i$ and minimize MSE to find the best-fitting slope and intercept. Three candidate lines through the scatter — one too steep, one too flat, one just right — show visually what MSE minimization does.

Just like the intercept had sampling variability in 3.4, the slope has sampling variability here. Take many samples, fit a line to each, and the slopes form a t-distribution centered on the true population slope. The default null hypothesis is $H_0: \beta_1 = 0$ — no relationship between $x$ and $y$. The p-value tells us how surprising our observed slope would be if the true slope were zero. A null slopes visualization — many grey lines from the null distribution overlaid on the data, with the observed slope in red — makes this intuitive.

Predictions follow directly: plug any $x$ into the equation to get $\hat{y}$. The slope $\beta_1$ tells us how much $y$ changes for a one-unit change in $x$. By the end, the GLM summary table spans one-sample t-tests, two-sample t-tests, ANOVA, and regression — all the same framework, all minimizing MSE, all testing coefficients with t-distributions.

---

### Part 4.3 | Timeseries

#### Outline

- Data over time: many economic questions involve time series
- Autocorrelation: today's value depends on yesterday's — observations are not independent
- Lag plots reveal autocorrelation
- Model 1 (Levels): $Y = \beta_0 + \beta_1 \cdot t + \epsilon$ — residuals show runs (consistently positive, then consistently negative)
- Diagnosing autocorrelation: residual plots and residual lag plots
- Model 2 (First Differences): $\Delta Y_t = Y_t - Y_{t-1}$ — removes much of the autocorrelation
- Model 3 (Double First Differences): $\Delta Y = \beta_0 + \beta_1 \cdot \Delta X + \epsilon$ — do changes in X relate to changes in Y?
- Model 4 (Growth Rates): $g_Y = \beta_0 + \beta_1 \cdot g_X + \epsilon$ — normalizes for exponential growth
- Interpretation changes at each level: $\beta_0$ and $\beta_1$ mean different things in levels vs differences vs growth rates
- Exercise: GDP and unemployment across model specifications

#### Narrative

So far our models have used cross-sectional data — different cities, different neighborhoods. But many economic questions involve data that unfolds over time. When we put time on the x-axis, something breaks: today's value depends on yesterday's. This is autocorrelation, and it violates the independence assumption that our standard errors rely on. If we ignore it, our standard errors are too small and our p-values lie.

The naive approach — regressing $Y$ on time in levels — produces residuals that show runs: consistently positive for a while, then consistently negative. The fix is to model changes rather than levels. First differences ($\Delta Y_t = Y_t - Y_{t-1}$) remove much of the autocorrelation. Double first differences ($\Delta Y = \beta_0 + \beta_1 \cdot \Delta X + \epsilon$) let us ask whether changes in one variable relate to changes in another. For variables with exponential growth, growth rates ($g_Y = \Delta Y / Y_{t-1}$) normalize the scale and produce stationary series.

Each specification changes the interpretation of the coefficients. In levels, $\beta_1$ is the relationship between $Y$ and $X$. In first differences, $\beta_1$ is the short-term relationship between changes. In growth rates, $\beta_1$ is how Y's growth responds to X's growth. Students compare all three specifications using GDP and unemployment data.

---

### Part 4.4 | Model Diagnostics

#### Outline

- Can we trust our models? Coefficients, standard errors, and p-values depend on assumptions being met
- Two models side by side: one well-specified, one misleading — both produce numbers, but one is wrong
- Residuals ($\hat{\epsilon}_i = y_i - \hat{y}_i$) and predicted values ($\hat{y}_i$) are the raw material for diagnostics
- The residual plot: residuals vs predicted values — the single most important diagnostic tool
- Four OLS assumptions: (1) Linearity, (2) Homoskedasticity, (3) Normality, (4) Independence
- Checking linearity: curved residuals reveal non-linear relationships; fix with transformations ($x^2$, $\log$)
- Checking homoskedasticity: fan-shaped residuals mean unequal spread; fix with robust standard errors
- Checking normality: histogram of residuals; CLT makes this less critical with large samples
- Checking independence: residual lag plots reveal autocorrelation; fix with differencing (connects to 4.3)
- The diagnostic workflow applies to all model types from 4.1–4.3
- Exercise: revisit earlier models with full diagnostic checks

#### Narrative

We've built models with categorical predictors (4.1), numerical predictors (4.2), and time series (4.3). Every model gave us coefficients, standard errors, and p-values. But should we trust those numbers? The answer depends on whether the model's assumptions are met. Two scatter plots side by side — one where a linear model fits well, one where it doesn't — both produce coefficients and p-values, but one of them is misleading.

The key diagnostic tool is the residual plot: residuals against predicted values. If the model is well-specified, this looks like random noise. Patterns reveal problems. A U-shape means non-linearity — fix with transformations. A fan or funnel shape means heteroskedasticity — fix with robust standard errors. Autocorrelation in the residuals means the independence assumption is violated — fix with differencing, as we learned in 4.3.

Students have been doing "check the residuals" in every exercise since 4.1 — now they understand the full theory behind it. The diagnostic workflow (fit the model, extract residuals, make residual plots, check for patterns) applies to every model type. This section is the capstone of Part 4: we can build models and we can validate them.

---

### Optional: Causality

An optional section covers the distinction between correlation and causation. Using the ice cream and drowning example, students learn that significant slopes don't necessarily mean causal relationships — confounding variables can create spurious correlations. The fix is control variables: adding the confounder to the model isolates the true relationship. This previews the multivariate framework in Part 5.

---

### Summary

| Part | Core Idea | Key Result |
|------|-----------|------------|
| 4.1 | Categorical predictors | Dummy variables turn group comparisons into regression; two-sample t-test and ANOVA are special cases of the GLM |
| 4.2 | Numerical predictors | Slopes have sampling distributions and p-values; test whether relationships exist |
| 4.3 | Timeseries | Autocorrelation breaks independence; differencing and growth rates fix it |
| 4.4 | Model diagnostics | Residual plots check linearity, homoskedasticity, normality, independence; diagnostics validate all model types |
