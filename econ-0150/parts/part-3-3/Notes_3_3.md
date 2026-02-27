## Part 3.3 | Confidence and Hypothesis Testing

### Overview

- **Movement 1**: With a known $\sigma$, we can calculate the probability $\bar{x}$ falls within any distance of $\mu$ — this gives us confidence intervals
- **Movement 2**: The centerpoint flip — since the distance between $\bar{x}$ and $\mu$ is symmetric, we can center the CI on $\bar{x}$ instead of $\mu$
- **Movement 3**: We don't know $\sigma$ either; using $S$ introduces extra variability; the t-distribution accounts for this
- **Movement 4**: We can test specific claims about $\mu$ using p-values; common misinterpretations; statistical vs practical significance

---

### Opening — What the CLT Gives Us

Last time we discovered something remarkable. Even though we don't know the population distribution, we know exactly how the sample mean behaves:

$$
\bar{x} \sim N\Big(\mu, \frac{\sigma}{\sqrt{n}}\Big)
$$
The sample mean follows an approximately normal distribution centered on the true mean with a standard deviation — the standard error — of $\sigma / \sqrt{n}$. This is the central limit theorem.

Now that we have the distribution, let's use it.

---

## Movement 1: Confidence Intervals with Known $\sigma$

### How Close Are $\bar{x}$ and $\mu$?

If we know $\sigma$, we can calculate exact probabilities about the distance between $\bar{x}$ and $\mu$. Let's use the wait time example: $\mu = 12$ minutes, $\sigma = 2.5$, $n = 30$.

The standard error is $SE = 2.5 / \sqrt{30} \approx 0.456$.

What's the probability that a sample mean falls within one standard error of $\mu$?

*[Stage direction: show a normal curve centered at $\mu = 12$ with the region from $\mu - SE$ to $\mu + SE$ (approximately 11.54 to 12.46) shaded in blue. Mark $\mu$ with a green dashed line. The shaded area covers about 68% of the curve.]*

About 68%. If we drew many samples of size 30, roughly 68% of them would produce a sample mean within one standard error of the true mean.

What about within two standard errors? About 95%. Within 1.96 standard errors to be precise? Exactly 95%.

We call this range a **confidence interval**. A 68% confidence interval is $[\mu - SE, \mu + SE]$. A 95% confidence interval is $[\mu - 1.96 \cdot SE, \mu + 1.96 \cdot SE]$. If we drew many samples, 68% (or 95%) of their means would fall inside the respective interval.

*Exercise 3.3: students calculate the probability $\bar{x}$ is within various multiples of SE from $\mu$ using `stats.norm.cdf()`. Then each student draws a sample and checks whether their $\bar{x}$ falls inside the 95% interval.*

### The Problem

But wait. We centered the confidence interval on $\mu$. We said: "95% of sample means fall within 1.96 standard errors of $\mu$." That's true, but it requires knowing $\mu$ — which is exactly what we're trying to learn about. If we knew $\mu$, we wouldn't need statistics. So how is this useful?

---

## Movement 2: The Centerpoint Flip

### The Key Insight

Here's the insight that makes everything work. The CLT tells us about the *distance* between $\bar{x}$ and $\mu$. That distance is the same whether you measure from $\mu$ to $\bar{x}$ or from $\bar{x}$ to $\mu$.

If $\bar{x}$ is within 1.96 standard errors of $\mu$, then $\mu$ is within 1.96 standard errors of $\bar{x}$.

Read that again. It's the same statement, just flipped. Instead of asking "where will $\bar{x}$ land relative to the unknown $\mu$?" — a question we can't answer without knowing $\mu$ — we ask "where could $\mu$ be relative to our observed $\bar{x}$?" That's a question we *can* answer.

