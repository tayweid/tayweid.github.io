## Part 3.4 | The Simplest Linear Model

### Overview

- Hypothesis testing is the simplest case of a much more general framework: the general linear model
- A GLM is just a line through data: $y_i = mx_i + b + \epsilon_i$; we choose the line that minimizes MSE
- The intercept-only model: set $x_i = 1$ for all observations; the best $b$ is the sample mean
- MSE at the optimum equals the variance — connecting two ideas
- The distribution of $b$ across samples is the familiar t-distribution
- We can test hypotheses on $b$ — is the intercept different from zero?
- This is the same one-sample t-test from 3.3, expressed in regression language
- Part 4 preview: add a real predictor, test slopes, build real models

---

### Opening — From Hypothesis Testing to Models

We've built a powerful framework over the last three sessions. In 3.1, we established that data is a sample from an unknown population. In 3.2, the CLT told us the sampling distribution of $\bar{x}$. In 3.3, we used that distribution to build confidence intervals and test hypotheses — all without knowing the population distribution or its parameters.

These ideas are powerful on their own. But they're also the simplest case of something much more general. What we've been doing — estimating a population mean and testing hypotheses about it — is the foundation of a framework called the **general linear model** (GLM). Today we'll see the connection explicitly.

### What Is a GLM?

A general linear model is just a line drawn through data. The general form:

$$y_i = mx_i + b + \epsilon_i$$

Let's define each piece:

- $y_i$ is the **outcome variable** — the thing we're trying to explain. It's the data. In our examples, it's been wait time, or sleep hours.
- $x_i$ is the **predictor variable** — the thing we think helps explain the outcome. It could be numerical (temperature, income) or categorical (morning vs afternoon, County A vs County B).
- $m$ and $b$ are the **parameters** — the slope and intercept that define the line. These are what we're trying to estimate.
- $\epsilon_i$ is the **error** for observation $i$ — the part the model can't explain. It's the gap between what we observe and what the model predicts.

This should look familiar. It's the equation of a line from algebra. The only new ingredient is $\epsilon_i$ — the acknowledgment that the data won't fall perfectly on any line.

### Predicted Values and Errors

For any choice of parameters $m$ and $b$, the model makes a prediction for each data point:

$$\hat{y}_i = mx_i + b$$

We call $\hat{y}_i$ the **predicted value** (or fitted value). It's the point on the line directly above or below observation $i$.

The error is the gap between what we observe and what the model predicts:

$$\epsilon_i = y_i - \hat{y}_i$$

If the prediction is too high, $\epsilon_i$ is negative. If the prediction is too low, $\epsilon_i$ is positive. A perfect model would have $\epsilon_i = 0$ for every observation. In practice, we're just trying to make the errors as small as possible.

