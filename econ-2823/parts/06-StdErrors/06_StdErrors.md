# Part 11: Standard Errors for Transformations

## Introduction

In non-linear models, we often estimate model parameters and their standard errors, but what we truly care about are concrete outcomes derived from those parameters. For example, after estimating the probability that each type of customer buys a product, we might want to know predicted profits under a sale event compared to standard prices, and we need confidence intervals for those predictions. This unit covers how to propagate uncertainty from parameter estimates through arbitrary transformations to obtain standard errors on the quantities we actually care about.

We explore three main approaches to this problem. First, for simple monotonic transformations, we can directly plug confidence interval bounds through the transformation function. Second, the delta method provides a general analytical framework based on Taylor expansions for computing standard errors of transformed parameters. Third, resampling methods -- particularly bootstrapping -- offer a flexible, assumption-light alternative. We also cover likelihood ratio tests and information criteria for model comparison, which round out the toolkit for inference in maximum likelihood estimation.

Throughout this unit, we work with a running example involving the geometric distribution (modeling streaks), the binomial distribution (modeling weekly inventory events), and the Poisson regression model, demonstrating how to move from estimated parameters to actionable predictions with proper uncertainty quantification.

## The Geometric Distribution and Streak Data

The geometric random variable models counts under the assumption that there is a constant probability $p$ of a streak ending after each period. The probability that a streak lasts for exactly $x = 0, 1, 2, \ldots$ periods is:

$$\Pr\{X = x\} = (1-p)^x p$$

This distribution has a constant rate of decay: the probability of reaching a value of $x+1$ is $(1-p)$ times the probability of reaching $x$. This contrasts with the Poisson distribution, where the probabilities first rise to a peak and then decline.

We generate streak data with a true ending probability of $p = 1/8$ and estimate $p$ via maximum likelihood:

```python
np.random.seed(42)
streak_data = np.random.geometric(1/8, 100) - 1

def log_likelihood_geom(p):
    return np.sum(streak_data * np.log(1 - p) + np.log(p))

result = optimize.minimize_scalar(
    lambda p: -log_likelihood_geom(p),
    bounds=(1e-6, 1 - 1e-6),
    method='bounded'
)
p_hat = result.x
```

The standard error is computed using the score vector (the derivative of the individual log-likelihoods with respect to $p$) and the Fisher information:

```python
eps = 1e-6
score_vector = (
    (streak_data * np.log(1 - (p_hat + eps)) + np.log(p_hat + eps)) -
    (streak_data * np.log(1 - (p_hat - eps)) + np.log(p_hat - eps))
) / (2 * eps)

sigma_p = np.sqrt((1 / np.mean(score_vector**2)) / len(streak_data))
```

With the estimate $\hat{p}$ and its standard error $\hat{\sigma}_p$, we construct a 95% confidence interval:

$$\text{95\% CI: } \left[\hat{p} - 1.96 \times \hat{\sigma}_p,\; \hat{p} + 1.96 \times \hat{\sigma}_p\right]$$

## Plugging Parameters into Transformations

The confidence interval for $\hat{p}$ is not the final answer -- it is an ingredient. Consider the scenario where streaks measure the number of days between uses of an inventory item. A firm holds two items renewed weekly, and production stops if inventory is depleted. We want to know: what is the probability of three or more uses in a week?

This requires the binomial distribution. The probability of exactly $x$ uses in $n=7$ days is:

$$\Pr\{X = x\} = \binom{7}{x} p^x (1-p)^{7-x}$$

We define the quantity of interest as:

$$Q(p) = 1 - q(0) - q(1) - q(2)$$

where $q(x) = \binom{7}{x} p^x (1-p)^{7-x}$.

```python
def Q(p):
    return 1 - stats.binom.pmf(0, 7, p) - stats.binom.pmf(1, 7, p) - stats.binom.pmf(2, 7, p)
```

