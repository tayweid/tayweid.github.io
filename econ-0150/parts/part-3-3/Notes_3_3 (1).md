## Part 3.3 | Quantifying Uncertainty

### Overview

- Returning to the Card and Krueger minimum wage study from Part 0
- The CLT gives us the sampling distribution; now we use it
- With known σ, we can calculate the probability x̄ falls within any distance of μ — confidence intervals
- The centerpoint flip: distance is symmetric, so we can center the CI on x̄ instead of μ
- Interpretation: confidence is in the method, not any single interval
- We don't know σ either; using S introduces extra variability; the t-distribution accounts for this
- Hypothesis testing: is the NJ employment change significantly different from zero?
- The p-value measures how surprising the data is under the null — not the probability the null is true

---

### Opening — Back to New Jersey

In Part 0 we met David Card and Alan Krueger. In 1992, New Jersey raised its minimum wage from $4.25 to $5.05 an hour while neighboring Pennsylvania kept theirs unchanged. Card and Krueger surveyed 331 New Jersey fast food restaurants before and after the increase.

Although there are many models of the minimum wage, the simplest economic theory one often sees in early classes makes a clear prediction: a higher minimum wage raises the cost of labor, firms hire fewer workers, employment falls.

Card and Krueger's data told a different story. The average change in full-time-equivalent employment was +0.59 workers per store. Employment went *up*, not down.

But that +0.59 is a sample mean from 331 restaurants. A different 331 restaurants would give a different number. Is +0.59 meaningfully different from zero? Or is it just noise?

### Where We Left Off

The central limit theorem tells us:

$$
\bar{x} \xrightarrow{d} N\Big(\mu, \frac{\sigma}{\sqrt{n}}\Big)
$$

As the sample size grows, the distribution of $\bar{x}$ converges to a normal centered on the population mean $\mu$ with standard error $\sigma / \sqrt{n}$. We don't know $\mu$, but we know the shape of the sampling distribution. That's enough.

---

## Confidence Intervals with Known $\sigma$

### How Close Is $\bar{x}$ to $\mu$?

Suppose we knew the population standard deviation: $\sigma = 9.8$ FTE workers. With $n = 331$, the standard error is $SE = 9.8 / \sqrt{331} \approx 0.54$.

What's the probability that a sample mean falls within $2 \times SE$ of $\mu$? About 95%.

*[Stage direction: normal curve centered at μ = 0. The region from μ − 2SE to μ + 2SE is shaded. Vertical dashed lines at the bounds. Green dashed line at μ.]*

If Card and Krueger ran their survey many times, about 95% of sample means would land within this interval.

*Exercise 3.3: students calculate the probability x̄ falls within 1 SE of μ using `stats.norm.cdf()`.*

### Confidence Intervals Are About Probability

We can see this directly. Draw 100 samples from the same population. For each sample, plot the confidence interval centered on μ and mark where x̄ landed.