*[Stage direction: show a scatter plot with data points and a line. Draw vertical green dashed segments from each data point down (or up) to the line. These are the errors $\epsilon_i$. Label one point's components: the data point $y_i$ at the top, the predicted value $\hat{y}_i$ where the dashed line meets the model line, and the error $\epsilon_i$ as the length of the dashed segment.]*

### Choosing the Line — MSE

We want the line that is least wrong. But how do we measure "wrongness"? We use the **mean squared error**:

$$MSE = \frac{1}{n}\sum_{i=1}^{n} \epsilon_i^2 = \frac{1}{n}\sum_{i=1}^{n}(y_i - \hat{y}_i)^2$$

This is just the average squared distance between each data point and the line. Squaring ensures that points above and below the line both contribute positively (same logic as when we built variance in 3.1). The best line is the one that minimizes this quantity.

This should look familiar. It's very similar to variance.

### The Intercept-Only Model — Visual

The simplest GLM has no real predictor variable. We set $x_i = 1$ for every observation, so the model reduces to:

$$\hat{y}_i = b$$

The prediction is the same for everyone — a horizontal line at height $b$. The error for each observation is just how far it sits from that line: $\epsilon_i = y_i - b$.

Now imagine choosing different values of $b$. Where should the line go?

*[Stage direction: show a 3-panel figure.*
- *Left panel: raw data — blue dots scattered vertically, no line. Title: "Raw Data."*
- *Center panel: the same data with a horizontal red line at $b = 2.5$ (too high). Green dashed segments connect each point to the line. Some segments are short, some are long. Title: "Choosing b = 2.5."*
- *Right panel: the same data with a horizontal red line at $b = 1.5$ (too low). Green dashed segments again. A different pattern of errors. Title: "Choosing b = 1.5."*
- *Question for students: which line produces smaller total squared error?]*

Both lines are wrong, but they're wrong in different ways. When $b = 2.5$, the line is too high for most points — the errors are mostly negative. When $b = 1.5$, it's too low — the errors are mostly positive. Neither minimizes the total squared error. So what does?

### The Mean Minimizes MSE

*[Stage direction: show a 2-panel figure.*
- *Left panel: the data with a horizontal red line at $b = \bar{y}$ (the sample mean). Green dashed segments show the errors. They're roughly balanced — some positive, some negative, and the overall "wrongness" is as small as possible. Title: "Choosing $b = \bar{y}$."*
- *Right panel: a U-shaped curve plotting MSE as a function of $b$. The horizontal axis is the intercept parameter $b$, sweeping from well below to well above the mean. The curve has a clear minimum. A red dot marks the minimum, which occurs at $b = \bar{y}$. A red vertical dashed line drops from the dot to the x-axis. Title: "Mean Squared Error."]*

The value of $b$ that minimizes MSE is the sample mean, $\bar{y}$.

This connects two ideas we've developed separately:

1. The **sample mean** isn't just a summary statistic — it's the optimal parameter of the simplest possible model. When you compute the mean, you're fitting a model. You're finding the single number that is least wrong, on average, as a prediction for every observation.

2. The **MSE at the minimum** equals the variance. When $b = \bar{y}$, the mean squared error is:

$$MSE = \frac{1}{n}\sum(y_i - \bar{y})^2 = Var(y)$$

Variance is the average squared error of the best horizontal line through the data. That's what variance *is* — it measures how wrong the simplest model is.

### Writing the Model

We write this model as $y \sim 1$. The notation tells software: "find the best constant to predict $y$." The $1$ represents the intercept — a column of ones as the predictor variable. When you fit $y \sim 1$, the software returns the sample mean as the estimated coefficient.

Why ones? Because the model is $\hat{y}_i = b \cdot x_i$, and if $x_i = 1$ for every observation, then $\hat{y}_i = b$ — a horizontal line. The "predictor" is just the constant 1, and the "slope" of that predictor is the intercept.

### Sampling Error in $b$

Now let's think about what happens across samples. Take many samples from the same population, fit the intercept-only model to each one, and record the estimated $b$.

*[Stage direction: show an 8-panel grid (2 rows of 4). Each panel shows a different sample — blue dots scattered vertically with a red horizontal line at that sample's mean. Green dashed segments show errors. Each panel has a title like "Sample 1: Mean = 2.04" or "Sample 3: Mean = 1.87." The means vary across panels — some higher, some lower — but they're all in the same ballpark.]*

Each sample has a slightly different $\bar{y}$, so each gives a slightly different $b$. Some are a little higher than the true mean, some a little lower. This is sampling variability — the same phenomenon we explored in 3.2, now expressed in the language of model parameters.

### Distribution of $b$

If we collect all these $b$ values and plot them on a histogram, what do we see?

*[Stage direction: show a histogram of $b$ values from ~1,000 samples. The histogram is bell-shaped, centered on the true population mean. Overlay a green dashed curve — the t-distribution (or normal, nearly identical at this sample size). Mark the true mean with a black vertical line.]*

It's the familiar bell curve. The distribution of $b$ across samples follows a t-distribution centered on the true population mean.

This shouldn't be surprising. We know $b = \bar{y}$ in this model, and we know from 3.2 that $\bar{y}$ follows an approximately normal distribution centered on $\mu$. So the model parameter inherits the sampling distribution of the sample mean. But stating it this way — in terms of model parameters rather than sample means — opens the door to a much more general framework.

### Centering on the Observed $b$

In practice, we only have one sample. We observe one $b$. Just as we did in 3.3, we center the sampling distribution on our observed value.

*[Stage direction: show two layers. The faded background shows the histogram of $b$ values centered on the true mean (from the previous figure, now ghosted at low opacity). In the foreground, a green dashed t-distribution curve is centered on the observed sample mean (e.g., 1.97), with the true mean shown as a faded black line slightly to one side.]*

We can't see the true mean. But we know the shape and spread of the distribution around our observed $b$. That's enough to test hypotheses.

### Testing Model Parameters

Since $b$ follows a t-distribution, we can perform hypothesis tests on it — exactly as we did in 3.3. The default null hypothesis in regression software is:

$$H_0: \beta_0 = 0$$

"The intercept is zero." In the intercept-only model, this means "the population mean is zero."

The t-statistic is:

$$t = \frac{b - 0}{S / \sqrt{n}} = \frac{\bar{x}}{S / \sqrt{n}}$$

This is the same formula from 3.3, just written as $b$ instead of $\bar{x}$. The p-value is the area in the tails of the t-distribution beyond our observed $b$.

*[Stage direction: show a t-distribution centered on the null hypothesis value (zero). Mark the observed $b$ with a red vertical line. Shade the tails beyond $b$ (and its mirror on the other side of zero) in blue to represent the p-value. If the observed mean is, say, 1.97 and the SE is 0.09, the observed value is far from zero and the p-value will be tiny.]*

### Finding p-Values in the Model

The mechanics are identical to 3.3. Center the t-distribution on the null value. Find the area more extreme than our observed statistic. That area is the p-value.

When we fit $y \sim 1$ in software, we get back:
- The estimated coefficient $b = \bar{y}$
- The standard error $S / \sqrt{n}$
- The t-statistic $b / (S / \sqrt{n})$
- The p-value for the test $H_0: \beta_0 = 0$

All in one output. The software is doing exactly what we did by hand in 3.3.

### Testing Other Nulls

The default null is $\beta_0 = 0$, but what if we want to test a different value? Say we want to test $\mu_0 = 2$ — is the population mean different from 2?

The trick: subtract 2 from every observation and test whether the shifted data has a mean of zero.

$$y_i^{shifted} = y_i - 2$$

Now fit $y^{shifted} \sim 1$. The intercept is $\bar{y} - 2$. The test $H_0: \beta_0 = 0$ on the shifted data is equivalent to testing $H_0: \mu = 2$ on the original data.

This is exactly the one-sample t-test from 3.3, expressed in regression language. Same math, different framing.

### Exercise Preview

*Exercise 3.5: Are wait times different in the morning vs afternoon? Students compute the difference in wait times for each observation, then fit the intercept-only model ($y_{diff} \sim 1$) to the differences. The intercept estimates the average difference. Testing $\beta_0 = 0$ asks whether there's a systematic difference between morning and afternoon.*

### Why This Matters

The big innovation here is not the intercept-only model itself — that's just a fancy way of computing a sample mean. The innovation is that we've expressed hypothesis testing in the language of **model parameters**. We're testing whether a parameter of a statistical model is different from zero.

Why does this matter? Because once you can test parameters, you can test anything a linear model can express.

In Part 4, we add a real predictor variable. Instead of $\hat{y}_i = b$ (a horizontal line), we fit:

$$\hat{y}_i = mx_i + b$$

A line with a slope. The slope $m$ gets its own sampling distribution, its own standard error, and its own p-value. We'll be able to test whether there's a **relationship** between two variables — whether $m \neq 0$. If the slope is significantly different from zero, the predictor helps explain the outcome.

The errors $\epsilon_i$ will now measure how far each point is from a *tilted* line rather than a flat one. Minimizing MSE gives the line of best fit. And the MSE will be smaller than the variance — because the tilted line explains some of the variability that the horizontal line couldn't.

Everything in Part 4 builds directly on what we've done here. The framework is the same. The only thing that changes is the complexity of the model.

### Part 4 Preview

Here's what's coming:

- **Part 4.1** — Categorical predictors: comparing group means using dummy variables — the simplest extension from the intercept-only model
- **Part 4.2** — Numerical predictors: fitting a line through a scatter plot, testing whether the slope is zero
- **Part 4.3** — Timeseries: handling data that unfolds over time, where observations depend on their past values
- **Part 4.4** — Model diagnostics: checking whether our model's assumptions hold and what to do when they don't

All built on the same statistical foundation we developed in Part 3: the CLT, the sampling distribution of parameters, and the t-test for model coefficients.
