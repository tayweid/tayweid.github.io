## Part 4.1 | Numerical Predictors

### Overview

- Natural extension from the intercept-only model: the horizontal line gets a slope
- The bivariate model: $y_i = \beta_0 + \beta_1 x_i + \epsilon_i$ — predictions now vary with $x$
- Errors are vertical distances from a tilted line, not a flat one
- MSE minimization with two parameters: compare candidate lines (too steep, too flat, just right)
- MSE as a function of $\beta_1$ — another U-shaped curve with a clear minimum
- Sampling error in the slope: many samples give many different $\beta_1$ values
- Distribution of $\beta_1$: histogram of slopes follows a t-distribution centered on the true slope
- Hypothesis testing: $H_0: \beta_1 = 0$ — is there a relationship?
- Null slopes visualization: many grey lines from the null overlaid on data, observed slope in red
- Predictions: plug in $x$ to get $\hat{y}$; moving one unit right changes $\hat{y}$ by $\beta_1$
- Interpretation: $\beta_1$ is the change in $y$ for a one-unit change in $x$; $\beta_0$ is the predicted $y$ when $x = 0$
- GLM summary: intercept-only model → bivariate regression — same framework, same MSE, same t-tests

---

### Opening — From a Horizontal Line to a Tilted One

In 3.4, we built the intercept-only model. We drew a horizontal line through data, chose the height that minimized MSE, and discovered that the optimal parameter was the sample mean. We could test whether the intercept was zero — a one-sample t-test in regression language.

But in general we don't ask many questions about vertical intercepts. More interesting questions involve relationships between variables. Do people wait longer later in the day? Are wealthier countries happier? Does education predict wages? These are all questions about whether one variable moves with another.

To answer them, we tilt the line. Instead of $\hat{y}_i = \beta_0$ (a flat line), we fit $\hat{y}_i = \beta_0 + \beta_1 x_i$ (a line with a slope). The slope $\beta_1$ captures the relationship between $x$ and $y$.

