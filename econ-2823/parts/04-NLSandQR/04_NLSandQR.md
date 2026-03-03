# Part 06: Non-linear Least Squares and Quantile Regression

## Introduction

In standard OLS estimation, we model the conditional expectation of an outcome as a linear function of the parameters, and we focus on the mean of the conditional distribution. These assumptions are convenient because they yield closed-form solutions for the parameter estimates. However, many real-world relationships are inherently non-linear, and the mean may not always be the quantity of interest.

This unit introduces two estimation methods that relax these constraints. Non-linear Least Squares (NLS) allows us to specify models where the parameters enter in a non-linear fashion, such as through ratios, exponentials, or other functional forms. Quantile Regression allows us to estimate conditional quantiles of the outcome distribution rather than just the mean, enabling us to understand how the effects of covariates differ across the distribution.

In both cases, we lose the closed-form solutions available in OLS and must instead rely on numerical optimization to find the parameter estimates. We will walk through the objectives that each method minimizes, how to set up and use numerical optimizers in Python, and how to use dedicated library functions that streamline these estimations.

## Non-linear Least Squares

The setup for NLS is similar to ordinary least squares. We have an outcome $y_i$ we seek to explain and a set of $k$ explanatory variables $\mathbf{x}_i = (x_{i,1}, x_{i,2}, \ldots, x_{i,k})$. As in OLS, we are estimating the conditional expectation of $y$ given $\mathbf{x}_i$, but now we specify that this conditional mean has a non-linear relationship:

$$\mathbb{E}(y|\mathbf{x}) = f(\mathbf{x})$$

where the function $f(\cdot)$ has $j$ unknown parameters $\boldsymbol{\beta} = (\beta_0, \beta_1, \ldots, \beta_j)$. Similar to OLS, we assume an additive error $\epsilon_i$ for each observation:

$$y_i = f(\mathbf{x}; \boldsymbol{\beta}) + \epsilon_i$$

where $\epsilon_i$ is a mean-zero disturbance with variance $\sigma^2$.

### The Logistic Growth Example

As an example, suppose we want to estimate the growth of a user base across time $t$. We fit the data to a logistic function:

$$f(t) = \frac{\alpha}{1 + \gamma \exp(-\lambda t)}$$

This function captures a pattern of slow initial growth, a period of rapid growth, and then a leveling off toward an asymptote. The three parameters are: $\alpha$, the long-run asymptote (the maximum user count as $t \to \infty$); $\gamma$, which controls the initial position of the curve; and $\lambda$, the growth rate.

```python
def logistic_f(t, alpha, gamma, lam):
    """Logistic growth function."""
    return alpha / (1 + gamma * np.exp(-lam * t))
```

We apply this model to data on the growth of active Twitter users in the US.

```python
twitter_us = pd.read_csv('social/TwitterUsers.csv')
```

The plot of this data shows the characteristic S-curve shape that motivates the logistic specification.

### The NLS Objective

We estimate the parameters by minimizing the total sum of squares, just as in OLS:

$$\text{Sum of Squares}(\boldsymbol{\beta}) = \sum_i \left(y_i - \frac{\alpha}{1 + \gamma \exp(-\lambda t)}\right)^2$$

We seek the estimated value $\hat{\boldsymbol{\beta}} = (\alpha, \gamma, \lambda)$ that minimizes this expression. Unlike OLS, there is no closed-form solution, so we must use numerical optimization.

```python
def nls_objective(beta):
    """Sum of squared residuals for the logistic model."""
    predicted = beta[0] / (1 + beta[1] * np.exp(-beta[2] * twitter_us['t'].values))
    return np.sum((twitter_us['TwitterActiveUS'].values - predicted)**2)
```

### Choosing Starting Values

Numerical optimizers require initial parameter guesses. Good starting values are critical for convergence. We can use our understanding of the model to calibrate these. Since $\alpha$ represents the asymptotic user count, we set it near the last observed value. At $t = 0$, the model gives $f(0) = \alpha / (1 + \gamma)$, which we can invert to get a guess for $\gamma$. Finally, the inflection point of the logistic function occurs at $t = \log(\gamma)/\lambda$, which we can use to guess $\lambda$.

```python
alpha0 = 69
gamma0 = alpha0 / 9 - 1
lambda0 = np.log(gamma0) / 10
```

### Running the Estimation

We use `scipy.optimize.minimize` with the Nelder-Mead method:

```python
from scipy.optimize import minimize

result = minimize(fun=nls_objective, x0=[alpha0, gamma0, lambda0], method='Nelder-Mead')
estimated_params = result.x
```

The resulting model gives us a forecast function for Twitter's active US users:

$$f(t) = \frac{68.39}{1 + 7.53 \, e^{-0.219 \cdot t}}$$

The fitted curve overlaid on the data shows an excellent fit, with the model capturing both the early growth phase and the leveling off in later periods.

## Standard Errors and Inference

Inference for NLS models is analogous to OLS. We can compute standard errors, confidence intervals, and prediction intervals. These rely on asymptotic approximations and Taylor expansions. The variance-covariance matrix for the parameter estimates is computed via the Jacobian of the model function:

$$\hat{\text{Var}}(\hat{\boldsymbol{\beta}}) = \hat{\sigma}^2 (G G')^{-1}$$

where $G$ is the matrix of numerical partial derivatives of $f$ with respect to each parameter, evaluated at each data point.

```python
eps = 1e-8
g = np.zeros((3, n))
for j in range(3):
    beta_plus = estimated_params.copy()
    beta_plus[j] += eps
    g[j, :] = (nls_f_vec(beta_plus) - nls_f_vec(estimated_params)) / eps

D_mat = sigma_hat_sq * np.linalg.inv(g @ g.T)
```

Predictions and their confidence intervals can be constructed using analytical derivatives of $f$ with respect to the parameters combined with the variance-covariance matrix. This approach, a preview of the delta method, yields both a confidence interval for the model (uncertainty in the estimated curve) and a prediction interval (uncertainty in individual future observations).

### Using `scipy.optimize.curve_fit`

Python provides a dedicated function for NLS estimation that handles much of this machinery automatically:

```python
from scipy.optimize import curve_fit

popt, pcov = curve_fit(
    logistic_f,
    twitter_us['t'].values,
    twitter_us['TwitterActiveUS'].values,
    p0=[alpha0, gamma0, lambda0]
)
```

The `curve_fit` function returns both the optimized parameters `popt` and their covariance matrix `pcov`, from which standard errors and confidence intervals are easily computed.

### Model Misspecification

A key warning with NLS is that inference is conducted under the maintained assumption that the functional form is correct. If the model is misspecified, the parameter estimates and their standard errors may be misleading. This is illustrated by fitting the logistic model to Snapchat user growth data, where the data does not exhibit enough curvature to identify all parameters well. The objective function becomes flat over wide ranges of the asymptote parameter $\alpha$, leading to very large standard errors and poor identification.

When we enrich the model by adding an intercept parameter:

$$f(t) = c + \frac{\alpha}{1 + \gamma \exp(-\lambda t)}$$

the Twitter data still produces well-identified estimates, but the Snapchat data does not. Multiple rounds of optimization from different starting points yield very different parameter estimates that fit the in-sample data nearly identically but produce wildly divergent out-of-sample predictions. This underscores the importance of having sufficient variation in the data to identify non-linear features of the model.

## Direct Transformations

Some non-linear models can be linearized through variable transformations, avoiding the need for NLS entirely. The Cobb-Douglas production function is a classic example:

$$y = \beta \cdot C^\gamma L^{1-\gamma}$$

Taking logarithms yields a linear model:

$$\log(y) = \log(\beta) + \gamma \log(C) + (1 - \gamma) \log(L)$$

This can be estimated directly with OLS on the transformed variables. However, the logistic growth model cannot be similarly transformed, which is why the non-linear approach is necessary.

## Quantile Regression

### The Idea

Standard OLS estimates the conditional mean $\mathbb{E}(y|\mathbf{x})$. But what if we want to estimate other features of the conditional distribution? Quantile regression allows us to estimate the conditional $\tau$-th quantile of the outcome $y$ as a function of $\mathbf{x}$. For instance, the median (50th percentile), the bottom 10th percentile, or the top 1st percentile.

### OLS vs. Quantile Regression Objectives

The two methods differ in the loss function they minimize:

- **OLS**: Minimize $\sum_i (y_i - \mathbf{x}_i \boldsymbol{\beta})^2$ -- the squared loss
- **LAD (Median)**: Minimize $\sum_i |y_i - \mathbf{x}_i \boldsymbol{\beta}|$ -- the absolute loss

The squared loss penalizes large errors disproportionately, pulling the estimate toward the mean. The absolute loss treats all errors equally in magnitude, producing the median.

### Why Absolute Loss Gives the Median

Consider the absolute loss function. Any change in the parameter has offsetting effects from points to the left and right. At the optimum, the errors are balanced so that the fitted value sits at the median of the data. This insight generalizes: by making the loss function asymmetric, we can target any quantile.

### The General Objective

The quantile regression loss function for the $\tau$-th quantile is:

$$\rho_\tau(u) = \begin{cases} -u \cdot (1-\tau) & \text{if } u < 0 \\ u \cdot \tau & \text{if } u \geq 0 \end{cases}$$

We then find the parameter vector $\boldsymbol{\beta}$ that minimizes:

$$\sum_i \rho_\tau(y_i - \mathbf{x}_i \boldsymbol{\beta})$$

When $\tau = 0.5$, the two sides of the loss function are symmetric, and we recover the median. When $\tau = 0.25$, the left side is three times steeper than the right, so the optimal fit places three times as many points above the line as below it, targeting the 25th percentile.

### Implementation in Python

We use `statsmodels.regression.quantile_regression.QuantReg` to estimate quantile regressions. The application examines house sale prices as a function of year and month of sale:

```python
from statsmodels.regression.quantile_regression import QuantReg

house_sales = pd.read_csv('real_estate/sales_all.csv')
valid_sales = house_sales[house_sales['SALEDESC'] == 'VALID SALE'].copy()

# Prepare variables
X_ols = pd.get_dummies(valid_sales[['y', 'm']], drop_first=True).astype(float)
X_ols = sm.add_constant(X_ols)
y_price = valid_sales['price'].values

# Median regression
qr_median = QuantReg(y_price, X_ols).fit(q=0.5)
```

### Comparing OLS and Median Regression

When we compare OLS predictions (which target the mean) with median regression predictions, we often see different patterns. In the house price application, the month effects differ between the two models because the price distribution is skewed. The mean is pulled by expensive outlier sales, while the median is more robust.

The plot of month effects for year 2019 shows that both OLS and the median regression detect summer premiums, but the magnitudes differ.

### Estimating Other Quantiles

One of the strengths of quantile regression is the ability to examine how effects vary across the distribution:

```python
qr_90 = QuantReg(y_price, X_ols).fit(q=0.9)
qr_99 = QuantReg(y_price, X_simple).fit(q=0.99)
```

Comparing the 10th, 25th, 50th, 75th, and 90th percentile regressions reveals whether the summer premium is consistent across the price distribution. For higher-value houses (the top decile), the seasonal pattern may be quite different from the median house.

### Interpretation Issues

There are important subtleties in interpreting quantile regression results. The estimated coefficients describe how the conditional quantile varies across different levels of the covariates, not the marginal effect for a person at a particular quantile.

For example, a quantile regression of wages on education at $\tau = 0.5$ tells us:

$$\beta_1 = \frac{\partial \text{Median}(\text{wage} | \text{Educ})}{\partial \text{Educ}}$$

This is the change in the conditional median wage as we compare groups with different education levels. It does not tell us how a particular median-wage person would respond to more education.

This distinction matters because, unlike the mean, quantiles do not obey the law of iterated expectations. With OLS, the conditional mean effect equals the unconditional mean effect:

$$\mathbb{E}[\mathbb{E}(Y|X)] = \mathbb{E}(Y)$$

No analogous result holds for quantiles, so the interpretation of quantile regression coefficients requires more care.

## Summary

- Non-linear Least Squares (NLS) extends OLS to models where parameters enter non-linearly, using the same sum-of-squares objective but requiring numerical optimization
- Good starting values are critical for NLS convergence; use model structure to calibrate initial guesses
- `scipy.optimize.curve_fit` provides a convenient interface for NLS that returns both parameter estimates and their covariance matrix
- Model misspecification is a greater concern in NLS because poor identification can produce parameter estimates that fit in-sample but diverge wildly out-of-sample
- Some non-linear models (e.g., Cobb-Douglas) can be linearized through transformations, but others (e.g., logistic growth) cannot
- Quantile regression estimates conditional quantiles rather than the conditional mean, using an asymmetric loss function $\rho_\tau$
- The `QuantReg` class in statsmodels implements quantile regression in Python
- Quantile regression coefficients describe how the conditional quantile varies across covariate levels, which differs from the unconditional quantile treatment effect
- Both NLS and quantile regression require numerical optimization because they lack closed-form solutions
