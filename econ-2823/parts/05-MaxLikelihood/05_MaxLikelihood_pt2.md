# Part 09: Maximum Likelihood 2 -- Inference

## Introduction

In the previous unit we introduced maximum likelihood estimation (MLE) and showed how to set up and optimize likelihood functions in Python. We derived MLE estimators for several distributions and applied the method to a Poisson soccer scoreline model. However, point estimates alone are insufficient -- we need to quantify uncertainty by constructing standard errors and confidence intervals.

This unit addresses the inferential side of MLE. We begin with the asymptotic properties that justify MLE inference: consistency, asymptotic normality, and efficiency. We then derive the Fisher Information Matrix, which provides the foundation for computing variance-covariance matrices. The Cramer-Rao inequality establishes that MLE achieves the smallest possible asymptotic variance among unbiased estimators. We work through these concepts with the Poisson distribution, computing standard errors via both the score (outer product of gradients) and Hessian (second derivatives) approaches. We then apply these methods to the soccer scoreline model and compare results with those from a Generalized Linear Model (GLM).

Throughout, we emphasize both analytical and numerical methods for computing standard errors, since most practical models require the latter.

## Properties of Maximum Likelihood Estimates

Under regularity conditions, the MLE estimator $\hat{\boldsymbol{\theta}}$ of an identifiable parameter vector $\boldsymbol{\theta}_0$ has three key properties:

1. **Consistency**: $\hat{\boldsymbol{\theta}}$ converges in probability to the true parameter $\boldsymbol{\theta}_0$ as the sample size grows.
2. **Asymptotic Normality**: $\sqrt{n}(\hat{\boldsymbol{\theta}} - \boldsymbol{\theta}_0)$ converges in distribution to $\mathcal{N}(0, \Sigma)$.
3. **Efficiency**: The asymptotic variance-covariance matrix $\Sigma$ is the smallest possible among all asymptotically normal estimators.

These are all large-sample results. In finite samples, MLE estimators can be biased (as we saw with the MLE for $\sigma$ in the normal distribution), and all inference relies on the sample being sufficiently large.

## Theory for the Variance-Covariance of MLE Estimators

### The Score Vector

The score vector evaluated at a parameter value $\boldsymbol{\theta}$ is defined as the gradient of the log-likelihood:

$$\mathbf{s}(\boldsymbol{\theta}) = \frac{\partial \log L(\boldsymbol{\theta})}{\partial \boldsymbol{\theta}}$$

By the chain rule, this equals:

$$\mathbf{s}(\boldsymbol{\theta}) = \frac{1}{L(\boldsymbol{\theta})} \frac{\partial L(\boldsymbol{\theta})}{\partial \boldsymbol{\theta}}$$

At the true parameter value, the expected score is zero. The variability of the score around zero encodes information about how well the data identifies the parameters.

### The Fisher Information Matrix

The Fisher Information Matrix evaluated at the true parameter $\boldsymbol{\theta}_0$ is:

$$\mathbf{I}_{\boldsymbol{\theta}_0} = \mathbb{E}\left[\mathbf{s}(\boldsymbol{\theta}_0) \mathbf{s}(\boldsymbol{\theta}_0)^T\right] = -\mathbb{E}\left[\frac{\partial^2 \log L(\boldsymbol{\theta}_0)}{\partial \boldsymbol{\theta} \partial \boldsymbol{\theta}^T}\right]$$

The first expression uses the outer product of the score vector. The second, equivalent expression uses the negative expected Hessian of the log-likelihood. Both yield the same matrix at the true parameter values, but they can differ in finite samples when evaluated at estimates.

## The Cramer-Rao Inequality

A fundamental result in statistics establishes a lower bound on the variance of any unbiased estimator. If we have observations $\mathbf{z}$ with density $f(\mathbf{z}; \boldsymbol{\theta}_0)$, then any unbiased estimator $\hat{\boldsymbol{\theta}}(\mathbf{z})$ satisfies:

$$\text{Var}(\hat{\boldsymbol{\theta}}(\mathbf{z})) \geq \frac{1}{n} \mathbf{I}(\boldsymbol{\theta}_0)^{-1}$$

