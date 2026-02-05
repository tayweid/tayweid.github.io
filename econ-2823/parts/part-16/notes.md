# Part 16: Censoring and Selection

## Introduction

This unit focuses on using maximum likelihood techniques to address two additional violations of the standard linear model that can cause bias: censoring and selection. Censoring arises when data above or below a certain value is measured only at the limit (top-coding or bottom-coding). Selection occurs when the participants in our dataset are non-randomly selected and may therefore be unrepresentative of the population of interest.

Both problems lead to biased OLS estimates because they violate the assumption that the expected error conditional on all values of the explanatory variables is zero. The Tobit model addresses censoring by explicitly modeling the likelihood of observations at the boundary, while the Heckman selection model corrects for non-random sample selection using a two-equation system. These techniques are fundamental tools in applied economics, particularly for studying wages, labor supply, and any outcome where the observed sample is a selected subset of the population.

Throughout this unit, we implement these models from scratch in Python using custom log-likelihood functions and `scipy.optimize`, since Python does not have built-in equivalents to R's `tobit()` from the AER package or `selection()` from the sampleSelection package.

## Censoring

Suppose we are modeling the effect of variable $x$ on outcome $y$ using the classical linear model:

$$y_i = \beta_0 + \beta_1 x_i + \epsilon_i$$

where $\epsilon_i \sim \mathcal{N}(0, \sigma^2)$.

In simulated data with true parameters $\beta_0 = 5000$ and $\beta_1 = 2$, standard OLS recovers these values quite well. However, suppose that due to data collection limits, we can only measure $y$ up to $\bar{y} = 6000$, and values above this threshold are top-coded at the limit.

```python
np.random.seed(42)
x = 100 * np.random.chisquare(df=2, size=10000)
epsilon = np.random.normal(0, 400, size=10000)
y = 5000 + 2 * x + epsilon

y_upper = 6000
y_censored = np.where(y > y_upper, y_upper, y)
```

Running OLS on the censored data substantially underestimates $\beta_1$. The violation is clear: if the true relationship is $y = \beta_0 + \beta_1 x + \epsilon$ and we use the censored variable $y_C$, then:

$$y_C = \begin{cases} \beta_0 + \beta_1 x + \epsilon & \text{if } \epsilon < \bar{y} - \beta_0 - \beta_1 x \\ \bar{y} & \text{otherwise} \end{cases}$$

For unbiased estimation of $\beta_1$, we need the expected error conditional on all values of $x$ to be zero, but the expected error on the top-coded variable is positive. A scatter plot of the data reveals a flat ceiling of observations at the upper limit, pulling the OLS line downward.

### Dropping Censored Observations

One might try removing all top-coded observations. However, this still produces biased estimates because the expected error is now negative (increasingly so as $x$ gets larger), since we are truncating the sample to remove data points with large errors. The plot shows that dropping censored observations produces an even steeper downward bias than including them.

## The Tobit Model

The proper approach is to model the censoring directly. The Tobit regression makes the classical linear model assumption that errors are normally distributed, while recognizing that data points at the upper limit are top-coded.

For uncensored observations, the density is the standard normal PDF:

$$\phi\left(\frac{y_i - \beta_0 - \beta_1 x_i}{\sigma}\right)$$

This is exactly the same as the maximum likelihood version of the classical linear model.

For observations at the upper limit $\bar{y}$, all values of $\epsilon$ larger than a cutoff could have produced the observed value. The likelihood for these data points uses the upper tail of the normal:

$$1 - \Phi\left(\frac{\bar{y} - \beta_0 - \beta_1 x_i}{\sigma}\right)$$

Similarly, for left-censored observations at $\underline{y}$, we model the left tail:

$$\Phi\left(\frac{\underline{y} - \beta_0 - \beta_1 x_i}{\sigma}\right)$$

Given left and right censoring at $\underline{y}$ and $\bar{y}$ respectively, the full log-likelihood is:

$$\log \mathcal{L}(\beta_0, \beta_1, \sigma; y, x) = \sum_{\underline{y} < y_i < \bar{y}} \log \phi\left(\frac{y_i - \beta_0 - \beta_1 x_i}{\sigma}\right) + \sum_{\underline{y} \geq y_i} \log \Phi\left(\frac{y_i - \beta_0 - \beta_1 x_i}{\sigma}\right) + \sum_{y_i \geq \bar{y}} \log\left(1 - \Phi\left(\frac{y_i - \beta_0 - \beta_1 x_i}{\sigma}\right)\right)$$

### Tobit Implementation in Python

In Python, we implement the Tobit model as a custom MLE using `scipy.optimize.minimize`. We estimate $\log(\sigma)$ rather than $\sigma$ directly to ensure positivity:

```python
def tobit_loglik(params, y, X, left=-np.inf, right=np.inf):
    beta = params[:-1]
    sigma = np.exp(params[-1])
    xb = X @ beta
    ll = 0.0

    uncensored = (y > left) & (y < right)
    if np.any(uncensored):
        ll += np.sum(stats.norm.logpdf(y[uncensored], xb[uncensored], sigma))

    left_censored = (y <= left)
    if np.any(left_censored):
        ll += np.sum(np.log(stats.norm.cdf((left - xb[left_censored]) / sigma)))

    right_censored = (y >= right)
    if np.any(right_censored):
        ll += np.sum(np.log(1 - stats.norm.cdf((right - xb[right_censored]) / sigma)))

    return ll
```

The `fit_tobit()` function uses OLS estimates as initial values and then maximizes the log-likelihood with BFGS. Standard errors are computed from the numerical Hessian.

Applying the Tobit model with right-censoring at 6000 recovers parameter estimates very close to the true values $\beta_0 = 5000$ and $\beta_1 = 2$, with the estimated $\sigma$ close to the true value of 400. The model can also handle double censoring by specifying both left and right limits.

### Practical Applications

Tobit models are useful for removing the effects of boundary observations. For example, when studying how characteristics affect wages, you would encounter many individuals at minimum wage (dictated at either the state or federal level). A Tobit would be the first step to understanding how this censoring might affect inference. Note, however, that the normal distribution assumption is doing a lot of the heavy lifting. Non-parametric or semi-parametric censored regression methods can weaken these distributional assumptions.

## Interval Regression

Another type of censored data is interval-censored data. Instead of observing the true value $y$, we see that it lies in an interval $[\underline{y}_i, \bar{y}_i]$. For example, a survey respondent might select a household income category of \$50,000 to \$60,000.

For an observation in interval $[\underline{y}_i, \bar{y}_i]$, the likelihood under the normal assumption is the probability of falling within that interval:

$$\Phi\left(\frac{\bar{y}_i - \beta_0 - \beta_1 x_i}{\sigma}\right) - \Phi\left(\frac{\underline{y}_i - \beta_0 - \beta_1 x_i}{\sigma}\right)$$

The negative log-likelihood is:

```python
def nll_intReg(params, y_lower, y_upper, x):
    b0, b1, sigma = params
    if sigma <= 0:
        return 1e10
    prob = (stats.norm.cdf((y_upper - b0 - b1 * x) / sigma) -
            stats.norm.cdf((y_lower - b0 - b1 * x) / sigma))
    prob = np.maximum(prob, 1e-300)
    return -np.sum(np.log(prob))
```

Optimizing this with `scipy.optimize.minimize` (Nelder-Mead method) recovers the true parameters from the interval-censored data.

## Selection Models

While censoring involves observing limited values, selection involves not observing some data at all. The canonical example in economics is wages and labor force participation. When we examine the wages of workers, we are implicitly looking at a selected sample: only those who were willing to work at the offered wages. There is a hidden binary variable (work vs. not work at the offered wages), and conditional on accepting the offer, we observe wages and characteristics.

### The Heckman Selection Model

The Heckman selection model uses a pair of limited dependent variable equations:

- **Wage-offer equation:** $w_i^* = x_i^T \beta + \epsilon_i^{\text{Ofr}}$
- **Selection equation:** $u_i^* = z_i^T \delta + \epsilon_i^{\text{Sel}}$

where $x_i$ and $z_i$ are possibly overlapping sets of predictors. We observe only limited versions of these latent variables:

$$u_i = \begin{cases} 1 & \text{if } u_i^* \geq 0 \\ 0 & \text{if } u_i^* < 0 \end{cases} \qquad w_i = \begin{cases} w_i^* & \text{if } u_i = 1 \\ 0 & \text{otherwise} \end{cases}$$

Under the assumption that the errors are jointly normal:

$$\begin{pmatrix} \epsilon_i^{\text{Ofr}} \\ \epsilon_i^{\text{Sel}} \end{pmatrix} \sim \mathcal{N}\left(0, \Sigma\right)$$

the employed variable in the selection equation is similar to a probit, and the wage variable is similar to a Tobit. The variance-covariance matrix allows correlation across the two errors:

$$\Sigma = \begin{bmatrix} 1 & \rho \\ \rho & \sigma^2 \end{bmatrix}$$

where $\sigma^2$ captures wage variability and $\rho$ gives the correlation between the errors. Something unobserved by the analyst that causes low wage offers might also make a person more or less selective about those offers.

### Heckman Two-Step Estimator

The Heckman two-step procedure is implemented as follows:

1. **Step 1:** Estimate a probit model for the selection equation to get $\hat{\delta}$.
2. **Step 2:** Compute the inverse Mills ratio (IMR): $\lambda_i = \frac{\phi(z_i^T \hat{\delta})}{\Phi(z_i^T \hat{\delta})}$.
3. **Step 3:** Run OLS on the outcome equation for selected observations, including the IMR as an additional regressor.

