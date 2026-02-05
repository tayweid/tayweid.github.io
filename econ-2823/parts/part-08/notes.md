# Part 08: Maximum Likelihood Estimation

## Introduction

In the previous unit on non-linear least squares and quantile regression, we were relatively agnostic about the distribution of the error term, requiring only that it was conditionally mean-zero and homoskedastic. The non-linearity of those models forced us to solve for optimal parameters numerically, but we did not impose a full probabilistic model on the data.

Maximum Likelihood Estimation (MLE) takes a more structured approach. We assume that we know the parametric form of the data-generating process -- that is, we specify a probability distribution for each observation conditional on the observables and the model parameters. We then choose the parameter values that make the observed data most likely under that assumed distribution.

This unit introduces the likelihood function, derives the MLE for several canonical distributions (normal, Poisson, multinomial, uniform), explains why we work with the log-likelihood in practice, and demonstrates how to code and optimize likelihood functions in Python. We conclude with an extended application estimating a Poisson model for soccer match scorelines, and show how the same model can be estimated using the Generalized Linear Model (GLM) framework.

## Likelihood Modeling

In likelihood-based models, we assume that each data outcome $y_i$ has a known probability distribution, conditional on any observables $\mathbf{x}_i$ and the parameters of the model $\boldsymbol{\theta}$. That is, the observation $y_i$ has a probability distribution represented by some function $f_Y(y_i; \mathbf{x}_i, \boldsymbol{\theta})$.

### Normal Distribution Example

Suppose we assume, as in classical linear regression, that the conditional outcome $Y_i | \mathbf{x}_i$ is normally distributed with mean $\mathbf{x}_i \boldsymbol{\beta}$ and variance $\sigma^2$. Then the density of $Y_i | \mathbf{x}_i$ is:

$$f_Y(y_i) = \phi\left(\frac{y_i - \mathbf{x}_i \boldsymbol{\beta}}{\sigma}\right)$$

For three independent observations, the joint density is the product of the individual densities:

$$\text{Density}(y_1, y_2, y_3) = \phi\left(\frac{y_1 - \mathbf{x}_1 \boldsymbol{\beta}}{\sigma}\right) \cdot \phi\left(\frac{y_2 - \mathbf{x}_2 \boldsymbol{\beta}}{\sigma}\right) \cdot \phi\left(\frac{y_3 - \mathbf{x}_3 \boldsymbol{\beta}}{\sigma}\right)$$

### From Density to Likelihood

As data analysts, we do not observe the true data-generating process -- we only observe the realized data $\mathbf{y} = (y_1, y_2, y_3)$. The likelihood function reverses the perspective: given the observed data, we vary the parameters to find which values make the data most probable.

To simplify, consider a constant-only model with known variance $\sigma = 1$. The likelihood as a function of $\beta_0$ is:

$$L(\beta_0; \mathbf{y}) = \phi(y_1 - \beta_0) \cdot \phi(y_2 - \beta_0) \cdot \phi(y_3 - \beta_0)$$

For data $\mathbf{y} = (1, -1, 3)$, plotting this likelihood over different values of $\beta_0$ reveals a peak at $\hat{\beta}_0 = 1$, which is the sample mean. We can verify this numerically:

```python
from scipy import stats, optimize

def example_likelihood(beta0):
    return stats.norm.pdf(1 - beta0) * stats.norm.pdf(-1 - beta0) * stats.norm.pdf(3 - beta0)

result = optimize.minimize_scalar(lambda b: -example_likelihood(b), bounds=(0, 2), method='bounded')
```

## Log-Likelihoods

When dealing with many independent observations, the likelihood is a product of many small probabilities. This product can become numerically tiny, causing floating-point errors. Moreover, products are unwieldy to differentiate.

The solution is to work with the log-likelihood instead. Since the $\log$ function is strictly increasing on $(0, \infty)$, the parameter values that maximize $L(\theta; y)$ also maximize $\log L(\theta; y)$.

### Transforming the Objective Function

A general principle: if a value $x$ maximizes a function $f(x)$, then it also maximizes $g(f(x))$ for any strictly increasing function $g(\cdot)$. The value of the transformed function differs, but the optimizer does not change.

Applying the logarithm transforms the product into a sum:

$$l(\theta; y) = \log\left(\prod_{i=1}^n \Pr\{y_i; \theta\}\right) = \sum_{i=1}^n \log(\Pr\{y_i; \theta\})$$

This is much better behaved numerically and analytically. In Python:

```python
def example_log_likelihood(beta0):
    return stats.norm.logpdf(1 - beta0) + stats.norm.logpdf(-1 - beta0) + stats.norm.logpdf(3 - beta0)
```

The log-likelihood yields the same maximizer but with a different objective value. We can always recover the likelihood by exponentiating the log-likelihood.

### Analytical Derivation for the Normal Case

For the normal model with known variance, the first-order condition of the log-likelihood simplifies to:

$$\frac{\partial l(\beta_0)}{\partial \beta_0} = \sum_{i=1}^n (y_i - \beta_0) = 0$$

which gives $\hat{\beta}_0 = \bar{y}$, the sample mean. This is a reassuring result.

If we also treat $\sigma$ as unknown, the two first-order conditions yield:

1. $\hat{\beta} = \frac{1}{n} \sum_{i=1}^n y_i = \bar{y}$
2. $\hat{\sigma} = \sqrt{\frac{1}{n} \sum_{i=1}^n (y_i - \bar{y})^2}$

Note that the MLE for $\sigma$ divides by $n$ rather than $n-1$. This means the MLE estimator for $\sigma$ is biased in finite samples (it slightly underestimates the true standard deviation), though it is consistent as $n \to \infty$.

### Numerical Verification

We can verify these analytical results numerically by generating data from a known distribution and maximizing the log-likelihood:

```python
np.random.seed(42)
y = np.random.normal(loc=3, scale=2, size=1000)

def example_log_likelihood_n(theta):
    return np.sum(stats.norm.logpdf(y, loc=theta[0], scale=theta[1]))

mle_est = optimize.minimize(
    lambda theta: -example_log_likelihood_n(theta),
    x0=[0, 1],
    method='BFGS'
)
```

The concentrated likelihood -- the log-likelihood evaluated as a function of one parameter while holding others at their MLE values -- shows a clearly concave shape with a unique maximum, confirming that the optimization landscape is well-behaved for this model.

## Poisson Example

Consider a Poisson model where each data point is a random count $K_i$ with probability:

$$\Pr(K_i = k) = \frac{\lambda^k e^{-\lambda}}{k!}$$

For a sample of iid draws $(k_1, k_2, \ldots, k_N)$, the log-likelihood is:

$$l(\lambda) = \sum_{i=1}^N \left(k_i \cdot \log(\lambda) - \lambda - \log(k_i!)\right)$$

Setting the derivative to zero yields the MLE estimator $\hat{\lambda} = \bar{k}$, the sample average of the counts.

## Multinomial Example

When the random variable $Y_i$ can take $K$ discrete values, the data is summarized by the count $n_k$ for each type. The likelihood is:

$$L(\mathbf{p}) = \frac{n!}{n_1! \cdots n_K!} p_1^{n_1} \cdots p_K^{n_K}$$

The log-likelihood, subject to the constraint $\sum_k p_k = 1$, is:

$$l(\mathbf{p}) = \sum_{k=1}^K n_k \cdot \log(p_k)$$

Solving via Lagrange multipliers yields the intuitive MLE: $\hat{p}_k = n_k / n$, the sample proportion for each type.

## Uniform Example

For uniform draws on $[0, \theta]$, the density is $f(u) = 1/\theta$ for $0 \leq u \leq \theta$. The likelihood is $L(\theta) = \theta^{-n}$ for $\theta \geq \max(u_i)$. Since this is strictly decreasing in $\theta$, the MLE is $\hat{\theta} = \max(u_1, \ldots, u_N)$. This is a case where the MLE is biased (it always underestimates $\theta$), illustrating that MLE does not guarantee unbiasedness in finite samples.

## Adding in Observables

Moving beyond simple parameter estimation, we incorporate conditioning variables into the model. We model the outcome $y_i$ through a linear combination of observables $\mathbf{x}_i \boldsymbol{\beta}$, which then enters non-linearly into the probability distribution. This is the framework of generalized linear models.

### Poisson with Observable Groups

Suppose we observe count data $(k_i, g_i)$ where $g_i$ indicates group membership. We model each group's mean as $\lambda_g = \lambda_0 + \delta_g$. The log-likelihood is:

$$l(\lambda_0, \delta_1, \ldots, \delta_G) = \sum_{i=1}^N \left(k_i \log(\lambda_0 + \delta_{g_i}) - (\lambda_0 + \delta_{g_i}) - \log(k_i!)\right)$$

However, the first-order conditions reveal an identification problem: the FOC for $\lambda_0$ is linearly dependent on the sum of the group-specific FOCs. We have $G$ equations in $G+1$ unknowns, so the parameters are not uniquely determined. This is analogous to the multicollinearity problem in linear regression with too many dummy variables.

