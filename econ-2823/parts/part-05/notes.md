# Part 05: Simulation as a Tool

## Introduction

Simulation is a powerful complement to analytical and numerical methods. Even when we can calculate something analytically, the time and effort required may exceed what it would take to run a quick simulation and get a reliable approximation. Simulation leverages the law of large numbers: if we can construct a random variable whose expected value equals the quantity we want, we simply draw many samples and take the average.

This unit covers the theoretical foundation of simulation (the law of large numbers), then works through increasingly complex applications: estimating the value of pi, simulating Electoral College outcomes, studying the finite-sample properties of econometric estimators, and modeling soccer match scorelines. Along the way, we see how simulation can reveal properties of estimators and models that would be difficult or impossible to derive analytically.

The key insight is that simulation turns a hard analytical problem into a computational one. If you can write down how to generate one random draw from a process, you can generate thousands or millions of draws and let the law of large numbers do the rest.

## Law of Large Numbers

The theoretical foundation of simulation is the law of large numbers. For an independent and identically distributed (iid) sample $(X_1, X_2, \ldots, X_n)$ with mean $\mu_X$ and variance $\sigma^2_X$, the law of large numbers tells us that for any positive $\epsilon$, as $n \rightarrow \infty$:

$$\Pr\left\{\left| \overline{X}_n - \mu_X \right| > \epsilon \right\} \rightarrow 0$$

In other words, the sample mean converges in probability to the population mean. This gives us a recipe for approximating any quantity $\mu$: if we can construct a random variable $X$ with $\mathbb{E}X = \mu$, then we simply simulate many draws of $X$ and average them.

## Example: Calculating Pi

### Analytical Approach: Nilakantha Series

Before reaching for simulation, consider an analytical approach. The Nilakantha series provides a formula for pi:

$$\pi = 3 + \frac{4}{2 \times 3 \times 4} - \frac{4}{4 \times 5 \times 6} + \frac{4}{6 \times 7 \times 8} + \ldots$$

```python
def nilakantha_pi(n):
    """Calculate pi using the Nilakantha series."""
    x = 3.0
    for k in range(1, n + 1):
        x += 4 * ((-1) ** (k + 1)) / ((1 + 2*k)**3 - (1 + 2*k))
    return x
```

With 200 terms, the error is on the order of $10^{-10}$. A plot of the error versus the number of terms shows rapid convergence on a logarithmic scale.

### Simulation Approach: Monte Carlo

We can also estimate pi using simulation. Draw points $(U_1, U_2)$ uniformly from the square $[-1, 1]^2$ and define:

$$X = \begin{cases} 4 & \text{if } U_1^2 + U_2^2 \leq 1 \\ 0 & \text{otherwise} \end{cases}$$

The expected value of $X$ equals the probability of landing inside the unit circle times 4. Since the area of the unit circle is $\pi$ and the area of the square is 4, we have:

$$\mathbb{E}X = \frac{\pi \cdot 1^2}{2 \times 2} \cdot 4 = \pi$$

```python
n = 10000
u1 = np.random.uniform(-1, 1, n)
u2 = np.random.uniform(-1, 1, n)
in_circle = np.where((u1**2 + u2**2) <= 1, 4, 0)
pi_estimate = np.mean(in_circle)
```

A scatter plot of the random points, colored by whether they fall inside or outside the unit circle, provides a vivid illustration of the Monte Carlo method. Points inside the circle are shown in one color and points outside in another, with the unit circle boundary drawn on top.

Testing with increasing sample sizes ($n = 10^3, 10^4, \ldots, 10^7$) shows that the error decreases, confirming the law of large numbers. On a log-log plot, the error decreases roughly as $1/\sqrt{n}$, consistent with the central limit theorem.

## Electoral College Simulation

A more substantive application is simulating US presidential election outcomes. The president is not elected by popular vote but by the Electoral College, where each state contributes a fixed number of electoral votes. The winner of each state receives all of that state's electoral votes, and 270 are needed to win.

### Independent State Model

Using state-level win probabilities from The Economist's election model, we simulate each state's outcome independently:

```python
def run_election_simulation(prob_list, ev_list, n_sims):
    """Run multiple election simulations."""
    n_states = len(prob_list)
    rnd = np.random.uniform(0, 1, (n_sims, n_states))
    dem_wins = rnd < np.array(prob_list)
    dem_totals = np.sum(dem_wins * np.array(ev_list), axis=1)
    return dem_totals
```

Running 100,000 simulations produces a distribution of Democratic electoral votes. A histogram of this distribution, with a vertical line at 269 (the threshold for winning), shows the range of possible outcomes. The fraction of simulations where the Democrat exceeds 269 electoral votes gives the estimated win probability.

### Adding Common Shocks (Correlation)

The independent model treats each state's outcome as independent, which understates the variance of the total. In reality, national factors (the economy, candidate quality, late-breaking events) shift all states in the same direction. We model this with a common shock using a logistic link function:

$$\Pr(\text{State } j \text{ is Dem}) = \frac{\exp(\alpha_j + \epsilon)}{\exp(\alpha_j + \epsilon) + 1}$$

where $\epsilon$ is a common $U[-k, k]$ shock and $\alpha_j$ is a state-level parameter calibrated so that without the shock, the probability matches the original forecast.

The logistic function $\frac{e^x}{e^x + 1}$ maps any real number to the interval $(0, 1)$, making it a natural choice for modeling probabilities. The parameter $\alpha_j$ is recovered by inverting this relationship:

```python
def gen_alpha(p, k):
    """Generate alpha parameter from probability p and shock range k."""
    if p <= 0.0001:
        return -10
    elif p >= 0.9999:
        return 10
    else:
        return k + np.log(np.exp(2*p*k) - 1) - np.log(np.exp(2*k) - np.exp(2*k*p))
```

