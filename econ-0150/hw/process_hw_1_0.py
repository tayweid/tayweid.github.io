import json
import os
import shutil

# Define the homework directory
hw_dir = '/Users/taylorjweidman/PROJECTS/tayweid.github.io/econ-0150/hw/hw-1-0'

# Create subdirectories
os.makedirs(os.path.join(hw_dir, 'data'), exist_ok=True)
os.makedirs(os.path.join(hw_dir, 'i'), exist_ok=True)

# Move files
files_to_move = {
    'data': ['ECON_0150_Survey.csv', 'HW_1_0_Leisure.csv', 'HW_1_0_Working.csv'],
    'i': ['HW_1_0_Q1.png', 'HW_1_0_Q2.png']
}

for subdir, files in files_to_move.items():
    for file in files:
        src = os.path.join(hw_dir, file)
        dst = os.path.join(hw_dir, subdir, file)
        if os.path.exists(src) and not os.path.exists(dst):
            shutil.move(src, dst)
            print(f"Moved {file} to {subdir}/")

# Create the notebook structure
cells = [
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": ["# ECON 0150 | Fall 2025 | Homework 1.0"]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "### Due: Friday, Jan 17, 5PM\n",
            "\n",
            "Homework is designed to both test your knowlege and challenge you to apply familiar concepts in new applications. Answer clearly and completely. You are welcomed and encouraged to work in groups so long as your work is your own. Submit your figures and answers to Gradescope."
        ]
    },
    {
        "cell_type": "code",
        "metadata": {},
        "source": [
            "# Imports\n",
            "import pandas as pd\n",
            "import numpy as np\n",
            "import matplotlib.pyplot as plt\n",
            "import seaborn as sns\n",
            "%matplotlib inline"
        ],
        "outputs": [],
        "execution_count": None
    },
    {
        "cell_type": "code",
        "metadata": {},
        "source": [
            "# Load Data\n",
            "ECON_0150_Survey = pd.read_csv('data/ECON_0150_Survey.csv')\n",
            "HW_1_0_Leisure = pd.read_csv('data/HW_1_0_Leisure.csv')\n",
            "HW_1_0_Working = pd.read_csv('data/HW_1_0_Working.csv')\n"
        ],
        "outputs": [],
        "execution_count": None
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": ["#### Q1. Class Survey Variable Types"]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "What type of variable is this?\n",
            "\n",
            "What is the most effective visualization for this variable?\n",
            "\n",
            "What is the mean value?"
        ]
    },
    {
        "cell_type": "code",
        "metadata": {},
        "source": ["# "],
        "outputs": [],
        "execution_count": None
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": ["#### Q2. Understanding Continuous Variables Visually"]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "The following data from the Better Life Index was collected from OECD countries use using time-use surveys. This question is aimed at practicing the skill of analyzing continuous variables displayed visually.\n",
            "\n",
            "![Question 1](i/HW_1_0_Q1.png)"
        ]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": ["a. What is the most common 50 minute range of time spent on leisure?"]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": ["b. In how many countries do people spend between 800 and 850 minutes on leisure and personal care?"]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": ["c. How many countries spend more than 900 minutes on leisure and personal care?"]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": ["d. What is the approximate difference between the two most common ranges?"]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": ["#### Q3. Making Comparisons with Continuous Variables"]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "The following data on hours worked is available from Our World in Data. This question is aimed at practicing the skill of making comparisons of continuous variables displayed visually.\n",
            "\n",
            "![Question 2](i/HW_1_0_Q2.png)"
        ]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "a. In which country did people work the most on average?\n",
            "\n",
            "- South Korea\n",
            "- United States\n",
            "- Norway"
        ]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "b. When did Norwegians work less than Americans?\n",
            "\n",
            "- Before 1965\n",
            "- During 1965\n",
            "- After 1965\n",
            "- Never"
        ]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "c. When was the largest difference between the longest and the shortest annual working time?\n",
            "\n",
            "- 1960s\n",
            "- 1980s\n",
            "- 2000s\n",
            "- 2010s"
        ]
    },
    {
        "cell_type": "markdown",
        "metadata": {},
        "source": [
            "d. In the 1980s, roughly how many times more did an average South Korean work than an average Norwegian?\n",
            "\n",
            "- 2x\n",
            "- 3x\n",
            "- 4x\n",
            "- 5x"
        ]
    }
]

# Create the notebook
notebook = {
    "cells": cells,
    "metadata": {
        "kernelspec": {
            "display_name": "Python 3",
            "language": "python",
            "name": "python3"
        },
        "language_info": {
            "codemirror_mode": {
                "name": "ipython",
                "version": 3
            },
            "file_extension": ".py",
            "mimetype": "text/x-python",
            "name": "python",
            "nbconvert_exporter": "python",
            "pygments_lexer": "ipython3",
            "version": "3.8.0"
        }
    },
    "nbformat": 4,
    "nbformat_minor": 4
}

# Save regular notebook
with open(os.path.join(hw_dir, 'Homework_1_0.ipynb'), 'w') as f:
    json.dump(notebook, f, indent=1)
print("Created Homework_1_0.ipynb")

# Save solutions notebook
with open(os.path.join(hw_dir, 'Homework_1_0_sols.ipynb'), 'w') as f:
    json.dump(notebook, f, indent=1)
print("Created Homework_1_0_sols.ipynb")

# Rename old notebook if it exists
old_nb = os.path.join(hw_dir, 'hw_1_0_sols.ipynb')
if os.path.exists(old_nb):
    os.rename(old_nb, os.path.join(hw_dir, 'hw_1_0_sols_old.ipynb'))
    print("Renamed old notebook")

print("\nDone processing hw-1-0!")