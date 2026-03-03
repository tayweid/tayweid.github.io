# Part 00: Welcome

## Introduction

This unit introduces Jupyter Notebooks, the primary computing environment for this course. Jupyter Notebooks are interactive documents that combine text, code, and output in a single file, making them ideal for data analysis and documentation. By the end of this unit, you should be comfortable navigating Jupyter, writing formatted text in Markdown cells, running Python code cells, and installing packages for your projects.

Jupyter Notebooks are widely used in data science and economics research because they allow you to interleave narrative explanation with executable code. This makes it easy to document your workflow, share reproducible analyses, and present results in a polished format.

## Jupyter Notebooks

A Jupyter Notebook contains two main types of cells: **text cells** (Markdown) and **code cells** (Python). The notebook is interactive — you can make changes or add cells, then run a cell to see its output. To run a cell, select it and click the Run button in the toolbar, or use the keyboard shortcut `Ctrl+Enter` (Windows) or `Command+Return` (Mac).

For more details, see the [Jupyter documentation](https://jupyter-notebook.readthedocs.io/).

## Formatted Text

Markdown cells allow you to write formatted text that provides context and description for your analysis. To create a Markdown cell, choose the cell type "Markdown" from the toolbar selector. To edit any cell, double-click on it; to render the output, run the cell.

Markdown supports a range of formatting options:

- **Italic** text with `*italic*`
- **Bold** text with `**bold**`
- **Bold and italic** with `***both***`
- Block quotes using `>`
- Bulleted and numbered lists

For example, a bulleted list:

- Apples
- Oranges
- Grapes

And a numbered list:

1. Wake up
2. Get out of bed
3. Drag a comb across my head

A block quote:

> Facts are stubborn things, but statistics are pliable.
>
> — *Mark Twain*

For more on Markdown syntax, see the [Markdown Syntax documentation](https://jupyter-notebook.readthedocs.io/).

## LaTeX

Markdown cells support LaTeX for writing mathematical notation. This is essential for expressing economic models and statistical formulas.

**Inline math** uses single dollar signs: `$x^2$` renders as $x^2$.

**Display math** uses double dollar signs to create centered, standalone equations:

```
$$\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_i$$
```

Common constructs you'll use in this course:

- **Subscripts and superscripts**: `$x_i$`, `$x^2$`, `$x_i^2$`
- **Fractions**: `$\frac{a}{b}$`
- **Greek letters**: `$\alpha, \beta, \gamma, \sigma, \mu, \varepsilon$`
- **Summation and integration**: `$\sum_{i=1}^{n}$`, `$\int_{a}^{b}$`
- **Hats and bars**: `$\hat{\beta}$`, `$\bar{x}$`

Some examples:

- A regression equation: `$y_i = \beta_0 + \beta_1 x_i + \varepsilon_i$`
- A sample mean: `$\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_i$`
- A probability: `$P(X \leq x) = \int_{-\infty}^{x} f(t) \, dt$`

For a full reference, see the [LaTeX math guide](https://en.wikibooks.org/wiki/LaTeX/Mathematics).

## Python Code

Code cells contain Python code. Choose the cell type "Code" from the toolbar. Like Markdown cells, you run the cell to see its output. Here is a simple example that prints the numbers 0 through 9:

```python
import time, sys
for i in range(10):
    print(i)
    time.sleep(0.5)
```

When you run a code cell, Python executes the code and displays any output directly below the cell.

## Installing Packages

Python's ecosystem relies on packages (libraries) that extend its functionality. There are several ways to install packages depending on your environment.

### Using pip

To install a package with pip from within a notebook, use the magic syntax:

```
%pip install pandas
```

This ensures the package is installed into the correct kernel. Note that this install statement runs every time the entire notebook is executed, which may be undesirable for large packages.

To install from a terminal, reference the same Python version as the kernel:

```
python-3.9.5 -m pip install pandas
```

To list installed packages:

```
python-3.9.5 -m pip list
```

### Using conda

Conda is a package and environment manager. To use it, first create and activate an environment:

```
conda create --name test_env
# agree to the prompt
conda activate test_env
```

When the environment is activated, the command line prompt should show the environment name `(test_env) /cloud/project$`. Next install `ipykernel` and register the environment as a Jupyter kernel:

```
conda install ipykernel
python -m ipykernel install --user --name=test_env
```

> Note: pre-installed python versions should not be used once a conda environment is activated. Simply use `python` to correctly reference the python version in the environment.

Once the kernel is registered, it will appear as an option in the "New" menu. To install a conda package from within a notebook, use the magic syntax:

```
%conda install pandas
```

To install a conda package from the terminal, ensure the environment is activated then:

```
conda install pandas
```

### Using venv

Python's built-in `venv` module creates virtual environments:

```
python-3.9.5 -m venv test
cd test
source bin/activate
```

Before installing packages, create a `pip.conf` file in the top-level directory of the venv with the following contents to override user settings:

```
[install]
    user=false
[list]
    user=false
```

Now pip can be used normally whenever the venv is activated:

```
pip install jsondiff
pip list
```

To use a virtual environment as a notebook kernel, with the environment activated:

```
pip install ipykernel
python -m ipykernel install --user --name=test
```

## Summary

- Jupyter Notebooks combine text (Markdown) and code (Python) in a single interactive document
- Markdown cells support rich formatting including headings, lists, block quotes, and links
- Code cells execute Python and display output inline
- Packages can be installed via pip, conda, or venv depending on your environment setup
