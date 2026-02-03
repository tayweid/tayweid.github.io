# R to Python Notebook Conversions

## Overview

15 R-based Jupyter notebooks in the econ-2823 course have been converted to Python equivalents. All Python notebooks live alongside the R originals in `classes/notebooks/`. A shared utility module `utils.py` provides common functions used across notebooks.

**Location:** `classes/notebooks/`
**Naming Convention:** `*_Python.ipynb` files alongside R versions
**Shared Module:** `utils.py`

---

## File Map

### Shared Module

| File | Description |
|------|-------------|
| `utils.py` | Shared utility functions: numerical derivatives, Newton-Raphson, MLE helpers, bootstrap, marginal effects, delta method, inverse Mills ratio, Pitt-themed plotting |

### Already-Python Notebooks (no conversion needed)

| File | Topics |
|------|--------|
| `00_welcome.ipynb` | Course welcome |
| `04_API_python.ipynb` | API data access |
| `07_FindingData.ipynb` | Data sources |
| `10_SQL_Python.ipynb` | SQL from Python (pre-existing) |

### Converted Notebooks

| R Original | Python Version | Cells | Topics |
|------------|----------------|-------|--------|
| `01_Jupyter.ipynb` | `01_Jupyter_Python.ipynb` | ~27 | Jupyter intro, pandas, matplotlib, OLS basics |
| `02_NumericalMethods-1.ipynb` | `02_NumericalMethods-1_Python.ipynb` | ~40 | Numerical derivatives, Taylor expansion, Newton-Raphson |
| `03_NumericalMethods-2.ipynb` | `03_NumericalMethods-2_Python.ipynb` | ~38 | Optimization (scipy.optimize), BFGS, Nelder-Mead, global optimization |
| `05_Simulation.ipynb` | `05_Simulation_Python.ipynb` | ~45 | Monte Carlo pi, electoral college simulation, OLS finite-sample properties, soccer Poisson |
| `06_NLSandQR.ipynb` | `06_NLSandQR_Python.ipynb` | 119 | Nonlinear least squares (curve_fit), logistic growth, social media data, quantile regression |
| `08_MaxLikilihood1.ipynb` | `08_MaxLikelihood1_Python.ipynb` | 114 | Likelihood theory, normal/Poisson/multinomial MLE, soccer scoreline model, GLM comparison |
| `09_MaxLikelihood2.ipynb` | `09_MaxLikelihood2_Python.ipynb` | ~60 | Score vectors, Fisher information, Hessian-based SEs, soccer model SEs, GLM Poisson, delta method |
| `10_SQL_R.ipynb` | `10_SQL_R_Python.ipynb` | ~20 | SQLite queries via sqlite3/pandas |
| `11_StdErrors.ipynb` | `11_StdErrors_Python.ipynb` | 146 | Geometric MLE, parameter transformations, delta method, bootstrap (percentile + BCa), LR tests, AIC/BIC |
| `12_GLMs.ipynb` | `12_GLMs_Python.ipynb` | 51 | GLM theory, Poisson regression, deviance, model comparison, binomial/logistic regression |
| `13_BinaryOutcomes.ipynb` | `13_BinaryOutcomes_Python.ipynb` | 73 | Logit/probit, latent variable interpretation, NFL field goals, marginal effects (AME + at-means) |
| `14_Ordered.ipynb` | `14_Ordered_Python.ipynb` | 55 | Ordered logit/probit (OrderedModel + custom MLE), e-cigarette data, marginal effects, predicted probabilities |
| `15_MultinomialChoice.ipynb` | `15_MultinomialChoice_Python.ipynb` | 51 | Conditional logit (custom MLE), IIA, multinomial probit, mixed logit, counterfactuals |
| `16_CensoringAndSelection.ipynb` | `16_CensoringAndSelection_Python.ipynb` | 83 | Tobit (custom MLE), interval regression, Heckman two-step selection, switching regression |
| `17_Hazards.ipynb` | `17_Hazards_Python.ipynb` | 50 | Survival analysis (lifelines), Weibull/LogNormal AFT, Cox PH, mortality data, recidivism |

---

## Notebook-by-Notebook Details

### 01: Jupyter Introduction

| | |
|---|---|
| **R file** | `01_Jupyter.ipynb` |
| **Python file** | `01_Jupyter_Python.ipynb` |
| **Data** | `MLB.csv` |

