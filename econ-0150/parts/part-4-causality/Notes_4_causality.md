## Part 4 (Optional) | Causality

### Overview

- A significant $\beta_1$ means there's a relationship — but does $X$ cause $Y$?
- The ice cream and drowning example: a strong positive correlation that is entirely spurious
- Three possible explanations for any correlation: direct causation, reverse causation, confounding
- Confounding variables create spurious correlations by affecting both $X$ and $Y$
- The regression still finds the "least wrong" predictions — but prediction is not causation
- The fix: add the confounding variable to the model as a control variable
- Multiple regression: each coefficient represents the effect of that variable holding others constant
- Domain knowledge is essential — statistics alone cannot establish causation
- This previews the multivariate framework in Part 5

---

### Opening — Correlation Isn't Causation

We've learned to test whether relationships exist. We've found significant slopes. The p-value on $\beta_1$ told us that the relationship between $X$ and $Y$ is unlikely to be zero. But does a significant $\beta_1$ mean $X$ *causes* $Y$?

The answer is: not necessarily. This is perhaps the most important distinction in empirical research, and it's one that even experienced researchers sometimes blur.

---

### The Ice Cream Puzzle

Here's a dataset from Denmark: ice cream sales and drowning deaths over several years. Let's plot them.

*[Stage direction: scatter plot of ice cream sales (x-axis, in cubic meters) vs drowning deaths (y-axis). A clear positive relationship — more ice cream, more drowning. A red regression line with a positive slope. Text: "Pearson correlation: r = 0.78." The relationship looks convincing.]*

The correlation is strong. If we run the regression:

$$Drownings = \beta_0 + \beta_1 \cdot IceCream + \epsilon$$

We find $\beta_1 > 0$ and highly significant. The p-value is tiny. By every statistical criterion we've learned, there is a significant positive relationship between ice cream sales and drowning deaths.

Should we ban ice cream?

---

### Three Possible Explanations

Whenever we find a significant relationship between $X$ and $Y$, there are at least three possible explanations:

*[Stage direction: three simple diagrams arranged horizontally.*
- *Left: "Hypothesis A" — an arrow from "Ice Cream" to "Drowning." Caption: "Ice cream causes drowning."*
- *Center: "Hypothesis B" — an arrow from "Drowning" to "Ice Cream." Caption: "Drowning causes ice cream sales."*
- *Right: "Hypothesis C" — a question mark between "Ice Cream" and "Drowning." Caption: "Something else is going on."]*

Hypothesis A seems absurd — eating ice cream doesn't make people drown. Hypothesis B makes even less sense. So what's going on?

---

### Confounding Variables

Both ice cream sales and drowning deaths increase in summer. Hot weather makes people buy ice cream *and* go swimming. Temperature (or season) affects both variables independently.

