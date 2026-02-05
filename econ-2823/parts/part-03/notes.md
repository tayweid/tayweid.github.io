# Part 03: Numerical Methods 2 - Optimization

## Introduction

This unit continues from the previous notebook on numerical methods, completing the toolbox with numerical optimization. Having already covered numerical derivatives and numerical root finding, we now tackle the problem of finding the minimum or maximum of a function computationally. Optimization is arguably the most important numerical tool in economics: nearly every model involves an agent maximizing utility, a firm maximizing profit, or an econometrician minimizing a loss function.

The core insight is that for smooth, continuous functions, optimization reduces to root finding on the derivative. A necessary condition for an optimal point is that the slope is zero: $f'(x) = 0$. We can therefore apply the Newton-Raphson method to the derivative, or use purpose-built optimization algorithms from SciPy. Along the way, we will confront the fundamental challenge of local versus global optima, explore non-gradient methods like Nelder-Mead, and discuss stochastic approaches like simulated annealing for escaping local traps.

This unit also extends optimization to multiple dimensions, where gradients become vectors, second-order conditions involve the Hessian matrix, and the landscape of potential pitfalls grows considerably.

## Numerical Optimization

We build on two previously completed topics (numerical derivatives and numerical solutions to equations) and now tackle the third: numerical optimization. The setting is a one-dimensional continuous function, and the approach leverages the first-order conditions from calculus. If the problem is smooth, then a necessary condition to be at an optimal point for a continuous differentiable function is:

$$f'(x) = 0$$

## Option 1: Use Analytical Derivatives

The most straightforward approach to numerical optimization is to code up the analytical derivative of the function and then solve for its roots. We work with two test functions:

$$f(x) = 2x^2 - 10x + 3$$
$$g(x) = f(x) \cdot e^{-x/10}$$

Their derivatives are:

$$f'(x) = 4x - 10$$
$$g'(x) = -0.1 e^{-0.1x}(2x^2 - 10x + 3) + e^{-0.1x}(4x - 10)$$

```python
def f(x):
    return 2*x**2 - 10*x + 3

def g(x):
    return f(x) * np.exp(-x/10)

def d_f(x):
    return 4*x - 10

def d_g(x):
    return -0.1 * np.exp(-0.1*x) * f(x) + np.exp(-0.1*x) * (4*x - 10)
```

For $f(x)$, plotting the derivative reveals a straight line crossing zero at $x = 2.5$. Applying Newton-Raphson to $f'(x)$ quickly converges to this minimum.

For $g(x)$, the derivative crosses zero at two points. Starting Newton-Raphson from $x_0 = 0$ finds one critical point, while starting from $x_0 = 20$ finds another. Evaluating $g$ at both points reveals which is the minimum and which is the maximum.

## Option 2: Fully Numeric Optimization

When we do not want to compute analytical derivatives at all, we can go fully numeric. The idea is to apply Newton-Raphson to the first-order condition $f'(x) = 0$, but where both $f'$ and $f''$ are computed numerically:

$$x_{n+1} = x_n - \frac{f'(x_n)}{f''(x_n)}$$

```python
def newton_raphson_fullnumeric(f, x0, tol=1e-8, eps=1e-6, maxiter=50, output=False):
    """Fully numeric optimization using Newton-Raphson."""
    xx = x0
    fval = n_deriv_1(f, xx, eps)  # numerical first derivative
    error = abs(fval)
    ii = 1

    while error > tol and ii < maxiter:
        fd = n_deriv_2(f, xx, np.sqrt(eps))  # numerical second derivative
        xx = xx - fval / fd
        fval = n_deriv_1(f, xx, eps)
        error = abs(fval)
        ii += 1

    return xx
```

This fully numeric approach converges to the same solutions as the analytical-derivative approach, with differences on the order of machine precision. The key advantage is that we never need to think about the derivative formula at all.

## Type of Optima: Maxima vs Minima

Both local minima and local maxima satisfy the first-order condition $f'(x) = 0$. To distinguish between them, we check the second derivative:

- For a **maximum**: $f''(x) < 0$ (the slope is decreasing, so the function curves downward)
- For a **minimum**: $f''(x) > 0$ (the slope is increasing, so the function curves upward)

By evaluating the numerical second derivative at each critical point of $g(x)$, we can classify each as a local minimum or local maximum. A plot of the function with both critical points annotated confirms the classification visually.

## Global vs Local Optima

Only one of the critical points is a global optimum. When we zoom out to see the function over a much larger domain (say, $x \in [-5, 105]$), we often discover that the function's behavior at the boundaries or far from the critical points dominates. The local minimum found by Newton-Raphson may not be the global minimum if the function continues to decrease elsewhere.

This is a fundamental challenge: gradient-based methods find local optima, but they have no way to verify whether a local optimum is also the global optimum.

## Local Solutions: The Challenge

To illustrate the severity of the local-optima problem, consider a wavy function with many local extrema:

```python
def wavy_f(x):
    return ((-(x-2)**2) * np.cos(x-2) -
            90 * np.cos(20*(x-2)) * np.exp(-30*(x-2)**4) +
            np.exp((x-2)**2))
```

A plot of this function reveals a landscape with multiple peaks and valleys. Different starting points for Newton-Raphson lead to different solutions. Starting from $x_0 = 0, 1.6, 2.05, 2.1,$ and $2.3$ all yield different critical points. The optimizer has no way to know if it has found the best one.

## Multi-dimensional Optimization

In multiple dimensions, the optimization problem becomes richer and more complex. Consider:

$$f(x_1, x_2) = 2x_1^2 + 2x_2^2 - 2x_1 x_2 - 5x_1 + x_2$$

The first-order conditions are a system of equations:

$$\frac{\partial f}{\partial x_1} = 4x_1 - 2x_2 - 5 = 0$$
$$\frac{\partial f}{\partial x_2} = 4x_2 - 2x_1 + 1 = 0$$

Solving this system yields the unique minimizing solution $x_1^* = 3/2$ and $x_2^* = 1/2$.

```python
def f2(x):
    return 2*x[0]**2 + 2*x[1]**2 - 2*x[0]*x[1] - 5*x[0] + x[1]
```

## Multi-dimensional Second-Order Conditions

For multi-dimensional problems, the second-order conditions involve two key objects:

The **gradient vector** of partial derivatives:

$$\nabla f = \left(\frac{\partial f}{\partial x_1}, \ldots, \frac{\partial f}{\partial x_n}\right)^T$$

The **Hessian matrix** of second-order partial derivatives. The second-order conditions check whether the Hessian is:

- **Positive definite** (all eigenvalues > 0) -- the critical point is a local **minimum**
- **Negative definite** (all eigenvalues < 0) -- the critical point is a local **maximum**

If some eigenvalues are positive and some negative, the point is a saddle point.

## Optimization in Python with SciPy

Python's `scipy.optimize` module provides production-quality optimization routines. The key function is `optimize.minimize`, which takes a function, an initial guess, and a method name:

```python
from scipy import optimize

result = optimize.minimize(f2, [0, 0], method='BFGS')
print(f"Optimal x: {result.x}")       # [1.5, 0.5]
print(f"Optimal value: {result.fun}")  # -4.0
print(f"Success: {result.success}")    # True
```

To verify the second-order conditions, we compute the Hessian numerically and check its eigenvalues:

```python
hess = utils.numerical_hessian(f2, result.x)
eigenvalues = np.linalg.eigvals(hess)
print(f"Is positive definite (minimum)? {np.all(eigenvalues > 0)}")
```

## Local Solutions in Multiple Dimensions

The problem of getting stuck at local solutions does not go away with more dimensions. A 2D version of the wavy function illustrates this: BFGS finds a local minimum that is far from the global minimum at $(2, 3)$.

## Non-Gradient Methods: Nelder-Mead

The Nelder-Mead method (the default in R's `optim()`) does not use gradients at all. Instead, it constructs a simplex (a triangle in 2D, a tetrahedron in 3D) and iteratively deforms it to explore the function landscape:

```python
result_nm = optimize.minimize(wavy_f_2d, [0, 0], method='Nelder-Mead')
```

For one-dimensional optimization, SciPy provides `minimize_scalar`:

```python
result_1d = optimize.minimize_scalar(g, bounds=(-10, 5), method='bounded')
```

## Simulated Annealing and Global Optimization

When we are concerned about reaching the global optimum, stochastic methods can help escape local minima. **Simulated annealing** works by allowing the optimizer to occasionally accept worse solutions, with the probability of accepting worse solutions decreasing over time (like a cooling process).

In SciPy, we can use `optimize.dual_annealing()` or `optimize.basinhopping()`:

```python
# Dual annealing for global optimization
result_da = optimize.dual_annealing(wavy_f_2d, bounds=[(-5, 10), (-5, 10)])

# Basin-hopping: combines local optimization with random restarts
result_bh = optimize.basinhopping(wavy_f_2d, [0, 0], niter=100)
```

A practical strategy is to combine approaches: use a global search method to find a promising region, then refine with a local gradient-based method:

```python
result_global = optimize.dual_annealing(wavy_f_2d, bounds=[(-5, 10), (-5, 10)])
result_refined = optimize.minimize(wavy_f_2d, result_global.x, method='BFGS')
```

## Non-uniqueness and Identification

Sometimes the objective does not have a unique optimizer. Consider:

$$f(x_1, x_2) = -(x_1 + x_2 - 3)^2$$

Any pair $(x_1, x_2)$ that sums to 3 will be a solution. The optimizer will find one such pair, but the choice depends on the starting point and the algorithm. This relates to **identification problems** in estimation: if the objective function is flat along a direction, the parameters along that direction are not identified.

The Hessian at such a point will have a near-zero eigenvalue, which is a diagnostic signal that the problem is under-identified.

## Summary: R to Python Optimization Mapping

For students coming from R, here is a mapping of key optimization functions:

| R Function | Python Equivalent |
|------------|-------------------|
| `optim(x0, f, method="BFGS")` | `scipy.optimize.minimize(f, x0, method='BFGS')` |
| `optim(x0, f, method="Nelder-Mead")` | `scipy.optimize.minimize(f, x0, method='Nelder-Mead')` |
| `optim(x0, f, method="SANN")` | `scipy.optimize.dual_annealing(f, bounds)` |
| `optimize(f, interval=c(a,b))` | `scipy.optimize.minimize_scalar(f, bounds=(a,b), method='bounded')` |
| `is.positive.definite(H)` | `np.all(np.linalg.eigvals(H) > 0)` |

Both R's `optim()` and Python's `scipy.optimize.minimize` minimize by default. To maximize, negate the function:

```python
result_max = optimize.minimize(lambda x: -g(x), 20)
```

## Summary

- Optimization of smooth functions reduces to root finding on the derivative: solve $f'(x) = 0$
- Fully numeric optimization uses numerical first and second derivatives in Newton-Raphson iteration
- Second-order conditions distinguish maxima ($f'' < 0$) from minima ($f'' > 0$)
- Gradient-based methods find local optima but may miss the global optimum
- Different starting points can lead to different local solutions
- Multi-dimensional optimization requires the gradient vector and Hessian matrix
- Positive definiteness of the Hessian (all eigenvalues > 0) confirms a local minimum
- Nelder-Mead is a gradient-free alternative that uses a simplex search
- Simulated annealing and basin-hopping can help find global optima by escaping local traps
- Non-unique optima signal identification problems, detectable via near-zero Hessian eigenvalues
- SciPy's `optimize.minimize` is the Python workhorse for optimization, paralleling R's `optim()`
