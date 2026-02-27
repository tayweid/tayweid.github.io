## Part 3.3 | Confidence and Hypothesis Testing

### Overview

- Returning to the Card and Krueger minimum wage study from Part 0
- The CLT gives us the sampling distribution; now we use it
- Movement 1: with known σ, we can calculate the probability x̄ falls within any distance of μ — this gives us confidence intervals
- Movement 2: the centerpoint flip — since distance is symmetric, we can center the CI on x̄ instead of μ
- Movement 3: we don't know σ either; using S introduces extra variability; the t-distribution accounts for this
- Movement 4: hypothesis testing — is the NJ employment change significantly different from zero?

---

### Opening — Back to New Jersey

In Part 0 we met David Card and Alan Krueger. In 1992, New Jersey raised its minimum wage from \$4.25 to \$5.05 an hour while neighboring Pennsylvania kept theirs unchanged. Card and Krueger designed a telephone survey of fast food restaurants in both states — Burger King, KFC, Wendy's, and Roy Rogers — interviewing managers before and after the increase. They built a sample of 410 restaurants: 331 in New Jersey and 79 in Pennsylvania.

Although there are many models of the minimum wage, the simplest economic theory one often sees in early classes makes a clear prediction here. A higher minimum wage raises the cost of labor. Firms respond by hiring fewer workers. Employment should fall.

Card and Krueger's data told a different story. At the 331 New Jersey restaurants, the average change in full-time-equivalent employment was +0.59 workers per store. Employment went *up*, not down.

But here's the tension. That +0.59 is a sample mean. It comes from 331 restaurants that Card and Krueger happened to survey. If they had called a different 331 restaurants, they would have gotten a different number. Maybe +1.2. Maybe −0.3. The sample mean varies from sample to sample.

So is +0.59 meaningfully different from zero? Or could it just be noise — a number that happens to look positive but is really consistent with no employment effect at all?

This is exactly the kind of question the CLT was built to answer.

### Where We Left Off

The central limit theorem tells us how the sample mean behaves:

$$
\bar{x} \sim N\Big(\mu, \frac{\sigma}{\sqrt{n}}\Big)
$$

The sample mean follows an approximately normal distribution centered on the true population mean $\mu$, with standard error $\sigma / \sqrt{n}$. We don't know what $\mu$ is — that's the whole point. But we know the *shape* of the sampling distribution, and that shape is enough to build everything that follows.

---

## Movement 1: Confidence Intervals with Known $\sigma$

### How Close Is $\bar{x}$ to $\mu$?

Let's start with a thought experiment. Suppose we somehow knew the population standard deviation of employment changes across all fast food restaurants in New Jersey. Suppose $\sigma = 9.8$ FTE workers.

With $n = 331$ restaurants, the standard error is:

$$
SE = \frac{\sigma}{\sqrt{n}} = \frac{9.8}{\sqrt{331}} \approx 0.54
$$

This tells us that across many hypothetical surveys, the sample mean would typically land within about 0.54 FTE workers of the true population mean.

What's the probability that a sample mean falls within one standard error of $\mu$?

*[Stage direction: show a normal curve centered at $\mu$ (marked with a green dashed line). The region from $\mu - SE$ to $\mu + SE$ is shaded in blue. The shaded area covers about 68% of the curve.]*

About 68%. If Card and Krueger ran their survey many times — each time sampling 331 different NJ restaurants — roughly 68% of those sample means would land within 0.54 FTE of the truth.

What about within two standard errors? About 95%. Within 1.96 standard errors to be precise? Exactly 95%.

$$
95\% \text{ CI}: \quad [\mu - 1.96 \cdot SE, \quad \mu + 1.96 \cdot SE]
$$

We call this a **confidence interval**. If we drew many samples, 95% of their means would fall inside this interval.

*Exercise 3.3: students calculate the probability $\bar{x}$ falls within various multiples of SE from $\mu$ using `stats.norm.cdf()`. Then each student draws a sample and checks whether their $\bar{x}$ falls inside the 95% interval.*

### The Problem

