# Part 17: Survival Models and Hazards

## Introduction

Lifespans and durations are frequently targets of analysis across many disciplines. Examples include time to failure for a machine, lifespans of people, duration until finding a job, time until buying a replacement product, and time until losing a customer. Industries from banking (customer lifetime value) to insurance (time to policy lapse) to manufacturing (machine component lifetimes) all rely on survival analysis methods.

While some economists use survival models to understand durations of unemployment or bid arrivals in auctions, these methods are even more widely used by demographers, biostatisticians, and health sciences researchers. This unit introduces the core concepts of survival analysis: the survival function, the hazard rate, and the cumulative hazard. We then cover the two main modeling approaches for incorporating covariates -- accelerated failure time (AFT) models and proportional hazard (PH) models -- with particular attention to the Weibull distribution and the Cox proportional hazard model.

In Python, survival analysis is handled by the `lifelines` library, which provides a clean interface for Kaplan-Meier estimation, parametric AFT models, and Cox regression.

## The Survival Function

To set up the key terms, we begin with mortality data from the US (downloaded from mortality.org). The life tables contain variables including the probability of death $q(x)$, the number of survivors $l(x)$ out of an initial 100,000 births, life expectancy $e(x)$, and other demographic measures.

```python
import pandas as pd

Mortality_US_m = pd.read_csv("hazards/USA_fltper_1x1.csv")
Mortality_US_f = pd.read_csv("hazards/USA_mltper_1x1.csv")
Mortality_US = pd.concat([Mortality_US_m, Mortality_US_f], ignore_index=True)
```

Plotting the survivors from an initial 100,000 births for men and women in 1960 and 2020 produces the classic survival curves. The 2020 curves show dramatically improved survival at all ages compared to 1960, and women consistently outlive men.

We can think of the point of death $T$ for a person as a random variable with CDF $F(t)$. The CDF measures the probability that someone has died before age $t$. The complement $1 - F(t)$ measures the probability that someone is still alive at time $t$. We call this the **survival function**:

$$S(t) = 1 - F(t)$$

While the running example is mortality, the event being modeled can be any event that happens at some point in time.

## Hazards

The density $f(t)$ provides the unconditional probability of an event occurring at any point in time, but data often comes in the form of current survivors. For these data points, the probability that they survived to time $t$ is $S(t) = 1 - F(t)$. Given that they have survived up to $t$, the conditional density for the event occurring at $t' \geq t$ is:

$$\frac{f(t')}{1 - F(t)} = \frac{f(t')}{S(t)}$$

The instantaneous risk of death at time $t$, conditional on survival to that point, is the **hazard rate**:

$$\lambda(t) = \frac{f(t)}{S(t)}$$

Computing the hazard rate from the US mortality data and plotting it for ages 35-50 reveals that hazard rates have declined substantially from 1960 to 2020, and are consistently higher for men than women.

### Mathematical Relationships

The hazard is mathematically related to the survival function via:

$$\lambda(t) = -\frac{\partial}{\partial t} \log(S(t))$$

which means the survival function can be written as:

$$S(t) = \exp\left\{-\int_0^t \lambda(s)\, ds\right\}$$

The expression $\Lambda(t) = \int_0^t \lambda(s)\, ds$ is the **cumulative hazard**, representing the sum of all risks faced from age 0 to age $t$. From $S(t) = \exp\{-\Lambda(t)\}$, we also have $\log(S(t)) = -\Lambda(t)$.

## Constant Hazards

If the hazard rate is constant, $\lambda(t) = \lambda$, then the CDF must be $F(t) = 1 - e^{-\lambda t}$, which is precisely the CDF of an exponential distribution. The main characteristic of the exponential distribution is its **constant hazard rate**: survival up to time $t$ tells us nothing about subsequent chances. Hazards that change through time require other distributions.

### Likelihood for Survival Data

For a single data point, it has either had the event occur at time $t_i$ (with likelihood $f(t_i) = \lambda(t_i) S(t_i)$) or not had the event occur yet (with likelihood $S(t_i)$). With a dummy variable $e_i$ for whether the event has occurred, the likelihood of the data is:

$$L = \prod_{i=1}^n \lambda(t_i)^{e_i} S(t_i)$$

