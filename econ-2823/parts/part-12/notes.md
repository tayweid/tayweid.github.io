# Part 12: Generalized Linear Models

## Introduction

Generalized Linear Models (GLMs) provide a unified framework for modeling outcomes that follow a variety of probability distributions, not just the Normal distribution assumed by ordinary least squares. The key insight of GLMs is that we can maintain a linear-in-parameters specification for how covariates affect the outcome, while allowing the outcome to follow distributions like Poisson, Binomial, Gamma, or others, by introducing a link function that connects the linear predictor to the mean of the distribution.

This unit covers the three core ingredients of any GLM: the probability family (which governs the mean-variance relationship), the linear predictor (which specifies how covariates enter the model), and the link function (which transforms the mean into something that can be modeled linearly). We work through the Poisson GLM in detail, including how to interpret coefficients, fitted values, and linear predictors. We also introduce binomial/logistic regression as a GLM, and cover deviance-based model comparison.

Understanding GLMs is essential because they allow us to properly model count data, binary outcomes, and other non-normal responses while preserving the familiar structure of regression analysis. The framework also makes clear why coefficients in non-linear models cannot be directly interpreted as marginal effects -- a theme that becomes central in subsequent units on binary and ordered outcomes.

## GLM: Families of Distribution

To ensure well-behaved estimation, GLMs restrict attention to the exponential family of distributions, which provides a clean link between the mean and variance. The members of this family include:

- **Gaussian/Normal** distributions (standard real-valued data)
- **Exponential** distribution (positive real values)
- **Poisson** distributions (count data)
- **Binomial** distributions (counts from a fixed and known $n$; the special case $n=1$ is a Bernoulli)
- **Multinomial** distributions (factor outcomes)
- **Gamma** distributions (positive real values; includes $\chi^2$ and exponential as special cases)
- **Inverse Gaussian** (positive real values, used in some finance applications)

Each family has a specific mean-variance relationship that is exploited during estimation to set up the likelihood efficiently.

## GLM: The Parameter Model

The parameter model in a GLM is identical in form to a standard linear model. Given an observable vector of $k$ conditioning variables $\mathbf{x}_i$ for each observation $i$, the model specifies a linear predictor:

$$\eta_i = \mathbf{x}_i^T \boldsymbol{\beta} = \sum_k \beta_k x_{ik}$$

where $\boldsymbol{\beta}$ is a vector of $k$ parameters to be estimated. A constant (intercept) can be included within this formulation as usual.

However, unlike in OLS, the linear predictor $\eta_i$ does not directly estimate the mean of the outcome variable. The connection between $\eta_i$ and the mean $\mu_i$ is established through the link function.

## GLM: The Link Function

The link function $g(\cdot)$ specifies how the mean of the outcome relates to the linear predictor:

$$\mathbf{x}_i^T \boldsymbol{\beta} = g(\mu_i)$$

Because the link function must be invertible, we can equivalently write:

$$\mu_i = g^{-1}(\mathbf{x}_i^T \boldsymbol{\beta})$$

An important point: the distribution of the response variable $y_i$ is not being transformed. The chosen distribution (Poisson, Normal, Binomial, etc.) applies directly to $y_i$. If the link is the log function, we are not modeling $\log(y)$ -- we are modeling the log of the expected value of $y$.

For example, in the Poisson soccer model from earlier units, the mean goals $\lambda_{ij}$ was modeled as:

$$\lambda_{ij} = \exp(\mu_0 + \mu_H + \alpha_i - \delta_j)$$

The log link $g(\lambda) = \log(\lambda)$ gives us an additive model for the parameters, where each term has a multiplicative effect on the mean:

$$\lambda = e^{\mu_0} \cdot e^{\mu_H} \cdot e^{\alpha_i} \cdot e^{-\delta_j}$$

### Common Link Functions

The three most commonly used link functions are:

- **Identity**: $g(\mu) = \mu$ (directly modeling the mean)
- **Log**: $g(\mu) = \log(\mu)$ (modeling multiplicative effects on the mean)
- **Logit**: $g(\mu) = \log\left(\frac{\mu}{1-\mu}\right)$ (modeling multiplicative effects on an odds ratio)

For probability models, we also use the **probit** link function $\Phi^{-1}(p)$, the inverse of the standard Normal CDF.

### Standard Link Functions by Family

| Probability Family | Standard Link | Other Links |
|---|---|---|
| Normal/Gaussian | Identity: $\mu$ | |
| Poisson | Log: $\log(\mu)$ | Identity, square-root |
| Binomial | Logit: $\log\left(\frac{\mu}{1-\mu}\right)$ | Probit, complementary log-log |
| Gamma | Inverse: $\frac{1}{\mu}$ | Identity, log |

## GLM Notation

Standard notation (consistent with the statsmodels documentation) uses:

- $\eta_i$ ("eta") for the linear predictor: $\eta_i = \mathbf{x}_i^T \boldsymbol{\beta}$
- Fitted values are the estimated means: $\hat{\mu}_i = g^{-1}(\hat{\eta}_i)$

