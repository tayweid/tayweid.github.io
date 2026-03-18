## Part 4.2 | Categorical Predictors

### Overview

- In 4.1, we fit a tilted line through continuous data and tested whether the slope was zero
- Many economic questions compare groups, not continuous relationships — what happens when the predictor is just 0 and 1?
- When data are naturally paired (3.4), we compute differences and test the mean difference — but pairing isn't always possible
- When groups can't be paired, we code the category as a dummy variable and use the same regression framework from 4.1
- $\beta_0$ = predicted $y$ when $x = 0$ = mean of the reference group (same interpretation rule as 4.1)
- $\beta_1$ = change in $y$ for a one-unit change in $x$ = difference between group means (same rule — one unit just means one group to the other)
- Sampling error: different samples give different slopes — the estimated difference varies from sample to sample
- Distribution of $\beta_1$: the slopes follow a t-distribution centered on the true population difference
- Hypothesis testing: $H_0: \beta_1 = 0$ — is the difference between groups real or just sampling noise?
- Null slopes visualization shows how extreme our observed difference is compared to chance
- This is a two-sample t-test expressed in regression language
- GLM summary: intercept-only, numerical predictor, binary predictor — all the same framework

---

### Opening — From Continuous to Categorical

In 4.1, we put a continuous variable on the x-axis, fit a tilted line, and tested whether the slope was zero. That line ran through a cloud of points, and the slope told us how much $y$ changes for every one-unit increase in $x$.

But many economic questions aren't about continuous relationships. They're about comparing groups. Is temperature different in high-greenspace vs low-greenspace neighborhoods? Do low-income areas face more pollution? Do workers with a college degree earn more than workers without one? These questions all involve a categorical predictor — a variable that sorts observations into groups rather than placing them on a continuous scale.

How do we handle this in the regression framework we've been building? It turns out we already have the tools. We just need to think carefully about what happens when $x$ can only be 0 or 1.

---

### When Pairing Works

We've actually compared groups before. At the end of 3.4, we compared morning and afternoon wait times. The trick was that the data were naturally paired — each coffee shop had both a morning observation and an afternoon observation on the same day. So we could compute a difference for each pair:

$$d_i = y_{i,afternoon} - y_{i,morning}$$

Once we had those differences, we fit the intercept-only model ($d \sim 1$) and tested whether the mean difference was zero. If $\beta_0 \neq 0$, the two time periods differ systematically.

This works beautifully when pairing is natural. Same shop, same day — the only thing that changed was the time of day. Any other factors (location, size, neighborhood) are held constant because we're comparing each shop to itself.

---

### When Pairing Breaks Down

Now consider the greenspace question: we have 100 neighborhoods, some with high green space and some with low green space, and we want to know whether they differ in temperature.

We can't pair them. There's no natural match between a specific high-greenspace neighborhood and a specific low-greenspace neighborhood. They're different places with different characteristics. We can't compute a difference for each "pair" because there are no pairs.

It gets worse. What if we have 60 low-greenspace neighborhoods and 40 high-greenspace neighborhoods? The groups aren't even the same size. There's no way to line them up one-to-one.

We need a different approach — one that compares group means without requiring paired observations. And we already have one. The regression framework from 4.1 doesn't care whether $x$ is continuous or not. It just needs $x$ to be a number.

---

### The Binary Predictor — Same Regression, Different X

Here's the key insight: if we code the group as a number, we can use the same regression from 4.1.

Create a **dummy variable**: $HighGreen = 1$ if the neighborhood has high green space, $HighGreen = 0$ otherwise. Now each observation has a temperature (the outcome) and a number — 0 or 1 — as the predictor.

*[Stage direction: show a box/strip plot of temperature by greenspace group. X-axis has two positions: 0 (Low Greenspace) and 1 (High Greenspace). Data points are jittered horizontally within each group. Box plots show the distribution of temperatures in each group. The low-greenspace group is visibly warmer on average.]*

Plot these two groups on the same axes we'd use for any scatter plot. The x-axis has two values — 0 and 1 — and the y-axis shows temperature. It looks different from the continuous scatter in 4.1, but the math is identical.

We write the model exactly as before:

$$Temperature = \beta_0 + \beta_1 \cdot HighGreen + \epsilon$$

The line connects two points — one at $x = 0$ and one at $x = 1$ — instead of running through a continuous cloud. But it's still a line, and we still find it by minimizing MSE.