Since the MLE's asymptotic variance is exactly this lower bound, the MLE is asymptotically efficient. If you have the correct probability distribution and a large amount of data, there is no better estimation method than maximum likelihood.

## Poisson Example (Theory)

### Deriving the Fisher Information

Consider the simple Poisson model with parameter $\lambda$. The likelihood and log-likelihood are:

$$L(\lambda) = \prod_{i=1}^N \frac{\lambda^{k_i} e^{-\lambda}}{k_i!}$$

$$l(\lambda) = \sum_{i=1}^N \left(k_i \cdot \log(\lambda) - \lambda - \log(k_i!)\right)$$

The score is:

$$s(\lambda) = \frac{\partial l(\lambda)}{\partial \lambda} = \sum_{i=1}^N \frac{k_i}{\lambda} - N$$

Using the outer product formula $\mathbf{I}(\lambda) = \mathbb{E}[s(\lambda)^2]$, we can expand and simplify. Using the properties that $\mathbb{E}(k_i) = \lambda$ and $\text{Var}(k_i) = \lambda$ for a Poisson random variable, the algebra yields:

$$\mathbf{I}(\lambda) = \frac{N}{\lambda}$$

Alternatively, using the Hessian formula is much quicker:

$$\mathbf{I}(\lambda) = -\mathbb{E}\left[\frac{\partial^2 l(\lambda)}{\partial \lambda^2}\right] = -\mathbb{E}\left[-\sum_{i=1}^N \frac{k_i}{\lambda^2}\right] = \frac{N}{\lambda}$$

Both approaches give the same result, confirming the identity between the two Information Matrix formulas.

### Poisson Conclusion

The Cramer-Rao inequality tells us that every unbiased estimator for $\lambda$ has variance at least $\lambda / N$, and the MLE estimator $\hat{\lambda} = \bar{k}$ achieves this bound asymptotically.

## Calculation of the Variance-Covariance Matrix

In practice, we do not know the true parameter values. We have estimates $\hat{\boldsymbol{\theta}}$ and need to assess their precision. The approach parallels OLS: we plug our estimates into the theoretical variance formula to get an estimated variance-covariance matrix.

There are two approaches for estimating $\mathbf{I}_{\boldsymbol{\theta}_0}$:

1. **Score method**: Calculate the score vector $\mathbf{s}(\hat{\boldsymbol{\theta}})$ at each data point, then average the outer products to approximate the expectation.
2. **Hessian method**: Calculate the Hessian matrix of the log-likelihood at each data point and average.

The score method is generally preferred for numerical computation because it requires only first derivatives (one per parameter per data point), while the Hessian requires $k^2$ second derivatives per data point.

## Poisson Estimator: Standard Errors in Practice

### Score-Based Approach

Starting with simulated Poisson data ($\lambda = 2$, $n = 400$):

```python
np.random.seed(42)
pois_data = np.random.poisson(2, 400)
lambda_hat = np.mean(pois_data)
```

The score for a single observation is $s(k_j) = k_j / \lambda - 1$. We compute it at $\hat{\lambda}$:

```python
def pois_score_est(kj):
    return kj / lambda_hat - 1

scores = pois_score_est(pois_data)
Fisher_Inf = np.mean(scores**2)
EstVar = 1.0 / Fisher_Inf
```

The standard error of $\hat{\lambda}$ is then:

$$\text{SE}(\hat{\lambda}) = \frac{\sqrt{\hat{\text{Var}}}}{\sqrt{n}}$$

```python
se_lambda = np.sqrt(EstVar / 400)
```

We can compare this estimated SE with the true SE (which we know because we generated the data): $\sqrt{\lambda/n} = \sqrt{2/400} \approx 0.0707$. The estimated SE is close but not identical, reflecting sampling variability.

The plot of the actual versus estimated sampling distributions shows two nearly overlapping normal curves, illustrating that our variance estimator is working well.

### Hessian-Based Approach

The Hessian for a single Poisson observation is $h(k_j) = -k_j / \lambda^2$:

```python
def pois_hess_est(kj):
    return -kj / lambda_hat**2

pois_hess = pois_hess_est(pois_data)
EstVar_H = 1.0 / np.mean(-pois_hess)
se_hessian = np.sqrt(EstVar_H / 400)
```

The Hessian-based SE is not identical to the score-based SE because the two Information Matrix formulas are only equivalent in expectation at the true parameter value. In finite samples evaluated at the estimate, they can differ slightly.

### Numerical Approximation

When analytical derivatives are impractical, we use numerical derivatives:

$$f'(x) \approx \frac{f(x + \epsilon) - f(x - \epsilon)}{2\epsilon}$$

```python
def d_log_likelihood_poisson(kj, lam, eps):
    return (stats.poisson.logpmf(kj, lam + eps) -
            stats.poisson.logpmf(kj, lam - eps)) / (2 * eps)
```

The numerical scores match the analytical scores closely, confirming the reliability of the numerical approach.

## Scaling Considerations: Score vs. Hessian

For a model with $k$ parameters, the score method requires computing $n$ different $k$-dimensional numerical gradients to form the $k \times k$ matrix $\mathbb{E}[\mathbf{s}\mathbf{s}^T]$. The Hessian method requires $n \cdot k^2$ numerical second derivatives. For models with many parameters, the score approach is significantly cheaper.

## Two-Group Poisson Example

To illustrate the multivariate case, consider two observable groups with separate Poisson parameters $\lambda_1$ and $\lambda_2$:

```python
np.random.seed(123)
groups = np.where(np.random.uniform(size=400) > 0.5, 1, 2)
k_vals = np.where(groups == 1,
                  np.random.poisson(1.5, 400),
                  np.random.poisson(2.5, 400))
```

The score matrix is $N \times 2$, with each row having a non-zero entry only in the column corresponding to that observation's group. The Fisher Information is estimated via the outer product:

```python
Sigma = np.linalg.inv(score_matrix.T @ score_matrix / nn)
```

The resulting variance-covariance matrix is diagonal, reflecting the independence of the two group estimators:

$$\hat{\boldsymbol{\Sigma}} = \begin{pmatrix} \hat{\sigma}^2_{\lambda_1} & 0 \\ 0 & \hat{\sigma}^2_{\lambda_2} \end{pmatrix}$$

Standard errors are extracted from the diagonal: $\text{SE}(\hat{\lambda}_g) = \sqrt{\hat{\sigma}^2_g / n}$.

### Alternative Parameterization

If we instead parameterize the model as group 1 having mean $\lambda_1$ and group 2 having mean $\lambda_1 + \lambda_2$ (so $\lambda_2$ is the difference), the score matrix changes structure. Now $\lambda_1$ appears in all rows, creating off-diagonal elements in the variance-covariance matrix. However, the variance of the sum $\hat{\lambda}_1 + \hat{\lambda}_2$ should equal the variance of the original group 2 estimator. This is confirmed via matrix algebra:

$$\text{Var}(\hat{\lambda}_1 + \hat{\lambda}_2) = \mathbf{c}^T \hat{\boldsymbol{\Sigma}} \mathbf{c}$$

where $\mathbf{c} = (1, 1)^T$. This foreshadows the delta method for transformations of parameters.

## Soccer Parameter Standard Errors

Returning to the Premier League scoreline model from Part 08, we compute standard errors for all 40 parameters using the score method.

The likelihood function is modified to return a vector of per-observation log-probabilities (two per match: one for home goals, one for away goals):

```python
def likelihood_function_list(theta, data):
    # Returns vector of log-probabilities, two per match
    ...
```

The score matrix is $N \times 40$, computed via numerical derivatives:

```python
for i in range(n_params):
    eps_vec = np.zeros(n_params)
    eps_vec[i] = eps
    score_mat[:, i] = (likelihood_function_list(theta_out + eps_vec, estimData) -
                       likelihood_function_list(theta_out - eps_vec, estimData)) / (2 * eps)

aVCM = np.linalg.inv(score_mat.T @ score_mat / n_obs_soccer) / n_obs_soccer
seVector = np.sqrt(np.diag(aVCM))
```

