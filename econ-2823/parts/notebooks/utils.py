"""
Econometrics utilities for Python notebook conversions.
ECON 2823 - Shared utility functions for numerical methods,
maximum likelihood estimation, bootstrap inference, and more.
"""
import numpy as np
import pandas as pd
from scipy import optimize, stats
import statsmodels.api as sm

# =============================================================================
# NUMERICAL DERIVATIVES (from Notebooks 02-03)
# =============================================================================

def numerical_derivative(f, x, eps=1e-6):
    """
    Centered numerical derivative (O(eps^2) accuracy).

    Parameters
    ----------
    f : callable
        Function to differentiate
    x : float
        Point at which to evaluate derivative
    eps : float
        Step size for finite difference

    Returns
    -------
    float
        Approximate derivative f'(x)
    """
    return (f(x + eps) - f(x - eps)) / (2 * eps)


def numerical_derivative_high_order(f, x, eps=1e-6):
    """
    Five-point stencil derivative (O(eps^4) accuracy).

    More accurate than centered difference, uses formula:
    f'(x) = [-f(x+2h) + 8f(x+h) - 8f(x-h) + f(x-2h)] / (12h)

    Parameters
    ----------
    f : callable
        Function to differentiate
    x : float
        Point at which to evaluate derivative
    eps : float
        Step size for finite difference

    Returns
    -------
    float
        Approximate derivative f'(x)
    """
    return (-f(x + 2*eps) + 8*f(x + eps) - 8*f(x - eps) + f(x - 2*eps)) / (12 * eps)


def numerical_second_derivative(f, x, eps=1e-4):
    """
    Five-point stencil second derivative.

    Parameters
    ----------
    f : callable
        Function to differentiate
    x : float
        Point at which to evaluate second derivative
    eps : float
        Step size for finite difference

    Returns
    -------
    float
        Approximate second derivative f''(x)
    """
    return (-f(x + 2*eps) + 16*f(x + eps) - 30*f(x) + 16*f(x - eps) - f(x - 2*eps)) / (12 * eps**2)


def numerical_gradient(f, x, eps=1e-6):
    """
    Gradient vector for multivariate function using centered differences.

    Parameters
    ----------
    f : callable
        Multivariate function f: R^n -> R
    x : array-like
        Point at which to evaluate gradient
    eps : float
        Step size for finite difference

    Returns
    -------
    ndarray
        Gradient vector [df/dx1, df/dx2, ..., df/dxn]
    """
    x = np.asarray(x, dtype=float)
    grad = np.zeros_like(x)
    for i in range(len(x)):
        x_plus = x.copy()
        x_plus[i] += eps
        x_minus = x.copy()
        x_minus[i] -= eps
        grad[i] = (f(x_plus) - f(x_minus)) / (2 * eps)
    return grad


def numerical_hessian(f, x, eps=1e-5):
    """
    Hessian matrix via finite differences.

    Uses the formula for mixed partial derivatives:
    d2f/dxidxj = [f(xi+h,xj+h) - f(xi+h,xj-h) - f(xi-h,xj+h) + f(xi-h,xj-h)] / (4h^2)

    Parameters
    ----------
    f : callable
        Multivariate function f: R^n -> R
    x : array-like
        Point at which to evaluate Hessian
    eps : float
        Step size for finite difference

    Returns
    -------
    ndarray
        n x n Hessian matrix of second partial derivatives
    """
    x = np.asarray(x, dtype=float)
    n = len(x)
    H = np.zeros((n, n))
    for i in range(n):
        for j in range(n):
            x_pp = x.copy()
            x_pp[i] += eps
            x_pp[j] += eps
            x_pm = x.copy()
            x_pm[i] += eps
            x_pm[j] -= eps
            x_mp = x.copy()
            x_mp[i] -= eps
            x_mp[j] += eps
            x_mm = x.copy()
            x_mm[i] -= eps
            x_mm[j] -= eps
            H[i, j] = (f(x_pp) - f(x_pm) - f(x_mp) + f(x_mm)) / (4 * eps**2)
    return H


# =============================================================================
# ROOT FINDING (from Notebook 02)
# =============================================================================

