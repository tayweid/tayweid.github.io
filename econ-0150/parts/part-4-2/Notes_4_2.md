## Part 4.2 | Numerical Predictors

### Overview

- Transition from categorical to continuous predictor: the line tilts through a full scatter plot
- The bivariate model: $y_i = \beta_0 + \beta_1 x_i + \epsilon_i$
- MSE minimization: compare candidate lines, find the slope that minimizes total squared error
- MSE as a function of $\beta_1$ — another U-shaped curve with a clear minimum
- Sampling error in the slope: different samples produce different slopes
- Distribution of $\beta_1$: t-distribution centered on the true population slope
- Hypothesis testing: $H_0: \beta_1 = 0$ — is there a relationship?
- Null slopes visualization: lines from the null distribution overlaid on the data
- Predictions: plug in $x$ to get $\hat{y}$; interpretation of $\beta_1$ as the change in $y$ per unit change in $x$
- GLM summary: one-sample t-test, two-sample t-test, ANOVA, regression — all the same framework
- Exercise: happiness and GDP

---

### Opening — From Categories to Continuous Predictors

In 4.1, the predictor was a dummy variable — 0 or 1 — and the regression line connected two group means. The model could only make two distinct predictions. Now we remove that restriction. The predictor is a continuous number — GDP per capita, minutes after opening, years of education — and the model makes a different prediction for every value of $x$.

*[Stage direction: show a scatter plot of happiness (y-axis) vs GDP per capita (x-axis) for ~50 countries. No line yet — just the cloud of points. The relationship is clearly positive: wealthier countries tend to be happier. Title: "Are wealthier countries happier?"]*

We've seen scatter plots like this since Part 2. We described the relationship as "positive" or "strong." Now we can be precise.

---

### The Bivariate Model

We write the model:

$$y_i = \beta_0 + \beta_1 x_i + \epsilon_i$$

This is the same equation we introduced in 3.4, now with a real predictor variable. The model makes a different prediction for each observation:

$$\hat{y}_i = \beta_0 + \beta_1 x_i$$

The prediction lies on the line. The error $\epsilon_i = y_i - \hat{y}_i$ is the vertical distance from the data point to the line.