*[Stage direction: show two panels stacked vertically.*
- *Top panel: sampling distribution centered on $\mu$ (green dashed line). The 68% CI is shaded. $\bar{x}$ (red dashed line) is marked somewhere inside the shaded region. Title: "Confidence Interval centered on $\mu$."*
- *Bottom panel: the same normal curve, but now centered on $\bar{x}$ (red dashed line). The 68% CI is shaded around $\bar{x}$. $\mu$ (green dashed line) falls inside the shaded region. Title: "Confidence Interval centered on $\bar{x}$."*
- *The point: the two perspectives are mirror images. If $\bar{x}$ is inside the CI around $\mu$, then $\mu$ is inside the CI around $\bar{x}$.]*

### Simulation Verification

We can verify this with a simulation. Draw 20 samples from the same population. For each sample:
1. Construct a 95% CI centered on $\mu$ and check whether $\bar{x}$ is inside.
2. Construct a 95% CI centered on $\bar{x}$ and check whether $\mu$ is inside.

*[Stage direction: show a paired CI figure with 20 rows. Each row has two horizontal intervals — one centered on $\mu$, one centered on $\bar{x}$ — with dots for $\bar{x}$ and $\mu$ respectively. Color-code: green rows where the check passes, red rows where it fails. The key observation is that the SAME rows are green/red in both columns. The samples that have $\bar{x}$ inside the CI around $\mu$ are exactly the samples that have $\mu$ inside the CI around $\bar{x}$.]*

The same samples pass both tests. This isn't a coincidence — it's a mathematical identity. The distance between two points doesn't depend on which one you measure from.

### The Interpretation

So a 95% confidence interval centered on $\bar{x}$ has this meaning: "If we repeated this sampling process many times, 95% of the confidence intervals we construct would contain the true mean $\mu$."

This is *not* the same as saying "there's a 95% probability that $\mu$ is in this particular interval." The truth is fixed — $\mu$ doesn't move. What varies is the interval, because $\bar{x}$ changes with every sample. Some intervals capture $\mu$, some don't. The 95% refers to the long-run success rate of the procedure, not to any single interval.

We often shorthand this as "we're 95% confident the truth is in this interval." That's fine as shorthand, but be careful — the confidence is in the *method*, not in any individual interval.

---

## Movement 3: Unknown $\sigma$ and the t-Distribution

### The Remaining Problem

We've made great progress. We can center the confidence interval on $\bar{x}$ instead of $\mu$. But we built the interval using $\sigma / \sqrt{n}$ as the standard error. And we don't know $\sigma$.

Can we just plug in $S$ — the sample standard deviation — and call it a day? Almost. But there's a catch.

### $S$ Varies Around $\sigma$

Just as $\bar{x}$ varies around $\mu$ from sample to sample, $S$ varies around $\sigma$. Every time we draw a new sample, we get a slightly different $S$.

*[Stage direction: show a histogram of sample standard deviations from 1,000 samples (each of size 30) drawn from a population with $\sigma = 2.5$. The histogram is centered near 2.5 but has substantial spread. Mark the true $\sigma = 2.5$ with a vertical blue dashed line.]*

Some samples happen to have more spread-out observations — their $S$ is larger. Others happen to cluster — their $S$ is smaller. This isn't a problem when we use $\sigma$ because it's a fixed number. But $S$ introduces a new source of randomness.

### Different Samples, Different Spreads

To see why this matters, look at several samples side by side.

*[Stage direction: show 5–7 panels, each containing:*
- *A strip plot of the sample data points*
- *A red horizontal dashed line at $\bar{x}$ for that sample*
- *A green horizontal dashed line at the true $\mu$*
- *A blue sampling distribution curve centered on $\bar{x}$, with width proportional to $S / \sqrt{n}$ for that sample*
- *Title showing $\bar{x}$ and $S$ for that sample*
- *The key observation: both the center (red line) and the width (blue curve) vary across panels.]*

Notice that both $\bar{x}$ and $S$ differ across samples. The sampling distributions these samples imply have different centers *and* different widths. When $S$ happens to be too small, the implied sampling distribution is too narrow — we think we're more precise than we actually are.

### Too Confident with the Normal

What happens if we build 90% confidence intervals using $S / \sqrt{n}$ as the standard error but use the normal distribution (as if we knew $\sigma$)?

