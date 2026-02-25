## Part 4.3 | Timeseries

### Overview

- Many economic questions involve data that unfolds over time
- Time series have a special property: autocorrelation — today's value depends on yesterday's
- This violates the independence assumption, making standard errors and p-values unreliable
- Model 1 (Levels): fit a line through a time series — residuals show runs of positive and negative errors
- Model 2 (First Differences): model changes instead of levels — removes much of the autocorrelation
- Model 3 (Double First Differences): relate changes in $X$ to changes in $Y$
- Model 4 (Growth Rates): for exponentially growing variables, normalize by dividing by the previous value
- Each specification changes the interpretation of $\beta_0$ and $\beta_1$
- Exercise: GDP and unemployment across model specifications

---

### Opening — Data Over Time

So far our models have used cross-sectional data — different cities at one point in time, different neighborhoods, different countries. We compared green space and temperature, income and pollution, happiness and GDP. In each case, the observations were independent: one city's temperature tells us nothing about another city's temperature.

But many of the most important questions in economics involve data that unfolds over time. How has GDP changed over the last 50 years? Is unemployment rising or falling? Do changes in one variable predict changes in another? When we put time on the x-axis, something fundamental changes.

*[Stage direction: show a time series plot — GDP (or a simulated autocorrelated series) plotted as connected dots over ~100 time periods. The series trends upward with visible momentum: when it's going up, it tends to keep going up; when it dips, it stays low for a while. The visual impression is smooth persistence, not random scatter.]*

Notice how different this looks from a scatter plot. The points aren't randomly scattered — they're connected, and they have momentum. If the value is high today, it'll probably be high tomorrow. If it dipped last period, it's likely still low this period. This persistence has a name.

---

### Autocorrelation

**Autocorrelation** means observations are correlated with their own past values. If it's hot today, it'll probably be hot tomorrow. If GDP grew last quarter, it'll probably grow this quarter. Each observation "remembers" what came before.

We can visualize autocorrelation directly with a **lag plot**: plot today's value ($Y_t$) against yesterday's value ($Y_{t-1}$).

*[Stage direction: lag plot — scatter of $Y_t$ (y-axis) against $Y_{t-1}$ (x-axis) for the time series from the previous figure. The points form a tight positive relationship along the diagonal (identity line drawn in grey dashed). A text box shows "Correlation: 0.89" or similar. The positive relationship is visually striking — high past values predict high current values.]*

The strong positive relationship tells us today's value is tightly linked to yesterday's. This is the essence of autocorrelation.

---

### Why This Matters

Our regression framework assumes errors are independent. The standard error formula, the t-distribution, the p-values — all rely on the assumption that one observation's error is unrelated to the next.

When errors are autocorrelated, the standard errors are wrong. Specifically, they're too small. We think we're more precise than we actually are. Confidence intervals are too narrow. P-values are too small. We "find" significant relationships that aren't really there.

This isn't a minor technicality. Autocorrelation can make a completely random time series look like it has a significant trend. It's one of the most common ways statistical analysis goes wrong in practice.

---

### Model 1 — Levels

The naive approach: take the raw time series and fit a regression line.

$$Y = \beta_0 + \beta_1 \cdot t + \epsilon$$

*[Stage direction: time series plot with a red regression line through it. Green dashed segments show the errors from each data point to the line. The key visual feature: the errors show "runs." For a stretch of time, the series is above the line (positive errors), then for a stretch it's below (negative errors), then above again. The errors are not random — they cluster.]*

Look at the errors. They're not randomly scattered around zero. When the model over-predicts, it over-predicts for several consecutive periods. When it under-predicts, it under-predicts for several consecutive periods. This is the signature of autocorrelation in the residuals.

---

### Diagnosing Autocorrelation

We can see autocorrelation in two diagnostic plots:

*[Stage direction: 2-panel figure.*
- *Left panel: "Residual Plot" — residuals (y-axis) plotted against time (x-axis). The residuals show clear runs: positive for a stretch, then negative, then positive again. A horizontal dashed line at zero. The pattern is visually obvious — this is not random noise.*
- *Right panel: "Residual Lag Plot" — current residual $\epsilon_t$ (y-axis) against lagged residual $\epsilon_{t-1}$ (x-axis). A strong positive relationship is visible. A red regression line through the points slopes upward. Text: "Autocorrelation = 0.65" (or similar). Dashed reference lines at zero on both axes.]*

The left panel shows the runs in the residuals over time. The right panel shows the autocorrelation directly: if the residual was positive last period, it tends to be positive this period too. This is the smoking gun — our independence assumption is violated.

---

### Model 2 — First Differences

Instead of modeling the level of $Y$, model the *change* in $Y$:

$$\Delta Y_t = Y_t - Y_{t-1}$$

First differences ask: how much did $Y$ change from one period to the next?

*[Stage direction: 2-panel figure stacked vertically.*
- *Top panel: the original time series — trending upward, autocorrelated, persistent. Title: "Original (Levels)."*
- *Bottom panel: the first differences of the same series — fluctuating around a constant with no visible trend or persistence. Much more random-looking. A red horizontal line at the mean of the differences (slightly positive if the original series was trending up, at zero if not). Title: "First Differences."]*

The transformation is dramatic. The original series trends upward with persistent momentum. The first differences fluctuate around a constant — they look much more like random noise. Most of the autocorrelation has been removed.

---

### Interpreting First Differences

What do first differences tell us?

If the original series has no trend, the first differences fluctuate around zero — sometimes positive (went up), sometimes negative (went down), averaging to nothing.

If the original series has a positive trend, the first differences are mostly positive — the series keeps going up. The intercept $\beta_0$ of a regression on the first differences captures this average rate of change. A positive $\beta_0$ means $Y$ is trending upward.

*[Stage direction: first differences plotted over time with a red horizontal regression line at the positive intercept. The differences scatter around this line. The slope of the regression ($\beta_1$ on time) is essentially zero — the rate of change isn't changing. Title: "First Differences: $\beta_0 > 0$ (positive trend), $\beta_1 \approx 0$ (constant rate)."]*

---

### Model 3 — Double First Differences

When we have two time series and want to know whether they're related, we difference both:

$$\Delta Y_t = \beta_0 + \beta_1 \cdot \Delta X_t + \epsilon_t$$

Now we're asking: do changes in $X$ relate to changes in $Y$? When $X$ increases, does $Y$ tend to increase too?

*[Stage direction: scatter plot of $\Delta X$ (x-axis) vs $\Delta Y$ (y-axis). Each point represents one time period's changes. A red regression line through the scatter. Dashed reference lines at zero on both axes. The relationship should be visible but noisy. Title: "$\Delta Y$ vs $\Delta X$."]*

This specification has several advantages:
- It further reduces autocorrelation in the error terms
- $\beta_0$ captures $Y$'s time trend (how $Y$ changes even when $X$ doesn't)
- $\beta_1$ captures the short-term relationship between changes in $X$ and changes in $Y$
- The interpretation is clean: "a one-unit increase in $\Delta X$ is associated with a $\beta_1$-unit increase in $\Delta Y$"

---

### Checking the Fix

Do first differences actually solve the autocorrelation problem? We can check with the same diagnostic plots:

*[Stage direction: 2-panel figure (same layout as the levels diagnostic).*
- *Left panel: "Residual Plot" — residuals from the differenced regression plotted against time. The pattern is much more random now — no visible runs. Close to random scatter around zero.*
- *Right panel: "Residual Lag Plot" — current residual vs lagged residual. The relationship is much weaker. Text: "Autocorrelation = 0.15" (much smaller than before). The points form a cloud with little structure.]*

The autocorrelation is much reduced. The residuals look more like random noise. Our standard errors and p-values are more trustworthy.

---

### Model 4 — Growth Rates

For variables with exponential growth — GDP, prices, population — first differences have a problem: the absolute changes grow over time. GDP might grow by $100 billion in 1960 and by $500 billion in 2020, even if the growth rate is the same.

Growth rates normalize by dividing the change by the previous level:

$$g_Y = \frac{Y_t - Y_{t-1}}{Y_{t-1}} = \frac{\Delta Y_t}{Y_{t-1}}$$

*[Stage direction: 3-panel figure stacked vertically.*
- *Top panel: an exponential time series (GDP-like). Title: "Original Series (Exponential Growth)."*
- *Middle panel: first differences of the same series — the changes themselves grow over time, creating a fan shape. Title: "First Differences (Growing Over Time)."*
- *Bottom panel: growth rates (percentage changes) — stationary, fluctuating around a constant growth rate. A black dashed horizontal line at the true growth rate (e.g., 5%). Title: "Growth Rates (Stationary Around Growth Rate)."]*

The growth rate model:

$$g_Y = \beta_0 + \beta_1 \cdot g_X + \epsilon$$

Now $\beta_0$ is $Y$'s baseline growth rate, and $\beta_1$ is how $Y$'s growth responds to a one-percentage-point increase in $X$'s growth. This is the standard specification for macroeconomic analysis.

*[Stage direction: scatter plot of $X$ growth rate (x-axis) vs $Y$ growth rate (y-axis). Red regression line. Dashed reference lines at zero on both axes. Title: "Growth Rate Model: $g_Y$ vs $g_X$."]*

---

### Choosing Between Specifications

| Model | Equation | $\beta_1$ Interpretation | Best For |
|-------|----------|--------------------------|----------|
| Levels | $Y = \beta_0 + \beta_1 X + \epsilon$ | Relationship between levels | Cross-sectional data |
| First Diff | $\Delta Y = \beta_0 + \beta_1 \Delta X + \epsilon$ | Short-term relationship between changes | Trending time series |
| Growth Rates | $g_Y = \beta_0 + \beta_1 g_X + \epsilon$ | Response of $Y$'s growth to $X$'s growth | Exponentially growing series |

The right choice depends on the data. For cross-sectional data (cities, countries), levels are fine. For trending time series, use first differences. For exponentially growing series, use growth rates. Always check the residuals.

---

### Exercise Preview

*Exercise 4.3: GDP and Unemployment.* Students work with quarterly macroeconomic data. They fit the levels model ($GDP \sim Unemployment$), the first differences model ($\Delta GDP \sim \Delta Unemployment$), and the growth rate model ($g_{GDP} \sim g_{Unemployment}$). For each specification, they check the residual lag plot for autocorrelation and compare the coefficients and p-values. The levels model will show significant autocorrelation in the residuals; the differenced and growth rate models will be much cleaner.

---

### Looking Ahead

We've now built models with categorical predictors (4.1), numerical predictors (4.2), and time-based predictors (4.3). Each model gave us coefficients, standard errors, and p-values. But how do we know if we should trust those results? In 4.4, we learn the full theory of model diagnostics — the four assumptions behind OLS, how to check each one, and what to do when they fail. Students have been doing "Step 4: Check the residuals" in every exercise. Now they'll understand the full framework behind it.