*[Stage direction: same data as before, but now overlay a red regression line connecting the mean of the low-greenspace group (at $x = 0$) to the mean of the high-greenspace group (at $x = 1$). The line has a downward slope because high-greenspace neighborhoods are cooler.]*

The model only makes predictions at two x-values. When $x = 0$ (low greenspace), the prediction is $\hat{y} = \beta_0$. When $x = 1$ (high greenspace), the prediction is $\hat{y} = \beta_0 + \beta_1$. The line connecting these two predictions is the regression line.

---

### Interpreting $\beta_0$ and $\beta_1$

The interpretation rules are the same as 4.1 — they just look different because $x$ only takes two values.

**The intercept ($\beta_0$)**: the predicted $y$ when $x = 0$. In 4.1, this was the predicted wait time when minutes-after-opening was zero. Here, $x = 0$ corresponds to the low-greenspace group, so $\beta_0$ is the mean temperature of the reference group.

*[Stage direction: same figure with regression line. Label $\beta_0$ at the point where the line meets $x = 0$. Add a horizontal dashed line from the y-axis to the point, and label it with the numerical value (e.g., $\beta_0 = 22.03°C$).]*

**The slope ($\beta_1$)**: the change in $y$ for a one-unit change in $x$. In 4.1, moving one unit on $x$ meant moving along a continuous scale — one more minute, one more unit of log GDP. Here, moving one unit on $x$ means jumping from one group to the other. So $\beta_1$ is the difference between the two group means:

$$\beta_1 = \bar{y}_{high} - \bar{y}_{low}$$

*[Stage direction: same figure. Now label $\beta_1$ as the vertical gap between the two group means. Draw an arrow or bracket showing the distance from $\beta_0$ at $x = 0$ to $\beta_0 + \beta_1$ at $x = 1$. Label it "$\beta_1 = -2.97°C$" (the slope is negative because high-greenspace neighborhoods are cooler).]*

If $\beta_1$ is negative, the high-greenspace group has lower temperatures. If it's positive, the high-greenspace group has higher temperatures. If it's zero, there's no difference between the groups.

Same interpretation rule, just a special case. The model doesn't know whether $x$ is continuous or binary — it just computes the slope.

---

### Sampling Error in the Slope

We observe one sample — 100 neighborhoods — and estimate one slope. But a different sample of 100 neighborhoods would give a different slope. Just as in 4.1, the estimated $\beta_1$ varies from sample to sample.

*[Stage direction: 8-panel grid (2 rows of 4). Each panel shows a different random sample of neighborhoods — two clusters of jittered points at $x = 0$ and $x = 1$, with a red regression line connecting the two group means. The slopes vary across panels: some steeper negative, some shallower, one nearly flat. Each panel title shows the estimated slope (e.g., "Sample 1: $\beta_1$ = −3.41," "Sample 5: $\beta_1$ = −1.92"). The slopes are all in the same neighborhood but noticeably different — this is sampling variability.]*

Each sample gives a slightly different difference between the two group means. Some samples make the groups look more different, some less. This is the same phenomenon we saw in 4.1 with continuous data — the estimated slope is a random variable with its own sampling distribution.

---

### Distribution of $\beta_1$

If we collect slopes from many samples and plot them on a histogram, we get a bell curve — just as we did in 4.1.

*[Stage direction: histogram of slope coefficients ($\beta_1$ = difference between group means) from ~1,000 simulated samples. The histogram is bell-shaped, centered on the true population difference. Overlay a green dashed t-distribution curve. Mark the true difference with a black vertical dashed line. The sampling distribution of $\beta_1$ is approximately t-distributed, centered on the true population difference between groups.]*

The differences follow a t-distribution centered on the true population difference. The CLT applies to the difference between group means just as it applies to a single mean or a continuous slope. This lets us perform a t-test.

---

### Hypothesis Testing — Is $\beta_1 = 0$?

The default null hypothesis is:

$$H_0: \beta_1 = 0$$

"There is no difference between the two groups." If $\beta_1 = 0$, the line is flat — both groups have the same mean, and knowing which group a neighborhood belongs to doesn't help predict its temperature.

The p-value answers: how surprising is our observed slope if the true difference is zero?

