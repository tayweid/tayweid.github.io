# R to Python Notebook Conversion Plan

## Overview

Convert 15 R-based Jupyter notebooks in the econ-2823 course to Python equivalents. The course covers numerical methods, simulation, maximum likelihood, GLMs, binary/ordered/multinomial choice models, selection models, and survival analysis.

**Location:** `classes/notebooks/`
**Output Strategy:** Create `*_Python.ipynb` files alongside R versions
**Shared Module:** Create `utils.py` for common operations

---

## Notebook Inventory

| # | Notebook | Language | Conversion Difficulty | Primary Topics |
|---|----------|----------|----------------------|----------------|
| 01 | Jupyter.ipynb | R | **Easy** | Jupyter intro, basic R/tidyverse, ggplot2 |
| 02 | NumericalMethods-1.ipynb | R | Medium | Numerical derivatives, Taylor expansion, Newton-Raphson |
| 03 | NumericalMethods-2.ipynb | R | Medium | Numerical optimization, optim(), gradient methods |
| 05 | Simulation.ipynb | R | Medium | Monte Carlo, electoral simulation, finite-sample properties |
| 06 | NLSandQR.ipynb | R | Medium | Nonlinear least squares, quantile regression |
| 08 | MaxLikelihood1.ipynb | R | Medium | MLE basics, Poisson models, soccer scoring |
| 09 | MaxLikelihood2.ipynb | R | Medium | Standard errors via Fisher information, delta method |
| 10 | SQL_R.ipynb | R | **Easy** | Database queries (trivial conversion) |
| 11 | StdErrors.ipynb | R | Medium | Bootstrap, resampling, likelihood ratio tests |
| 12 | GLMs.ipynb | R | **Easy** | Generalized linear models |
| 13 | BinaryOutcomes.ipynb | R | Medium | Logit/probit, marginal effects |
| 14 | Ordered.ipynb | R | **Hard** | Ordered logit/probit (polr) |
| 15 | MultinomialChoice.ipynb | R | **Hard** | Multinomial logit/probit (mlogit) |
| 16 | CensoringAndSelection.ipynb | R | **Hard** | Tobit, Heckman selection models |
| 17 | Hazards.ipynb | R | Medium | Survival analysis, Cox PH, AFT models |

**Already Python:** 00_welcome.ipynb, 04_API_python.ipynb, 07_FindingData.ipynb, 10_SQL_Python.ipynb

---

## Python Library Requirements

### Core Libraries (install via pip)
```
numpy
pandas
scipy
statsmodels
matplotlib
seaborn
scikit-learn
```

### Specialized Libraries
```
lifelines          # Survival analysis (Notebook 17)
pyreadr            # Reading .rda files from R
arch               # Bootstrap methods (optional)
```