**What it covers:** Introduction to Jupyter, loading data, summary statistics, linear regression, basic plotting. Includes an R vs Python quick reference table.

| R | Python |
|---|--------|
| `library(tidyverse)` | `import pandas as pd` |
| `read_csv("file.csv")` | `pd.read_csv("file.csv")` |
| `head(df)` | `df.head()` |
| `summary(df)` | `df.describe()` |
| `lm(y ~ x, data=df)` | `sm.OLS(y, sm.add_constant(X)).fit()` |
| `ggplot() + geom_line()` | `plt.plot()` or `sns.regplot()` |

---

### 02: Numerical Methods 1

| | |
|---|---|
| **R file** | `02_NumericalMethods-1.ipynb` |
| **Python file** | `02_NumericalMethods-1_Python.ipynb` |
| **Data** | None |
| **utils.py functions used** | `numerical_derivative`, `numerical_derivative_high_order`, `numerical_second_derivative`, `newton_raphson` |

**What it covers:** Linear systems, numerical derivatives (forward, centered, five-point stencil), Taylor expansion derivation, Newton-Raphson root finding, scipy alternatives.

| R | Python |
|---|--------|
| `solve(A, b)` | `np.linalg.solve(A, b)` |
| `rbind(c(2,3), c(1,1))` | `np.array([[2,3], [1,1]])` |
| Custom derivative function | `utils.numerical_derivative()` |
| Custom Newton-Raphson | `utils.newton_raphson()` + `scipy.optimize.fsolve/brentq/newton` |

---

### 03: Numerical Methods 2

| | |
|---|---|
| **R file** | `03_NumericalMethods-2.ipynb` |
| **Python file** | `03_NumericalMethods-2_Python.ipynb` |
| **Data** | None |
| **utils.py functions used** | `numerical_gradient`, `numerical_hessian` |

**What it covers:** Multivariate optimization, second-order conditions via Hessian eigenvalues, BFGS, Nelder-Mead, global optimization (simulated annealing, basin-hopping), 1D optimization.

| R | Python |
|---|--------|
| `optim(x0, f, method="BFGS")` | `optimize.minimize(f, x0, method='BFGS')` |
| `optim(..., hessian=TRUE)` | `numerical_hessian()` or `res.hess_inv` |
| `is.positive.definite(H)` | `np.all(np.linalg.eigvals(H) > 0)` |
| `optimize(f, interval=c(a,b))` | `optimize.minimize_scalar(f, bounds=(a,b), method='bounded')` |
| `GenSA(fn=f, lower, upper)` | `optimize.dual_annealing(f, bounds)` |

---

### 05: Simulation

| | |
|---|---|
| **R file** | `05_Simulation.ipynb` |
| **Python file** | `05_Simulation_Python.ipynb` |
| **Data** | `538/` folder (FiveThirtyEight soccer data) |

**What it covers:** Monte Carlo pi estimation, electoral college simulation with common shocks, OLS finite-sample properties, soccer scorelines with Poisson process.

| R | Python |
|---|--------|
| `runif(n, min, max)` | `np.random.uniform(min, max, n)` |
| `rnorm(n, mean, sd)` | `np.random.normal(mean, sd, n)` |
| `rpois(n, lambda)` | `np.random.poisson(lambda, n)` |
| `ifelse(cond, yes, no)` | `np.where(cond, yes, no)` |
| `sapply(vec, fun)` | List comprehension or `np.vectorize` |

---

### 06: NLS and Quantile Regression

| | |
|---|---|
| **R file** | `06_NLSandQR.ipynb` |
| **Python file** | `06_NLSandQR_Python.ipynb` |
| **Data** | `social/SnapchatUsers.csv`, `social/TwitterUsers.csv`, `real_estate/sales_all.csv` |

**What it covers:** Nonlinear least squares via manual optimization and `curve_fit`, logistic growth models for social media, standard errors via Jacobian/delta method, quantile regression across multiple quantiles, real estate application.

| R | Python |
|---|--------|
| `nls(formula, data, start)` | `scipy.optimize.curve_fit(func, x, y, p0)` |
| `optim(par, fn)` | `scipy.optimize.minimize(fn, par, method='Nelder-Mead')` |
| `rq(y ~ x, tau=0.5)` | `sm.QuantReg(y, X).fit(q=0.5)` |
| `confint(model)` | `model.conf_int()` or manual delta method |
| `vcov(model)` | `pcov` from curve_fit or `model.cov_params()` |
| `predictNLS()` | Custom uncertainty propagation via delta method |