*[Stage direction: progression of 3 slides building the hypothesis test:*
1. *First: the sampling distribution centered on the true difference, with a red dashed line at our sample slope. Caption: "We don't know the entire distribution, just our sample slope."*
2. *Second: shift the distribution — center it on zero (the null). Show both the sample slope (red dashed) and the null (black solid). Caption: "Center the distribution on our null."*
3. *Third: same as above, but shade the two tails beyond the sample slope and its mirror image. These blue-shaded regions are the p-value. Caption: "The p-value is the probability of a difference as extreme as ours under the null ($\beta_1 = 0$)."]*

A small p-value is evidence against the null. If the probability of seeing a difference this large by chance (under no real group difference) is tiny, we conclude the groups really do differ.

---

### Null Slopes Visualization

Another way to see this: generate many possible slopes under the null hypothesis ($\beta_1 = 0$) and overlay them on the data.

*[Stage direction: single panel. The two-group data is faded (low opacity). Fifty grey lines are drawn through the data, each with a slope drawn from the null distribution (centered on zero). The lines cluster around horizontal — they're nearly flat because the null says no difference. The observed regression line is drawn in red, clearly steeper than the grey lines. Caption: "Grey lines: possible slopes under the null (no difference). Red line: our observed slope."]*

How likely does it look like our red slope was drawn from the null slopes? If it stands out clearly from the grey lines, the p-value is small. The difference between groups is real.

---

### This Is a Two-Sample T-Test

Everything we just did — estimating the difference, building its sampling distribution, testing whether it's zero — is exactly a two-sample t-test. The math is identical. The same test statistic, the same p-value. We've just expressed it in regression language.

Why bother? Because the regression framework is more general. A two-sample t-test only compares two groups. Regression can handle continuous predictors, multiple groups, and multiple predictors all at once. The two-sample t-test is a special case.

---

### Exercise: Environmental Justice

Do low-income neighborhoods face higher pollution levels? This is an environmental justice question with real policy implications.

*Exercise 4.2: Neighborhood Income and Pollution*

**Step 1: Summarize the data.** Visualize pollution levels by income group.

*[Stage direction: strip/box plot of Air Pollution Index by income group. X-axis: "High Income (0)" and "Low Income (1)." Data points jittered. Low-income group visibly has higher pollution levels and slightly more spread.]*

**Step 2: Build a model.**

$$Pollution = \beta_0 + \beta_1 \cdot LowIncome + \epsilon$$

**Step 3: Estimate the model.** Fit the regression. Report $\beta_0$ (mean pollution in high-income areas), $\beta_1$ (additional pollution in low-income areas), and the p-value.

*[Stage direction: same plot with the regression line overlaid. Label $\beta_0$ at x=0 (e.g., 23.9) and $\beta_0 + \beta_1$ at x=1 (e.g., 39.8). Label the slope $\beta_1 = 15.9$.]*

**Step 4: Check the residuals.** Make a residual plot (residuals vs predicted values). With only two predicted values, the residual plot has two vertical columns. Check that the spread is roughly equal in both groups.

**Step 5: Interpret.** A significant positive $\beta_1$ means low-income neighborhoods face higher pollution — evidence of environmental inequality.

---

### GLM Summary So Far

We've now seen three models in the same framework, building in complexity:

| Model | Equation | What It Tests |
|-------|----------|---------------|
| Intercept-only (3.4) | $y = \beta_0 + \epsilon$ | Is the mean different from zero? (One-sample t-test) |
| Numerical predictor (4.1) | $y = \beta_0 + \beta_1 x + \epsilon$ | Is there a relationship between $x$ and $y$? (Tilted line through continuous scatter) |
| Binary predictor (4.2) | $y = \beta_0 + \beta_1 \cdot Group + \epsilon$ | Is the difference between two groups significant? (Tilted line connecting two group means) |

The model doesn't care what $x$ is — continuous or binary. Same MSE minimization, same t-tests on coefficients, same p-values. The GLM is a unifying framework. 4.1 and 4.2 aren't different methods — they're the same method applied to different types of predictors.

---

### Looking Ahead

We've compared group means using regression. The predictor was 0 and 1, and the line connected two group means. In 4.1 the predictor was continuous — the line ran through a full scatter plot. Now we've seen categorical, numerical, and intercept-only models all within the same GLM framework. Next, in 4.3, we ask: can we trust the numbers our models produce? We check the assumptions behind OLS and learn what to do when they're violated.