When the transformation $Q(p)$ is strictly monotonic (increasing in $p$), we can simply evaluate $Q$ at the confidence interval bounds of $\hat{p}$ to get a confidence interval for $Q$. However, the direction may reverse for decreasing functions. For example, the probability of no emergency call-out in a year, $(1 - Q(p))^{52}$, is a decreasing function of $p$, so the upper bound on $p$ gives the lower bound on the no-call probability.

When the transformation is not monotonic -- for instance, the probability of exactly 2 or 3 call-out weeks in a year -- this direct approach fails. The function may peak within the confidence interval, making it impossible to simply read off the bounds. In such cases, a simulation approach works well: draw many values of $p$ from its asymptotic normal distribution, apply the transformation to each draw, and take empirical quantiles:

```python
p_draws = np.random.normal(p_hat, sigma_p, 1_000_000)
out = np.array([two_or_three(p) for p in p_draws])
print(f"2.5% quantile: {np.percentile(out, 2.5):.7f}")
print(f"97.5% quantile: {np.percentile(out, 97.5):.7f}")
```

## The Delta Method

For multi-dimensional parameters, we need a structured method. The delta method is based on the Taylor expansion. Suppose we have a consistent estimator $\hat{\theta}$ with:

$$\sqrt{n}(\hat{\theta} - \theta) \rightarrow^D \mathcal{N}(0, \Sigma)$$

For a continuous transformation $g(\hat{\theta})$, the first-order Taylor expansion gives:

$$g(\hat{\theta}) \approx g(\theta) + \frac{\partial g(\theta)}{\partial \theta}(\hat{\theta} - \theta)$$

This leads to:

$$\sqrt{n}(g(\hat{\theta}) - g(\theta)) \rightarrow^D \mathcal{N}\left(0, \frac{\partial g(\theta)}{\partial \theta^T} \Sigma \frac{\partial g(\theta)}{\partial \theta}\right)$$

The practical implementation computes the variance of the transformed estimator as:

$$\hat{\Omega} = \frac{\partial g(\hat{\theta})}{\partial \theta^T} \left(\frac{1}{n}\hat{\Sigma}\right) \frac{\partial g(\hat{\theta})}{\partial \theta}$$

In code, this requires only:
- A gradient vector `dG`, computed numerically via finite differences
- The variance-covariance matrix `Sigma_hat` from the model (e.g., `model.cov_params()`)

```python
est_model = sm.GLM(y, X, family=...).fit()
Sigma_hat = est_model.cov_params()
dG = utils.numerical_gradient(g, theta_hat)
Omega_hat = dG @ Sigma_hat @ dG
```

### Delta Method Example: Poisson Model

We generate data from a Poisson model with $\lambda_i = \exp(\beta_1 + \beta_2 x_{1i} + \beta_3 x_{2i})$ and true parameters $\beta = (2, -1, 1)$. After fitting with `sm.GLM`, we want the probability of a zero count when $x_1 = 1$ and $x_2 = -2$:

$$\Pr\{X = 0\} = e^{-\lambda}, \quad \lambda = \exp(\beta_1 + \beta_2 - 2\beta_3)$$

```python
def prob_pois_0(beta):
    return stats.poisson.pmf(0, mu=np.exp(beta[0] + beta[1] - 2 * beta[2]))

dG = utils.numerical_gradient(prob_pois_0, beta_hat)
Sigma_hat_arr = Sigma_hat_divN.values
Omega_hat = dG @ Sigma_hat_arr @ dG
se_zero = np.sqrt(Omega_hat)
```

Comparing the delta method to simulation (drawing 500,000 samples from the multivariate normal distribution of $\hat{\beta}$), the results are very close, validating the approximation.

## Resampling Methods

Resampling methods approximate the sampling distribution of estimators using the data itself, without relying on asymptotic normality. Three main flavors exist:

- **Bootstrapping**: Resample $n$ observations from the original $n$ with replacement, repeated many times.
- **Jackknifing**: Remove one data point $i$ at a time, refit with the remaining $n-1$, repeat for each $i$.
- **Sub-sampling**: Take sub-samples of size $m < n$ without replacement.

### Bootstrapping