def newton_raphson(f, x0, tol=1e-8, max_iter=50, eps=1e-6):
    """
    Newton-Raphson root finding algorithm.

    Finds x such that f(x) = 0 using iterative formula:
    x_{n+1} = x_n - f(x_n) / f'(x_n)

    Parameters
    ----------
    f : callable
        Function for which to find root
    x0 : float
        Initial guess
    tol : float
        Convergence tolerance (stops when |f(x)| < tol)
    max_iter : int
        Maximum number of iterations
    eps : float
        Step size for numerical derivative

    Returns
    -------
    tuple
        (root, iterations, converged)
        - root: approximate root
        - iterations: number of iterations used
        - converged: boolean indicating convergence
    """
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


def newton_raphson_multivariate(f, x0, tol=1e-8, max_iter=50, eps=1e-6):
    """
    Multivariate Newton-Raphson for system of equations.

    Finds x such that f(x) = 0 where f: R^n -> R^n

    Parameters
    ----------
    f : callable
        Vector-valued function f: R^n -> R^n
    x0 : array-like
        Initial guess
    tol : float
        Convergence tolerance
    max_iter : int
        Maximum iterations
    eps : float
        Step size for Jacobian computation

    Returns
    -------
    tuple
        (root, iterations, converged)
    """
    x = np.asarray(x0, dtype=float)
    n = len(x)

    for iteration in range(max_iter):
        fx = np.asarray(f(x))
        if np.linalg.norm(fx) < tol:
            return x, iteration, True

        # Compute Jacobian numerically
        J = np.zeros((n, n))
        for j in range(n):
            x_plus = x.copy()
            x_plus[j] += eps
            x_minus = x.copy()
            x_minus[j] -= eps
            J[:, j] = (np.asarray(f(x_plus)) - np.asarray(f(x_minus))) / (2 * eps)

        # Newton step: x_{n+1} = x_n - J^{-1} f(x_n)
        try:
            delta = np.linalg.solve(J, fx)
        except np.linalg.LinAlgError:
            return x, iteration, False

        x = x - delta

    return x, max_iter, False


# =============================================================================
# MAXIMUM LIKELIHOOD (from Notebooks 08-09)
# =============================================================================

def maximize_likelihood(log_likelihood, x0, method='BFGS', **kwargs):
    """
    Maximize log-likelihood function.

    Parameters
    ----------
    log_likelihood : callable
        Log-likelihood function to maximize
    x0 : array-like
        Initial parameter guess
    method : str
        Optimization method (default 'BFGS')
    **kwargs
        Additional arguments passed to scipy.optimize.minimize

    Returns
    -------
    OptimizeResult
        Result object with .x (optimal params) and .fun (log-likelihood value)
    """
    result = optimize.minimize(
        lambda x: -log_likelihood(x),
        x0,
        method=method,
        **kwargs
    )
    result.fun = -result.fun  # Convert back to log-likelihood
    return result


def fisher_information(log_likelihood, theta, eps=1e-5):
    """
    Estimate Fisher information via numerical Hessian of negative log-likelihood.

    The Fisher information is I(theta) = -E[d^2 log L / d theta^2]
    At the MLE, this equals the negative Hessian of the log-likelihood.

    Parameters
    ----------
    log_likelihood : callable
        Log-likelihood function
    theta : array-like
        Parameter values (typically MLE)
    eps : float
        Step size for numerical differentiation

    Returns
    -------
    ndarray
        Fisher information matrix
    """
    H = numerical_hessian(lambda x: -log_likelihood(x), theta, eps)
    return H


def mle_standard_errors(log_likelihood, theta, eps=1e-5):
    """
    Standard errors from inverse Fisher information.

    SE(theta_hat) = sqrt(diag(I(theta)^{-1}))

    Parameters
    ----------
    log_likelihood : callable
        Log-likelihood function
    theta : array-like
        Parameter values (typically MLE)
    eps : float
        Step size for numerical differentiation

    Returns
    -------
    ndarray
        Standard errors for each parameter
    """
    I = fisher_information(log_likelihood, theta, eps)
    try:
        cov = np.linalg.inv(I)
        return np.sqrt(np.diag(cov))
    except np.linalg.LinAlgError:
        return np.full(len(theta), np.nan)


def mle_variance_covariance(log_likelihood, theta, eps=1e-5):
    """
    Variance-covariance matrix from inverse Fisher information.

    Parameters
    ----------
    log_likelihood : callable
        Log-likelihood function
    theta : array-like
        Parameter values (typically MLE)
    eps : float
        Step size for numerical differentiation

    Returns
    -------
    ndarray
        Variance-covariance matrix
    """
    I = fisher_information(log_likelihood, theta, eps)
    try:
        return np.linalg.inv(I)
    except np.linalg.LinAlgError:
        return np.full((len(theta), len(theta)), np.nan)


