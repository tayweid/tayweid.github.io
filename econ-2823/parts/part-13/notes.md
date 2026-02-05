# Part 13: Binary Outcomes

## Introduction

This unit focuses on modeling binary outcome variables -- situations where the dependent variable takes only the values 0 or 1. While the linear probability model (LPM) provides a simple starting point, it has fundamental limitations: it can produce predicted probabilities outside the [0, 1] range and imposes constant marginal effects. The logit and probit models address these issues by using non-linear link functions that map the linear predictor into a valid probability.

We develop the logit model through two perspectives. The first is the GLM perspective, where we model the log-odds ratio as linear in the covariates. The second is the latent variable perspective, where an unobserved continuous variable determines the observed binary outcome. These two perspectives are mathematically equivalent for the logit model when the latent variable has a logistic error distribution, and for the probit model when the error is Normal. The latent variable interpretation connects naturally to the economic concept of utility, which provides a behavioral foundation for discrete choice models.

The unit also covers practical application with NFL field goal data, the concept of marginal effects (both at the means and average marginal effects), and model comparison between logit, probit, and linear probability specifications.

## The Logit Model

The expected value of a binary outcome is simply the probability $p$ that it takes value 1. The logit link function models the log-odds ratio as linear in the covariates:

$$\eta = \log\left(\frac{p}{1-p}\right) = \log\left(\frac{\Pr\{X=1\}}{\Pr\{X=0\}}\right)$$

By specifying a linear model $\eta_i = x_i^T \beta$ for the log-odds ratio, we are modeling the odds ratio as a product of exponential terms:

$$\frac{p}{1-p} = \exp(x_i^T \beta) = e^{\beta_0} e^{\beta_1 x_{i1}} \cdots e^{\beta_k x_{ik}}$$

Inverting the log-odds ratio gives the probability directly:

$$\Pr\{X = 1\} = p = \frac{\exp(x_i^T \beta)}{1 + \exp(x_i^T \beta)}$$

This is the logistic function (also called the sigmoid function), which maps any real-valued linear predictor into the interval $(0, 1)$.

## Simulated Data: Multiple Car Ownership

We generate data with a binary outcome (owning multiple cars), a binary predictor (married), and a continuous predictor (household income). The true model is:

$$\eta_i = -2.5 + 2.0 \cdot \delta_{\text{married}} + 0.5 \cdot x_{2i}$$

where $x_{2i}$ is drawn from a normal distribution (and later transformed to household income).

```python
p_mean = special.expit(eta)  # logistic function
binary_outcome = np.random.binomial(1, p_mean)
```

We estimate the logit model using `sm.Logit`:

```python
X_logit = sm.add_constant(data_bernoulli[['married', 'log_income']])
logit_model = sm.Logit(y, X_logit).fit(disp=0)
beta_binom = logit_model.params
```

## Interpreting Logit Coefficients via Odds Ratios

The estimated coefficients describe effects on the log-odds scale. Exponentiating them gives the odds ratio. For the multiple car ownership example, the estimated odds ratio relationship is:

$$\frac{\Pr\{\text{Multiple cars}\}}{\Pr\{\text{Not multiple cars}\}} = \exp(\hat{\beta}_0) \cdot \exp(\hat{\beta}_1 \cdot \delta_{\text{married}}) \cdot \exp(\hat{\beta}_2 \cdot \log(\text{income}))$$

Odds ratios are more intuitive to communicate. For example, at 100k income, a married household might have odds 3:1 in favor of multiple cars, while a single household might have odds roughly 1:2.

To convert odds ratios to probabilities:

$$p = \frac{\exp(\eta)}{1 + \exp(\eta)}$$

In Python, this is `scipy.special.expit(eta)`.

## The Latent Variable Interpretation and Link Functions

An alternative view treats the binary outcome as a limited observation of a continuous latent variable:

$$y_i^* = x_i^T \beta + \epsilon_i$$

We observe only:

$$y_i = \begin{cases} 1 & \text{if } y_i^* \geq 0 \\ 0 & \text{if } y_i^* < 0 \end{cases}$$

The probability of a positive outcome is then:

$$\Pr\{y_i = 1\} = \Pr\{\epsilon_i \geq -x_i^T \beta\} = 1 - F_\epsilon(-x_i^T \beta)$$

where $F_\epsilon$ is the CDF of $\epsilon_i$. This reveals that different link functions correspond to different distributional assumptions on the error term:

- **Logit model**: $\epsilon_i$ has a logistic distribution with CDF $F(z) = \frac{1}{1 + e^{-z}}$
- **Probit model**: $\epsilon_i$ has a standard Normal distribution with CDF $\Phi(z)$

The logistic and Normal distributions are remarkably similar, especially near the center. The standard logistic has variance $\pi^2/3$, and when a Normal is matched to the same variance, the two distributions are nearly indistinguishable.

### The Utility Framework

The latent variable approach connects naturally to economic utility theory. We interpret $y_i^*$ as the utility difference between choosing option $A$ (coded as 1) and option $B$ (normalized to 0):

$$\text{Utility}(A) = x_i^T \beta + \epsilon_i > 0 = \text{Utility}(B)$$