But wait. We centered this confidence interval on $\mu$. We said: "95% of sample means fall within 1.96 standard errors of $\mu$." That's true, but it requires *knowing* $\mu$ — which is exactly what we're trying to learn about. If we already knew the true effect of the minimum wage on employment, we wouldn't need to run the study. So how is this useful?

---

## Movement 2: The Centerpoint Flip

### The Key Insight

Here's the insight that makes everything work. The CLT tells us about the *distance* between $\bar{x}$ and $\mu$. That distance is the same whether you measure it from $\mu$ to $\bar{x}$ or from $\bar{x}$ to $\mu$.

If $\bar{x}$ is within 1.96 standard errors of $\mu$, then $\mu$ is within 1.96 standard errors of $\bar{x}$.

Read that again. It's the same statement, just flipped. Instead of asking "where will $\bar{x}$ land relative to the unknown $\mu$?" — a question we can't answer without knowing $\mu$ — we ask "where could $\mu$ be relative to our observed $\bar{x}$?" That's a question we *can* answer.

*[Stage direction: show two panels stacked vertically.*
- *Top panel: sampling distribution centered on $\mu$ (green dashed line). The 95% CI is shaded. $\bar{x} = 0.59$ (red dashed line) is marked inside the shaded region. Title: "Confidence Interval centered on $\mu$."*
- *Bottom panel: the same normal curve, now centered on $\bar{x} = 0.59$ (red dashed line). The 95% CI is shaded around $\bar{x}$. $\mu$ (green dashed line) falls inside the shaded region. Title: "Confidence Interval centered on $\bar{x}$."*
- *The point: the two perspectives are mirror images. If $\bar{x}$ is inside the CI around $\mu$, then $\mu$ is inside the CI around $\bar{x}$.]*

### Simulation Verification

We can verify this with a simulation. Simulate drawing 20 samples of 331 restaurants from the same population. For each sample:

1. Construct a 95% CI centered on $\mu$ and check whether $\bar{x}$ is inside.
2. Construct a 95% CI centered on $\bar{x}$ and check whether $\mu$ is inside.

*[Stage direction: show a paired CI figure with 20 rows. Each row has two horizontal intervals — one centered on $\mu$, one centered on $\bar{x}$ — with dots for $\bar{x}$ and $\mu$ respectively. Color-code: green rows where the check passes, red rows where it fails. The key observation is that the SAME rows are green/red in both columns. The samples that have $\bar{x}$ inside the CI around $\mu$ are exactly the samples that have $\mu$ inside the CI around $\bar{x}$.]*

The same samples pass both tests. This isn't a coincidence — it's a mathematical identity. The distance between two points doesn't depend on which one you measure from.

### The Confidence Interval for New Jersey

Let's build the 95% confidence interval centered on Card and Krueger's observed sample mean:

$$
0.59 \pm 1.96 \times 0.54 = [-0.47, \; 1.65]
$$

This interval runs from $-0.47$ to $+1.65$ FTE workers per store. Notice something important: zero is inside this interval. The data is consistent with no employment effect.

But the interval also tells us something. It excludes large negative numbers. Standard economic theory might predict employment declines of 2, 3, or even 5 FTE workers per store at restaurants forced to raise wages. Those values are well outside our confidence interval. The data may not pin down the exact effect, but it rules out the large employment losses the textbook model predicts.

### The Interpretation

A 95% confidence interval has a precise meaning: "If we repeated this sampling process many times, 95% of the confidence intervals we construct would contain the true mean $\mu$."

This is *not* the same as saying "there's a 95% probability that $\mu$ is in this particular interval." The truth is fixed — $\mu$ doesn't move. What varies is the interval, because $\bar{x}$ changes with every sample. Some intervals capture $\mu$, some don't. The 95% refers to the long-run success rate of the procedure, not to any single interval.

We often shorthand this as "we're 95% confident the truth is in this interval." That's fine as shorthand, but the confidence is in the *method*, not in any individual interval.

---

## Movement 3: Unknown $\sigma$ and the t-Distribution