*[Stage direction: same scatter plot, now with a red regression line overlaid. Green dashed segments connect each data point vertically to the line, showing the errors. Label one point's components: the data point $y_i$ at the top of the segment, the predicted value $\hat{y}_i$ where the segment meets the line, and the error $\epsilon_i$ as the length of the segment.]*

Compared to the intercept-only model from 3.4, the line now tilts. The errors measure distance from a tilted line rather than a flat one. And the MSE should be smaller — because the tilted line explains some of the variability that the horizontal line couldn't.

---

### Choosing the Slope — MSE

How do we find the best line? Same idea as 3.4: minimize the mean squared error. But now we're choosing two parameters — $\beta_0$ and $\beta_1$ — instead of one.

*[Stage direction: 3-panel figure. Each panel shows the same scatter plot with a different regression line in red and green dashed error segments from each point to the line.*
- *Left panel: a line that's too steep ($\beta_1$ too large). Errors are large. Title: "Model A — MSE = 8.42."*
- *Center panel: a line that's too flat ($\beta_1$ too small). Errors are large in a different pattern. Title: "Model B — MSE = 5.87."*
- *Right panel: the optimal line ($\beta_1$ from OLS). Errors are as small as possible. Title: "Model C — MSE = 3.21."]*

Which line produces the smallest total squared error? Model C — the one that balances the errors most evenly. This is what OLS (ordinary least squares) does: it finds the slope and intercept that minimize MSE.

---

### MSE as a Function of $\beta_1$

We can visualize the optimization directly. Try every possible slope, compute the MSE for each one, and plot the result.

*[Stage direction: 2-panel figure.*
- *Left panel: the scatter plot with the optimal regression line and green dashed errors. Title: "Model C."*
- *Right panel: a U-shaped curve plotting MSE (y-axis) against the slope $\beta_1$ (x-axis). The curve has a clear minimum. A red dot marks the minimum, with a red dashed line dropping to the x-axis at $\hat{\beta}_1$. Title: "MSE for Different Slopes."]*

This should look familiar. In 3.4, we plotted MSE as a function of $b$ (the intercept) and found that the sample mean minimized it. Here, we're plotting MSE as a function of the slope, and the minimum gives us the best-fitting slope. Same logic, one more dimension.

---

### Sampling Error in the Slope

Now imagine taking many samples from the same population. Each sample gives a slightly different scatter plot, and OLS gives a slightly different slope.

*[Stage direction: 8-panel grid (2 rows of 4). Each panel shows a different sample — blue dots in a scatter plot with a red regression line. Each panel has a title like "Sample 1: Slope = 0.0112" or "Sample 4: Slope = 0.0068." The slopes vary across panels — some steeper, some flatter — but they're all in the same ballpark. The true relationship is visible in each sample, just noisier.]*

Each sample gives a slightly different $\beta_1$. Some slopes are steeper than the truth, some are flatter. This is sampling variability — the same phenomenon from 3.2 and 3.4, now applied to slope coefficients.

---

### Distribution of $\beta_1$

Collect all the slopes from many samples and plot them on a histogram. What do we see?

*[Stage direction: histogram of ~1,000 slope coefficients. The histogram is bell-shaped. Overlay a green dashed t-distribution curve. A black vertical dashed line marks the true population slope. The histogram is centered on the truth. Title: "Sampling Distribution of $\beta_1$."]*

It's the familiar bell curve. The distribution of $\beta_1$ across samples follows a t-distribution centered on the true population slope.

This shouldn't be surprising. The CLT applies to slope coefficients too — they're functions of the data, and as the sample size grows, their sampling distribution approaches normal. The t-distribution accounts for the extra uncertainty from estimating the standard error.

---

### Centering on the Observed Slope

In practice, we only have one sample. We observe one slope. Just as we did in 3.3, we center the sampling distribution on our observed value.

*[Stage direction: t-distribution centered on zero (the null hypothesis). The observed slope is marked with a red vertical dashed line to the right of zero. A black vertical line marks zero (the null). The curve is centered on the null. Title shows: "Default Null: $\beta_1 = 0$."]*

We know the shape and spread of the distribution. That's enough to test hypotheses.

---

### Testing Whether $\beta_1 = 0$

The default null hypothesis is $H_0: \beta_1 = 0$ — there is no relationship between $x$ and $y$. If the true slope were zero, the predictor would be useless and the regression line would be flat.

We ask: if there were no relationship, how surprising is the slope we observed? The p-value is the probability of seeing a slope as extreme as ours (or more extreme) under the null distribution.

*[Stage direction: t-distribution centered on zero. The observed slope is marked with a red dashed vertical line. A mirror of the observed slope on the other side of zero is marked with a faded red dashed line ("Equally Extreme"). The tails beyond both lines are shaded in blue, labeled "p-value." The shaded area is small — the slope is far from zero.]*

A small p-value means our slope is far from what we'd expect by chance — evidence of a real relationship. A large p-value means a slope like ours could easily arise from sampling variability alone.

---

### Null Slopes Visualization

Another way to see this: draw many lines from the null distribution and overlay them on the data.

*[Stage direction: the scatter plot with data points shown at low opacity. Many grey lines (50+) are overlaid — each representing a slope drawn from the null distribution ($\beta_1 = 0$). The grey lines cluster around horizontal (zero slope), fanning out slightly due to sampling variability. The observed regression line is plotted in red on top, clearly steeper than all the grey lines. Label: "Grey lines: possible slopes under the null ($\beta_1 = 0$)."]*

If our red line looks like one of the grey lines, we can't reject the null. If it stands out — steeper or flatter than anything the null would produce — the relationship is real.

---

### Predictions

The fitted line lets us predict $y$ for any value of $x$. What's the expected wait time at 100 minutes after opening? Plug it in:

$$\hat{y} = \beta_0 + \beta_1 \cdot 100$$

*[Stage direction: scatter plot with regression line. A green vertical dashed line at $x = 100$. Where the vertical line meets the regression line, a green star marks the prediction point. A green horizontal dashed line extends from the prediction point to the y-axis, showing the predicted value. Data points near $x = 100$ are highlighted (full opacity) while other points are faded.]*

What about at 200 minutes? The prediction is $\beta_1 \cdot 100$ higher than at 100 minutes. Moving 100 units to the right on the x-axis changes the prediction by exactly $100 \cdot \beta_1$.

---

### Interpreting $\beta_1$

$\beta_1$ is the change in $y$ for a one-unit change in $x$. This is the most important number the model produces.

*[Stage direction: scatter plot with regression line, data faded. Two green prediction points on the line are marked — one at $x_1 = 200$ and one at $x_2 = 300$. A purple horizontal double-arrow between them is labeled "$\Delta x = 100$ min." A purple vertical double-arrow on the left shows the change in predicted values, labeled "$\Delta y = 1.10$." The visual makes clear: move right by $\Delta x$, move up by $\Delta y = \beta_1 \cdot \Delta x$.]*

In our example, $\beta_1 \approx 0.011$ means that for each additional minute after opening, the expected wait time increases by about 0.011 minutes. Over 100 minutes, that's about 1.1 minutes longer.

What about $\beta_0$? It's the predicted $y$ when $x = 0$ — the expected wait time when the shop first opens. But be careful: if $x = 0$ is outside the range of the data, $\beta_0$ may not have a meaningful interpretation. Don't predict where you don't have data.

---

### GLM Summary

We can now see the full picture. Every test we've encountered is a special case of the GLM:

| Test | Model | Predictor Type |
|------|-------|----------------|
| One-sample t-test | $y = \beta_0 + \epsilon$ | None (intercept only) |
| Two-sample t-test | $y = \beta_0 + \beta_1 \cdot Group + \epsilon$ | Binary dummy (0/1) |
| ANOVA | $y = \beta_0 + \beta_1 G_1 + \beta_2 G_2 + ... + \epsilon$ | Multiple dummies |
| Regression | $y = \beta_0 + \beta_1 x + \epsilon$ | Continuous number |

All minimize MSE. All produce coefficients with t-distributions. All test whether coefficients equal zero. The framework is unified — the only thing that changes is what goes in for $x$.

---

### Exercise Preview

*Exercise 4.2: Happiness and Per Capita GDP.* Students fit the model $Happiness = \beta_0 + \beta_1 \cdot \log(GDP) + \epsilon$, interpret the slope, test the null $H_0: \beta_1 = 0$, make predictions for specific GDP levels, and check the residuals.

---

### Looking Ahead

We can fit lines through scatter plots and test relationships between variables. But what about data that unfolds over time? When observations are ordered — GDP this quarter, then next quarter, then the quarter after — they're no longer independent. The errors from one period carry over into the next. In 4.3, we learn how to handle this.