For the 20th team (which is constrained by the sum-to-zero restriction), its standard error is computed via the delta method, using the linear combination vector that sums the other 19 team parameters with weight $-1$:

```python
alphaOutSE[19] = np.sqrt(sumAlpha @ aVCM @ sumAlpha)
```

The output provides standard errors for each team's attack ($\alpha$) and defense ($\delta$) parameters, as well as the overall mean ($\mu$) and home advantage ($\eta$) parameters.

## Generalized Linear Models

If the effects on the mean can be expressed as a sum of linear parts, the model can be estimated using a Generalized Linear Model (GLM). The GLM framework handles the non-linear link function automatically.

For the soccer model, we reshape the data so that each match produces two observations (home goals and away goals), with the log-mean of the Poisson specified as a linear combination of an intercept, a home indicator, an attacking team factor, and a defending team factor:

```python
glm_mod = smf.glm(
    'value ~ C(Home) + C(Off, Treatment(reference="Man City")) + C(Def, Treatment(reference="Man City"))',
    data=df,
    family=sm.families.Poisson()
).fit()
```

The GLM automatically computes standard errors, confidence intervals, and the variance-covariance matrix via `model.cov_params()`. The estimates closely match the hand-coded results, with minor differences due to optimization tolerances and different normalizations (the GLM uses a reference category rather than sum-to-zero constraints).

### Verifying Consistency

We can check that the two approaches give the same predictions. For example, Wolves' expected goals at home against Man City from the GLM:

```python
log_wolves_xg = intercept + home_param + wolves_off
```

matches the hand-coded model's prediction:

```python
hand_coded_log = mu + eta + wolves_alpha - mancity_delta
```

up to small numerical differences.

## The Delta Method

Since the model parameters enter through a log-link, quantities of interest like expected goals involve $\exp(\cdot)$ of a linear combination of parameters. To get standard errors for these transformed quantities, we use the delta method:

If $g(\boldsymbol{\theta})$ is a smooth function of parameters with variance-covariance matrix $\boldsymbol{\Sigma}$, then:

$$\text{Var}(g(\hat{\boldsymbol{\theta}})) \approx \nabla g(\hat{\boldsymbol{\theta}})^T \boldsymbol{\Sigma} \nabla g(\hat{\boldsymbol{\theta}})$$

This approximation is valid for large samples and provides a way to construct confidence intervals for any function of the estimated parameters:

```python
xg_val, xg_se = utils.delta_method(wolves_xg_home, theta_out, aVCM)
print(f"95% CI: [{xg_val - 1.96*xg_se:.4f}, {xg_val + 1.96*xg_se:.4f}]")
```

## Interpreting Standard Errors in Non-Linear Models

An important point about MLE in non-linear models: the standard errors are constructed for the parameters themselves, which may not be directly interpretable. The parameters are inputs into a larger model, and reporting a parameter or its standard error only has meaning within the context of the model. To communicate results in a meaningful way, we must transform the parameters into interpretable quantities (like expected goals) and use the delta method to obtain their standard errors.

## Summary

- MLE estimators are consistent, asymptotically normal, and efficient (achieving the Cramer-Rao lower bound)
- These are large-sample properties; MLE can be biased in finite samples
- The Fisher Information Matrix can be computed via the score outer product $\mathbb{E}[\mathbf{s}\mathbf{s}^T]$ or the negative expected Hessian $-\mathbb{E}[\partial^2 l / \partial\theta\partial\theta^T]$
- In practice, we estimate the Information Matrix by plugging in $\hat{\theta}$ and averaging across data points
- The score method is computationally cheaper than the Hessian method for models with many parameters
- Numerical derivatives provide a reliable alternative when analytical derivatives are impractical
- For the Poisson distribution, the asymptotic variance is $\lambda/N$ and the MLE achieves this bound
- Parameterization affects the variance-covariance structure but not the variance of estimable functions (verified via the delta method)
- Generalized Linear Models provide an automated framework that handles standard errors, using `statsmodels`' `smf.glm()` with the appropriate family
- The delta method $\text{Var}(g(\hat{\theta})) \approx \nabla g^T \Sigma \nabla g$ is essential for obtaining standard errors of transformed parameters
