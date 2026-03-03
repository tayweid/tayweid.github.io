# Part 01: Jupyter Notebooks (Python Version)

## Introduction

This unit provides a hands-on introduction to working with Jupyter Notebooks using Python. Jupyter is the primary computing environment for this course, and this notebook walks through the essential skills: navigating the interface, writing Markdown documentation, loading and exploring data with pandas, running linear regressions with statsmodels, and creating visualizations with matplotlib and seaborn.

Jupyter is widely used in data science because it lets you combine executable code with narrative text. It is also the standard interface on major cloud computing platforms like Amazon SageMaker, Azure ML Studio, Google Colab, and Posit Cloud.

## Python Setup

For data science work in Python, we rely on several core libraries:

- **pandas** — Data manipulation and analysis
- **numpy** — Numerical computing
- **matplotlib** — Plotting and visualization
- **seaborn** — Statistical visualization with clean defaults
- **statsmodels** — Statistical modeling

Install them via:

```bash
pip install pandas numpy matplotlib seaborn statsmodels
```

## Using Jupyter

You can start Jupyter from a terminal:

- `jupyter lab` — A more customizable, tab-based interface
- `jupyter notebook` — The standard notebook interface

Jupyter notebooks are divided into cells. While in a cell, you can type and then hit **Shift+Enter** to run it. Pressing **Esc** moves you into Command Mode, where you can manipulate cells.

### Command Mode Shortcuts

- **a** — Add a cell above
- **b** — Add a cell below
- **y** — Convert cell to code
- **m** — Convert cell to Markdown
- **dd** — Delete cell (press d twice)

### Markdown Cells

Markdown cells support formatted text including headings, bullet lists, tables, and links. This is how you document your analysis alongside your code.

### Code Cells

Code cells contain Python code. Running a cell is equivalent to typing that code into a Python interpreter:

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import statsmodels.api as sm

plt.rcParams['figure.figsize'] = (10, 6)
sns.set_style('whitegrid')
```

## Loading and Exploring Data

The first step in any analysis is loading your data. In Python, we use pandas to read CSV files:

```python
import os
os.getcwd()  # Check current working directory

MLB16_18 = pd.read_csv("MLB.csv")
```

Once loaded, we can explore the data with several pandas methods:

```python
MLB16_18.head()           # View first few rows
MLB16_18.columns.tolist() # Column names
MLB16_18.info()           # Data types and non-null counts
MLB16_18.describe()       # Summary statistics
```

The `describe()` method provides count, mean, standard deviation, min, quartiles, and max for each numeric column.

## Output

If you evaluate an expression without assigning it to a variable, Jupyter will display the result. For example, `MLB16_18.head()` displays a table of the first five rows.

## Linear Regression

In Python, we use `statsmodels` for linear regression. We explicitly separate the predictor variables (X) from the outcome variable (y), and manually add a constant term for the intercept:

```python
X = MLB16_18[['Age', 'Agesqrd']]
X = sm.add_constant(X)
y = MLB16_18['BA']

BA_reg1 = sm.OLS(y, X).fit()
BA_reg1.params
```

This returns the estimated coefficients. The full regression output, including standard errors, t-statistics, p-values, and R-squared, is obtained with:

```python
print(BA_reg1.summary())
```

The summary output includes coefficient estimates, standard errors, t-values, p-values, and confidence intervals.

## Plotting

Python offers two main plotting libraries:

### matplotlib

matplotlib gives you fine-grained control over your plots:

```python
fig, ax = plt.subplots(figsize=(10, 6))

plot_data = MLB16_18.copy()
plot_data['fitted'] = BA_reg1.fittedvalues
plot_data_sorted = plot_data.groupby('Age')['fitted'].mean().reset_index()

ax.plot(plot_data_sorted['Age'], plot_data_sorted['fitted'],
        linewidth=2, color='#003594', label='Fitted')
ax.scatter(plot_data_sorted['Age'], plot_data_sorted['fitted'],
           s=50, color='red', zorder=5)
ax.set_xlabel('Age')
ax.set_ylabel('Fitted Batting Average')
ax.set_title('MLB Batting Average: Fitted Quadratic')
plt.tight_layout()
plt.show()
```

This produces a line plot of fitted batting averages against age, showing the quadratic relationship.

### seaborn

Seaborn provides a higher-level interface with clean defaults:

```python
fig, ax = plt.subplots(figsize=(10, 6))
sns.regplot(x='Age', y='BA', data=MLB16_18, order=2,
            scatter_kws={'alpha': 0.5},
            line_kws={'color': '#003594', 'linewidth': 2}, ax=ax)
ax.set_title('MLB Batting Average vs Age (with quadratic fit)')
plt.tight_layout()
plt.show()
```

This produces a scatter plot of all observations with a polynomial regression line overlaid.

## Notebook Sequentiality

Jupyter maintains a hidden internal state. When you run a cell, it is as if you typed that code into the Python interpreter. While notebooks are designed to be read top-to-bottom, you can run cells in any order. This means you need to be aware of which cells you have run and in what order, since later cells may overwrite variables defined in earlier cells.

```python
y = 4
x = 6
x + y  # Returns 10
```

If you then run another cell:

```python
y = 10
x = 12
x + y  # Returns 22
```

The values of `x` and `y` have changed because notebook state is cumulative.

## Exporting Notebooks

To share your work, go to `File > Download as` and save as HTML or PDF. The export captures the current state of the notebook for whichever cells have been run. Note that if you have multiple notebooks open, each has its own separate state.

## Using the Shared Utils Module

This course includes a shared utility module `utils.py` that provides helper functions for numerical methods, maximum likelihood estimation, bootstrapping, and more. It also includes Pitt-themed plotting styles:

```python
import utils
utils.set_pitt_style()
utils.summary_stats(MLB16_18, columns=['Age', 'BA', 'AB'])
```

## Summary

- Jupyter Notebooks combine Markdown text and Python code in an interactive environment
- Core Python libraries for data science: pandas, numpy, matplotlib, seaborn, statsmodels
- Data is loaded with `pd.read_csv()` and explored with `.head()`, `.info()`, `.describe()`
- Linear regression uses `sm.OLS(y, X).fit()` with an explicit constant added via `sm.add_constant()`
- Visualization is done with matplotlib (low-level control) or seaborn (high-level, clean defaults)
- Notebook state is sequential — be mindful of which cells have been run and in what order
- The shared `utils.py` module provides course-specific helper functions
