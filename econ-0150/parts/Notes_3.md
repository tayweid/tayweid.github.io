## Part 3 | Univariate GLM

Part 2 ended with a question we couldn't answer. We saw that Bogo 10 customers spend more than Bogo 5 customers on average, but the distributions overlap considerably. Is the difference real, or just noise? To answer that, we need to move from describing data to making claims about things we can't directly observe. That's what Part 3 is about.

The arc is: (3.1) data is a sample from an unknown population — we want to learn about the population, not just the sample; (3.2) the central limit theorem tells us the distribution of the sample mean, even when we know nothing about the population; (3.3) we can use that distribution to quantify how surprised we should be by any hypothesis, leading to confidence intervals and p-values; (3.4) hypothesis testing is the simplest version of a much more powerful framework — the general linear model — which sets up everything in Part 4.

---

### Part 3.1 | Data vs the Population

#### Outline

- We've spent the first part of the semester learning how to understand and visualize data
- But data is just a sample — we usually want to say something about the population
- Introduce the distinction: data question ("which sample sleeps longer?") vs population question ("which county sleeps longer?")
- To make comparisons precise, we need measures of centrality (the mean) and dispersion — build up intuitively from range → mean deviation (fails: sums to zero) → mean absolute deviation (works but mathematically awkward) → variance → standard deviation, each fixing the previous one's problem
- The population is an unobservable random variable; the data is a collection of realizations
- If we knew the population distribution, we could answer anything — but we never do
- This is the fundamental tension that Part 3 resolves

#### Narrative

We've spent the first two parts of this course developing the skillset to understand data. We can summarize it, visualize it, transform it, and describe relationships between variables. But there's a deeper question lurking behind everything we've done.

Consider some data on the sleep patterns of two groups. Which group sleeps longer? We can look at the distributions and see they overlap. We can compare the means: Group A sleeps longer on average. But some people in Group B sleep longer than most people in Group A. Group A also has more variability — the standard deviation is larger.

Why standard deviation? We build up to it by trying simpler alternatives and watching each one fail. The range only uses two points. The mean deviation averages to zero because positive and negative differences cancel. The mean absolute deviation fixes the sign problem but is mathematically awkward. Squaring the deviations (variance) handles signs and is smooth to work with, but the units are squared. Taking the square root gives us the standard deviation — interpretable units, mathematically nice, and a genuine measure of how far observations typically sit from the center.

These are questions about the **data**. We can answer them completely because we see the data in its entirety. But now suppose I tell you that Group A and Group B are 50 people sampled from two different counties. The question changes. Instead of "which sample group sleeps longer?" we're asking "which **county** sleeps longer?" That's a question about the **population**, not the data.

The population is not just everyone currently living in the county. Even if we surveyed every resident today, tomorrow would bring new people. The population is a theoretical concept — an infinite pool of possible observations. It's what we call a **random variable**.

Think of a random variable like a deck of cards. The **probability function** tells us which cards are in the deck. An **observation** is the card you drew. The **sample** is the record of cards you've drawn. Data is a sample drawn from a random variable.

If we knew the random variable — its shape, its parameters — we could answer any question about the population. What proportion of the population sleeps less than 5 hours? What's the probability a randomly drawn person sleeps more than 9 hours? Where does the middle 92% of the population fall? These questions all have exact answers when we know the probability function.

But in practice we never know the probability function. We only see the sample. The sample statistics ($\bar{x}$, $S$) are not the population parameters ($\mu$, $\sigma$). So how do we make claims about the population when all we see is the sample?

---

### Part 3.2 | The Central Limit Theorem

#### Outline

- If we don't know the population distribution, what can we know?
- Classroom simulation: students each draw observations, we plot the distribution of their sample means
- As sample size grows, the distribution of sample means gets tighter and more bell-shaped
- The distribution of sample means approaches a normal distribution centered on the population mean with standard deviation $\sigma / \sqrt{n}$
- This works for nearly any population distribution
- Key properties: centered on $\mu$, gets tighter with larger $n$, shape doesn't depend on the population shape
- The central limit theorem is perhaps the most underappreciated idea in modern science

#### Narrative

We don't know the distribution of the random variable generating our data. But we can still learn about the population. Here's how.

Imagine everyone in the class is going to help me collect data. Each of you rolls a die once and gives me the result. We'll plot the distribution of your results. With a fair die, we'd expect a roughly uniform distribution — each outcome equally likely.

Now roll two dice and calculate the mean. Your means will be different from each other. Why? Because each of you drew a different sample. But something interesting happens when we plot these sample means: they bunch up in the middle. There are many more ways to get a mean of 3.5 than a mean of 1 or 6, just like there are many more ways to roll a 7 with two dice than a 2 or 12.