The model term $x_i^T \beta$ captures the average utility difference based on observables, while $\epsilon_i$ represents idiosyncratic (unobserved) utility. Because utility is ordinal (only relative comparisons matter), scale and normalization are not identified -- we can set the error variance to 1 and the baseline utility to 0.

## The Probit Model

The probit model assumes Normal errors in the latent variable formulation. It is estimated using:

```python
probit_model = sm.Probit(y, X_logit).fit(disp=0)
```

The predicted probability under the probit model is:

$$\Pr\{y_i = 1\} = \Phi(x_i^T \hat{\beta})$$

where $\Phi$ is the standard Normal CDF. While the probit and logit produce different coefficient values (because the underlying distributions have different scales), the predicted probabilities are typically very similar, especially in the interior of the probability range.

Both models map the linear predictor $\eta \in (-\infty, \infty)$ into a probability in $[0, 1]$, producing the characteristic S-shaped response curve. This contrasts with the linear probability model, which produces a straight line that can extend beyond $[0, 1]$.

## Application: NFL Field Goal Data

We apply these models to NFL field goal data (2009-2019), modeling the probability of a successful kick as a function of distance (yardline). After filtering blocked kicks:

```python
X_fg = sm.add_constant(FG_not_blocked['yardline_100'])
good_kick_logit = sm.Logit(y_fg, X_fg).fit(disp=0)
good_kick_probit = sm.Probit(y_fg, X_fg).fit(disp=0)
good_kick_lm = sm.OLS(y_fg, X_fg).fit()
```

All three models (LPM, logit, probit) give similar predictions in the range where most data exists (roughly 18-48 yards). However, the LPM predicts probabilities greater than 1 for short kicks and negative probabilities for very long attempts, while the logit and probit are always bounded in $[0, 1]$.

To capture the sharp drop-off in success probability beyond 40 yards, we add a piecewise-linear term:

```python
FG_not_blocked['yards_over_40'] = np.where(FG_not_blocked['yardline_100'] > 40,
                                            FG_not_blocked['yardline_100'] - 40, 0)
```

This dramatically improves model fit for long-distance attempts, and the non-linear models handle the transition more gracefully than the LPM, which can still produce incoherent predictions at extreme distances.

## Marginal Effects

Because logit and probit models are non-linear, the effect of a one-unit change in a covariate on the predicted probability depends on the values of all covariates. This is in contrast to the LPM, where coefficients are directly interpretable.

For a continuous variable $x_1$ in the logit model, the marginal effect is:

$$\frac{\partial p}{\partial x_1} = \frac{\beta_1 \cdot \exp(\eta)}{(\exp(\eta) + 1)^2} = \beta_1 \cdot p \cdot (1-p)$$

This is largest when $p = 0.5$ (where the logistic curve is steepest) and smallest near 0 or 1.

### Marginal Effects at the Means

One approach evaluates the marginal effect at the sample averages of all covariates:

$$\left.\frac{\partial p}{\partial x_1}\right|_{\bar{x}_1, \bar{x}_2} = \frac{\beta_1 \cdot \exp(\bar{\eta})}{(\exp(\bar{\eta}) + 1)^2}$$

For a binary variable, the marginal effect is a discrete change:

$$\Pr\{y = 1 | x_1 = 1, \bar{x}_2\} - \Pr\{y = 1 | x_1 = 0, \bar{x}_2\}$$

### Average Marginal Effects

A preferred approach computes the marginal effect for every observation and then averages:

$$\text{AME} = \frac{1}{n} \sum_{i=1}^{n} \left.\frac{\partial p_i}{\partial x_1}\right|_{x_{i1}, x_{i2}}$$

This is computed in Python as:

```python
p_hat = special.expit(linear_pred)
logistic_pdf = p_hat * (1 - p_hat)
ame_yardline = np.mean(logistic_pdf * beta['yardline_100'])
```

For the field goal model with a high-pressure variable, the AME for yardline distance is approximately -0.012 (each additional yard reduces success probability by about 1.2 percentage points on average), and the AME for high-pressure situations is approximately -0.073 (a 7.3 percentage point reduction).

Standard errors for marginal effects can be computed using the delta method.

## Model Comparison

Logit and probit models for the field goal data produce nearly identical predictions, as expected. They can be compared using log-likelihood, AIC, BIC, and pseudo R-squared. The average marginal effects are typically very similar between the two specifications, reinforcing that the choice between logit and probit is primarily one of convenience and interpretability rather than substantive modeling.

## Summary

- Binary outcomes are modeled using logit (logistic distribution for errors) or probit (Normal distribution for errors) models.
- The logit model provides interpretable odds ratios via exponentiated coefficients.
- The latent variable interpretation connects binary choice to utility theory, where the error distribution determines the link function.
- The LPM provides easy-to-read coefficients but can produce probabilities outside $[0, 1]$.
- Logit and probit give very similar predictions in practice; the choice is often a matter of convention.
- Marginal effects must be computed through the model because the coefficient alone does not give the effect on probability.
- Average marginal effects (AMEs) are generally preferred over marginal effects at the means.
- The delta method can be used to compute standard errors for marginal effects.
- Non-linear models allow flexible predictor specifications (e.g., piecewise terms) just like linear models, while maintaining coherent probability predictions.
