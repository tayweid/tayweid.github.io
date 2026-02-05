# Part 15: Unordered Multinomial Choice

## Introduction

In the previous unit we examined choices where the multinomial outcome had a clear vertical ordering. In many practical situations, however, we are interested in an unordered set of choices. Consider a consumer deciding among no purchase, Brand A, Brand B, or Brand C. While it may be possible to say that Brand A is on average more desirable than Brand B, we want the data to determine this rather than imposing it ourselves. The probabilities we estimate for a particular individual making some choice can also be interpreted as market shares.

This unit covers the main techniques for modeling unordered multinomial outcomes: multinomial logit (the workhorse method due to its computational tractability), multinomial probit (which allows correlated errors across alternatives), and mixed logit (which allows for random coefficients capturing individual-level taste heterogeneity). We also explore counterfactual analysis, which is the ultimate purpose of building these models: predicting what happens when we change attributes of the available choices.

Throughout this unit, we build custom maximum likelihood estimation routines in Python using `scipy.optimize`, since Python does not have a direct equivalent to R's comprehensive `mlogit` package. While this requires more effort, it provides a deeper understanding of how these models actually work under the hood.

## Random Utility Framework

The foundation for multinomial choice models is the random utility framework (sometimes called random utility models). For person $i$, we assume they derive some anticipated utility from option $m$ given by $U^i(m)$. When given a choice between options 1 through $M$, the person compares $U^i(1), U^i(2), \ldots, U^i(M)$ and selects the option that gives them the greatest expected outcome.

We model this utility as having a linear form in the explanatory variables:

$$U^i(m) = x_{im}\beta + z_i\gamma_m + \epsilon_{im}$$

While we do not observe the utilities directly, we observe a choice for product $m$ only if $U_i(m)$ is greater than all of the other choices for person $i$.

The data is composed of two types of variables:

- **Choice attributes** $x_{im}$ that can vary across both choices and decision makers (but do not have to).
- **Individual attributes** $z_i$ that are held constant across choices but that can be weighted differently across choices.

The parameters we estimate are:

- $\beta$, which tells us how different characteristics of the choice feed into utility and are constant across both decision makers and choices.
- $\gamma_m$ for each option $m$, telling us how specific individual characteristics feed into how much a product is liked or disliked.

## Example: Montreal-Toronto Travel Mode Choice

To make the framework concrete, we examine the travel choices for 3,880 travellers between Montreal and Toronto. The transportation options are car, bus, train, and air. This dataset appears in the vignettes accompanying R's `mlogit` package documentation.

For each individual we have a normalized measure of income and whether they live in an urban area. For each choice option we have a measure of the cost, the in-vehicle time (ivt), and the out-of-vehicle time (ovt). The dependent variable is the observed choice, where we restrict attention to decision makers who consider all four alternatives.

### Loading and Preparing the Data

```python
import pandas as pd

url = "https://raw.githubusercontent.com/cran/mlogit/master/inst/extdata/ModeCanada.csv.gz"
ModeCanada = pd.read_csv(url)

# Filter to cases with all 4 alternatives
MC = ModeCanada[ModeCanada['noalt'] == 4].copy()
MC = MC.reset_index(drop=True)
```

The data is in "long" format with one row per person-alternative combination. We reshape it into matrices for fast computation, building arrays of shape `(n_cases, n_alts)` for each variable, along with a choice indicator vector.

## Conditional Logit via Custom MLE

Python does not have a direct equivalent to R's `mlogit` package. The key distinction is that `statsmodels.MNLogit` implements only the basic multinomial logit where covariates vary only across individuals, not across alternatives. To replicate the full conditional logit (McFadden's choice model), we write a custom log-likelihood function and maximize it with `scipy.optimize`.

The model specification has three parts:

1. **Generic coefficients** (cost, freq, ovt): same $\beta$ across all alternatives.
2. **Alternative-specific coefficients for individual variables** (income): separate $\gamma_m$ for each alternative.
3. **Alternative-specific coefficients for choice-varying variables** (ivt): separate $\delta_m$ for each alternative.

The log-likelihood function for the conditional logit model is:

$$\text{LL} = \sum_i \log \Pr\{Y_i = \text{chosen}_i\}$$

where the probability of choosing alternative $j$ is given by the softmax:

$$\Pr\{Y_i = j\} = \frac{\exp\{V_{ij}\}}{\sum_{m=1}^M \exp\{V_{im}\}}$$

and $V_{ij}$ is the deterministic part of the utility.