The bootstrap treats the empirical distribution of the data as a stand-in for the true data generating process. For each bootstrap replicate, we resample, re-estimate the model, and compute the statistic of interest:

```python
def pois_bs_prob0(data_arr):
    df = pd.DataFrame(data_arr, columns=['y', 'x1', 'x2'])
    X = sm.add_constant(df[['x1', 'x2']])
    model = sm.GLM(df['y'], X, family=sm.families.Poisson()).fit(disp=0)
    return prob_pois_0(model.params.values)

bs_results_prob0 = utils.bootstrap(
    data_pois[['y', 'x1', 'x2']].values,
    pois_bs_prob0,
    n_boot=10000,
    seed=42
)
```

Confidence intervals can be computed using the percentile method (taking the 2.5th and 97.5th percentiles of the bootstrap distribution) or the BCa (bias-corrected and accelerated) method, which adjusts for bias and skewness.

The bootstrap variance-covariance matrix can be estimated as the sample covariance of the bootstrapped coefficient vectors:

```python
bs_Sigma = np.cov(valid_coefs, rowvar=False)
```

### Pros and Cons of Bootstrapping

Pros include minimal distributional assumptions, robustness to extreme observations, direct construction over the full estimation procedure, and flexibility to answer any question once the sampling distribution is assembled. Cons include the need for a moderate sample size, computational cost for slow estimation routines, the requirement to handle data dependencies (time series, strata), and poor behavior with fat-tailed distributions or extreme values.

## Likelihood Ratio Tests

The likelihood ratio test compares a restricted model (under the null hypothesis) to the unrestricted model. The test statistic is:

$$\lambda_{H_0} = 2\left(l(\hat{\theta}) - l(\tilde{\theta}_{H_0})\right)$$

This quantity is always non-negative (the unrestricted maximizer must achieve at least as high a likelihood). Under the null hypothesis, $\lambda_{H_0}$ converges to a $\chi^2_k$ distribution, where $k$ is the number of constraints imposed.

To test $H_0: \beta_3 = 1.5$ in the Poisson model, we use the `offset` argument in `sm.GLM` to fix the coefficient:

```python
pois_con = sm.GLM(
    data_pois['y'], sm.add_constant(data_pois[['x1']]),
    family=sm.families.Poisson(),
    offset=1.5 * data_pois['x2']
).fit(disp=0)

lr_stat, p_value = utils.likelihood_ratio_test(pois_con.llf, pois_unc.llf, df=1)
```

Joint tests (e.g., $H_0: \beta_2 = -1$ and $\beta_3 = 1$) use the same framework with 2 degrees of freedom.

## Model Selection: AIC and BIC

When comparing non-nested models, we use information criteria that balance fit and complexity. Let $k$ be the number of parameters and $L$ the maximized likelihood:

**Akaike Information Criterion (AIC):**

$$\text{AIC} = 2k - 2\log L$$

**Bayesian Information Criterion (BIC):**

$$\text{BIC} = k\log(n) - 2\log L$$

In both cases, lower values indicate a better model. The BIC penalizes complexity more heavily for large samples. In Python, these are available as `model.aic` and can be computed manually for BIC:

```python
bic = k * np.log(n_obs) - 2 * model.llf
```

Adding an irrelevant noise variable to a correctly specified model will increase both AIC and BIC, correctly identifying the simpler model as preferred.

## Summary

- Confidence intervals on parameters must be propagated through transformations to obtain intervals on quantities of interest.
- For monotonic transformations, direct evaluation at confidence bounds works; for non-monotonic cases, simulation is needed.
- The delta method provides a general analytical framework: $\hat{\Omega} = \nabla g^T (\frac{1}{n}\hat{\Sigma}) \nabla g$.
- Bootstrapping approximates the sampling distribution by resampling with replacement and re-estimating.
- The delta method, simulation, and bootstrap typically give similar results, providing mutual validation.
- Likelihood ratio tests compare nested models using the chi-squared distribution.
- AIC and BIC provide principled criteria for model selection, balancing fit against complexity.