```python
def heckman_two_step(selection_y, selection_X, outcome_y, outcome_X):
    # Step 1: Probit
    probit = sm.Probit(selection_y, selection_X).fit(disp=0)

    # Step 2: Inverse Mills ratio
    z_hat = probit.fittedvalues
    imr = stats.norm.pdf(z_hat) / stats.norm.cdf(z_hat)

    # Step 3: OLS with IMR
    selected = selection_y == 1
    outcome_X_aug = np.column_stack([outcome_X, imr[selected]])
    ols = sm.OLS(outcome_y, outcome_X_aug).fit()

    return probit, ols, imr
```

### Application: Women's Labor Force Participation

We apply the Heckman model to data from Mroz (1987) on married women's labor force participation decisions and wages. The two equations are:

- **Selection:** $\Pr\{\text{In Labor Force}\} = \delta_0 + \delta_1 \cdot \text{age} + \delta_2 \cdot \text{age}^2 + \delta_3 \cdot \text{fam.income} + \delta_4 \cdot \text{has.children} + \delta_5 \cdot \text{educ}$
- **Outcome:** $\mathbb{E}[\text{Wage} | x] = \beta_0 + \beta_1 \cdot \text{exper} + \beta_2 \cdot \text{exper}^2 + \beta_3 \cdot \text{educ} + \beta_4 \cdot \text{city}$

The estimated coefficients require careful interpretation. For a 30-year-old urban woman with five years of work experience, a high-school education, and average family income, we can compute the effect of having children on the labor force participation probability by evaluating the normal CDF at the estimated linear index with and without the children indicator.

The model also produces wage offer predictions for all individuals, including those not in the labor force. A violin plot of conditional wage distributions shows that many women who select out of the labor force would counterfactually have had higher wages, revealing the effect of the correlation parameter $\rho$.

### Extensions: Tobit Type 5 (Switching Regression)

The Heckman selection model (Tobit type 2) has a natural extension to the Tobit type 5 model, where people select into one of two options $A$ or $B$ (different careers, for example), and we observe the outcome wage within each career:

$$u_i = \begin{cases} A & \text{if } u_i^* \geq 0 \\ B & \text{if } u_i^* < 0 \end{cases} \qquad w_i = \begin{cases} w_{(A,i)}^* & \text{if } u_i = A \\ w_{(B,i)}^* & \text{if } u_i = B \end{cases}$$

We model three latent variables: the relative preference for $A$ over $B$, the wage in $A$, and the wage in $B$. The identification conditions for these three equations are non-trivial and require separate variables as instruments in the selection equation.

The switching regression can be implemented as two separate Heckman corrections, one for each regime. For those selected into regime $A$, we use the standard IMR $\phi(z)/\Phi(z)$, while for those in regime $B$ (not selected), we use the negative Mills ratio $-\phi(z)/(1 - \Phi(z))$.

A simulated data example demonstrates that the two-step estimator recovers the true parameters for both the selection and outcome equations reasonably well.

## Comments on Implementation

The log-likelihood functions for these models can be non-concave, leading to potentially many local maxima. Good initial conditions are essential, which is why two-step estimators are valuable: they provide reasonable starting values for full maximum likelihood estimation.

Historically (1970s), two-step estimators were used because of computational limitations. From the R `sampleSelection` vignette: "The original article suggests using the two-step solution for exploratory work and as initial values for ML estimation, since in those days the cost of the two-step solution was \$15 while that of the maximum-likelihood solution was \$700."

While computational power now allows full maximum likelihood, the academic literature has moved away from some of the stronger parametric assumptions (the normal distribution is doing more heavy lifting than we might like). The more modern approach uses control functions to model the effects of selection directly in the main equation.

## Summary

- **Censoring** (top-coding or bottom-coding) biases OLS because the conditional expectation of the error is nonzero. Dropping censored observations does not fix the problem.
- The **Tobit model** corrects for censoring by combining the normal PDF (for uncensored observations) and CDF (for censored tails) in the likelihood function.
- **Interval regression** handles data observed only within brackets by using the difference of two CDF evaluations at the interval bounds.
- **Selection bias** arises when the observed sample is non-randomly selected from the population.
- The **Heckman selection model** corrects for this by (1) estimating a probit for the selection equation, (2) computing the inverse Mills ratio, and (3) including the IMR in the outcome regression.
- The **switching regression** (Tobit type 5) extends the Heckman model to settings where individuals select into one of two regimes, each with its own outcome equation.
- In Python, these models are implemented as custom MLE routines using `scipy.optimize`, since there are no built-in equivalents to R's `tobit()` or `selection()` functions.