```python
from scipy import optimize

def log_likelihood(theta):
    V = compute_utilities(theta)
    V_max = V.max(axis=1, keepdims=True)
    V_shifted = V - V_max  # numerical stability
    exp_V = np.exp(V_shifted)
    sum_exp_V = exp_V.sum(axis=1)
    log_prob = V_shifted[np.arange(n_cases), Y_choice] - np.log(sum_exp_V)
    return log_prob.sum()

result = optimize.minimize(
    lambda theta: -log_likelihood(theta),
    np.zeros(n_params),
    method='BFGS',
    options={'maxiter': 5000}
)
```

Standard errors are computed from the numerical Hessian of the log-likelihood at the optimum. The model can be evaluated using McFadden's pseudo-R-squared and a likelihood ratio test against the null model of equal choice probabilities.

### Interpreting the Results

The estimated coefficients have three distinct interpretations:

1. Terms like $\beta_\text{cost}$, $\beta_\text{freq}$, and $\beta_\text{ovt}$ vary across individuals and choices but have a constant effect in each utility equation.
2. Terms like $\gamma^\text{air}_\text{income}$, $\gamma^\text{bus}_\text{income}$, etc., are individual-specific but estimated with a separate effect for each choice. When we allow for choice-specific terms, this estimation is often referred to as conditional logit.
3. Terms like $\delta^\text{air}_\text{ivt}$, $\delta^\text{bus}_\text{ivt}$, etc., vary across individuals and alternatives, with the variable having a choice-specific effect.

Under the multinomial logit model the errors are assumed to have an extreme-value distribution. This assumption ensures a clean representation for the odds ratio. The probability of choosing option $j$ from $M$ possible options is:

$$\Pr\{Y_i = j\} = \frac{\exp\{U_i(j)\}}{\sum_{m=1}^M \exp\{U_i(m)\}}$$

Because the denominator is the same for all choices, the odds ratio for any two options simplifies to:

$$\frac{\Pr\{Y_i = 1\}}{\Pr\{Y_i = 2\}} = \frac{\exp\{U_i(1)\}}{\exp\{U_i(2)\}}$$

And the log-odds-ratio is just the difference in utilities:

$$\log\left(\frac{\Pr\{Y_i = 1\}}{\Pr\{Y_i = 2\}}\right) = U_i(1) - U_i(2)$$

## Independence of Irrelevant Alternatives (IIA)

This property of multinomial logit is called Independence of Irrelevant Alternatives. The odds ratio comparing any two outcomes is purely a function of the characteristics for those two choices, and does not respond to other features of the overall set of choices.

While this is mostly a nice feature that was designed into the approach, it can be absurd in some settings. In particular, if choice 3 is a direct substitute for choice 1, you would imagine that some of its features (like pricing) could affect the relative chances between choices 1 and 2.

There are ways to remove the IIA assumption across pre-specified nests, where the technique is called Nested Logit. This allows for a degree of correlation in the error terms within the nested choices, but independence across the nests.

## Multinomial Probits

Another option that allows for correlation across the errors is multinomial probit. Here, the error terms have a multivariate normal distribution $\boldsymbol{\epsilon} \sim \mathcal{N}(0, \Sigma)$, where the variance matrix should be thought of more as a correlation matrix since scale is not fully identified.

In contrast to the logit, the probit allows the errors to be correlated across choices. So the fact that an individual has a high idiosyncratic shock to their utility for a Mercedes can be correlated with having a high shock for an Audi and a negative shock for a GM.

The major computational challenge is that there is no closed-form expression for the probability that one draw from a multivariate normal exceeds all others when $M > 2$. Estimation therefore requires Simulated Maximum Likelihood (SML): randomly drawing samples from the multivariate normal and using these to compute the probability that the utility for option $j$ exceeds that for the other $M - 1$ options. This simulation approach makes estimation substantially slower and bootstrapping standard errors very time-consuming.

```python
def simulated_mnp_loglik(theta, n_sim=200):
    V = compute_utilities(theta)
    rng = np.random.default_rng(42)
    log_probs = np.zeros(n_cases)
    for i in range(n_cases):
        eps = rng.standard_normal((n_sim, n_alts))
        U_sim = V[i, :] + eps
        chosen_sim = np.argmax(U_sim, axis=1)
        sim_prob = np.mean(chosen_sim == Y_choice[i])
        log_probs[i] = np.log(max(sim_prob, 1e-10))
    return log_probs.sum()
```

Python does not have a well-maintained multinomial probit package. For serious research applications, R's `mlogit` package remains recommended.

## Mixed Logit

