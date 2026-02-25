## Part 4.1 | Categorical Predictors

### Overview

- The simplest extension from the intercept-only model: instead of one mean, compare two means
- Code the category as a dummy variable (0/1) — now it's a number we can put on the x-axis
- $\beta_0$ = mean of the reference group (where $x = 0$); $\beta_1$ = difference between group means
- The p-value on $\beta_1$ tests whether the difference is significant — this is a two-sample t-test in regression language
- Null slopes visualization shows how extreme our observed difference is compared to chance
- More than two groups: ANOVA as regression with multiple dummy variables
- Reference group coding changes which differences we estimate directly, but the model is equivalent
- GLM summary: one-sample t-test, two-sample t-test, ANOVA — all the same framework

---

### Opening — From One Mean to Two

In 3.4, we built the intercept-only model. We estimated a single mean, tested whether it was zero, and saw that the one-sample t-test is the simplest possible regression. The exercise at the end of 3.4 compared morning and afternoon wait times by computing differences — already a group comparison, just handled indirectly.

Now let's do this directly. Many economic questions involve comparing groups. Do neighborhoods with green space have lower temperatures? Do low-income areas face higher pollution? Do countries with higher GDP have happier citizens? These are all questions about whether two (or more) groups differ on some outcome.

Here's the key insight: if we code the group as a number, we can use the same regression framework from 3.4. The model doesn't care whether $x$ is "minutes after opening" or "1 if high greenspace, 0 if low greenspace." It just needs a number.

---

### Dummy Variables

Let's say we're interested in whether neighborhoods with high green space have lower temperatures. We have data on 100 neighborhoods — 50 with low green space and 50 with high green space.

We create a **dummy variable**: $HighGreen = 1$ if the neighborhood has high green space, $HighGreen = 0$ otherwise. Now each observation has a temperature (the outcome) and a number (0 or 1) as the predictor.

*[Stage direction: show a box/strip plot of temperature by greenspace group. X-axis has two positions: 0 (Low Greenspace) and 1 (High Greenspace). Data points are jittered horizontally within each group. Box plots show the distribution of temperatures in each group. The low-greenspace group is visibly warmer on average.]*

We can plot these two groups on the same axes we'd use for any scatter plot. The x-axis has two values — 0 and 1 — and the y-axis shows temperature. It looks different from a typical scatter plot, but the math is identical.

---

### The Model

We write the model just like any regression:

$$Temperature = \beta_0 + \beta_1 \cdot HighGreen + \epsilon$$

This is the same equation from 3.4, just with a real predictor variable. The line connects two points — one at $x = 0$ and one at $x = 1$.

*[Stage direction: same data as before, but now overlay a red regression line connecting the mean of the low-greenspace group (at $x = 0$) to the mean of the high-greenspace group (at $x = 1$). The line has a downward slope because high-greenspace neighborhoods are cooler.]*

The model only makes predictions at two x-values. When $x = 0$ (low greenspace), the prediction is $\hat{y} = \beta_0$. When $x = 1$ (high greenspace), the prediction is $\hat{y} = \beta_0 + \beta_1$. The line connecting these two predictions is the regression line.

---

### Interpreting $\beta_0$

When $x = 0$, our model predicts $\hat{y} = \beta_0$. Since $x = 0$ corresponds to the low-greenspace group, the intercept is the mean temperature of the reference group.

Ask students: what does $\beta_0$ represent here?

*[Stage direction: same figure with regression line. Label $\beta_0$ at the point where the line meets $x = 0$. Add a horizontal dashed line from the y-axis to the point, and label it with the numerical value (e.g., $\beta_0 = 22.03°C$).]*

This is exactly the same interpretation as the intercept-only model — $\beta_0$ is a group mean. The difference is that now it's the mean of one specific group rather than the mean of all the data.

---

### Interpreting $\beta_1$

When $x = 1$, the model predicts $\hat{y} = \beta_0 + \beta_1$. So $\beta_1$ is the difference between the high-greenspace mean and the low-greenspace mean:

$$\beta_1 = \bar{y}_{high} - \bar{y}_{low}$$

It's the slope of the line from $x = 0$ to $x = 1$. In a standard regression, we'd say "$\beta_1$ is the change in $y$ for a one-unit change in $x$." Here, a one-unit change in $x$ means moving from one group to the other.

*[Stage direction: same figure. Now label $\beta_1$ as the vertical gap between the two group means. Draw an arrow or bracket showing the distance from $\beta_0$ at $x = 0$ to $\beta_0 + \beta_1$ at $x = 1$. Label it "$\beta_1 = -2.97°C$" (the slope is negative because high-greenspace neighborhoods are cooler).]*

If $\beta_1$ is negative, the high-greenspace group has lower temperatures. If it's positive, the high-greenspace group has higher temperatures. If it's zero, there's no difference between the groups.

---

### This Is a Two-Sample T-Test

The p-value on $\beta_1$ tests whether the difference between the two group means is statistically significant. The null hypothesis is $H_0: \beta_1 = 0$ — no difference between the groups.

This is exactly the same as a two-sample t-test. The math is identical. The same test statistic, the same p-value. We've just expressed it in regression language.