*[Stage direction: vertical caterpillar plot. 100 vertical bars, all spanning ±2 SE centered on μ. Each bar has a dot at that sample's x̄. Green if x̄ is inside, red if outside. Bars are half-transparent, dots are opaque. Blue horizontal dashed line at μ = 0.]*

Most dots land inside the interval — about 95 out of 100. The interval is fixed. The randomness is in which x̄ we draw.

*Exercise 3.3: each student draws a sample, calculates x̄, checks whether it falls inside the interval. The class pools results.*

---

## The Centerpoint Flip

### The Problem

We centered the confidence interval on μ. But we don't know μ — that's the whole point of the study. If we knew the true effect of the minimum wage, we wouldn't need the data.

### The Key Insight

The CLT tells us about the *distance* between x̄ and μ. That distance is the same in both directions. If x̄ is within 2 SE of μ, then μ is within 2 SE of x̄.

Instead of asking where x̄ lands relative to μ, we ask where μ could be relative to our observed x̄. That's a question we can answer.

### Verification

We can verify this with a simulation. Draw 100 samples. For each one, build a CI centered on μ and a CI centered on x̄. The same samples are green and red in both cases.

*[Stage direction: two-panel caterpillar figure, stacked vertically. Top panel: 100 CIs centered on μ with dots at x̄. Bottom panel: 100 CIs centered on x̄ with μ marked as a horizontal line. Same seed — the same samples are green/red in both panels.]*

If x̄ is in the CI centered on μ, then μ is in the CI centered on x̄. It's the same test, just flipped.

### The Confidence Interval for New Jersey

Card and Krueger observed x̄ = 0.59 from one sample of 331 restaurants. Center the CI on x̄:

$$
\bar{x} \pm 2 \times SE = 0.59 \pm 2 \times 0.54 = [-0.49, \; 1.67]
$$

We just saw that 95 out of 100 intervals contain μ. But we only drew one sample. Is μ inside our interval? We don't know.

### Interpretation

Our study is one of those bars in the caterpillar plot. Most are green — but some are red. Our interval either contains μ or it doesn't. We don't know which.

"95% confident" means the method works 95% of the time, not that this interval has a 95% chance of containing μ. Our confidence is in the method, not the specific interval we estimated.

---

## Unknown $\sigma$ and the t-Distribution

### The Remaining Problem

We can center the CI on x̄. But we built it using $\sigma / \sqrt{n}$, and we don't know σ. Can we use S — the sample standard deviation — instead?

Yes, but S is itself a random variable. It varies from sample to sample, just like x̄ varies around μ. This introduces a new source of uncertainty.

### S Varies Around σ

How close would S be to σ with only 15 restaurants? Draw 1,000 samples and find out.

*[Stage direction: histogram of sample standard deviations from 1,000 samples of size 15, drawn from a population with σ = 9.8. The histogram is centered near 9.8 but has substantial spread. Red dashed line at σ = 9.8.]*

S is centered on σ, but with only 15 restaurants there's a lot of variability. Like x̄ is distributed around μ, S is distributed around σ.

### The t-Distribution

The **t-distribution** accounts for this extra uncertainty. It looks like the normal but with heavier tails — more probability in the extremes. The heavier tails widen our confidence intervals just enough to compensate for using S instead of σ.

*[Stage direction: three overlaid curves — normal (blue), t with df = 14 (red, heavy tails), t with df = 330 (green, nearly identical to normal).]*

The t-distribution has a parameter called degrees of freedom, equal to n − 1. With small samples, the t has much heavier tails. As n grows and S becomes a better estimate of σ, the t approaches the normal. Card and Krueger had 331 restaurants — their t-distribution is nearly identical to the normal.

The t-distribution accounts for the extra uncertainty when we use S instead of σ. When n is large, S is close to σ and the t approaches the normal.

### Putting It All Together

We now have everything we need:

1. **Center** the sampling distribution on x̄ = 0.59.
2. **Width** comes from S/√n — the sample standard error.
3. **Shape** is the t-distribution with n − 1 degrees of freedom.

We don't need to know μ. We don't need to know σ. The CLT gives us normality; the centerpoint flip lets us use x̄; the t-distribution handles unknown σ.

The confidence interval tells us where μ could be. But sometimes we want to ask a sharper question — not "where is μ?" but "could μ be this specific value?" That's hypothesis testing, and it works by going back to the null distribution — centering on the claimed value and asking how surprising our data would be.

---

## Hypothesis Testing

### Testing the Theory

Economic theory predicts employment should fall — or at least not change. Card and Krueger observed x̄ = +0.59. Is that consistent with no effect?

Instead of asking where μ might be, we test a specific value: μ = 0.

### The Null Hypothesis

We formalize this with hypotheses:

- **Null hypothesis** (H₀): μ = 0. The minimum wage had no effect on employment.
- **Alternative hypothesis** (H₁): μ ≠ 0. The minimum wage changed employment.

### Where Does Our Sample Fall?

If μ = 0, the sampling distribution of x̄ is centered on zero. Where does our observed x̄ = 0.59 fall on this distribution?

*[Stage direction: t-distribution centered on μ₀ = 0. Just the curve, a blue dashed line at 0, and a green vertical line at x̄ = 0.59. No shading. Clean.]*

Is 0.59 far from 0? How would we know?

### The p-value

The **p-value** answers this. It's the fraction of the null distribution that is at least as extreme as our sample — the probability of seeing a result this far or farther from zero, if the true mean is zero.

*[Stage direction: same t-distribution. Now shade the right tail beyond +0.59 and the left tail below −0.59 in red. Annotation showing p = 0.28.]*

The shaded area is the probability of getting a result as extreme as ours, if μ = 0. p = 0.28 — about 28% of samples would look this extreme or more. Not surprising.

### The t-Statistic

The t-statistic measures how many standard errors our sample mean is from the null:

$$
t = \frac{\bar{x} - \mu_0}{S / \sqrt{n}} = \frac{0.59 - 0}{0.54} \approx 1.09
$$

Our sample mean is about 1.09 standard errors from zero. That's not far.

### The Decision

By convention, we reject H₀ if the p-value falls below 0.05. Here p = 0.28, well above 0.05. We do not reject the null. The data is consistent with no employment effect.

### What Card and Krueger Did Next

Card and Krueger didn't stop here. They compared the changes in NJ to Pennsylvania, which faced the same economic conditions but no wage increase. The difference-in-differences was +2.76 FTE workers per store (SE = 1.36, p ≈ 0.04). That result was statistically significant. The comparison removed confounding factors that affected both states equally. We'll see this approach — using control groups — when we get to regression in Part 4.

### Common Misinterpretations

**The p-value is NOT the probability that H₀ is true.** A p-value of 0.28 does not mean there's a 28% chance the minimum wage had no effect. It assumes the null is true and asks how surprising the data would be.

**The p-value is NOT the probability the result is "due to chance."** All results reflect some combination of signal and noise. The p-value doesn't separate them.

**The p-value IS the probability of seeing data this extreme if H₀ were true.** A small p-value says the data would be unusual under the null. A large p-value says the data is compatible with the null.

### Statistical vs Practical Significance

We failed to reject H₀ when looking at NJ alone. Does that mean the minimum wage had no effect? Not necessarily. Failing to reject the null doesn't prove it's true — it means we don't have enough evidence to rule it out. Our CI ran from −0.49 to +1.67. The true effect could be zero. It could also be moderately positive. What we can say is that the data rules out large negative effects.

With large enough samples, even tiny effects become statistically significant. Statistical significance tells you the effect probably isn't zero. Practical significance tells you whether the effect matters. Always consider the size of the effect, not just the p-value.

### Looking Ahead

We've built a framework for making claims about an unknown population mean. The CLT gives us the sampling distribution. The t-distribution handles unknown σ. Confidence intervals tell us where μ could be. Hypothesis tests tell us whether the data is consistent with a specific claim.

These tools are the simplest case of something more general. Testing a population mean is really fitting a model with one parameter and asking whether it could be zero. Next time, we'll write our hypothesis test as a regression model and discover that the framework generalizes to test any relationship between variables.