As we increase the sample size to 5, then 30, the distribution of sample means gets tighter and more bell-shaped. And if I overlay a specific probability function on top — a normal distribution centered on the population mean with a standard deviation of $\sigma / \sqrt{n}$ — it matches the shape of our sample means almost exactly.

$$\bar{x} \sim N\Big(\mu, \frac{\sigma}{\sqrt{n}}\Big)$$

This is the **central limit theorem**. With very few restrictions, the distribution of the sample mean approaches a normal distribution centered on the truth, regardless of the shape of the population. The population could be uniform, skewed, bimodal — it doesn't matter. The sample means will still be approximately normal.

Three properties to notice. First, the distribution is centered on $\mu$, the population mean. Second, it gets tighter as $n$ increases — larger samples produce more precise estimates. Third, the spread is governed by $\sigma / \sqrt{n}$, which we call the **standard error**. The standard error tells us how much sampling variability to expect.

Why does the standard error involve $\sqrt{n}$ and not just $n$? Consider $n$ independent observations, each with variance $\sigma^2$. The sum of $n$ samples has variance $n\sigma^2$. Dividing by $n$ to get the mean gives variance $\sigma^2 / n$. Taking the square root gives the standard error: $\sigma / \sqrt{n}$.

It does not equal a normal exactly — it approaches one. We need the samples to be independent and identically distributed. And if the population is very non-normal, we need a reasonably large sample for the approximation to work. But for most practical purposes, the CLT is remarkably robust.

This is an extraordinary result. We started with an unknown population. We can't see $\mu$. We don't know the shape of the distribution. And yet we know exactly how the sample mean will behave. We know its distribution, its center, and its spread. That knowledge is what lets us make inferences.

---

### Part 3.3 | Confidence and Hypothesis Testing

#### Outline

- With the CLT, we know the sampling distribution of $\bar{x}$ around $\mu$
- With known $\sigma$: we can calculate how likely $\bar{x}$ is to be close to $\mu$ (confidence intervals)
- The centerpoint flip: since the distance between $\bar{x}$ and $\mu$ is symmetric, we can center the distribution on $\bar{x}$ instead of $\mu$ — same math, different reference point
- This is huge: we don't need to know $\mu$ to make probability statements about it
- But we don't know $\sigma$ either — using $S$ in its place introduces extra variability
- The t-distribution accounts for this extra uncertainty (heavier tails, approaches normal as $n$ grows)
- Now we can ask: how surprised should we be if the true mean is some specific value $\mu_0$?
- The p-value is the probability of seeing data this extreme under the null hypothesis
- Common misinterpretation: the p-value is NOT the probability the null is true
- The p-value is the probability of seeing this sample if the null were true

#### Narrative

##### How Close Are $\bar{x}$ and $\mu$?

The central limit theorem tells us the distribution of the sample mean around the population mean. If we knew $\sigma$, we could calculate exact probabilities. What's the probability that $\bar{x}$ falls within one standard error of $\mu$? About 68%. Within two standard errors? About 95%.

We call this range a **confidence interval**. A 95% confidence interval is the range around the center within which the sample mean falls 95% of the time. If we drew many samples, 95% of them would produce sample means inside this interval.

But there's a problem. We don't observe $\mu$. So centering the interval on $\mu$ seems useless — we can't check whether $\bar{x}$ fell inside a range that we can't see.

##### The Centerpoint Flip

Here's the key insight. The central limit theorem tells us about the distance between $\bar{x}$ and $\mu$. That distance is the same whether we measure from $\mu$ to $\bar{x}$ or from $\bar{x}$ to $\mu$. If $\bar{x}$ is within 1.96 standard errors of $\mu$, then $\mu$ is within 1.96 standard errors of $\bar{x}$.

This means we can flip our perspective. Instead of asking "where will $\bar{x}$ fall around the unknown $\mu$?", we ask "where could $\mu$ be around our observed $\bar{x}$?" The distribution has the same shape and spread — we just change the reference point from what we don't know ($\mu$) to what we do know ($\bar{x}$).

We can verify this with a simulation. Draw many samples, construct a 95% confidence interval around $\mu$, and check if $\bar{x}$ is inside. Then construct a 95% confidence interval around $\bar{x}$ and check if $\mu$ is inside. The samples that have $\bar{x}$ inside the interval around $\mu$ are exactly the same samples that have $\mu$ inside the interval around $\bar{x}$.

This is a remarkable result. We can center the confidence interval on $\bar{x}$ instead of $\mu$. We don't need to know the population mean to make probability statements about it.