Why bother? Because the regression framework is more general. A two-sample t-test only compares two groups. Regression can handle continuous predictors, multiple groups, and multiple predictors all at once. The two-sample t-test is a special case.

*[Stage direction: show the null slopes visualization. Plot the data (two groups) with the observed regression line in red. Overlay 100 grey lines drawn from the null distribution — each one represents a possible slope we might observe by chance if there were no difference between groups. The grey lines cluster around zero slope (horizontal). The observed red line stands out clearly below the grey lines. Add a text note: "Grey lines: possible samples under the null (no difference)."]*

The null slopes visualization makes the logic concrete. If there were no difference between groups, the slopes we'd observe by chance would cluster around zero. Our observed slope is far from zero — it's unlikely to have arisen by chance.

---

### Exercise: Environmental Justice

Do low-income neighborhoods face higher pollution levels? This is an environmental justice question with real policy implications.

*Exercise 4.1: Neighborhood Income and Pollution*

**Step 1: Summarize the data.** Visualize pollution levels by income group.

*[Stage direction: strip/box plot of Air Pollution Index by income group. X-axis: "High Income (0)" and "Low Income (1)." Data points jittered. Low-income group visibly has higher pollution levels and slightly more spread.]*

**Step 2: Build a model.**

$$Pollution = \beta_0 + \beta_1 \cdot LowIncome + \epsilon$$

**Step 3: Estimate the model.** Fit the regression. Report $\beta_0$ (mean pollution in high-income areas), $\beta_1$ (additional pollution in low-income areas), and the p-value.

*[Stage direction: same plot with the regression line overlaid. Label $\beta_0$ at x=0 (e.g., 23.9) and $\beta_0 + \beta_1$ at x=1 (e.g., 39.8). Label the slope $\beta_1 = 15.9$.]*

**Step 4: Check the residuals.** Make a residual plot (residuals vs predicted values). With only two predicted values, the residual plot has two vertical columns. Check that the spread is roughly equal in both groups.

**Step 5: Interpret.** A significant positive $\beta_1$ means low-income neighborhoods face higher pollution — evidence of environmental inequality.

---

### More Than Two Groups — ANOVA

What if the predictor has more than two categories? Suppose we want to compare temperatures across four climate regions: Coastal, Mountain, Desert, and Plains.

We can't code four categories with a single 0/1 variable. Instead, we create a dummy variable for each group except one — the **reference group**. If Coastal is the reference:

$$Temperature = \beta_0 + \beta_1 \cdot Mountain + \beta_2 \cdot Desert + \beta_3 \cdot Plains + \epsilon$$

Each dummy variable equals 1 for observations in that group and 0 otherwise. The interpretation:

- $\beta_0$ = mean temperature in Coastal areas (the reference)
- $\beta_1$ = difference between Mountain and Coastal
- $\beta_2$ = difference between Desert and Coastal
- $\beta_3$ = difference between Plains and Coastal

*[Stage direction: show a multi-group comparison figure. Four groups on the x-axis (Coastal, Mountain, Desert, Plains). Data points jittered within each group. Horizontal lines at each group's mean. The Coastal group is highlighted as the reference. Vertical arrows show the differences $\beta_1$, $\beta_2$, $\beta_3$ from the reference group mean to each other group mean.]*

Each coefficient has its own t-test and p-value. If $\beta_2$ has a small p-value, Desert regions have significantly different temperatures from Coastal regions. This is ANOVA — Analysis of Variance — expressed in regression language.

Why do we leave out one group? Because if you know someone is not Mountain, not Desert, and not Plains, you know they're Coastal. Including all four dummies would be redundant — the model can't estimate them all independently.

---

### Reference Group Coding

The choice of reference group changes which differences the coefficients directly estimate. If we recode so Desert is the reference:

$$Temperature = \beta_0 + \beta_1 \cdot Coastal + \beta_2 \cdot Mountain + \beta_3 \cdot Plains + \epsilon$$

Now $\beta_0$ is the mean temperature in Desert areas, and the other coefficients measure differences from Desert. The model is equivalent — same predictions, same residuals, same MSE — but the coefficients directly answer different comparison questions.

---

### GLM Summary So Far

We've now seen four tests that are all the same framework:

| Test | Model | What It Tests |
|------|-------|---------------|
| One-sample t-test | $y = \beta_0 + \epsilon$ | Is the mean different from zero? |
| Two-sample t-test | $y = \beta_0 + \beta_1 \cdot Group + \epsilon$ | Is the difference between two groups significant? |
| ANOVA | $y = \beta_0 + \beta_1 \cdot G_1 + \beta_2 \cdot G_2 + ... + \epsilon$ | Are there differences across multiple groups? |
| Regression | $y = \beta_0 + \beta_1 \cdot x + \epsilon$ | Is there a relationship? *(next time)* |

All minimize MSE. All test coefficients with t-distributions. All produce p-values with the same interpretation. The GLM is a unifying framework.

---

### Looking Ahead

We've compared group means using regression. The predictor was 0 and 1, and the line connected two group means. But what if the predictor is continuous — not just 0 and 1, but any number? Next time, we fit lines through scatter plots and test whether slopes are zero.
