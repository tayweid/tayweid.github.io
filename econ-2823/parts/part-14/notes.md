# Part 14: Ordered Multinomial Choice

## Introduction

This unit extends the binary choice models from Part 13 to handle multiple ordered outcomes. Many real-world variables are categorical with a natural ordering: survey responses on Likert scales, credit ratings, educational attainment levels, or customer service tiers. While one approach is to collapse the ordered variable into a binary indicator and use logit/probit, this discards valuable information about the gradations between categories. Ordered logit and ordered probit models preserve this information by modeling the full ordinal structure.

The core idea is elegant: we maintain the latent variable framework from binary choice but add threshold parameters that partition the continuous latent variable into the observed ordered categories. The linear predictor $\eta_i = x_i^T \beta$ shifts the distribution left or right, changing the probability mass in each category. The thresholds $\zeta$ are estimated alongside the regression coefficients, and together they determine the probability of each outcome for any given set of covariates.

We develop the model from first principles, verify threshold estimation with custom maximum likelihood, and apply the framework to real survey data on e-cigarette usage among youth. We also cover how to compute and interpret marginal effects, which are more complex than in binary models because each covariate has a separate marginal effect for every outcome category.

## The Ordered Choice Model

Suppose our firm has three levels of service and we observe each customer's ordered choice:

- No purchase (Option 0)
- Basic package (Option 1)
- Upgrade package (Option 2)
- Deluxe package (Option 3)

The latent variable model is:

$$y_i^* = x_i^T \beta + \epsilon_i$$

where $\epsilon_i$ has either a logistic (ordered logit) or Normal (ordered probit) distribution. The observed outcome is determined by where $y_i^*$ falls relative to the thresholds $\zeta_{0,1} < \zeta_{1,2} < \zeta_{2,3}$:

$$y = \begin{cases}
3 \text{ (Deluxe)} & \text{if } x_i^T\beta + \epsilon_i \geq \zeta_{2,3} \\
2 \text{ (Upgrade)} & \text{if } \zeta_{2,3} > x_i^T\beta + \epsilon_i \geq \zeta_{1,2} \\
1 \text{ (Basic)} & \text{if } \zeta_{1,2} > x_i^T\beta + \epsilon_i \geq \zeta_{0,1} \\
0 \text{ (No purchase)} & \text{if } x_i^T\beta + \epsilon_i < \zeta_{0,1}
\end{cases}$$

Note that no intercept appears in $x_i^T \beta$ because the thresholds absorb the location of the distribution. The effect of covariates is to shift the entire distribution of $y_i^*$ left or right, which changes the probability mass falling in each category.

## Probabilities from the Model

For $K$ ordered categories with thresholds $\zeta_1 < \zeta_2 < \ldots < \zeta_{K-1}$ and linear predictor $\eta_i = x_i^T \beta$, the probability of each outcome is:

$$P(y_i = k) = F(\zeta_k - \eta_i) - F(\zeta_{k-1} - \eta_i)$$

where $\zeta_0 = -\infty$, $\zeta_K = +\infty$, and $F$ is the CDF of the assumed error distribution (logistic for ordered logit, Normal for ordered probit).

As covariates shift $\eta_i$ upward, the probabilities of higher categories increase and the probabilities of lower categories decrease. The thresholds remain fixed -- they define the boundaries between categories in the latent variable space.

## Intercept-Only Example

Consider a simple example with no covariates: 50 non-purchasers, 100 basic purchasers, and 15 upgrade purchasers. Under the ordered logit assumption (logistic CDF), the log-likelihood is:

$$50 \log\left(\frac{e^{\zeta_{01}}}{1+e^{\zeta_{01}}}\right) + 100\log\left(\frac{e^{\zeta_{12}}}{1+e^{\zeta_{12}}} - \frac{e^{\zeta_{01}}}{1+e^{\zeta_{01}}}\right) + 15\log\left(1 - \frac{e^{\zeta_{12}}}{1+e^{\zeta_{12}}}\right)$$

This is maximized at $\hat{\zeta}_{01} = -0.833$ and $\hat{\zeta}_{12} = 2.303$.