---

### 08: Maximum Likelihood 1

| | |
|---|---|
| **R file** | `08_MaxLikilihood1.ipynb` |
| **Python file** | `08_MaxLikelihood1_Python.ipynb` |
| **Data** | FiveThirtyEight soccer data (loaded via URL) |
| **utils.py functions used** | `maximize_likelihood`, `set_pitt_style` |

**What it covers:** Likelihood function concepts, log-likelihoods, analytical FOC for normal MLE, numerical normal MLE, Poisson/multinomial/uniform examples, soccer scoreline model (40-parameter MLE), GLM comparison.

| R | Python |
|---|--------|
| `dnorm(x, mean, sd, log=TRUE)` | `stats.norm.logpdf(x, loc=mean, scale=sd)` |
| `dpois(k, lambda, log=TRUE)` | `stats.poisson.logpmf(k, mu=lambda)` |
| `optim(par, fn, control=list(fnscale=-1))` | `optimize.minimize(lambda p: -fn(p), x0=par)` |
| `optimize(fn, interval, maximum=TRUE)` | `optimize.minimize_scalar(lambda x: -fn(x), bounds=interval)` |
| `glm(y~x, family=poisson)` | `sm.GLM(y, X, family=sm.families.Poisson()).fit()` |

---

### 09: Maximum Likelihood 2

| | |
|---|---|
| **R file** | `09_MaxLikelihood2.ipynb` |
| **Python file** | `09_MaxLikelihood2_Python.ipynb` |
| **Data** | `.rda` files (loaded via `pyreadr`) |
| **utils.py functions used** | `numerical_gradient`, `numerical_hessian`, `fisher_information`, `mle_standard_errors`, `mle_variance_covariance`, `score_vector`, `delta_method`, `load_rda` |

**What it covers:** MLE properties (consistency, asymptotic normality, efficiency), score vectors, Fisher information matrix, Cramer-Rao inequality, Hessian-based SEs, two-group Poisson, soccer model SEs, GLM comparison with factor references, delta method for transformed parameters.

| R | Python |
|---|--------|
| `sapply(data, score_fn)` | Vectorized numpy or list comprehension |
| `t(S) %*% S / n` | `S.T @ S / n` |
| `solve(A)` | `np.linalg.inv(A)` |
| `gather()` (wide to long) | `pd.melt()` |
| `glm(..., family=poisson)` | `smf.glm(..., family=sm.families.Poisson())` |
| `vcov(model)` | `model.cov_params()` |
| `load("file.rda")` | `pyreadr.read_r("file.rda")` or `utils.load_rda()` |

---

### 10: SQL

| | |
|---|---|
| **R file** | `10_SQL_R.ipynb` |
| **Python file** | `10_SQL_R_Python.ipynb` |
| **Data** | `survey.db` (SQLite) |

**What it covers:** SQLite database connections, SELECT queries, filtering, joins, aggregation. Near-trivial conversion since SQL queries are identical.

| R | Python |
|---|--------|
| `dbConnect(RSQLite::SQLite(), "survey.db")` | `sqlite3.connect("survey.db")` |
| `dbGetQuery(conn, "SELECT...")` | `pd.read_sql_query("SELECT...", conn)` |
| `dbDisconnect(conn)` | `conn.close()` |
| `dbCommit(conn)` | `conn.commit()` |

---

### 11: Standard Errors

| | |
|---|---|
| **R file** | `11_StdErrors.ipynb` |
| **Python file** | `11_StdErrors_Python.ipynb` |
| **Data** | Simulated |
| **utils.py functions used** | `bootstrap`, `bootstrap_ci`, `bootstrap_se`, `numerical_gradient`, `delta_method`, `likelihood_ratio_test` |

**What it covers:** Geometric distribution MLE, parameter transformations, delta method (manual + via utils), bootstrap resampling (percentile + BCa CIs), bootstrap variance-covariance, likelihood ratio tests, AIC/BIC model selection.