*Exercise 3.4: students simulate this. Generate 1,000 samples of size 15. For each, construct a 90% CI using the normal distribution with $S / \sqrt{n}$. Count how many contain $\mu$.*

*[Stage direction: show a bar chart with two bars. Left bar labeled "Normal (too confident)" shows coverage of ~87–88% in red. Right bar labeled "t-distribution (correct)" shows coverage of ~90% in green. A horizontal blue dashed line at 90% marks the target.]*

We're aiming for 90% but only achieving about 87–88%. We're *overconfident*. Our intervals are too narrow because sometimes $S$ underestimates $\sigma$, making the interval too tight, and we don't account for that extra uncertainty.

### The t-Distribution

The **t-distribution** fixes this. It's a probability distribution that looks like a normal but with heavier tails — more probability mass in the extremes. This extra spread accounts for the uncertainty introduced by using $S$ instead of $\sigma$.

*[Stage direction: show three overlaid curves on the same axes:*
- *A blue curve: the standard normal distribution*
- *A red curve: a t-distribution with df = 1 (very heavy tails)*
- *A green curve: a t-distribution with df = 5 (moderate tails)*
- *Label each. The t-distributions are shorter in the middle and fatter in the tails than the normal.]*

The t-distribution has a parameter called **degrees of freedom** (df), which equals $n - 1$. With small samples, the t-distribution has much heavier tails than the normal — reflecting the large uncertainty in $S$. As $n$ grows and $S$ becomes a better estimate of $\sigma$, the t-distribution approaches the normal. With a large sample, the two are nearly identical.

Using the t-distribution instead of the normal widens our confidence intervals just enough to account for the uncertainty in $S$. Now when we simulate, 90% CIs actually contain $\mu$ about 90% of the time.

### Putting It All Together

We now have everything we need to make probability statements about an unknown population mean:

1. **Center** the sampling distribution on our observed $\bar{x}$.
2. **Width** comes from $S / \sqrt{n}$ — the sample standard error.
3. **Shape** is the t-distribution with $n - 1$ degrees of freedom.

We don't need to know $\mu$. We don't need to know $\sigma$. We don't even need to know the shape of the population. The CLT gives us normality; the centerpoint flip lets us use $\bar{x}$; the t-distribution handles unknown $\sigma$.

### Example

Suppose we're studying wait times at a clinic. We have a sample of $n = 30$ patients with $\bar{x} = 11.6$ minutes and $S = 2.5$ minutes.

Standard error: $SE = S / \sqrt{n} = 2.5 / \sqrt{30} \approx 0.456$.

For a 95% CI, we need the t critical value with $df = 29$: $t_{crit} \approx 2.045$.

95% CI: $11.6 \pm 2.045 \times 0.456 = [10.67, 12.53]$.

Interpretation: if we repeated this study many times, 95% of the intervals we construct would contain the true mean wait time.

---

## Movement 4: Hypothesis Testing and p-Values

### Testing Specific Claims

So far we've asked "where could $\mu$ be?" Now let's flip the question. Instead of finding a *range* for $\mu$, we want to test a *specific claim* about $\mu$.

Suppose someone claims the average wait time is 10 minutes. Our sample gives $\bar{x} = 10.85$. That's not 10 — but is it *far enough* from 10 to be surprising? Or could this just be normal sampling variability?

### Null and Alternative Hypotheses

We formalize this by setting up hypotheses:

- **Null hypothesis** ($H_0$): $\mu = 10$. This is the specific claim we're testing. It's what we assume is true until the data convinces us otherwise.
- **Alternative hypothesis** ($H_1$): $\mu \neq 10$. This is what we'd conclude if the data is inconsistent with the null.

The question is: if $H_0$ is true — if the real mean is 10 — how surprising is it that we observed $\bar{x} = 10.85$?

### The t-Statistic

To answer this, we calculate how far our sample mean is from the null value, measured in standard errors:

$$t = \frac{\bar{x} - \mu_0}{S / \sqrt{n}}$$

