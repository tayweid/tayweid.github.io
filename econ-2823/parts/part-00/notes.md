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

For example, a block quote:

> Facts are stubborn things, but statistics are pliable.
>
> — *Mark Twain*

For more on Markdown syntax, see the [Markdown Syntax documentation](https://jupyter-notebook.readthedocs.io/).

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
conda activate test_env
```

Then install `ipykernel` and register the environment as a Jupyter kernel:

```
conda install ipykernel
python -m ipykernel install --user --name=test_env
```

Once registered, the kernel appears in the Jupyter "New" menu. Install packages with:

```
%conda install pandas
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

Then install packages normally with pip. To register the venv as a Jupyter kernel:

```
pip install ipykernel
python -m ipykernel install --user --name=test
```

## Using R in Notebooks

Although this course focuses on Python, Jupyter also supports R through the IR Kernel. To install it:

1. Open a terminal and launch R (e.g., `/opt/R/4.3.1/bin/R`)
2. Install the IRkernel package: `install.packages('IRkernel')`
3. Make the kernel available to Jupyter: `IRkernel::installspec()`
4. Restart the notebook server

After installation, R will appear as a kernel option when creating new notebooks.

## Summary

- Jupyter Notebooks combine text (Markdown) and code (Python) in a single interactive document
- Markdown cells support rich formatting including headings, lists, block quotes, and links
- Code cells execute Python and display output inline
- Packages can be installed via pip, conda, or venv depending on your environment setup
- Jupyter also supports R through the IR Kernel, though this course primarily uses Python