Another alternative to induce correlations is to allow the coefficients to be random. In a standard model the utility is $U_i(j) = \beta x_{ij} + \epsilon_{ij}$. In a random coefficients model, person $i$ has their own value $\beta_i$, reflecting idiosyncratic tastes:

$$U_i(j) = \beta_i x_{ij} + \epsilon_{ij}$$

where we make a parametric assumption on the distribution, such as $\beta_i \sim \mathcal{N}(\beta, \sigma^2_\beta)$.

Given the value of $\beta_i$, the probability of making choice $j$ is:

$$\Pr\{Y_i = j\} = \frac{\exp\{\beta_i x_{ij} + \epsilon_{ij}\}}{\sum_{m=1}^M \exp\{\beta_i x_{im} + \epsilon_{im}\}}$$

People with a very high value of $\beta_i$ might be more inclined to make some choices over others, depending on the relevant values for the $x_{im}$ terms. In practical terms, it is very hard to assess the analytical expectation of the probabilities over the random coefficients, so we switch to numerical estimates using simulation.

By decomposing the utility into its average effect and idiosyncratic component:

$$U_i(j) = \beta x_{ij} + (\beta_i - \beta) x_{ij} + \epsilon_{ij}$$

we see that individual-level variation in $\beta_i$ induces correlation across alternatives through the shared individual effect.

The mixed logit is estimated via simulated maximum likelihood. For each individual, we draw many $\beta_i$ values from the assumed distribution, compute the conditional logit probability for each draw, and average over draws to get the simulated choice probability.

```python
def mixed_logit_loglik(theta_mixed, n_draws=500):
    sigma_cost = theta_mixed[-1]
    theta_base = theta_mixed[:-1]
    # ... compute base utilities without cost ...
    rng = np.random.default_rng(123)
    u_draws = rng.uniform(0, 1, (n_draws,))
    beta_cost_draws = beta_cost_mean + sigma_cost * (2 * u_draws - 1)
    prob_sum = np.zeros((n_cases, n_alts))
    for d in range(n_draws):
        V = V_base + X_cost * beta_cost_draws[d]
        # ... compute softmax probabilities ...
        prob_sum += exp_V / exp_V.sum(axis=1, keepdims=True)
    avg_probs = prob_sum / n_draws
    chosen_probs = avg_probs[np.arange(n_cases), Y_choice]
    return np.log(np.maximum(chosen_probs, 1e-10)).sum()
```

Models can be compared using AIC ($-2 \cdot \text{LL} + 2k$), where lower values indicate better fit.

## Prediction and Counterfactuals

The entire point of building these models is to run counterfactual analyses. Given estimated parameters, we can predict market shares by computing the average choice probabilities across all individuals:

```python
def predict_shares(theta):
    V = compute_utilities(theta)
    V_shifted = V - V.max(axis=1, keepdims=True)
    exp_V = np.exp(V_shifted)
    probs = exp_V / exp_V.sum(axis=1, keepdims=True)
    return probs.mean(axis=0)
```

For counterfactual analysis, we modify the data arrays to reflect a hypothetical scenario. In the travel mode example, we simulate a high-speed rail investment by making trains faster (dividing in-vehicle time by 2.5) but tripling the cost. We then re-compute predicted shares under the modified data.

Both the conditional logit and mixed logit models produce counterfactual predictions. The results show that the main beneficiary of changes to automobile costs would be the train system, providing evidence for investing in rail networks. The visualization compares original and counterfactual market shares as side-by-side bar charts for both model specifications.

### Connections to Industrial Organization

These multinomial logit techniques can be incorporated into models of entire industries. Structural models called BLP models (after Berry, Levinsohn, and Pakes) use game-theoretic models of oligopoly to understand how prices and product characteristics affect outcomes. After estimation, these models can predict what would happen under various price changes.

## Summary

- Unordered multinomial choice models estimate the probability of selecting each alternative from a set of options, based on both individual characteristics and choice attributes.
- The conditional logit model is the workhorse approach, estimated via maximum likelihood with an extreme-value error assumption.
- The multinomial logit implies Independence of Irrelevant Alternatives (IIA), which can be relaxed through nested logit, multinomial probit, or mixed logit specifications.
- Multinomial probit allows correlated errors across alternatives but requires simulated maximum likelihood, making estimation much slower.
- Mixed logit introduces random coefficients to capture individual-level taste heterogeneity and induces correlation across alternatives.
- In Python, these models require writing custom log-likelihood functions and using `scipy.optimize`, since there is no direct equivalent to R's `mlogit` package.
- The primary purpose of these models is counterfactual analysis: predicting how market shares change when we modify choice attributes.