This is the **t-statistic**. It tells us: "our sample mean is $t$ standard errors away from the null hypothesis."

With $\bar{x} = 10.85$, $\mu_0 = 10$, $S = 2.5$, and $n = 30$:

$$t = \frac{10.85 - 10}{2.5 / \sqrt{30}} = \frac{0.85}{0.456} \approx 1.86$$

Our sample mean is about 1.86 standard errors above the null. Is that a lot?

*[Stage direction: show a t-distribution (df = 29) centered on $\mu_0 = 10$. Mark $\bar{x} = 10.85$ with a green vertical line. The 95% CI around the null is shaded in blue. The observed mean is inside the CI but close to the edge.]*

### The p-Value

The **p-value** answers: "if the null hypothesis were true, what's the probability of observing a sample mean this far or farther from $\mu_0$?"

We look at the tails of the t-distribution — the area beyond our observed $\bar{x}$ in both directions (since a mean equally far *below* 10 would be equally surprising).

*[Stage direction: show the same t-distribution centered on $\mu_0 = 10$. Shade the right tail beyond $\bar{x} = 10.85$ and the left tail below $10 - 0.85 = 9.15$ in red. Label the total shaded area as the p-value. For this example, p ≈ 0.072.]*

The p-value is about 0.072. This means: if the true mean really is 10, we'd see a sample mean this far or farther from 10 about 7.2% of the time.

### The Decision Rule

By convention, we reject $H_0$ if the p-value is less than 0.05. This threshold is called the **significance level**.

In our example, $p = 0.072 > 0.05$. We don't reject the null. Our data is *consistent* with a true mean of 10 — the difference could plausibly be due to sampling variability.

But if we had observed $\bar{x} = 11.5$ instead, the p-value would be much smaller. We'd conclude that seeing a mean that far from 10 is very unlikely under the null, and we'd reject $H_0$.

The 0.05 threshold is just a convention, not a law of nature. There's nothing magical about it. What matters is understanding what the p-value tells you and making a judgment call.

### Common Misinterpretations

This is the part where people get confused. The p-value is frequently misunderstood.

**The p-value is NOT the probability that $H_0$ is true.** A p-value of 0.04 does *not* mean there's a 4% chance the null hypothesis is correct. The truth is fixed — $\mu$ either equals 10 or it doesn't. There's no probability about it. The p-value assumes the null is true and calculates how surprising the data would be.

**The p-value is NOT the probability the result is "due to chance."** All results reflect some combination of signal and noise. The p-value doesn't separate these. A p-value of 0.04 doesn't mean "4% chance it's noise and 96% chance it's real."

**The p-value IS the probability of seeing data this extreme if $H_0$ were true.** Think of it as a compatibility check. A small p-value says: "if the null were true, this data would be very unusual." A large p-value says: "this data is perfectly compatible with the null."

The truth is fixed. The sample is what's random. The p-value measures how surprising the sample is under a specific assumption about the truth.

### Statistical vs Practical Significance

One more caution. With large enough samples, even tiny differences become statistically significant. If you survey 10,000 people, a difference of 0.01 minutes in average wait time might produce a p-value below 0.05. The test says the difference is "statistically significant" — meaning it's unlikely to be zero. But does anyone care about a hundredth of a minute?

**Statistical significance** tells you the effect probably isn't zero. **Practical significance** tells you whether the effect matters. Always consider the *size* of the effect, not just whether it's statistically significant.

### Looking Ahead

We've now built a complete framework for making claims about an unknown population mean. The CLT gives us the sampling distribution. The t-distribution handles unknown $\sigma$. Confidence intervals tell us where $\mu$ could be. Hypothesis tests tell us whether the data is consistent with a specific claim.

But these tools are also the simplest case of something much more powerful. What we've been calling "testing a population mean" is really just fitting a statistical model with one parameter and asking whether that parameter could be zero. Next time, we'll see this explicitly — we'll write our hypothesis test as a regression model and discover that the framework generalizes to test *any* relationship between variables.