### Not Available in Python (require custom implementation)
- **Marginal effects** with standard errors (partial statsmodels support)
- **Ordered logit/probit** (statsmodels has `OrderedModel` but less polished than R's `polr`)
- **Multinomial probit** (no direct equivalent to `mlogit`)
- **Heckman selection models** (statsmodels has partial support)

---

## Conversion Strategy by Notebook

### Phase 1: Foundational Notebooks (01-03)

#### Notebook 01: Jupyter.ipynb
**Effort:** 1-2 hours
**Strategy:** Convert R/tidyverse examples to pandas/matplotlib

| R Code | Python Equivalent |
|--------|-------------------|
| `library(tidyverse)` | `import pandas as pd` |
| `read_csv("file.csv")` | `pd.read_csv("file.csv")` |
| `head(df)` | `df.head()` |
| `lm(y ~ x)` | `sm.OLS(y, sm.add_constant(x)).fit()` |
| `ggplot() + geom_line()` | `plt.plot()` or `sns.lineplot()` |

#### Notebook 02: NumericalMethods-1.ipynb
**Effort:** 3-4 hours
**Strategy:** Core numerical methods - these go into `utils.py`

| R Code | Python Equivalent |
|--------|-------------------|
| `solve(A)` | `np.linalg.solve(A, b)` or `np.linalg.inv(A)` |
| `rbind(c(2,3), c(1,1))` | `np.array([[2,3], [1,1]])` |
| `function(f, x, eps) {...}` | `def func(f, x, eps): ...` |
| Newton-Raphson loop | Same logic with `while` loop |

#### Notebook 03: NumericalMethods-2.ipynb
**Effort:** 3-4 hrs
**Strategy:** Map R's `optim()` to `scipy.optimize`

| R Code | Python Equivalent |
|--------|-------------------|
| `optim(x0, f, method="BFGS")` | `optimize.minimize(f, x0, method='BFGS')` |
| `optim(..., hessian=TRUE)` | `optimize.minimize(..., options={'return_hess': True})` or custom |
| `is.positive.definite(H)` | `np.all(np.linalg.eigvals(H) > 0)` |
| `optimize(f, interval=c(a,b))` | `optimize.minimize_scalar(f, bounds=(a,b), method='bounded')` |

---

### Phase 2: Simulation & MLE (05-09)

#### Notebook 05: Simulation.ipynb
**Effort:** 4-6 hours
**Key conversions:**

| R Function | Python Equivalent |
|------------|-------------------|
| `runif(n, min, max)` | `np.random.uniform(min, max, n)` |
| `rnorm(n, mean, sd)` | `np.random.normal(mean, sd, n)` |
| `rpois(n, lambda)` | `np.random.poisson(lambda, n)` |
| `ifelse(cond, yes, no)` | `np.where(cond, yes, no)` |
| `sapply(vec, fun)` | `[fun(x) for x in vec]` or `np.vectorize(fun)(vec)` |
| `lm(y ~ x)` | `sm.OLS(y, sm.add_constant(x)).fit()` |

**Note:** Electoral simulation uses 500K iterations - ensure vectorization for performance.

#### Notebook 06: NLSandQR.ipynb
**Effort:** 4-6 hours
**Key conversions:**

| R Function | Python Equivalent |
|------------|-------------------|
| `nls(formula, data, start)` | `scipy.optimize.curve_fit(func, x, y, p0)` |
| `rq(y ~ x, tau=0.5)` | `sm.QuantReg(y, X).fit(q=0.5)` |
| `confint(model)` | Manual via delta method or bootstrap |
| `predictNLS()` | Custom uncertainty propagation |

**Challenge:** R's `nls()` formula interface is more elegant; Python requires explicit function definition.

#### Notebook 08: MaxLikelihood1.ipynb
**Effort:** 4-6 hours
**Key conversions:**

| R Function | Python Equivalent |
|------------|-------------------|
| `dnorm(x, mean, sd, log=TRUE)` | `scipy.stats.norm.logpdf(x, mean, sd)` |
| `dpois(k, lambda, log=TRUE)` | `scipy.stats.poisson.logpmf(k, lambda)` |
| `optim(par, fn, control=list(fnscale=-1))` | `scipy.optimize.minimize(lambda p: -fn(p), par)` |

**Pattern:** Define log-likelihood function, use `scipy.optimize.minimize` with negated function.

#### Notebook 09: MaxLikelihood2.ipynb
**Effort:** 5-7 hours
**Key conversions:**

| R Concept | Python Approach |
|-----------|-----------------|
| Numerical gradient (score vector) | `scipy.optimize.approx_fprime()` |
| Fisher Information | `scores.T @ scores / n` |
| Variance-covariance matrix | `np.linalg.inv(fisher_info) / n` |
| `gather()` (wide→long) | `pd.melt()` |
| `glm(..., family=poisson)` | `sm.GLM(..., family=sm.families.Poisson())` |
| Loading .rda files | `pyreadr.read_r('file.rda')` |

---

### Phase 3: Inference & GLMs (10-13)

#### Notebook 10: SQL_R.ipynb
**Effort:** 1-2 hours
**Strategy:** Near-trivial - replace RSQLite with sqlite3/pandas

| R Code | Python Equivalent |
|--------|-------------------|
| `dbConnect(RSQLite::SQLite(), "survey.db")` | `sqlite3.connect("survey.db")` |
| `dbGetQuery(conn, "SELECT...")` | `pd.read_sql_query("SELECT...", conn)` |
| `dbDisconnect(conn)` | `conn.close()` |

#### Notebook 11: StdErrors.ipynb
**Effort:** 5-7 hours
**Key conversions:**

| R Function | Python Equivalent |
|------------|-------------------|
| `boot(data, statistic, R=10000)` | Custom: `[statistic(data[np.random.choice(...)]) for _ in range(10000)]` |
| `boot.ci(boot_obj, type="bca")` | Custom BCa implementation or `arch.bootstrap` |
| `mvrnorm(n, mu, Sigma)` | `np.random.multivariate_normal(mu, Sigma, n)` |
| `lrtest(model1, model2)` | `2 * (model1.llf - model2.llf)` vs chi-square |
| `vcov(model)` | `model.cov_params()` |

#### Notebook 12: GLMs.ipynb
**Effort:** 2-3 hours
**Strategy:** Direct statsmodels translation

| R Code | Python Equivalent |
|--------|-------------------|
| `glm(y ~ x1 + x2, family="poisson")` | `sm.GLM(y, X, family=sm.families.Poisson()).fit()` |
| `glm(..., family="binomial")` | `sm.GLM(y, X, family=sm.families.Binomial()).fit()` |
| `coef(model)` | `model.params` |
| `summary(model)` | `model.summary()` |

#### Notebook 13: BinaryOutcomes.ipynb
**Effort:** 5-7 hours
**Key conversions:**

| R Function | Python Equivalent |
|------------|-------------------|
| `glm(..., family="binomial")` | `sm.GLM(..., family=sm.families.Binomial())` |
| `glm(..., family=binomial(link="probit"))` | `sm.Probit(y, X).fit()` |
| `plogis(x)` | `scipy.special.expit(x)` |
| `margins(model)` | Custom: compute derivatives, average across observations |

**Challenge:** R's `margins` package computes average marginal effects with SEs automatically. Python requires manual delta method implementation.

---

### Phase 4: Advanced Models (14-17)

#### Notebook 14: Ordered.ipynb
**Effort:** 8-12 hours
**Challenge:** R's `MASS::polr()` is elegant; Python's `statsmodels.OrderedModel` exists but is less user-friendly.

| R Function | Python Approach |
|-----------|-----------------|
| `polr(y ~ x, method="logit")` | `OrderedModel(y, X, distr='logit').fit()` |
| `polr(y ~ x, method="probit")` | `OrderedModel(y, X, distr='probit').fit()` |
| `model$zeta` (thresholds) | Included in `model.params` |
| `fitted.values` (probability matrix) | `model.predict()` with appropriate method |

**Fallback:** If statsmodels inadequate, implement custom MLE with `scipy.optimize`.

#### Notebook 15: MultinomialChoice.ipynb
**Effort:** 10-15 hours
**Challenge:** R's `mlogit` package is highly specialized. No direct Python equivalent.

**Options:**
1. **statsmodels.discrete.discrete_model.MNLogit** - Basic multinomial logit only
2. **Custom implementation** - Write MLE for conditional logit
3. **PyLogit** - Third-party package (less maintained)

| R Concept | Python Approach |
|-----------|-----------------|
| `dfidx()` data formatting | Manual pandas reshaping to long format |
| `mlogit(choice ~ cost | income | ivt)` | Custom likelihood with `scipy.optimize` |
| Multinomial probit | Custom simulated MLE (no package support) |
| Mixed logit | Custom random coefficient model |

**Recommendation:** Start with basic multinomial logit via statsmodels, note limitations for advanced models.

#### Notebook 16: CensoringAndSelection.ipynb
**Effort:** 10-15 hours
**Challenge:** Selection models (Heckman) have limited Python support.

| R Function | Python Approach |
|------------|-----------------|
| `tobit(y ~ x, left=L, right=R)` | Custom MLE or limited statsmodels support |
| `selection(selection=..., outcome=...)` | `statsmodels.regression.Heckit` (limited) |
| Interval regression | Custom MLE with `scipy.optimize` |

**Heckman two-step approach:**
```python
# Step 1: Probit for selection
probit = sm.Probit(selected, Z).fit()
# Step 2: Compute inverse Mills ratio
imr = scipy.stats.norm.pdf(probit.fittedvalues) / scipy.stats.norm.cdf(probit.fittedvalues)
# Step 3: OLS with IMR as additional regressor
ols = sm.OLS(y[selected], np.c_[X[selected], imr[selected]]).fit()
```

#### Notebook 17: Hazards.ipynb
**Effort:** 5-7 hours
**Strategy:** Use `lifelines` package (mature and well-documented)

| R Function | Python Equivalent |
|------------|-------------------|
| `Surv(time, event)` | `lifelines` uses separate duration/event columns |
| `survreg(..., dist="weibull")` | `lifelines.WeibullAFTFitter().fit()` |
| `survreg(..., dist="lognormal")` | `lifelines.LogNormalAFTFitter().fit()` |
| `coxph(Surv(...) ~ x)` | `lifelines.CoxPHFitter().fit()` |
| `predict(model, type="risk")` | `model.predict_partial_hazard()` |

---

## Common Code Patterns Reference

### R Formula → Python Design Matrix

```python
# R: lm(y ~ x1 + x2 + x1:x2)
# Python:
import patsy
y, X = patsy.dmatrices('y ~ x1 + x2 + x1:x2', data=df)
model = sm.OLS(y, X).fit()
```

### R Apply Functions → Python

```python
# R: sapply(vec, fun)
# Python options:
result = [fun(x) for x in vec]           # List comprehension
result = np.array([fun(x) for x in vec]) # As numpy array
result = np.vectorize(fun)(vec)          # Vectorized (not always faster)
result = df['col'].apply(fun)            # Pandas apply
```

### R Optimization → Python

```python
# R: optim(par, fn, control=list(fnscale=-1))  # Maximize
# Python:
from scipy.optimize import minimize
result = minimize(lambda p: -fn(p), x0=par, method='BFGS')
# result.x contains optimal parameters
# result.fun contains (negated) optimal value
```

---

## Conversion Order (Sequential from 01)

| Order | Notebook | Effort | Key New Concepts |
|-------|----------|--------|------------------|
| 1 | 01_Jupyter | 1-2 hrs | Basic setup, pandas, matplotlib |
| 2 | 02_NumericalMethods-1 | 3-4 hrs | Numerical derivatives, Newton-Raphson |
| 3 | 03_NumericalMethods-2 | 3-4 hrs | scipy.optimize, optim equivalents |
| 4 | 05_Simulation | 4-6 hrs | Monte Carlo, random distributions |
| 5 | 06_NLSandQR | 4-6 hrs | curve_fit, QuantReg |
| 6 | 08_MaxLikelihood1 | 4-6 hrs | MLE with scipy.optimize |
| 7 | 09_MaxLikelihood2 | 5-7 hrs | Fisher information, delta method |
| 8 | 10_SQL_R | 1-2 hrs | sqlite3/pandas (trivial) |
| 9 | 11_StdErrors | 5-7 hrs | Bootstrap implementation |
| 10 | 12_GLMs | 2-3 hrs | statsmodels GLM |
| 11 | 13_BinaryOutcomes | 5-7 hrs | Logit/probit, marginal effects |
| 12 | 14_Ordered | 8-12 hrs | OrderedModel or custom MLE |
| 13 | 15_MultinomialChoice | 10-15 hrs | Custom multinomial logit |
| 14 | 16_CensoringAndSelection | 10-15 hrs | Tobit, Heckman models |
| 15 | 17_Hazards | 5-7 hrs | lifelines package |

**Estimated Total: 70-105 hours**

---

## Shared Utility Module: `utils.py`

Create `classes/notebooks/utils.py` with reusable functions:

```python
"""
Econometrics utilities for Python notebook conversions.
"""
import numpy as np
import pandas as pd
from scipy import optimize, stats
import statsmodels.api as sm

# =============================================================================
# NUMERICAL DERIVATIVES (from Notebooks 02-03)
# =============================================================================

def numerical_derivative(f, x, eps=1e-6):
    """Centered numerical derivative (O(eps^2) accuracy)."""
    return (f(x + eps) - f(x - eps)) / (2 * eps)

def numerical_derivative_high_order(f, x, eps=1e-6):
    """Five-point stencil derivative (O(eps^4) accuracy)."""
    return (-f(x + 2*eps) + 8*f(x + eps) - 8*f(x - eps) + f(x - 2*eps)) / (12 * eps)

def numerical_second_derivative(f, x, eps=1e-4):
    """Five-point stencil second derivative."""
    return (-f(x + 2*eps) + 16*f(x + eps) - 30*f(x) + 16*f(x - eps) - f(x - 2*eps)) / (12 * eps**2)

def numerical_gradient(f, x, eps=1e-6):
    """Gradient vector for multivariate function."""
    x = np.asarray(x, dtype=float)
    grad = np.zeros_like(x)
    for i in range(len(x)):
        x_plus = x.copy(); x_plus[i] += eps
        x_minus = x.copy(); x_minus[i] -= eps
        grad[i] = (f(x_plus) - f(x_minus)) / (2 * eps)
    return grad

def numerical_hessian(f, x, eps=1e-5):
    """Hessian matrix via finite differences."""
    x = np.asarray(x, dtype=float)
    n = len(x)
    H = np.zeros((n, n))
    for i in range(n):
        for j in range(n):
            x_pp = x.copy(); x_pp[i] += eps; x_pp[j] += eps
            x_pm = x.copy(); x_pm[i] += eps; x_pm[j] -= eps
            x_mp = x.copy(); x_mp[i] -= eps; x_mp[j] += eps
            x_mm = x.copy(); x_mm[i] -= eps; x_mm[j] -= eps
            H[i, j] = (f(x_pp) - f(x_pm) - f(x_mp) + f(x_mm)) / (4 * eps**2)
    return H

# =============================================================================
# ROOT FINDING (from Notebook 02)
# =============================================================================

def newton_raphson(f, x0, tol=1e-8, max_iter=50, eps=1e-6):
    """Newton-Raphson root finding."""
    x = x0
    for i in range(max_iter):
        fx = f(x)
        if abs(fx) < tol:
            return x, i, True
        dfx = numerical_derivative(f, x, eps)
        if abs(dfx) < 1e-12:
            return x, i, False  # derivative too small
        x = x - fx / dfx
    return x, max_iter, False

# =============================================================================
# MAXIMUM LIKELIHOOD (from Notebooks 08-09)
# =============================================================================

def maximize_likelihood(log_likelihood, x0, method='BFGS', **kwargs):
    """Maximize log-likelihood function."""
    result = optimize.minimize(
        lambda x: -log_likelihood(x),
        x0,
        method=method,
        **kwargs
    )
    result.fun = -result.fun  # Convert back to log-likelihood
    return result

def fisher_information(log_likelihood, theta, eps=1e-5):
    """Estimate Fisher information via numerical Hessian."""
    H = numerical_hessian(lambda x: -log_likelihood(x), theta, eps)
    return H

def mle_standard_errors(log_likelihood, theta, eps=1e-5):
    """Standard errors from inverse Fisher information."""
    I = fisher_information(log_likelihood, theta, eps)
    try:
        cov = np.linalg.inv(I)
        return np.sqrt(np.diag(cov))
    except np.linalg.LinAlgError:
        return np.full(len(theta), np.nan)

# =============================================================================
# BOOTSTRAP (from Notebook 11)
# =============================================================================

def bootstrap(data, statistic, n_boot=1000, seed=None):
    """Bootstrap resampling."""
    rng = np.random.default_rng(seed)
    data = np.asarray(data)
    n = len(data)
    estimates = []
    for _ in range(n_boot):
        idx = rng.choice(n, size=n, replace=True)
        sample = data[idx] if data.ndim == 1 else data[idx, :]
        estimates.append(statistic(sample))
    return np.array(estimates)

def bootstrap_ci(estimates, alpha=0.05, method='percentile'):
    """Bootstrap confidence interval."""
    if method == 'percentile':
        return np.percentile(estimates, [100*alpha/2, 100*(1-alpha/2)])
    elif method == 'basic':
        theta = np.mean(estimates)
        return 2*theta - np.percentile(estimates, [100*(1-alpha/2), 100*alpha/2])
    else:
        raise ValueError(f"Unknown method: {method}")

# =============================================================================
# MARGINAL EFFECTS (from Notebook 13)
# =============================================================================

def marginal_effects_binary(model, X, link='logit'):
    """Compute average marginal effects for binary outcome model."""
    beta = model.params
    linear_pred = X @ beta
    if link == 'logit':
        pdf = stats.logistic.pdf(linear_pred)
    elif link == 'probit':
        pdf = stats.norm.pdf(linear_pred)
    else:
        raise ValueError(f"Unknown link: {link}")
    ame = (pdf[:, np.newaxis] * beta).mean(axis=0)
    return ame

# =============================================================================
# PLOTTING UTILITIES
# =============================================================================

PITT_BLUE = "#003594"
PITT_GOLD = "#FFB81C"
PITT_DGRAY = "#75787B"
PITT_GRAY = "#97999B"
PITT_LGRAY = "#C8C9C7"

def set_pitt_style():
    """Set matplotlib style to match R notebooks."""
    import matplotlib.pyplot as plt
    plt.rcParams.update({
        'figure.figsize': (10, 10/1.68),
        'axes.facecolor': 'white',
        'axes.grid': True,
        'grid.color': PITT_GRAY,
        'grid.linewidth': 0.5,
    })
```

---

## Verification Strategy

For each converted notebook:
1. Run both R and Python versions on same data
2. Compare coefficient estimates (should match to 3-4 decimal places)
3. Compare standard errors
4. Compare predictions/fitted values
5. Visual comparison of any plots

---

## File Structure After Conversion

```
classes/notebooks/
├── utils.py                          # NEW: Shared utilities
├── 01_Jupyter.ipynb                  # R version (keep)
├── 01_Jupyter_Python.ipynb           # NEW: Python version
├── 02_NumericalMethods-1.ipynb       # R version (keep)
├── 02_NumericalMethods-1_Python.ipynb # NEW
├── ...
└── 17_Hazards_Python.ipynb           # NEW
```

---

## Key Decisions Made

1. **File strategy:** Create `*_Python.ipynb` alongside R versions
2. **Conversion order:** Sequential from 01
3. **Shared code:** Create `utils.py` for reusable functions
4. **Pedagogical content:** Preserve explanations, adapt for Python idioms