def score_vector(log_likelihood, theta, eps=1e-6):
    """
    Compute score vector (gradient of log-likelihood).

    Parameters
    ----------
    log_likelihood : callable
        Log-likelihood function
    theta : array-like
        Parameter values
    eps : float
        Step size for numerical gradient

    Returns
    -------
    ndarray
        Score vector
    """
    return numerical_gradient(log_likelihood, theta, eps)


# =============================================================================
# BOOTSTRAP (from Notebook 11)
# =============================================================================

def bootstrap(data, statistic, n_boot=1000, seed=None):
    """
    Bootstrap resampling for statistical inference.

    Parameters
    ----------
    data : array-like
        Original data (1D array or 2D with observations in rows)
    statistic : callable
        Function that computes statistic of interest from data
    n_boot : int
        Number of bootstrap replications
    seed : int, optional
        Random seed for reproducibility

    Returns
    -------
    ndarray
        Array of bootstrap estimates
    """
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
    """
    Bootstrap confidence interval.

    Parameters
    ----------
    estimates : array-like
        Bootstrap estimates
    alpha : float
        Significance level (default 0.05 for 95% CI)
    method : str
        'percentile' or 'basic'

    Returns
    -------
    tuple
        (lower, upper) confidence bounds
    """
    if method == 'percentile':
        return np.percentile(estimates, [100*alpha/2, 100*(1-alpha/2)])
    elif method == 'basic':
        theta = np.mean(estimates)
        return 2*theta - np.percentile(estimates, [100*(1-alpha/2), 100*alpha/2])
    else:
        raise ValueError(f"Unknown method: {method}")


def bootstrap_se(estimates):
    """
    Bootstrap standard error (standard deviation of bootstrap distribution).

    Parameters
    ----------
    estimates : array-like
        Bootstrap estimates

    Returns
    -------
    float
        Bootstrap standard error
    """
    return np.std(estimates, ddof=1)


# =============================================================================
# MARGINAL EFFECTS (from Notebook 13)
# =============================================================================

def marginal_effects_binary(model, X, link='logit'):
    """
    Compute average marginal effects for binary outcome model.

    For logit: AME = mean(pdf(X*beta) * beta)
    For probit: AME = mean(phi(X*beta) * beta)

    Parameters
    ----------
    model : fitted statsmodels model
        Fitted binary outcome model
    X : ndarray
        Design matrix (including constant if needed)
    link : str
        'logit' or 'probit'

    Returns
    -------
    ndarray
        Average marginal effects for each coefficient
    """
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


def marginal_effects_at_means(model, X, link='logit'):
    """
    Compute marginal effects at the mean values of X.

    Parameters
    ----------
    model : fitted statsmodels model
        Fitted binary outcome model
    X : ndarray
        Design matrix
    link : str
        'logit' or 'probit'

    Returns
    -------
    ndarray
        Marginal effects at means
    """
    beta = model.params
    x_mean = X.mean(axis=0)
    linear_pred = x_mean @ beta
    if link == 'logit':
        pdf = stats.logistic.pdf(linear_pred)
    elif link == 'probit':
        pdf = stats.norm.pdf(linear_pred)
    else:
        raise ValueError(f"Unknown link: {link}")
    return pdf * beta


# =============================================================================
# DELTA METHOD (from Notebook 09)
# =============================================================================

def delta_method(g, theta, vcov, eps=1e-6):
    """
    Delta method for variance of transformed parameters.

    If g(theta) is a function of parameters, then:
    Var(g(theta)) ≈ g'(theta)' * Var(theta) * g'(theta)

    Parameters
    ----------
    g : callable
        Transformation function g: R^k -> R^m
    theta : array-like
        Parameter estimates
    vcov : ndarray
        Variance-covariance matrix of theta
    eps : float
        Step size for numerical gradient

    Returns
    -------
    tuple
        (transformed_value, standard_error)
    """
    theta = np.asarray(theta)
    g_val = np.atleast_1d(g(theta))

    # Compute Jacobian of g
    m = len(g_val)
    k = len(theta)
    J = np.zeros((m, k))

    for i in range(k):
        theta_plus = theta.copy()
        theta_plus[i] += eps
        theta_minus = theta.copy()
        theta_minus[i] -= eps
        J[:, i] = (np.atleast_1d(g(theta_plus)) - np.atleast_1d(g(theta_minus))) / (2 * eps)

    # Variance using delta method
    var_g = J @ vcov @ J.T

    if m == 1:
        return g_val[0], np.sqrt(var_g[0, 0])
    else:
        return g_val, np.sqrt(np.diag(var_g))