and the log-likelihood is:

$$l = \sum_{i=1}^n \log(S(t_i)) + e_i \log(\lambda(t_i)) = \sum_{i=1}^n -\Lambda(t_i) + e_i \log(\lambda(t_i))$$

### MLE for the Exponential Case

Under a constant hazard, the cumulative hazard is linear: $\Lambda(t_i) = \lambda \cdot t_i$. The log-likelihood divided by $N$ simplifies to:

$$\frac{l(\lambda)}{N} = \lambda \bar{T} + \eta_E \log(\lambda)$$

where $\eta_E = N_e / N$ is the fraction of the data that has experienced the event and $\bar{T}$ is the average observation time. The MLE estimator is:

$$\hat{\lambda} = -\frac{\eta_E}{\bar{T}}$$

If all events are observed without censoring ($E = 1$), this reduces to the standard MLE estimator for an exponential: $1/\bar{T}$.

## Modeling Effects

There are two main types of model for incorporating covariates into survival data:

1. **Accelerated Failure Time (AFT) Models** -- modeling effects on the duration
2. **Proportional Hazard (PH) Models** -- modeling effects on the risks

### Accelerated Failure Time Models

In AFT models, the log of the event time is modeled as:

$$\log(T_i) = x_i^T \beta + \sigma \epsilon$$

where the distribution of $\epsilon$ is chosen and the model is assessed using maximum likelihood. The failure time is therefore:

$$T_i = T_i^0 \exp\{x_i^T \beta\} = T_i^0 \cdot \eta_i$$

The effects have a multiplicative relationship $\eta_i = \exp\{x_i^T \beta\}$ with the failure time. For someone with $\eta_i = 1$, their lifespan is distributed according to $T_i^0 = \exp\{\sigma \epsilon\}$. For someone with $\eta_i = 2$, their lifespan is distributed as $2 T_i^0$. The survival function becomes $S(t_i / 2)$ instead of $S(t_i)$, accelerating the time scale.

We need a distributional assumption for the noise:

- An exponential baseline makes all hazards constant, just at different levels.
- A **Weibull distribution** is a common choice, with a shape parameter $k$ allowing both increasing and decreasing hazards, plus the benefit of also being interpretable as a proportional hazards model.

## Weibull Distributions

The Weibull survival function is:

$$S(t) = \exp\{-(\lambda t)^k\}$$

for a scale parameter $\lambda$ and shape parameter $k$:

- $k > 1$ implies increasing risks with time
- $k < 1$ implies decreasing risks with time

```python
def S_weibull(t, lam=1, k=1):
    return np.exp(-(lam * t)**k)

t = np.linspace(0, 100, 500)
plt.plot(t, S_weibull(t, lam=1/70, k=0.5), label='k=0.5 (decreasing hazard)')
plt.plot(t, S_weibull(t, lam=1/70, k=2),   label='k=2 (increasing hazard)')
```

The plot shows that with $k = 0.5$ the survival curve drops steeply at first and then levels off (decreasing hazard over time), while with $k = 2$ the curve stays high initially then drops rapidly (increasing hazard).

## Example: Recidivism Data

We apply survival models to individualized data on criminal recidivism among parolees, with the event defined as committing a new crime (original data from Wooldridge). The data includes covariates such as work program participation, number of prior convictions, time served, felon status, alcohol and drug history, race, marital status, education, and age.

### Weibull AFT Estimation

In Python, we use the `lifelines` library. Unlike R's `survival` package, which requires creating a `Surv()` object, lifelines takes duration and event columns directly:

```python
from lifelines import WeibullAFTFitter

weibull_aft = WeibullAFTFitter()
weibull_aft.fit(df_model, duration_col='durat', event_col='fail')
weibull_aft.print_summary()
```

The coefficients are reported for both the `lambda_` (location) and `rho_` (scale) parameters. The effect of an additional year of time served on the duration until reoffending is computed as $\exp(\hat{\beta}_\text{tserved} \times 12) - 1$, which shows approximately an 18% decrease. Being ten years older increases the duration by approximately 5%.

### Alternative Distributions

Other distributions are easily substituted:

```python
from lifelines import LogNormalAFTFitter

lognormal_aft = LogNormalAFTFitter()
lognormal_aft.fit(df_model, duration_col='durat', event_col='fail')
```

