# Part 02: Numerical Methods

## Introduction

This unit introduces the fundamental numerical tools that allow us to move from purely theoretical analysis to concrete computation. In economics, we often start with fully analytical models where we figure out the moving parts, inputs, outputs, and objectives. But at some point the model either becomes too complicated to solve by hand, or we need to connect the model to data and estimate things concretely. At that point, we move from theory on paper to engaging with numbers inside a computer.

The transition from analytical to numerical methods involves a tradeoff. We lose some generality because we can no longer think about things in full abstraction. But we gain a great deal of concrete detail that lets us actually compute answers, estimate parameters, and visualize results. This notebook covers the first two of three key numerical tools: numerical derivatives and numerical solutions to equations. The third tool, numerical optimization, is covered in the next unit.

The techniques here are not just academic exercises. When you minimize the total sum of squares for a regression model, you are implicitly relying on the linear algebra and numerical methods covered in this unit.

## Linear Equations

We begin with something familiar: solving a system of linear equations. Consider the simple system:

$$\begin{array}{rcl} 2 x_1+ 3 x_2 & = & 6 \\  x_1+ x_2 & = & 2 \end{array}$$

You probably solved this type of equation in high school, and the unique solution is $x_1 = 0$ and $x_2 = 2$. We can represent this system in matrix form as $\mathbf{A}\mathbf{x}=\mathbf{c}$:

$$\left[ \begin{array}{cc} 2 & 3 \\ 1 & 1 \end{array}\right] \left(\begin{array}{c}x_1\\x_2\end{array}\right)= \left(\begin{array}{c}6\\2\end{array}\right)$$

In Python, we solve this using NumPy's linear algebra routines:

```python
A = np.array([[2, 3],
              [1, 1]])
c = np.array([6, 2])

# Solve using np.linalg.solve (more numerically stable than using inverse)
x = np.linalg.solve(A, c)
# x1 = 0.0, x2 = 2.0
```

Alternatively, we can compute the solution via the matrix inverse using $\mathbf{x} = \mathbf{A}^{-1}\mathbf{c}$:

```python
A_inv = np.linalg.inv(A)
x_via_inv = A_inv @ c  # @ is matrix multiplication in Python
```

While this small example could be done more quickly by hand, once the number of equations becomes large, linear algebra becomes indispensable. Implicitly, you have been using the benefits of this when minimizing the total sum of squares for a regression model:

$$\sum_i\left(y_{i}-(\beta_0+\beta_1 x_{i,1}+\ldots +\beta_k x_{i,k})\right)^2$$

The OLS solution is:

$$\hat{\boldsymbol{\beta}} = (\mathbf{X}^T\mathbf{X})^{-1}\mathbf{X}^T\mathbf{y}$$

## Numerical Derivatives

### Analytical Derivatives

Sometimes computing a derivative analytically is trivial:

$$f(x)=a x^2+b x+c \quad \Rightarrow \quad f^\prime(x)=2 a x+b$$

Other times it takes more work but is still manageable, such as applying the product rule:

$$g(x)=(a x^2+b x+c)\cdot e^{-\lambda x}$$

$$g^\prime(x)=-\lambda e^{-\lambda x}(a x^2 +bx +c)+e^{-\lambda x}(2ax+b)$$

And sometimes the analytical formula is just not worth thinking about at all. This is where numerical derivatives come in.

### Gradients and Derivatives

When we think about changes, it is usually a discrete quantity change $x \mapsto x + \Delta x$. The underlying gradient is the ratio of the movements:

$$\frac{\Delta y}{\Delta x}=\frac{f(x+\Delta x)-f(x)}{\Delta x}$$

As we make the change in $x$ smaller and smaller, this gradient approaches the derivative:

$$\frac{d}{dx}y= \lim_{\Delta x\rightarrow 0} \frac{f(x+\Delta x)-f(x)}{\Delta x}$$

### Forward Difference

