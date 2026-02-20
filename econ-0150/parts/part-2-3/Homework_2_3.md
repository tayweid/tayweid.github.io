## Homework 2.3 | Bivariate Relationships by Category

### Overview

In this homework, you'll analyze Amazon bestseller data to explore whether the relationship between user reviews and ratings differs between Fiction and Non-Fiction books. This brings together skills from all of Part 2.

### The Data

We'll use Amazon bestseller data with the following variables:

- **Name**: Book title
- **Author**: Book author
- **User Rating**: Average rating (0-5 scale)
- **Reviews**: Number of user reviews
- **Price**: Book price in dollars
- **Year**: Year the book was a bestseller
- **Genre**: Fiction or Non-Fiction

```python
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

file_path = 'https://tayweid.github.io/econ-0150/parts/part-2-1/data/'
books = pd.read_csv(file_path + 'amazon_book_sales.csv')
```

---

### Question 1: Explore the Data

(a) How many books are in the dataset?

(b) How many books are Fiction? How many are Non-Fiction?

---

### Question 2: Ratings by Genre (Part 2.2 Review)

(a) Create a boxplot of `User Rating` by `Genre`. Add a stripplot overlay.

```python
sns.boxplot(data=books, x='Genre', y='User Rating')
sns.stripplot(data=books, x='Genre', y='User Rating', color='black', alpha=0.3)
```

(b) Calculate the mean, standard deviation, and count for each genre.

```python
books.groupby('Genre')['User Rating'].agg(['mean', 'std', 'count'])
```

(c) Which genre has higher average ratings? Is the difference large or small relative to the variation within each group?

---

### Question 3: Reviews and Ratings (Part 2.1 Review)

(a) Create a scatter plot of `Reviews` (x-axis) vs `User Rating` (y-axis) for all books.

```python
sns.scatterplot(data=books, x='Reviews', y='User Rating')
```

(b) Is there a relationship between reviews and ratings? If so, is it positive, negative, or unclear?

---

### Question 4: Does the Relationship Differ by Genre? (Part 2.3)

(a) Create a scatter plot of `Reviews` vs `User Rating`, colored by `Genre`.

```python
sns.lmplot(data=books, x='Reviews', y='User Rating', hue='Genre')
```

(b) Does the relationship between reviews and ratings differ between Fiction and Non-Fiction? Describe what you see.

(c) In one sentence, what might explain any differences you observe?

---

### Summary

In this homework, you practiced:

- **Part 2.2 skills**: Boxplots and grouped statistics to compare distributions by category
- **Part 2.1 skills**: Scatter plots to examine relationships between numerical variables
- **Part 2.3 skills**: Using `hue` to see how relationships differ across categories