## Example: Poisson Model for Household Children

We set up a Poisson model for the number of children in a household:

$$\lambda_i = \exp\left(\beta_0 + \beta_1 \delta_{\text{married}} + \beta_2 \log(\text{income})\right) = \exp(\eta_i)$$

The true parameter values are $\beta_0 = -5.5$, $\beta_1 = 1$, $\beta_2 = 0.5$. We generate data and estimate:

```python
X = pd.DataFrame({
    'married': data_pois['married'].astype(float),
    'log_hh_income': np.log(data_pois['hh_income'])
})
X = sm.add_constant(X)

glm_output = sm.GLM(data_pois['children'], X, family=sm.families.Poisson()).fit()
```

The fitted values (the $\lambda_i$ means) and linear predictors (the $\eta_i$ terms) are related by:

- Linear predictor: $\hat{\eta}_i = \hat{\beta}_0 + \hat{\beta}_1 \cdot \text{married}_i + \hat{\beta}_2 \cdot \log(\text{income}_i)$
- Fitted values: $\hat{\lambda}_i = \exp(\hat{\eta}_i)$

These can be accessed as `glm_output.fittedvalues` and computed manually as `X @ glm_output.params`.

## Interpreting GLM Coefficients

Unlike in a linear model, the effect of the estimated parameters on the expected outcome is not constant and cannot be directly read from the GLM output. The significance stars and p-values tell us that a variable has a statistically significant effect on the model (that we can reject the parameter being zero), but to understand the magnitude of the effect, we need to work through the link function.

For the Poisson model with a log link, the effect of being married is a multiplier given by $\exp(\hat{\beta}_{\text{married}})$. The level effect depends on the other covariates. To see this concretely, we compute:

$$\Delta\lambda = \lambda(\text{married}, \text{income}) - \lambda(\text{single}, \text{income})$$

```python
def delta_lambda(income):
    return (np.exp(beta_hat['const'] + beta_hat['married'] + beta_hat['log_hh_income'] * np.log(income))
          - np.exp(beta_hat['const'] + beta_hat['log_hh_income'] * np.log(income)))
```

A plot of this function against income shows that the marriage effect increases with income -- because the multiplicative effect operates on a larger base. This non-constant marginal effect is a fundamental feature of non-linear models.

## Deviance and Model Comparison

The deviance in a GLM plays a role analogous to the residual sum of squares in OLS. It measures the discrepancy between the fitted model and a saturated model (one with a parameter for every observation):

$$D = 2\left[\log L(\text{saturated}) - \log L(\hat{\beta})\right]$$

We can use deviance to compare nested models, similar to an F-test in linear regression. The difference in deviance between a restricted and unrestricted model follows a $\chi^2$ distribution under the null hypothesis:

```python
dev_diff = glm_restricted.deviance - glm_output.deviance
p_value = 1 - stats.chi2.cdf(dev_diff, df=1)
```

Key model attributes in Python include `model.params` (coefficients), `model.bse` (standard errors), `model.deviance`, `model.aic`, and `model.llf` (log-likelihood).

## Binomial / Logistic Regression as a GLM

Another extremely common GLM is the binomial model with a logit link, known as logistic regression. It is used when the outcome is binary (0 or 1). The logit link function is:

$$g(p) = \log\left(\frac{p}{1-p}\right)$$

So the model is:

$$\log\left(\frac{p_i}{1-p_i}\right) = \mathbf{x}_i^T \boldsymbol{\beta}$$

Or equivalently:

$$p_i = \frac{\exp(\mathbf{x}_i^T \boldsymbol{\beta})}{1 + \exp(\mathbf{x}_i^T \boldsymbol{\beta})}$$

In Python:

```python
X_binom = sm.add_constant(data_binom[['age', 'log_income']])
glm_binom = sm.GLM(data_binom['outcome'], X_binom, family=sm.families.Binomial()).fit()
```

The coefficients do not directly give marginal effects on the probability. Instead, they give effects on the log-odds. The exponentiated coefficient $\exp(\beta_k)$ gives the odds ratio -- the multiplicative change in the odds for a one-unit increase in $x_k$. Predicted probabilities can be obtained with `model.predict()`.

## Summary

- GLMs unify regression for Normal, Poisson, Binomial, Gamma, and other exponential family distributions.
- The three ingredients are: probability family, linear predictor $\eta_i = \mathbf{x}_i^T \boldsymbol{\beta}$, and link function $g(\mu) = \eta$.
- The link function transforms the mean, not the response variable itself.
- Coefficients cannot be directly interpreted as marginal effects in non-linear GLMs; they describe effects on the transformed scale (e.g., log-mean for Poisson, log-odds for logistic).
- The `sm.GLM` function in statsmodels provides a consistent interface across families, but requires manually adding a constant with `sm.add_constant()`.
- Deviance provides a measure of model fit analogous to RSS, and deviance differences can be used for nested model comparisons via the chi-squared distribution.
- AIC, BIC, and log-likelihood are standard tools for comparing GLM specifications.