The most basic numerical derivative approximation is the forward difference formula. For the function $f(x) = 2x^2 - 10x + 3$ (whose analytical derivative is $f'(x) = 4x - 10$), we can code it up as follows:

```python
def num_deriv(f, x, eps):
    """Forward difference numerical derivative."""
    return (f(x + eps) - f(x)) / eps

def easy_f(x):
    return 2*x**2 - 10*x + 3

def d_easy_f(x):
    return 4*x - 10
```

Testing at $x = 3$ with $\epsilon = 10^{-7}$, the numerical derivative is approximately 2.0000002010 while the analytical derivative is exactly 2. The error is on the order of $2 \times 10^{-7}$.

For a more complex function like $f(x) = (2x^2 - 10x + 3)e^{-x/10}$, we can apply the same approach. Plotting the function produces a curve that starts positive, dips below zero, and then grows as the polynomial term dominates at large $x$. Comparing analytical and numerical derivatives across a range of $x$ values shows that they track each other closely, with small errors that are systematic and positive (characteristic of the forward difference method).

## Taylor Expansion and Better Formulas

To understand the accuracy of numerical derivative formulas, we use the Taylor expansion of the function around the point $x$:

$$f(x+\Delta x)=f(x)+\frac{f^\prime(x)}{1!}\Delta x+\frac{f^{\prime\prime}(x)}{2!}\Delta x^2+\frac{f^{\prime\prime\prime}(x)}{3!}\Delta x^3+\ldots$$

The forward difference formula gives:

$$\frac{f(x+\epsilon)-f(x)}{\epsilon}=f^\prime(x) + \frac{f^{\prime\prime}(x)}{2!}\epsilon + \ldots = f^\prime(x) + O(\epsilon)$$

This shows the forward difference has first-order accuracy: the error shrinks linearly with $\epsilon$.

### Centered Difference

If we use both a forward and a backward increment, we get the centered difference formula:

$$\frac{f(x+\epsilon)-f(x-\epsilon)}{2\epsilon}=f^\prime(x)+O(\epsilon^2)$$

This is more accurate because the first-order error terms cancel out, leaving only second-order errors:

```python
def c_num_deriv(f, x, eps):
    """Centered difference numerical derivative."""
    return (f(x + eps) - f(x - eps)) / (2 * eps)
```

When comparing forward and centered differences on the same function, the centered difference errors are dramatically smaller, often by several orders of magnitude.

### Higher-Order Formulas via Linear Algebra

Using Taylor expansion with five evaluation points ($x - 2\epsilon, x - \epsilon, x, x + \epsilon, x + 2\epsilon$), we can derive even more accurate formulas. We set up the system $\mathbf{f} = \mathbf{A}\mathbf{d}$ where the matrix $\mathbf{A}$ contains Taylor coefficients and $\mathbf{d}$ contains the derivatives we want to extract.

By inverting this system, we find weights for a five-point stencil that achieves $O(\epsilon^4)$ accuracy for the first derivative:

```python
# Build the Taylor coefficient matrix
A = np.zeros((5, 5))
for i, offset in enumerate([-2, -1, 0, 1, 2]):
    for j in range(5):
        A[i, j] = (offset ** j) / math.factorial(j)

A = A[[4, 3, 2, 1, 0], :]

# Find weights for first derivative
b = np.array([0, 1, 0, 0, 0])
A_inv = np.linalg.inv(A)
w1 = b @ A_inv
```

The resulting weights are approximately $-1/12, 2/3, 0, -2/3, 1/12$ for the points $f(x+2\epsilon), f(x+\epsilon), f(x), f(x-\epsilon), f(x-2\epsilon)$ respectively. Similarly, we can extract weights for the second derivative with $O(\epsilon^3)$ accuracy by selecting a different row.

The five-point stencil first derivative function achieves remarkable accuracy. For example, computing $\frac{d}{dx}\sin(x)$ at $x = 0.2$ with $\epsilon = 0.001$ gives 0.980067, matching $\cos(0.2)$ to six decimal places.

## Numerical Solutions to an Equation

### Non-linear Equations

Linear equations have well-defined solutions: we know if a system is solvable based on the rank of the matrix, and if it is solvable, there is a unique solution with an exact formula. Non-linear equations are much harder. Some are easily invertible:

$$x^4 = 12 \Rightarrow x = 12^{1/4}$$

Others are not:

$$x \cdot e^{x^2+3x} = 3$$

Furthermore, non-linear equations can admit multiple solutions.

### Newton-Raphson Method

The Newton-Raphson method is the core iterative algorithm for finding the root of a continuous function $f(x) = 0$. The procedure is:

1. Guess an initial solution $x_0$
2. Evaluate the function at this point: $f(x_0)$
3. Evaluate the derivative at this point: $f'(x_0)$

Then compute a new guess:

$$x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$$

We stop whenever $|x_{n+1} - x_n|$ is small enough. The intuition is that we are locally approximating the function by its tangent line and finding where that tangent line crosses zero.

```python
def newton_raphson(f, x0, tol=1e-8, eps=1e-6, max_iter=50):
    """Newton-Raphson root finding algorithm."""
    xx = x0
    fval = f(xx)
    error = abs(fval)
    ii = 1

    while error > tol and ii < max_iter:
        fd = n_deriv_1(f, xx, eps)  # numerical derivative
        if abs(fd) < 1e-12:
            break
        xx = xx - fval / fd
        fval = f(xx)
        error = abs(fval)
        ii += 1

    return xx
```

For the quadratic $f(x) = 2x^2 - 10x + 3$, the actual roots from the quadratic formula are approximately 0.32055053 and 4.67944947. Starting Newton-Raphson from $x_0 = 4$ converges to the high root in 5 steps, while starting from $x_0 = 1$ converges to the low root in 5 steps. This illustrates a key feature: the starting point matters, as the algorithm converges to the nearest root.

A plot of the function shows the parabola crossing zero at both roots, confirming the numerical results. The same approach works for the more complex function $(2x^2 - 10x + 3)e^{-x/10}$, finding roots at the same locations (since the exponential factor is always positive and does not change where the function equals zero).

### Using SciPy for Root Finding

In practice, we do not need to reinvent the wheel. SciPy provides several robust root-finding solvers:

```python
from scipy.optimize import fsolve, brentq, newton

# Newton's method
root_scipy = newton(easy_f, 4)

# General solver
root_fsolve = fsolve(easy_f, 4)[0]

# Bracketing method (needs interval containing root)
root_brent = brentq(easy_f, 0, 1)
```

The `brentq` function is a bracketing method that requires an interval known to contain the root, while `newton` and `fsolve` use initial guesses similar to our custom implementation.

## Summary

- Numerical derivatives approximate analytical derivatives using function evaluations at nearby points
- The forward difference formula $\frac{f(x+\epsilon)-f(x)}{\epsilon}$ has $O(\epsilon)$ accuracy
- The centered difference formula $\frac{f(x+\epsilon)-f(x-\epsilon)}{2\epsilon}$ has $O(\epsilon^2)$ accuracy
- A five-point stencil derived from Taylor expansion achieves $O(\epsilon^4)$ accuracy for the first derivative
- Linear algebra (matrix inversion) can be used to systematically derive higher-order derivative formulas
- The Newton-Raphson method finds roots of $f(x) = 0$ by iterating $x_{n+1} = x_n - f(x_n)/f'(x_n)$
- The starting point for Newton-Raphson determines which root is found when multiple roots exist
- SciPy provides production-quality implementations of these algorithms via `scipy.optimize`
