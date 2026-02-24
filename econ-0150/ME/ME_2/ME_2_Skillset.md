## ECON 0150 | MiniExam 2 | Skillset

### The Big Picture

Part 2 trains students to build and interpret the visualizations that underpin the statistical models in Parts 3-5. Each visualization type maps to a modeling technique:

- **Boxplots by category** (Part 2.2) → Two-sample t-tests (Part 3)
- **Scatter plots** (Part 2.1) → Bivariate regression (Part 4)
- **Scatter plots colored by category** (Part 2.3) → Multivariate regression with a categorical control (Part 5)

Before visualizing, students need to prepare data: **filtering** to remove rows that aren't relevant to the question and **log transformations** to deskew heavily skewed data so that patterns become visible.

---

### Skills and How They're Assessed

| # | Skill | Assessed In |
|---|-------|-------------|
| 1 | **Choose the right visualization** — Given a dataset, identify variable types and select the appropriate figure: scatter plot (two numerical), boxplot by category (one numerical + one categorical), or scatter by category (two numerical + one categorical). | Q1 |
| 2 | **Draw a scatter plot** — Plot two numerical variables against each other with labeled axes. | Q1b |
| 3 | **Draw a boxplot by category** — Sketch a boxplot comparing a numerical variable across groups. | Q1a, Q4 |
| 4 | **Draw a scatter plot colored by category** — Sketch a scatter plot with points colored by a categorical variable. | Q1c |
| 5 | **Identify variable types** — Classify variables as numerical or categorical from a data table. | Q1 |
| 6 | **Diagnose a misleading figure** — Recognize when a visualization fails to show patterns due to skewed data (exponential growth, heavy-tailed distributions). | Q2 |
| 7 | **Fix a figure with log transforms** — Redraw a figure using log-scaled axes to reveal hidden patterns. Know when to log one axis vs. both. | Q2 |
| 8 | **Interpret log2 scales** — Understand that each unit on a log2 scale represents a doubling of the original value. | Q3a |
| 9 | **Interpret log10 scales** — Understand that each unit on a log10 scale represents a tenfold increase. | Q3b |
| 10 | **Compare values on a log scale** — Given two log-transformed values, determine how many times larger one original value is than the other (e.g., 3 units apart on log2 = 8x). | Q3c |
| 11 | **Investigate and clean data** — When a boxplot looks compressed (e.g., most values at zero), diagnose the issue and filter to reveal meaningful variation. | Q4 |
| 12 | **Filter data** — Identify which rows to keep or remove based on a condition (e.g., keep only employees, remove volunteers). | Q4b |
| 13 | **Read a scatter plot colored by category** — Identify separate trends for each group in a color-coded scatter plot. | Q5 |
| 14 | **Describe how a relationship differs by group** — Articulate that one group shows a steeper/shallower trend than another and explain what that means in context. | Q5c |

---

### Skills NOT on This Exam

The following Part 2 skills are covered in class but not assessed on this MiniExam:

- Calculating grouped statistics (mean, count by category)
- Multi-step operations (filter + group-by + aggregate)
- Reshaping data from wide to long format
- Merging two datasets on a shared key
- Interpreting Anscombe's Quartet (why visualization matters)
- Reading a stripplot overlay on a boxplot
- Relationship reversals across groups (Simpson's paradox)