##### The Problem With $\sigma$

But there's still a problem. We used $\sigma$ — the population standard deviation — to construct the standard error. In practice we don't know $\sigma$ any more than we know $\mu$.

Can we just replace $\sigma$ with $S$, the sample standard deviation? Almost. Just like $\bar{x}$ varies around $\mu$ from sample to sample, $S$ varies around $\sigma$. Each sample gives us a different $S$. This introduces an extra source of variability into our confidence interval.

If we swap in $S$ and pretend the result is still a normal distribution, we'll be **too confident**. We can see this with a simulation: construct 90% confidence intervals using the normal distribution with $S / \sqrt{n}$, and count how often they contain $\mu$. The answer is less than 90% — maybe 87% or 88%. We're claiming 90% confidence but actually delivering less.

The **t-distribution** fixes this. It accounts for the extra uncertainty that comes from estimating $\sigma$ with $S$. The t-distribution looks like a normal distribution but with heavier tails — more probability mass in the extremes. As the sample size grows and $S$ becomes a better estimate of $\sigma$, the t-distribution approaches the normal. With a very large sample, there's almost no difference.

Now we have everything we need. We center the sampling distribution on $\bar{x}$. We use $S / \sqrt{n}$ as our standard error. We use the t-distribution instead of the normal to account for the uncertainty in $S$. And we can make probability statements about where $\mu$ could be, without knowing anything about the population.

##### Quantifying Surprise: p-values

With the sampling distribution in hand, we can test specific claims about the population mean. Suppose someone claims the average wait time is 10 minutes. Our sample gives $\bar{x} = 10.85$. Is that consistent with a true mean of 10, or should we be surprised?

We set up a **null hypothesis**: $H_0: \mu = 10$. Then we ask: if the true mean really were 10, how likely would we be to observe a sample mean as far from 10 as 10.85? We calculate this using the t-distribution centered on $\bar{x}$ (or equivalently, on the null — the math is the same either way). The area in the tails beyond the null value is the **p-value**.

A p-value of 0.07 means: if $\mu$ really is 10, we'd see a sample mean this far or farther from 10 about 7% of the time. That's not very surprising — we wouldn't reject the claim. A p-value of 0.002 would mean it almost never happens by chance — we'd reject the claim.

A common convention is to reject $H_0$ when the p-value is below 0.05. But this threshold is just a convention, not a law of nature. What matters is understanding what the p-value tells us.

And what it tells us is often misunderstood. The p-value is **not** the probability that $H_0$ is true. The truth is fixed — there's no randomness in whether $\mu$ equals 10 or not. The randomness is in the sample. The p-value is the probability of seeing data this extreme **if** the null hypothesis were true.

---

### Part 3.4 | The Simplest Linear Model

#### Outline

- Hypothesis testing is the simplest version of a much more powerful framework: the general linear model (GLM)
- A GLM is basically just drawing a line through data: $y_i = mx_i + b + \epsilon_i$
- The model's prediction for each point is $\hat{y}_i = mx_i + b$; the error is $\epsilon_i = y_i - \hat{y}_i$
- We choose the line that minimizes "wrongness," measured by the mean squared error
- The simplest GLM has no $x$ — just an intercept: $\hat{y}_i = b$ for all $i$
- The value of $b$ that minimizes MSE is the sample mean
- MSE at the minimum is equal to the variance
- Since $b = \bar{x}$, the distribution of $b$ across samples is the familiar normal/t distribution from 3.3
- We can perform hypothesis tests on $b$ — is the intercept different from zero?
- The default null in regression is $\beta_0 = 0$; to test other values, shift the data
- Writing the model as $y \sim 1$ tells software to fit an intercept-only model, where $x = 1$ for all rows
- This is the same one-sample t-test we developed in 3.3, now expressed as a regression

#### Narrative

##### From Hypothesis Testing to Models

So far in Part 3, we've built a framework for making claims about an unknown population mean. We know the sampling distribution approaches a t-distribution. We can quantify our surprise about any null hypothesis using the area in the tails. These are powerful ideas on their own.

But they're also the simplest case of something much more general. What we've been doing — estimating a population mean and testing hypotheses about it — is the foundation of a framework called the **general linear model** (GLM). The GLM is essentially just drawing lines through data.

##### Drawing Lines Through Data

A linear model has the general form:

$$y_i = mx_i + b + \epsilon_i$$

We call $y$ the **outcome variable** — the thing we're trying to explain. We call $x$ the **predictor variable** — the thing we think helps explain it. The parameters $m$ and $b$ define the line. And $\epsilon_i$ is the **error** (or residual) for observation $i$ — the part the model can't explain.