Under the ordered probit assumption (Normal CDF), the log-likelihood is:

$$50 \log(\Phi(\zeta_{01})) + 100 \log(\Phi(\zeta_{12}) - \Phi(\zeta_{01})) + 15\log(1 - \Phi(\zeta_{12}))$$

This yields $\hat{\zeta}_{01} = -0.516$ and $\hat{\zeta}_{12} = 1.335$.

Despite the seemingly large difference in threshold values, the implied probabilities are identical between the two models because the CDF functions differ in scale. We can verify this:

```python
res_logit = optimize.minimize(lambda z: -loglik_ordered_logit_simple(z),
                              x0=[0.0, 1.0], method='BFGS')
res_probit = optimize.minimize(lambda z: -loglik_ordered_probit_simple(z),
                               x0=[0.0, 1.0], method='BFGS')
```

Both recover implied probabilities of approximately 0.3030, 0.6061, and 0.0909, matching the empirical frequencies (50/165, 100/165, 15/165).

## Application: E-Cigarette Usage Data

We apply the ordered choice framework to data from the 2020 National Youth Tobacco Survey. The outcome variable measures e-cigarette usage/curiosity on a five-point ordered scale:

0. User (has used an e-cigarette/vape)
1. Definitely Try (would definitely try)
2. Probably Try
3. Probably Not Try
4. Definitely Not Try

The covariates include gender (female), race (black, hispanic), and age (as a factor variable with dummies).

### Ordered Logit

In Python, we use `statsmodels.miscmodels.ordinal_model.OrderedModel`:

```python
from statsmodels.miscmodels.ordinal_model import OrderedModel

vape_ologit = OrderedModel(y, X, distr='logit')
res_ologit = vape_ologit.fit(method='bfgs', disp=False)
```

The output includes both the coefficient vector $\beta$ (effects of female, black, hispanic, and age dummies) and the threshold parameters $\zeta$ (cutpoints between adjacent categories).

For example, with estimated coefficients, a black female 14-year-old has a linear predictor:

$$\eta_i = \hat{\beta}_{\text{female}} + \hat{\beta}_{\text{black}} + \hat{\beta}_{\text{Age\_14}}$$

The probability of each outcome is then computed using the logistic CDF and the estimated thresholds. For instance, the probability of "Definitely Not Try" is:

$$P(\text{Def Not Try}) = 1 - F(\hat{\zeta}_{3,4} - \hat{\eta}_i)$$

where $F$ is the logistic CDF.

### Ordered Probit

The probit version assumes Normal errors:

```python
vape_oprobit = OrderedModel(y, X, distr='probit')
res_oprobit = vape_oprobit.fit(method='bfgs', disp=False)
```

The probit model uses the Normal CDF to compute probabilities:

$$P(\text{Def Not Try}) = 1 - \Phi(\hat{\zeta}_{3,4} - \hat{\eta}_i)$$

The two models typically produce similar probabilities despite different parameter values, just as in the binary case. Model comparison using AIC may slightly favor one specification over the other.

### Extracting Parameters

In statsmodels, both coefficients and thresholds are stored together in `result.params`. To separate them:

```python
all_params = res_oprobit.params
n_betas = X.shape[1]
betas = all_params[:n_betas]
thresholds = all_params[n_betas:]
```

This differs from R's `polr()`, which stores coefficients in `$coefficients` and thresholds in `$zeta`.

### Predicted Probabilities

The `predict()` method returns a matrix of predicted probabilities, with one column per category:

```python
pred_probs = res_oprobit.predict()
```

Each row sums to 1.0, and the columns correspond to the ordered categories. These predicted probabilities can be computed for specific demographic profiles to understand how the probability distribution shifts across the outcome categories as covariates change.

## Custom MLE Implementation

For deeper understanding or custom needs, the ordered logit/probit log-likelihood can be written from scratch:

```python
def ordered_model_loglik(params, X, y_codes, n_categories, distr='logit'):
    n_vars = X.shape[1]
    beta = params[:n_vars]
    raw_thresholds = params[n_vars:]
    thresholds = np.cumsum(np.concatenate([[raw_thresholds[0]],
                                           np.exp(raw_thresholds[1:])]))

    eta = X @ beta
    F = stats.logistic.cdf if distr == 'logit' else stats.norm.cdf

    ll = 0.0
    for k in range(n_categories):
        mask = (y_codes == k)
        if k == 0:
            prob = F(thresholds[0] - eta[mask])
        elif k == n_categories - 1:
            prob = 1 - F(thresholds[-1] - eta[mask])
        else:
            prob = F(thresholds[k] - eta[mask]) - F(thresholds[k-1] - eta[mask])
        prob = np.clip(prob, 1e-15, 1 - 1e-15)
        ll += np.sum(np.log(prob))
    return ll
```

A key implementation detail: the threshold ordering constraint $\zeta_1 < \zeta_2 < \ldots$ is enforced by parameterizing the gaps between thresholds as exponentials. The first threshold is unconstrained, and subsequent gaps are $\exp(\cdot)$ of raw parameters, ensuring positivity. Thresholds are then recovered via cumulative summation.

Standard errors can be computed from the inverse of the Hessian returned by the BFGS optimizer, or via the `utils.mle_standard_errors()` function using numerical differentiation.

## Marginal Effects for Ordered Models

Unlike binary models, where there is a single marginal effect per covariate, ordered models have a separate marginal effect for each covariate-category pair. A positive coefficient $\beta_j$ means:

- Increasing $x_j$ **decreases** the probability of the lowest category
- Increasing $x_j$ **increases** the probability of the highest category
- The effect on middle categories is ambiguous (can be positive or negative)

For continuous variables with the probit link:

$$\frac{\partial P(y=k | x)}{\partial x_j} = \left[\phi(\zeta_{k-1} - x^T\beta) - \phi(\zeta_k - x^T\beta)\right] \beta_j$$

For the logit link, replace $\phi$ (the Normal PDF) with the logistic PDF $f(z) = \frac{e^z}{(1+e^z)^2}$.

An important property: the marginal effects across all categories must sum to zero for each covariate, because total probability must remain 1.

Average marginal effects are computed by evaluating the marginal effect at each observation and then averaging:

```python
me_probit = marginal_effects_ordered(
    res_oprobit.params.values, X, n_cats,
    var_names=list(X.columns),
    cat_names=category_order,
    distr='probit',
    at='average'
)
```

Visualization of these effects (e.g., bar charts showing the AME for female, black, and hispanic across all five outcome categories) provides an intuitive summary of how demographic characteristics shift the probability distribution across the ordered outcomes.

## Comparing Ordered Logit and Ordered Probit

A side-by-side comparison of the two models shows different coefficient magnitudes (because the logistic and Normal distributions have different scales) but similar log-likelihoods and AICs. The choice between them typically has little practical consequence for inference. The logit model is often preferred for its connection to odds ratios, while the probit model is preferred when the Normal error assumption is more natural for the application.

## Summary

- Ordered models extend binary choice to multiple ordered categories using threshold parameters that partition the latent variable space.
- The latent variable $y_i^* = x_i^T \beta + \epsilon_i$ determines the outcome based on where it falls relative to the thresholds $\zeta_1 < \zeta_2 < \ldots < \zeta_{K-1}$.
- Ordered logit uses logistic errors; ordered probit uses Normal errors. Both produce similar predictions.
- In Python, `statsmodels.OrderedModel` estimates these models; parameters include both $\beta$ coefficients and $\zeta$ thresholds.
- No intercept is estimated in the $\beta$ vector because the thresholds absorb the location information.
- Predicted probabilities for each category can be computed and must sum to 1 for each observation.
- Marginal effects in ordered models are category-specific: each covariate has a marginal effect on the probability of each outcome category.
- Marginal effects across all categories sum to zero for any given covariate.
- Custom MLE implementations must enforce the ordering of thresholds, typically through exponentiated parameterization of the gaps.
- Model comparison via AIC, BIC, and log-likelihood works the same as in other maximum likelihood contexts.