The simulation with common shocks produces a wider distribution of electoral votes. A plot of mean Democratic electoral votes against the shock value shows a clear monotonic relationship: positive shocks favor the Democrat across all states, while negative shocks favor the Republican. This captures the intuition that election-night surprises tend to be correlated across states.

## Simulating an Econometric Method

Simulation is invaluable for understanding the finite-sample behavior of econometric estimators. While asymptotic theory tells us that OLS estimators are normally distributed in large samples (allowing us to use $t$ and $F$ tests), these approximations may not hold well in small samples, especially with non-normal error distributions.

We set up a simple linear model with highly non-normal errors drawn from a beta distribution:

```python
def sim_linear_model(n, beta0=1, beta1=1, sigma_x=1, sigma_u=1):
    """Simulate a linear model and return OLS estimate and standard error."""
    x = np.random.normal(0, sigma_x, n)
    u = (np.random.beta(0.5, 0.5, n) - 0.5) * 2 * sigma_u * np.sqrt(8)
    y = beta0 + beta1 * x + u

    X = sm.add_constant(x)
    model = sm.OLS(y, X).fit()

    return {
        'estimate': model.params[1],
        'std_error': model.bse[1]
    }
```

Running this 10,000 times with $n = 25$ produces a distribution of $\hat{\beta}_1$ estimates. The mean of the estimates should be close to the true value ($\beta_1 = 1$), confirming unbiasedness. A histogram of the estimates, overlaid with a theoretical normal density, shows how closely the finite-sample distribution matches the asymptotic approximation.

We can also examine the distribution of the $t$-statistic under the null hypothesis $H_0: \beta_1 = 1$:

$$t = \frac{\hat{\beta}_1 - 1}{\text{SE}(\hat{\beta}_1)}$$

A histogram of the simulated $t$-statistics, overlaid with the theoretical $t(23)$ distribution, reveals how well the $t$-distribution approximation holds. The empirical Type I error rate (the fraction of simulations where $|t|$ exceeds the critical value) should be close to the nominal level of 0.05:

```python
t_crit = stats.t.ppf(0.975, df=23)
type_1_error = np.mean(np.abs(sim_df_25['t_stat']) > t_crit)
```

If the empirical rejection rate is close to 0.05, the $t$-test is performing well even with the non-normal errors. If it deviates substantially, the asymptotic approximation is poor and alternative methods (such as bootstrapping) may be needed.

## Soccer Scorelines Simulation

As a final application, we simulate soccer match outcomes using a Poisson model calibrated with FiveThirtyEight's team ratings. Goals scored in a soccer match are well-approximated by a Poisson distribution:

$$\Pr(k) = \frac{\lambda^k e^{-\lambda}}{k!}$$

For team $i$ playing against team $j$, the expected goals scored by team $i$ is:

$$\lambda_{ij} = \exp(\alpha_i - \delta_j)$$

where $\alpha_i$ measures team $i$'s offensive strength and $\delta_j$ measures team $j$'s defensive strength. These parameters are derived from the FiveThirtyEight offensive and defensive ratings by normalizing against league averages:

```python
prem_league['alpha'] = np.log(prem_league['off']) - lmean_def
prem_league['delta'] = lmean_off - np.log(prem_league['def'])
```

A single match is simulated by drawing Poisson random variables:

```python
def draw_score(team1, team2):
    """Simulate a match between two teams."""
    lambda1 = np.exp(alpha_dict[team1] - delta_dict[team2])
    lambda2 = np.exp(alpha_dict[team2] - delta_dict[team1])
    return np.random.poisson(lambda1), np.random.poisson(lambda2)
```

By simulating 10,000 matches between two teams, we can estimate win/draw/loss probabilities and average scorelines. For example, simulating Liverpool vs Arsenal produces estimated win probabilities for each team and the draw probability, along with expected goals for each side.

## R to Python Random Number Mapping

For reference, here is a mapping of common random number generation functions between R and Python:

| R Function | Python Equivalent |
|------------|-------------------|
| `runif(n, min, max)` | `np.random.uniform(min, max, n)` |
| `rnorm(n, mean, sd)` | `np.random.normal(mean, sd, n)` |
| `rpois(n, lambda)` | `np.random.poisson(lambda, n)` |
| `rbeta(n, a, b)` | `np.random.beta(a, b, n)` |
| `rbinom(n, size, prob)` | `np.random.binomial(size, prob, n)` |
| `sample(x, n, replace)` | `np.random.choice(x, n, replace=replace)` |
| `ifelse(cond, yes, no)` | `np.where(cond, yes, no)` |

A key performance note: in Python, vectorized operations with NumPy are much faster than loops. Always generate all random numbers at once (e.g., `np.random.uniform(0, 1, (n_sims, n_states))`) rather than drawing one at a time in a loop.

## Summary

- The law of large numbers justifies simulation: sample means converge to population means as the sample size grows
- Monte Carlo simulation estimates quantities by constructing random variables whose expectations equal the target value
- The Monte Carlo estimate of pi uses random points in a square and checks whether they fall inside a unit circle
- Electoral College simulations illustrate how state-level probabilities combine into an overall win probability
- Adding common shocks to state-level models introduces realistic correlation and widens the distribution of outcomes
- Simulation reveals finite-sample properties of econometric estimators that asymptotic theory alone cannot capture
- The empirical Type I error rate from simulation validates whether standard test statistics have correct size
- Poisson models combined with simulation produce realistic match-outcome distributions for sports forecasting
- Vectorized NumPy operations are essential for fast simulation in Python