# =============================================================================
# LIKELIHOOD RATIO TEST (from Notebook 11)
# =============================================================================

def likelihood_ratio_test(ll_restricted, ll_unrestricted, df):
    """
    Likelihood ratio test.

    Test statistic: LR = 2 * (log L_unrestricted - log L_restricted)
    Under H0, LR ~ chi-squared(df)

    Parameters
    ----------
    ll_restricted : float
        Log-likelihood of restricted model
    ll_unrestricted : float
        Log-likelihood of unrestricted model
    df : int
        Degrees of freedom (number of restrictions)

    Returns
    -------
    tuple
        (test_statistic, p_value)
    """
    lr_stat = 2 * (ll_unrestricted - ll_restricted)
    p_value = 1 - stats.chi2.cdf(lr_stat, df)
    return lr_stat, p_value


# =============================================================================
# INVERSE MILLS RATIO (from Notebook 16 - Selection Models)
# =============================================================================

def inverse_mills_ratio(z):
    """
    Compute inverse Mills ratio (IMR) = phi(z) / Phi(z).

    Used in Heckman selection models.

    Parameters
    ----------
    z : array-like
        Standard normal quantiles

    Returns
    -------
    ndarray
        Inverse Mills ratio values
    """
    z = np.asarray(z)
    return stats.norm.pdf(z) / stats.norm.cdf(z)


# =============================================================================
# PLOTTING UTILITIES
# =============================================================================

# University of Pittsburgh colors for consistent styling
PITT_BLUE = "#003594"
PITT_GOLD = "#FFB81C"
PITT_DGRAY = "#75787B"
PITT_GRAY = "#97999B"
PITT_LGRAY = "#C8C9C7"

def set_pitt_style():
    """Set matplotlib style to match R notebooks with Pitt colors."""
    import matplotlib.pyplot as plt
    plt.rcParams.update({
        'figure.figsize': (10, 10/1.68),  # Golden ratio
        'axes.facecolor': 'white',
        'axes.edgecolor': PITT_DGRAY,
        'axes.grid': True,
        'grid.color': PITT_LGRAY,
        'grid.linewidth': 0.5,
        'axes.prop_cycle': plt.cycler(color=[PITT_BLUE, PITT_GOLD, PITT_DGRAY,
                                              '#E87722', '#4CAF50', '#9C27B0']),
        'font.size': 11,
        'axes.titlesize': 14,
        'axes.labelsize': 12,
    })


def plot_function(f, x_range, n_points=200, ax=None, **kwargs):
    """
    Plot a function over a specified range.

    Parameters
    ----------
    f : callable
        Function to plot
    x_range : tuple
        (x_min, x_max)
    n_points : int
        Number of points for smooth curve
    ax : matplotlib axes, optional
        Axes to plot on
    **kwargs
        Additional arguments passed to plt.plot

    Returns
    -------
    matplotlib axes
    """
    import matplotlib.pyplot as plt
    if ax is None:
        fig, ax = plt.subplots()
    x = np.linspace(x_range[0], x_range[1], n_points)
    y = [f(xi) for xi in x]
    ax.plot(x, y, **kwargs)
    return ax


# =============================================================================
# DATA LOADING UTILITIES
# =============================================================================

def load_rda(filepath):
    """
    Load R .rda file and return as dictionary of pandas DataFrames.

    Requires pyreadr package: pip install pyreadr

    Parameters
    ----------
    filepath : str
        Path to .rda file

    Returns
    -------
    dict
        Dictionary with R object names as keys, DataFrames as values
    """
    try:
        import pyreadr
        return pyreadr.read_r(filepath)
    except ImportError:
        raise ImportError("pyreadr not installed. Run: pip install pyreadr")


# =============================================================================
# SUMMARY STATISTICS
# =============================================================================

def summary_stats(data, columns=None):
    """
    Generate summary statistics similar to R's summary().

    Parameters
    ----------
    data : DataFrame or array-like
        Data to summarize
    columns : list, optional
        Specific columns to summarize

    Returns
    -------
    DataFrame
        Summary statistics including min, max, mean, median, std
    """
    if isinstance(data, np.ndarray):
        data = pd.DataFrame(data)
    if columns:
        data = data[columns]
    return data.describe().T[['count', 'mean', 'std', 'min', '25%', '50%', '75%', 'max']]