### The Remaining Problem

We've made great progress. We can center the confidence interval on $\bar{x}$ instead of $\mu$. But we built the interval using $\sigma / \sqrt{n}$ as the standard error. And we don't know $\sigma$.

In the thought experiment, I told you $\sigma = 9.8$. In reality, Card and Krueger didn't know the population standard deviation of employment changes any more than they knew the population mean. They had to estimate it from their sample.

Can we just plug in $S$ — the sample standard deviation — and call it a day? Almost. But there's a catch.

### $S$ Varies Around $\sigma$

Just as $\bar{x}$ varies around $\mu$ from sample to sample, $S$ varies around $\sigma$. Every time we draw a new sample, we get a slightly different $S$.

*[Stage direction: show a histogram of sample standard deviations from 1,000 simulated samples (each of size 331) drawn from a population with $\sigma = 9.8$. The histogram is centered near 9.8 with modest spread. Mark the true $\sigma = 9.8$ with a vertical dashed line.]*

With 331 restaurants, $S$ is a pretty good estimate of $\sigma$ — the histogram is tight around the truth. But what if Card and Krueger had only been able to survey 15 restaurants? Then $S$ could be quite far from $\sigma$, and the intervals we build from it would be unreliable.

### Why Small Samples Matter

To see why this matters, imagine a smaller version of the study. Suppose Card and Krueger only had the budget to call 15 restaurants.

*[Stage direction: show 5–7 panels, each containing:*
- *A strip plot of 15 simulated employment changes*
- *A red dashed line at $\bar{x}$ for that sample*
- *A green dashed line at the true $\mu$*
- *A blue sampling distribution curve centered on $\bar{x}$, with width proportional to $S / \sqrt{n}$*
- *The key observation: both the center (red line) and the width (blue curve) vary across panels. Some panels have narrow curves (S happened to be small), some have wide curves.]*

Notice that both $\bar{x}$ and $S$ differ across samples. The sampling distributions these samples imply have different centers *and* different widths. When $S$ happens to be too small, the implied distribution is too narrow — we think we're more precise than we actually are.

### Too Confident with the Normal

What happens if we build 90% confidence intervals using $S / \sqrt{n}$ but use the normal distribution as if we knew $\sigma$?

*Exercise 3.3: students simulate this. Generate 1,000 samples of size 15 from a population with $\mu = 0$ and $\sigma = 9.8$. For each sample, construct a 90% CI using the normal distribution with $S / \sqrt{n}$. Count how many contain $\mu$.*

*[Stage direction: show a bar chart with two bars. Left bar labeled "Normal" shows coverage of ~87–88% in red. Right bar labeled "t-distribution" shows coverage of ~90% in green. A horizontal dashed line at 90% marks the target.]*

We're aiming for 90% but only achieving about 87–88%. We're *overconfident*. Our intervals are too narrow because sometimes $S$ underestimates $\sigma$, and we don't account for that extra uncertainty.

### The t-Distribution

The **t-distribution** fixes this. It's a probability distribution that looks like a normal but with heavier tails — more probability mass in the extremes. This extra spread accounts for the uncertainty introduced by estimating $\sigma$ with $S$.