For any choice of $m$ and $b$, the model makes a prediction for each data point:

$$\hat{y}_i = mx_i + b$$

We call $\hat{y}_i$ the **predicted value** (or fitted value). It's the point on the line directly above or below data point $i$. The error is just the gap between what we observe and what the model predicts: $\epsilon_i = y_i - \hat{y}_i$.

How do we choose which line? We minimize how wrong the model is. The measure of wrongness is the **mean squared error** (MSE) — the average squared distance between each data point and the line.

$$MSE = \frac{1}{n} \sum_i (y_i - \hat{y}_i)^2 = \frac{1}{n} \sum_i \epsilon_i^2$$

This should look familiar. It's very similar to variance. In fact, when we minimize MSE with the simplest possible model, the two are identical.

##### The Intercept-Only Model

The simplest GLM has no predictor variable. We can think of it as setting $x_i = 1$ for every observation, so the model reduces to a horizontal line: $\hat{y}_i = b$. The prediction is the same for every data point, and the error for each observation is how far it sits from the line: $\epsilon_i = y_i - b$.

What value of $b$ minimizes the MSE? If you move the line up, points below get farther away. If you move it down, points above get farther away. The value that minimizes total squared distance is the sample mean, $\bar{y}$.

This connects two ideas. First, the sample mean isn't just a summary statistic — it's the optimal parameter of the simplest possible model. Second, the MSE at that optimum is the variance. Variance is the average squared error of the best horizontal line through the data.

We write this model as $y \sim 1$, which tells software: "find the best constant to predict $y$." The $1$ represents the intercept — a column of ones as the predictor. The software returns the sample mean as the fitted coefficient.

##### Sampling Error in Model Parameters

Now imagine we take many different samples and fit the intercept-only model to each one. Each sample has a slightly different mean, so each gives us a slightly different $b$. If we plot all these $b$ values on a histogram, we get a familiar shape: the t-distribution centered on the true population mean.

This shouldn't be surprising. We know $b = \bar{x}$ in this model, and we know from the CLT that $\bar{x}$ follows an approximately normal distribution. So the model parameter $b$ inherits the same sampling distribution. But stating it this way — in terms of model parameters rather than sample means — opens the door to a much more general framework.

##### Testing Model Parameters

Here's where the ideas from 3.3 become powerful. Since $b$ follows a t-distribution, we can perform hypothesis tests on it. The default null hypothesis in regression software is $\beta_0 = 0$: the intercept is zero. If we fit $y \sim 1$, the software returns the sample mean along with a t-statistic and p-value testing whether that mean is different from zero.

The t-statistic is:

$$t = \frac{b - 0}{S / \sqrt{n}} = \frac{\bar{x}}{S / \sqrt{n}}$$

This is the same formula from 3.3, just written in terms of the model parameter $b$ instead of the sample mean $\bar{x}$.

To test a different null — say, $\mu_0 = 2$ — we shift the data by subtracting 2 from every observation and test whether the shifted data has a mean of zero. This is exactly the one-sample t-test from 3.3, expressed in the language of regression.

##### Why This Matters

The big innovation is not the intercept-only model itself — that's just a fancy way of computing a sample mean. The innovation is that we're using the ideas we've developed (CLT, sampling distributions, hypothesis tests) to make claims about **parameters of a statistical model**. Once you can test parameters, you can test anything a linear model can express.

In Part 4, we'll add a real predictor variable. Instead of a horizontal line, we'll fit a line with a slope: $\hat{y}_i = mx_i + b$. The slope coefficient $m$ will have its own sampling distribution, its own standard error, and its own p-value. We'll be able to test whether there's a relationship between two variables — whether the slope is different from zero. The errors $\epsilon_i$ will now measure how far each point is from a tilted line rather than a flat one, and minimizing MSE will give us the line of best fit.

Everything in Part 4 builds directly on what we've done here. The framework is the same. The only thing that changes is the complexity of the model.

---

### Summary

| Part | Core Idea | Key Result |
|------|-----------|------------|
| 3.1 | Data is a sample from an unknown population | We want to learn about the population, but only observe the sample |
| 3.2 | Central limit theorem | $\bar{x} \sim N(\mu, \sigma/\sqrt{n})$ regardless of population shape |
| 3.3 | Confidence and hypothesis testing | Flip the centerpoint to $\bar{x}$; use t-distribution for unknown $\sigma$; p-values quantify surprise |
| 3.4 | The simplest linear model | Mean minimizes MSE; hypothesis testing is the simplest GLM; sets up Part 4 |