*[Stage direction: show a 3-panel figure. Left panel: raw scatter plot of wait time vs minutes after opening — blue dots showing a cloud that drifts upward. Center panel: same data with a horizontal red line at the mean (the intercept-only model from 3.4), green dashed error segments from each point to the line. Right panel: empty — we haven't fit the tilted model yet.]*

---

### The Bivariate Model

We write the model as:

$$y_i = \beta_0 + \beta_1 x_i + \epsilon_i$$

This is the same equation as the intercept-only model, but now the prediction depends on $x$:

$$\hat{y}_i = \beta_0 + \beta_1 x_i$$

Each observation gets its own prediction based on its $x$-value. The error is still the vertical distance between the data point and the line:

$$\epsilon_i = y_i - \hat{y}_i$$

But now the line is tilted, so the errors are distances from a slanted line rather than a flat one.

*[Stage direction: same 3-panel figure, now complete. Left: raw data. Center: intercept-only model with horizontal line and error segments. Right: regression line (tilted, red) with error segments. The errors in the right panel are visibly smaller — the tilted line fits better. Titles: "Raw Data," "Model 1: $y = \beta_0 + \epsilon$," "Model 2: $y = \beta_0 + \beta_1 x + \epsilon$."]*

Compare the two models. Model 1 ignores $x$ entirely — same prediction for everyone. Model 2 uses $x$ to make better predictions. When there's a real relationship, the tilted line produces smaller errors. Two things to notice: (1) a slope improves model fit when there's a relationship, and (2) the intercept is no longer the mean — it's the predicted value when $x = 0$.

---

### Choosing the Slope — MSE

How do we find the best slope? Same logic as 3.4: minimize MSE. But now we're choosing two parameters — both $\beta_0$ and $\beta_1$.

Consider three candidate lines through the wait-time scatter plot:

*[Stage direction: 3-panel figure. Each panel shows the same scatter data with a different red line. Left panel: line too steep ($\beta_1 = 0.020$) — errors large at both ends. Center panel: line too shallow ($\beta_1 = 0.004$) — errors large in the middle and at the extremes. Right panel: optimal line ($\beta_1 \approx 0.011$) — errors balanced and minimal. Each panel shows MSE in the title. The optimal model has the lowest MSE.]*

Model A is too steep — it overshoots at the right and undershoots at the left. Model B is too shallow — it barely tilts, leaving large errors everywhere. Model C gets the slope right, and its MSE is the smallest. MSE minimization picks the line that balances all the errors as well as possible.

---

### MSE as a Function of $\beta_1$

Just as in 3.4 we plotted MSE against different values of $\beta_0$ and found a U-shaped curve, we can plot MSE against different values of $\beta_1$.

*[Stage direction: 2-panel figure. Left: the optimal regression line through the scatter data, with error segments. Right: a U-shaped curve showing MSE on the y-axis and $\beta_1$ on the x-axis. The curve has a clear minimum. A red dot marks the minimum, and a dashed vertical line drops to the x-axis at the optimal $\beta_1$. The curve tells us: slopes too large or too small both increase MSE. There's one slope that minimizes it.]*

The optimal slope gives the best guess of the relationship between $x$ and $y$. But could this slope just be sampling error? What if the true slope is zero — no relationship at all — and we happened to draw a sample that looks like there's one?

---

### Sampling Error in the Slope

Just as the sample mean varies from sample to sample, so does the estimated slope. Take many samples from the same population, fit a line to each one, and record the slope.

*[Stage direction: 8-panel grid (2 rows of 4). Each panel shows a different random sample — blue dots with a red regression line. The slopes vary across panels: some steeper, some shallower, one nearly flat. Each panel title shows the estimated slope (e.g., "Sample 1: Slope = 0.0094," "Sample 3: Slope = 0.0142"). The slopes are all in the same neighborhood but noticeably different — this is sampling variability.]*

Each sample gives a slightly different slope. Some are steeper, some shallower. This is exactly the same phenomenon we saw with the sample mean in 3.2 and with the intercept in 3.4. The estimated slope is a random variable with its own sampling distribution.

---

### Distribution of $\beta_1$

If we collect slopes from many samples and plot them on a histogram, we get a bell curve.

*[Stage direction: histogram of slope coefficients from ~1,000 simulated samples. The histogram is bell-shaped, centered on the true population slope. Overlay a green dashed t-distribution curve. Mark the true slope with a black vertical dashed line. The sampling distribution of $\beta_1$ is approximately normal (or t-distributed) centered on the true population slope.]*

The slopes follow a normal distribution centered on the true population slope. The CLT applies to slope coefficients just as it applies to means. This lets us perform a t-test on the slope.

---

### Hypothesis Testing — Is $\beta_1 = 0$?

The default null hypothesis is:

$$H_0: \beta_1 = 0$$

"There is no relationship between $x$ and $y$." If $\beta_1 = 0$, the line is flat — $x$ doesn't help predict $y$ at all. We're back to the intercept-only model.

The p-value answers: how surprising is our observed slope if the true slope is zero?

*[Stage direction: progression of 3 slides building the hypothesis test:*
1. *First: the sampling distribution centered on the true slope, with a red dashed line at our sample slope. Caption: "We don't know the entire distribution, just our sample slope."*
2. *Second: shift the distribution — center it on zero (the null). Show both the sample slope (red dashed) and the null (black solid). Caption: "Center the distribution on our null."*
3. *Third: same as above, but shade the two tails beyond the sample slope and its mirror image. These blue-shaded regions are the p-value. Caption: "The p-value is the probability of a slope as extreme as ours under the null ($\beta_1 = 0$)."]*

A small p-value is evidence against the null. If the probability of seeing our slope by chance (under no relationship) is tiny, we conclude the relationship is real.

---

### Null Slopes Visualization

Another way to see this: generate many possible slopes under the null hypothesis ($\beta_1 = 0$) and overlay them on the data.

*[Stage direction: single panel. The scatter data is faded (low opacity). Fifty grey lines are drawn through the data, each with a slope drawn from the null distribution (centered on zero). The lines cluster around horizontal — they're nearly flat because the null says no relationship. The observed regression line is drawn in red, clearly steeper than the grey lines. Caption: "Grey lines: possible slopes under the null (no relationship). Red line: our observed slope."]*

How likely does it look like our red slope was drawn from the null slopes? If it stands out clearly from the grey lines, the p-value is small. The relationship is real.

---

### Exercise 4.1 — Happiness and Per Capita GDP

Are wealthier countries happier? The World Happiness Report data includes life evaluation scores (0–10 scale) and GDP per capita for countries around the world.

*Exercise 4.1: Happiness and Log GDP Per Capita*

**Step 1: Explore the data.** Load the data. Create a scatter plot of life evaluation vs log GDP per capita. Describe the pattern — is there a visible relationship?

**Step 2: Fit the model.** Fit the regression: $LifeEvaluation = \beta_0 + \beta_1 \cdot logGDP + \epsilon$. Report the estimated slope and its p-value.

**Step 3: Make predictions.** Use the estimated equation to predict life evaluation at specific values of log GDP per capita.

**Step 4: Interpret.** What does a one-unit increase in log GDP per capita mean for life evaluation? What does $\beta_0$ represent — and is it meaningful in this context?

---

### Predictions

Once we have the estimated equation, predictions are arithmetic. Plug in any $x$-value and compute $\hat{y}$:

$$\hat{y} = \beta_0 + \beta_1 \cdot x$$

*[Stage direction: progression showing predictions. First panel: scatter data with regression line, all points visible. Second panel: highlight points near $x = 100$, fade the rest, draw a green vertical line at $x = 100$, mark where it hits the regression line. Third panel: add a horizontal green line from the y-axis to the prediction point, label the prediction value. Caption: "Plug $x = 100$ into the equation."]*

What if we want the prediction at $x = 200$? Same process — plug it in. The predicted value is $\beta_1 \times 100$ units higher than the prediction at $x = 100$, because $\beta_1$ is the change in $\hat{y}$ per unit change in $x$.

---

### Interpretation

**The slope ($\beta_1$)**: the change in $y$ for a one-unit change in $x$, holding everything else constant. In the wait-time example: "For every additional minute after opening, expected wait time increases by $\beta_1$ minutes." In the happiness example: "For every one-unit increase in log GDP per capita, life evaluation increases by $\beta_1$ points."

*[Stage direction: single panel showing the regression line with two predictions highlighted. At $x_1 = 200$ and $x_2 = 300$, green dots on the line. Purple arrows show $\Delta x = 100$ (horizontal) and $\Delta y$ (vertical). The slope is the ratio $\Delta y / \Delta x = \beta_1$. Caption: "$\beta_1$ tells us how much $y$ increases for every 1-unit increase in $x$."]*

**The intercept ($\beta_0$)**: the predicted $y$ when $x = 0$. Sometimes this is meaningful (wait time at the moment the shop opens). Sometimes it's not (a country with zero GDP doesn't exist). In either case, $\beta_0$ anchors the line — you need it to make predictions, even if interpreting it directly doesn't make sense.

---

### GLM Summary

We've now seen two models in the same framework:

| Model | Equation | What It Tests |
|-------|----------|---------------|
| Intercept-only (3.4) | $y = \beta_0 + \epsilon$ | Is the mean different from zero? (One-sample t-test) |
| Numerical predictor (4.1) | $y = \beta_0 + \beta_1 x + \epsilon$ | Is there a relationship between $x$ and $y$? ($\beta_1 = 0$?) |

Both minimize MSE. Both produce coefficients with t-distributions. Both yield p-values with the same interpretation: the probability of seeing results this extreme if the null is true.

The only difference is the complexity of the model. In 3.4, the model was a flat line and the coefficient was a mean. Here, the model is a tilted line and the new coefficient is a slope. Same framework, more interesting questions.

---

### Looking Ahead

What if the predictor isn't continuous but binary — 0 or 1? In Part 4.2, we use categorical predictors. The line connects two group means, the slope is the difference between them, and the t-test on the slope is exactly the two-sample t-test. Same framework, new type of predictor.