*[Stage direction: show three overlaid curves on the same axes:*
- *Blue: the standard normal distribution*
- *Red: t-distribution with df = 14 (heavy tails — this is the 15-store scenario)*
- *Green: t-distribution with df = 330 (nearly identical to normal — this is Card and Krueger's full sample)*
- *Label each.]*

The t-distribution has a parameter called **degrees of freedom** (df), equal to $n - 1$. With small samples, the t has much heavier tails than the normal — reflecting the large uncertainty in $S$. As $n$ grows and $S$ becomes a better estimate of $\sigma$, the t-distribution converges toward the normal. With $df = 330$, as in Card and Krueger's full study, the two distributions are nearly identical.

So the t-distribution is related to the sample size $n$ in two ways. First, since it's just like the normal distribution, the standard error will decrease as the sample size grows. But second, the t-distribution puts less weight in the tails, making it closer to a normal distribution as the sample size grows. 

Using the t-distribution widens our confidence intervals just enough to account for the uncertainty in $S$. Now when we simulate, 90% CIs actually contain $\mu$ about 90% of the time.

### Putting It All Together

We now have everything we need to make probability statements about the true effect of the minimum wage on employment:

1. **Center** the sampling distribution on our observed $\bar{x} = 0.59$.
2. **Width** comes from $S / \sqrt{n}$ — the sample standard error.
3. **Shape** is the t-distribution with $n - 1$ degrees of freedom.

We don't need to know $\mu$. We don't need to know $\sigma$. We don't even need to know the shape of the population distribution. The CLT gives us normality; the centerpoint flip lets us use $\bar{x}$; the t-distribution handles unknown $\sigma$.

### The Card and Krueger Confidence Interval

Card and Krueger's sample of 331 New Jersey restaurants gives $\bar{x} = 0.59$ FTE workers with $S \approx 9.8$, so $SE = S / \sqrt{331} \approx 0.54$.

For a 95% CI, we need the t critical value with $df = 330$: $t_{crit} \approx 1.967$. With this many degrees of freedom, the t-distribution is nearly identical to the normal ($z = 1.960$).

$$
95\% \text{ CI}: \quad 0.59 \pm 1.967 \times 0.54 = [-0.47, \; 1.65]
$$

We're 95% confident that the true average change in employment at New Jersey fast food restaurants falls between $-0.47$ and $+1.65$ FTE workers per store. The interval includes zero — consistent with no effect — but excludes the large negative values that the textbook model would predict.

---

## Movement 4: Hypothesis Testing and p-Values

### Testing the Theory

So far we've asked "where could $\mu$ be?" Now let's flip the question. Standard economic theory predicts that raising the minimum wage reduces employment. The simplest version of this prediction is that the minimum wage has no effect at all — employment doesn't change.

Let's test this directly. Card and Krueger observed $\bar{x} = +0.59$ FTE workers per store. That's not zero — but is it *far enough* from zero to be surprising? Or could this just be normal sampling variability?

### Null and Alternative Hypotheses

We formalize this by setting up hypotheses:

- **Null hypothesis** ($H_0$): $\mu = 0$. The minimum wage had no effect on employment.
- **Alternative hypothesis** ($H_1$): $\mu \neq 0$. The minimum wage changed employment in some direction.

The null hypothesis is what we assume until the data convinces us otherwise. Here it embodies the claim that despite the policy change, average employment at New Jersey restaurants stayed the same. The question is: if $H_0$ is true — if the real mean change is zero — how surprising is it that we observed $\bar{x} = 0.59$?

### The t-Statistic

To answer this, we calculate how far our sample mean is from the null value, measured in standard errors:

$$
t = \frac{\bar{x} - \mu_0}{S / \sqrt{n}} = \frac{0.59 - 0}{0.54} \approx 1.09
$$

This is the **t-statistic**. It tells us: our sample mean is about 1.09 standard errors above the null hypothesis. Is that a lot?

*[Stage direction: show a t-distribution (df = 330) centered on $\mu_0 = 0$. Mark $\bar{x} = 0.59$ with a vertical line. The 95% CI around the null $[{-1.06}, \; {+1.06}]$ is shaded in blue. The observed mean is well inside the CI — not close to the edges.]*

It's not. A value 1.09 standard errors from the null is well within the range of normal sampling variability.

### The p-Value

The **p-value** answers: "if the null hypothesis were true, what's the probability of observing a sample mean this far or farther from zero?"

We look at both tails of the t-distribution — because a mean equally far *below* zero would be equally surprising.

*[Stage direction: show the t-distribution centered on 0. Shade the right tail beyond $+0.59$ and the left tail below $-0.59$ in red. Label the total shaded area as the p-value $\approx 0.28$.]*

The p-value is about 0.28. If the true mean change really were zero, we'd observe a sample mean at least as far from zero as 0.59 about 28% of the time. That's not unusual at all. You'd see a result like this in roughly one out of every four surveys even when the minimum wage has no effect.

### The Decision

By convention, we reject $H_0$ if the p-value falls below 0.05. This threshold is called the **significance level**. Here, $p = 0.28$ — well above 0.05. We do not reject the null. The data is *consistent* with zero employment effect.

This is a version of what Card and Krueger found. Looking at New Jersey alone, the increase of 0.59 FTE workers per store is not statistically distinguishable from zero. The observed change could plausibly be noise.

### What Card and Krueger Did Next

But Card and Krueger didn't stop here. They recognized that New Jersey restaurants might have experienced employment changes for reasons unrelated to the minimum wage — a regional economic upturn, seasonal hiring patterns, or changes in the fast food industry. Any of these could have influenced the result.

To isolate the minimum wage effect, they compared the *changes* in employment between New Jersey and Pennsylvania. Pennsylvania restaurants faced the same economic conditions but no minimum wage increase. The difference-in-differences was $+2.76$ FTE workers per store with a standard error of 1.36, giving a t-statistic of about 2.03 and a p-value around 0.04. That result was statistically significant.

The comparison sharpened the analysis by removing confounding factors that affected both states equally. We'll see this kind of approach — using control groups and multiple predictors to isolate effects — when we get to regression in Part 4.

### Common Misinterpretations

The p-value is one of the most frequently misunderstood quantities in statistics.

**The p-value is NOT the probability that $H_0$ is true.** A p-value of 0.28 does *not* mean there's a 28% chance the minimum wage had no effect. The truth is fixed — the minimum wage either affected employment or it didn't. There's no probability about it. The p-value assumes the null is true and asks how surprising the data would be under that assumption.

**The p-value is NOT the probability the result is "due to chance."** All sample statistics reflect some combination of signal and noise. The p-value doesn't separate these. A p-value of 0.04 doesn't mean "4% chance it's noise and 96% chance it's real."

**The p-value IS the probability of seeing data this extreme if $H_0$ were true.** Think of it as a compatibility check. A small p-value says: "if the null were true, this data would be very unusual." A large p-value says: "this data is perfectly compatible with the null."

The truth is fixed. The sample is what's random. The p-value measures how surprising the sample is under a specific assumption about the truth.

### Statistical vs Practical Significance

The Card and Krueger example illustrates an important distinction. We failed to reject $H_0: \mu = 0$ when looking at New Jersey alone. Does that mean the minimum wage had no effect?

Not necessarily. Failing to reject the null doesn't prove the null is true. It means we don't have enough evidence to rule it out. Our confidence interval ran from $-0.47$ to $+1.65$. The true effect could be zero. It could also be moderately positive. What we *can* say is that the data rules out large negative effects — the large employment declines that textbook theory predicts.

More generally, with large enough samples, even tiny effects become statistically significant. If you surveyed 100,000 restaurants and found a mean change of $+0.05$ FTE workers, the p-value might fall below 0.05. The test would declare the result "statistically significant" — meaning the effect is probably not zero. But does anyone care about five hundredths of a worker?

**Statistical significance** tells you the effect is probably not zero. **Practical significance** tells you whether the effect matters. Always consider the *size* of the effect, not just whether it passes a threshold. Card and Krueger's contribution wasn't just the p-value. It was that the *direction* and *magnitude* of the effect contradicted the standard prediction. Even though the NJ-only result wasn't statistically significant, the point estimate was positive — opposite to what theory said — and the confidence interval excluded the large negative effects that the theory implied.

### Looking Ahead

We've built a complete framework for making claims about an unknown population mean. The CLT gives us the sampling distribution. The t-distribution handles unknown $\sigma$. Confidence intervals tell us where $\mu$ could be. Hypothesis tests tell us whether the data is consistent with a specific claim about $\mu$.

But these tools are also the simplest case of something much more powerful. What we've been calling "testing a population mean" is really just fitting a statistical model with one parameter and asking whether that parameter could be zero. Next time, we'll see this explicitly — we'll write our hypothesis test as a regression model and discover that the framework generalizes to test *any* relationship between variables.