| R | Python |
|---|--------|
| `rgeom(n, p)` | `np.random.geometric(p, n) - 1` |
| `boot(data, stat, R=10000)` | `utils.bootstrap(data, stat, n_boot=10000)` |
| `boot.ci(bs, type="bca")` | Custom BCa implementation |
| `mvrnorm(n, mu, Sigma)` | `np.random.multivariate_normal(mu, Sigma, n)` |
| `lrtest(m1, m2)` | `utils.likelihood_ratio_test(ll_r, ll_u, df)` |
| `vcov(model)` | `model.cov_params()` |
| `glm(..., offset=...)` | `sm.GLM(..., offset=...)` |

---

### 12: GLMs

| | |
|---|---|
| **R file** | `12_GLMs.ipynb` |
| **Python file** | `12_GLMs_Python.ipynb` |
| **Data** | Simulated |

**What it covers:** GLM theory (families, link functions), Poisson regression, fitted values and linear predictors, deviance and model comparison, binomial/logistic regression, odds ratios.

| R | Python |
|---|--------|
| `glm(y ~ x, family="poisson")` | `sm.GLM(y, X, family=sm.families.Poisson()).fit()` |
| `glm(y ~ x, family="binomial")` | `sm.GLM(y, X, family=sm.families.Binomial()).fit()` |
| `coef(model)` | `model.params` |
| `model$deviance` | `model.deviance` |
| `AIC(model)` | `model.aic` |
| `predict(model, type="response")` | `model.predict()` |

---

### 13: Binary Outcomes

| | |
|---|---|
| **R file** | `13_BinaryOutcomes.ipynb` |
| **Python file** | `13_BinaryOutcomes_Python.ipynb` |
| **Data** | `nfl/fg.rdata` (loaded via `pyreadr`) |
| **utils.py functions used** | `marginal_effects_binary`, `marginal_effects_at_means`, `load_rda` |

**What it covers:** Logit and probit models, latent variable/utility interpretation, NFL field goal application (LPM vs logit vs probit), marginal effects at means, average marginal effects, model comparison (log-likelihood, AIC, BIC, pseudo R-squared).

| R | Python |
|---|--------|
| `glm(..., family="binomial")` | `sm.Logit(y, X).fit()` |
| `glm(..., family=binomial(link="probit"))` | `sm.Probit(y, X).fit()` |
| `plogis(x)` | `scipy.special.expit(x)` |
| `margins(model)` | `utils.marginal_effects_binary(model, X, link)` |
| `margins(model, at=list(x=val))` | `utils.marginal_effects_at_means(model, X, link)` |
| `load("file.rda")` | `pyreadr.read_r("file.rda")` |

---

### 14: Ordered Choice

| | |
|---|---|
| **R file** | `14_Ordered.ipynb` |
| **Python file** | `14_Ordered_Python.ipynb` |
| **Data** | `eCig/eCig.rdata` (loaded via `utils.load_rda`) |
| **utils.py functions used** | `load_rda`, `set_pitt_style` |

**What it covers:** Ordered multinomial theory (latent variables, thresholds), intercept-only verification via custom MLE, ordered logit/probit via `OrderedModel`, manual probability calculations, predicted probabilities by age, custom MLE with reparameterized thresholds, marginal effects (AME + at-means), logit vs probit comparison.

| R | Python |
|---|--------|
| `polr(y ~ x, method="logit")` | `OrderedModel(y, X, distr='logit').fit(method='bfgs')` |
| `polr(y ~ x, method="probit")` | `OrderedModel(y, X, distr='probit').fit(method='bfgs')` |
| `model$coefficients` | `result.params[:n_betas]` |
| `model$zeta` (thresholds) | `result.params[n_betas:]` |
| `model$fitted.values` | `result.predict()` |
| `plogis(x)` / `pnorm(x)` | `stats.logistic.cdf(x)` / `stats.norm.cdf(x)` |

---

### 15: Multinomial Choice

| | |
|---|---|
| **R file** | `15_MultinomialChoice.ipynb` |
| **Python file** | `15_MultinomialChoice_Python.ipynb` |
| **Data** | ModeCanada dataset (from `mlogit` package or CSV) |
| **utils.py functions used** | `mle_standard_errors`, `set_pitt_style` |