*[Stage direction: a causal diagram (DAG). "Season/Temperature" at the top with arrows pointing down to both "Ice Cream Sales" and "Drowning Deaths." No arrow between Ice Cream and Drowning. The diagram makes clear: season causes both, but ice cream doesn't cause drowning.]*

The correlation between ice cream and drowning is **spurious** — it appears because both variables respond to a common cause. Remove the common cause, and the relationship disappears.

This is the definition of a **confounding variable**: a variable that affects both $X$ and $Y$, creating an apparent relationship between them that isn't causal.

---

### The Statistical Lesson

Our regression found a significant $\beta_1$. The model genuinely does make better predictions of drowning when it uses ice cream sales — because ice cream sales are a proxy for summer, and summer is when drowning happens. The model is doing exactly what we asked: finding the "least wrong" predictions.

But the relationship is an artifact. The model exploits the confound. Using ice cream sales to predict drowning *works*, but ice cream doesn't *cause* drowning.

**Prediction ≠ Causation.** A model can predict well for the wrong reasons.

---

### The Seasonal Pattern

We can see the confounding directly by looking at the timing.

*[Stage direction: 2-panel time series figure.*
- *Left panel: time series of ice cream sales (blue) and drowning deaths (red) over several years. Both series show clear seasonal peaks in summer and troughs in winter. The co-movement is driven by the shared seasonal cycle.*
- *Right panel: monthly averages — bar chart showing ice cream sales and drowning deaths by month (Jan-Dec). Both peak in June-August. The seasonal pattern is unmistakable.]*

Both variables follow the same seasonal pattern. The correlation exists because both respond to the same underlying cause — not because one affects the other.

---

### The Fix — Control Variables

If season is driving both variables, we can remove its influence by adding it to the model:

$$Drownings = \beta_0 + \beta_1 \cdot IceCream + \beta_2 \cdot Temperature + \epsilon$$

Now $\beta_1$ measures the relationship between ice cream and drowning **holding temperature constant**. We're asking: among months with the same temperature, do months with more ice cream have more drowning?

The answer is no. Once we control for temperature, $\beta_1$ becomes small and statistically insignificant. The "relationship" was entirely driven by the confounding variable.

*[Stage direction: a regression output table showing two models side by side.*
- *Model 1 (without control): $\beta_1$ (Ice Cream) = positive, significant (p < 0.001).*
- *Model 2 (with temperature control): $\beta_1$ (Ice Cream) = near zero, not significant (p = 0.72). $\beta_2$ (Temperature) = positive, significant.*
- *The contrast is stark: adding the control variable makes the ice cream coefficient disappear.]*

---

### Multiple Regression

This is the key idea behind **multiple regression**: when we include multiple predictors, each coefficient represents the effect of that variable **holding the others constant**. Economists call this "all else equal" or *ceteris paribus*.

By adding control variables, we can (partially) isolate the relationship between $X$ and $Y$ from the influence of confounders. Each additional control variable removes one potential source of spurious correlation.

---

### The Education and Wages Example

Wages depend on education, but also on experience, industry, location, natural ability, and many other factors. A simple regression:

$$Wages = \beta_0 + \beta_1 \cdot Education + \epsilon$$

might overestimate the "return to education" because education is correlated with other things that also affect wages. People with more education tend to come from wealthier families, live in cities with better job markets, and work in higher-paying industries.

With multiple regression:

$$Wages = \beta_0 + \beta_1 \cdot Education + \beta_2 \cdot Experience + \beta_3 \cdot Industry + \epsilon$$

Each coefficient is now the effect of that variable holding the others constant. $\beta_1$ is the return to an additional year of education for workers with the same experience in the same industry. This is a much more meaningful number.

*[Stage direction: show two coefficient estimates for education side by side — the simple regression $\beta_1$ (larger) and the multiple regression $\beta_1$ (smaller). The visual shows that controlling for confounders reduces the estimated effect of education. Label: "The estimated return to education shrinks when we add controls."]*

---

### When Can We Make Causal Claims?

Adding control variables helps, but it's not a magic bullet. Three problems remain:

1. **Omitted variable bias**: We might miss a confounder we didn't think of. If there's an unmeasured variable that affects both $X$ and $Y$, our $\beta_1$ is still biased.

2. **Reverse causality**: Maybe $Y$ causes $X$, not the other way around. Higher wages might lead people to get more education (rather than education causing higher wages). Regression can't tell you the direction of causation.

3. **Measurement error**: If $X$ is measured with noise, $\beta_1$ is biased toward zero.

Making causal claims requires both statistical tools and domain knowledge. You need to understand the mechanisms — how would $X$ cause $Y$? What confounders might exist? Is reverse causality plausible? Good empirical research combines careful statistical analysis with deep knowledge of the context.

---

### Spurious Correlations in the Wild

The world is full of confounding variables. Some famously absurd examples:

- Stock prices and butter production in Bangladesh (both trend upward over time)
- Nicolas Cage movies and swimming pool drownings (both happen to vary similarly year to year)
- Murder rates and ice cream sales (both increase in summer)
- Per-capita cheese consumption and deaths by bedsheet tangling (both trend upward)

These correlations are all real in the data. They would all produce significant $\beta_1$ values. But none of them are causal. The confounders (time trends, seasonal patterns, population growth) explain the apparent relationships.

Your job as an economist: sort the real causal relationships from the spurious ones. That requires statistics *and* critical thinking.

---

### Exercise Preview

*Exercise (Causality): Confounding in Action.* Students work with a dataset where a confounding variable (e.g., season, region, or time trend) creates a spurious relationship between $X$ and $Y$. They first fit the simple bivariate model and find a significant $\beta_1$. Then they add the confounder as a control variable and watch $\beta_1$ shrink or become insignificant. The exercise drives home the difference between correlation and causation in a hands-on way.

---

### Looking Ahead — Part 5

Part 5 extends the bivariate model to the full multivariate framework. We'll add numerical controls (5.1), categorical controls (5.2), interaction effects (5.3), and model selection (5.4). Control variables — the tool we introduced here — become central to the analysis. Every model in Part 5 is built on the same OLS foundation from Parts 3 and 4, just with more predictors.

The diagnostic tools from 4.4 still apply: residual plots, checks for linearity, homoskedasticity, normality, and independence. The only thing that changes is the complexity of the model.