The solution is to impose a normalization: either set one group's deviation to zero, or enforce $\sum_g \delta_g = 0$ so that the parameters represent deviations around the overall average.

Non-identifiability is harder to diagnose in non-linear models than in linear ones. Numerical optimizers will not necessarily warn you; instead, the problem manifests as failure to converge or estimates that depend on starting values.

## Estimation Example: Soccer Scorelines

The soccer scorelines application provides a rich example of Poisson MLE with many parameters. The model specifies that team $i$'s goal count against team $j$ follows a Poisson distribution with parameter:

- $\lambda_{ij} = \exp(\mu + \eta + \alpha_i - \delta_j)$ if $i$ is the home team
- $\lambda_{ij} = \exp(\mu + \alpha_i - \delta_j)$ if $i$ is the away team

where $\mu$ is the average goals parameter, $\eta$ is the home advantage, $\alpha_i$ is team $i$'s attacking strength, and $\delta_j$ is team $j$'s defensive strength.

The log-probability for $k$ goals simplifies to:

$$\log(\Pr\{k; \lambda_{ij}\}) = k \cdot \log(\lambda_{ij}) - \lambda_{ij} - \log(k!)$$

### Identification

This model has double identification problems: we can shift $\mu$ and redistribute the change to all $\alpha_i$ terms, and similarly for $\delta_j$ terms. The resolution is to impose sum-to-zero constraints: $\sum_i \alpha_i = 0$ and $\sum_j \delta_j = 0$, so each team-specific parameter is a deviation from the average.

### Coding the Likelihood

The implementation uses Premier League match data. The parameter vector $\theta$ has 40 elements: 19 alpha/delta pairs for teams 1-19 (with the 20th team implied by the sum-to-zero constraint), plus $\mu$ and $\eta$.

```python
def likelihood_function(theta):
    alpha = np.zeros(n_teams)
    delta = np.zeros(n_teams)
    for i in range(19):
        alpha[i] = theta[2*i]
        delta[i] = theta[2*i + 1]
    alpha[19] = -np.sum(alpha[:19])
    delta[19] = -np.sum(delta[:19])

    mu = theta[38]
    eta = theta[39]

    lambda_H = mu + eta + alpha[H] - delta[A]
    lambda_A = mu + alpha[A] - delta[H]

    prob = (home_goals * lambda_H - np.exp(lambda_H) - log_fact_hg +
            away_goals * lambda_A - np.exp(lambda_A) - log_fact_ag)

    return np.sum(prob)
```

Maximization uses `scipy.optimize.minimize` with the BFGS method, negating the function since `minimize` finds minima:

```python
result = optimize.minimize(
    lambda theta: -likelihood_function(theta),
    theta0,
    method='BFGS'
)
```

The resulting estimates yield expected goals (XG) and expected goals against (XGA) for each team. Plotting XGA versus XG positions teams in an attack-defense space, with the best teams appearing in the upper-left (high attack, low goals conceded).

## Comparison with GLM Poisson

The same Poisson scoreline model can be estimated using `statsmodels` GLM with a Poisson family. This requires reshaping the data so that each match produces two observations (one for each team's goals), with the log-mean specified as a linear combination of team and opponent indicators plus a home dummy:

```python
glm_model = sm.GLM(y_glm, X_glm, family=sm.families.Poisson()).fit()
```

The GLM estimates closely match the hand-coded MLE results, with any small differences attributable to optimization tolerances. The home advantage parameter is directly comparable between the two approaches.

## Summary

- Maximum likelihood estimation assumes a known parametric distribution for the data and finds parameter values that maximize the probability of the observed data
- The log-likelihood transforms the product of probabilities into a sum, improving numerical stability and analytical tractability
- For the normal distribution, MLE yields $\hat{\beta} = \bar{y}$ and $\hat{\sigma} = \sqrt{\frac{1}{n}\sum(y_i - \bar{y})^2}$, with the latter biased in finite samples
- The Poisson MLE is $\hat{\lambda} = \bar{k}$; the multinomial MLE is $\hat{p}_k = n_k/n$
- Identification requires that different parameter values lead to different distributions; normalization constraints resolve identification problems
- In Python, maximize log-likelihoods by negating and using `scipy.optimize.minimize`
- Generalized linear models (GLM) via `statsmodels` provide an automated framework for Poisson and other likelihood-based models
- R's `optim()` uses `fnscale=-1` for maximization; Python's `scipy.optimize.minimize()` always minimizes, so we negate the objective