**What it covers:** Unordered multinomial choice theory, conditional logit via custom MLE (no direct Python equivalent to R's `mlogit`), IIA discussion, multinomial probit (structure only), mixed logit with simulated MLE, counterfactual predictions (train IVT/cost changes).

| R | Python |
|---|--------|
| `dfidx()` data formatting | Manual pandas reshaping to long format |
| `mlogit(choice ~ cost \| income \| ivt)` | Custom log-likelihood + `scipy.optimize.minimize` |
| `mlogit(..., rpar=c(cost="u"))` | Custom simulated MLE with random coefficients |
| `predict(model, newdata)` | Custom prediction from estimated parameters |
| `summary(mlogit.est)` | Manual formatted output |

**Note:** Python lacks a direct equivalent to R's `mlogit` package. The notebook implements conditional logit, mixed logit, and multinomial probit from scratch using `scipy.optimize`.

---

### 16: Censoring and Selection

| | |
|---|---|
| **R file** | `16_CensoringAndSelection.ipynb` |
| **Python file** | `16_CensoringAndSelection_Python.ipynb` |
| **Data** | Simulated + Mroz87 dataset (loaded from web CSV) |
| **utils.py functions used** | `mle_standard_errors`, `inverse_mills_ratio`, `set_pitt_style` |

**What it covers:** Censoring vs truncation, OLS bias from top-coding, Tobit model (custom MLE handling left/right/double censoring), interval regression (custom MLE), Heckman two-step selection model (probit + inverse Mills ratio + OLS), switching regression (Tobit Type 5).

| R | Python |
|---|--------|
| `tobit(y ~ x, left=L, right=R)` | Custom `tobit_loglik()` + `scipy.optimize.minimize` |
| `selection(selection=..., outcome=...)` | Custom `heckman_two_step()` function |
| `pnorm(x)` | `stats.norm.cdf(x)` |
| `dnorm(x)` | `stats.norm.pdf(x)` |
| Inverse Mills ratio | `utils.inverse_mills_ratio(z_hat)` |
| `Probit` selection equation | `sm.Probit(y, X).fit()` |

**Note:** Both the Tobit and Heckman models are implemented from scratch since Python packages have limited support compared to R's `AER::tobit` and `sampleSelection::selection`.

---

### 17: Hazards / Survival Analysis

| | |
|---|---|
| **R file** | `17_Hazards.ipynb` |
| **Python file** | `17_Hazards_Python.ipynb` |
| **Data** | Mortality CSVs, `hazards/recidivism.rdata` (loaded via `pyreadr`) |

**What it covers:** Survival analysis concepts, mortality data visualization, Weibull and LogNormal AFT models, Cox proportional hazards, AIC model comparison, prediction types (linear predictor, risk, expected).

| R | Python |
|---|--------|
| `library(survival)` | `from lifelines import CoxPHFitter, WeibullAFTFitter, ...` |
| `Surv(time, event)` | Separate `duration_col` and `event_col` arguments |
| `survreg(..., dist="weibull")` | `WeibullAFTFitter().fit(df, duration_col, event_col)` |
| `survreg(..., dist="lognormal")` | `LogNormalAFTFitter().fit(df, duration_col, event_col)` |
| `coxph(Surv(...) ~ x)` | `CoxPHFitter().fit(df, duration_col, event_col)` |
| `survfit()` | `KaplanMeierFitter().fit()` |
| `predict(model, type="risk")` | `model.predict_partial_hazard(df)` |
| `AIC(model)` | `model.AIC_` |

---

## Python Library Requirements

### Core (used by most notebooks)
```
numpy
pandas
scipy
statsmodels
matplotlib
seaborn
```

### Specialized
```
lifelines          # Notebook 17 (survival analysis)
pyreadr            # Notebooks 09, 13, 14, 17 (loading .rda files)
```

### Custom implementations (in notebooks, not packages)
- **Tobit model** (Notebook 16) -- custom MLE
- **Heckman selection** (Notebook 16) -- custom two-step
- **Conditional logit** (Notebook 15) -- custom MLE
- **Mixed logit** (Notebook 15) -- custom simulated MLE
- **Multinomial probit** (Notebook 15) -- structure only
- **Marginal effects for ordered models** (Notebook 14) -- custom function
- **BCa bootstrap CI** (Notebook 11) -- custom implementation

---

## Shared Module: `utils.py`

Located at `classes/notebooks/utils.py`. Functions organized by source notebook:

| Function | From Notebook | Description |
|----------|---------------|-------------|
| `numerical_derivative()` | 02 | Centered finite difference, O(eps^2) |
| `numerical_derivative_high_order()` | 02 | Five-point stencil, O(eps^4) |
| `numerical_second_derivative()` | 02 | Five-point stencil second derivative |
| `numerical_gradient()` | 03 | Gradient vector for multivariate functions |
| `numerical_hessian()` | 03 | Hessian matrix via finite differences |
| `newton_raphson()` | 02 | Scalar Newton-Raphson root finding |
| `newton_raphson_multivariate()` | 02 | Multivariate Newton-Raphson |
| `maximize_likelihood()` | 08 | Wrapper for `scipy.optimize.minimize` with negation |
| `fisher_information()` | 09 | Fisher info via numerical Hessian |
| `mle_standard_errors()` | 09 | SEs from inverse Fisher information |
| `mle_variance_covariance()` | 09 | Full variance-covariance matrix |
| `score_vector()` | 09 | Numerical score vector |
| `bootstrap()` | 11 | Nonparametric bootstrap resampling |
| `bootstrap_ci()` | 11 | Percentile and basic CIs |
| `bootstrap_se()` | 11 | Bootstrap standard error |
| `marginal_effects_binary()` | 13 | Average marginal effects for logit/probit |
| `marginal_effects_at_means()` | 13 | Marginal effects evaluated at means |
| `delta_method()` | 09, 11 | Delta method for transformed parameters |
| `likelihood_ratio_test()` | 11 | LR test statistic + p-value |
| `inverse_mills_ratio()` | 16 | IMR for Heckman selection models |
| `load_rda()` | 09, 13, 14 | Load R .rda files via pyreadr |
| `summary_stats()` | 01 | Quick summary statistics table |
| `set_pitt_style()` | all | Matplotlib style with Pitt colors |
| `PITT_BLUE`, `PITT_GOLD`, etc. | all | University of Pittsburgh brand color constants |

---

## File Structure

```
classes/notebooks/
├── utils.py                              # Shared utility module
│
├── 00_welcome.ipynb                      # Python (original)
│
├── 01_Jupyter.ipynb                      # R original
├── 01_Jupyter_Python.ipynb               # Python conversion
│
├── 02_NumericalMethods-1.ipynb           # R original
├── 02_NumericalMethods-1_Python.ipynb    # Python conversion
│
├── 03_NumericalMethods-2.ipynb           # R original
├── 03_NumericalMethods-2_Python.ipynb    # Python conversion
│
├── 04_API_python.ipynb                   # Python (original)
│
├── 05_Simulation.ipynb                   # R original
├── 05_Simulation_Python.ipynb            # Python conversion
│
├── 06_NLSandQR.ipynb                     # R original
├── 06_NLSandQR_Python.ipynb              # Python conversion
│
├── 07_FindingData.ipynb                  # Python (original)
│
├── 08_MaxLikilihood1.ipynb               # R original (note: typo in original name)
├── 08_MaxLikelihood1_Python.ipynb        # Python conversion (corrected spelling)
│
├── 09_MaxLikelihood2.ipynb               # R original
├── 09_MaxLikelihood2_Python.ipynb        # Python conversion
│
├── 10_SQL_Python.ipynb                   # Python (original, pre-existing)
├── 10_SQL_R.ipynb                        # R original
├── 10_SQL_R_Python.ipynb                 # Python conversion of the R version
│
├── 11_StdErrors.ipynb                    # R original
├── 11_StdErrors_Python.ipynb             # Python conversion
│
├── 12_GLMs.ipynb                         # R original
├── 12_GLMs_Python.ipynb                  # Python conversion
│
├── 13_BinaryOutcomes.ipynb               # R original
├── 13_BinaryOutcomes_Python.ipynb        # Python conversion
│
├── 14_Ordered.ipynb                      # R original
├── 14_Ordered_Python.ipynb               # Python conversion
│
├── 15_MultinomialChoice.ipynb            # R original
├── 15_MultinomialChoice_Python.ipynb     # Python conversion
│
├── 16_CensoringAndSelection.ipynb        # R original
├── 16_CensoringAndSelection_Python.ipynb # Python conversion
│
├── 17_Hazards.ipynb                      # R original
├── 17_Hazards_Python.ipynb               # Python conversion
│
├── 538/                                  # FiveThirtyEight soccer data
├── eCig/                                 # E-cigarette survey data
├── hazards/                              # Recidivism data
├── nfl/                                  # NFL field goal data
├── real_estate/                          # Real estate sales data
├── social/                               # Social media user data
└── MLB.csv                               # MLB batting data
```