Comparing models via AIC ($-2 \cdot \text{LL} + 2k$), the log-normal specification fits the recidivism data slightly better than the Weibull.

### Proportional Hazard Models

The other major approach models proportional effects on the hazard rate rather than the duration. The hazard rate for person $i$ conditional on observables $x_i$ is:

$$\lambda_i(t | x_i) = \lambda_0(t) \cdot \exp\{x_i^T \beta\}$$

The model comprises a baseline hazard rate $\lambda_0(t)$ for someone with $x_i = 0$ and a multiplicative relationship through $\exp\{x_i^T \beta\} = \prod_{k=1}^K \exp\{x_{ik} \beta_k\}$, where variable $k$ scales the hazard up or down depending on the sign of $x_{ik} \beta_k$.

A key advantage of the proportional approach is that the cumulative hazard is similarly proportional:

$$\Lambda_i(t | x_i) = \Lambda_0(t) \exp\{x_i^T \beta\}$$

This means the survival function has the form:

$$S(t | x_i) = S_0(t)^{\eta_i}$$

where $S_0(t) = \exp\{-\Lambda_0(t)\}$ is the baseline survivor function and $\eta_i = \exp\{x_i^T \beta\}$ is the net risk multiplier.

### Cox Proportional Hazard Model

The Cox model uses a partial likelihood that leaves the baseline hazard unspecified, making it semi-parametric:

```python
from lifelines import CoxPHFitter

cph = CoxPHFitter()
cph.fit(df_model, duration_col='durat', event_col='fail')
cph.print_summary()
```

In the recidivism data, an additional year of time served has a multiplicative effect on the hazard of $\exp(12 \cdot \hat{\beta}_\text{tserved}) - 1 \approx 17\%$ increase in risk. Being 10 years older at release decreases the risk by approximately 3.5%.

### Prediction

The Cox model produces several types of predictions:

- **Linear predictor** $x_i^T \hat{\beta}$: the log of the risk multiplier
- **Partial hazard** $\exp\{x_i^T \hat{\beta}\}$: the risk multiplier relative to baseline
- **Expected events**: the predicted number of events for each individual

```python
recidivism['lin_pred'] = cph.predict_log_partial_hazard(df_model)
recidivism['risk_mult'] = cph.predict_partial_hazard(df_model)
recidivism['exp_events'] = cph.predict_expectation(df_model)
```

We can also decompose the risk into per-variable contributions by centering each covariate at its mean and multiplying by its coefficient. Converting to percentage change in risk ($100 \times (\exp(\text{term}) - 1)$) shows how each variable increases or decreases an individual's risk relative to the average person.

## Summary

- **Survival analysis** models the time until an event occurs, accounting for censored observations (individuals who have not yet experienced the event).
- The **survival function** $S(t) = 1 - F(t)$ gives the probability of surviving past time $t$.
- The **hazard rate** $\lambda(t) = f(t)/S(t)$ is the instantaneous risk of the event, conditional on survival to time $t$.
- The **cumulative hazard** $\Lambda(t) = \int_0^t \lambda(s)\, ds$ accumulates all risks faced up to time $t$, and $S(t) = \exp\{-\Lambda(t)\}$.
- A constant hazard implies an exponential distribution; the **Weibull** distribution generalizes this with a shape parameter allowing increasing or decreasing hazards.
- **Accelerated failure time (AFT) models** model how covariates multiplicatively accelerate or decelerate the time to the event: $T_i = T_i^0 \exp\{x_i^T \beta\}$.
- **Proportional hazard (PH) models** model how covariates multiplicatively scale the hazard rate: $\lambda_i(t) = \lambda_0(t) \exp\{x_i^T \beta\}$.
- The **Cox proportional hazard model** is semi-parametric, leaving the baseline hazard unspecified and estimating only the covariate effects through a partial likelihood.
- In Python, the `lifelines` library provides `WeibullAFTFitter`, `LogNormalAFTFitter`, `LogLogisticAFTFitter`, and `CoxPHFitter` for fitting these models, with duration and event columns passed directly to `.fit()`.
- Model comparison across distributional assumptions can be done via AIC.
