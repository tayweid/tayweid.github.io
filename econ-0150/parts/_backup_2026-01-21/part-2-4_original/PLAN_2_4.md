# Part 2.4: Panel Data (Wide Format) — Plan

## Learning Objectives

By the end of this unit, students should be able to:
1. Recognize when data is in long vs wide format
2. Understand which format is better for different tasks
3. Reshape data from long to wide using `pivot()`
4. Reshape data from wide to long using `melt()`

---

## Proposed Content Structure

### Section 1: Why Reshape? (Motivation)

**Slides 1-3: The Problem**
- Start with Coffee_Per_Cap data (already in wide format from 2.3)
- Ask: "What if we want to plot ALL years for ONE country as a line graph?"
- Wide format makes this awkward — each year is a column
- Need to reshape to long format

**Key insight:** Same data, different shapes, different affordances.

### Section 2: Wide → Long (Melting)

**Slides 4-7: Melt Operation**
- Show wide format: countries as rows, years as columns
- Introduce `melt()` — "unpivots" wide data into long format
- Visual: table transformation diagram
- Result: one row per country-year combination

**Code example:**
```python
# Wide to Long
long_df = wide_df.melt(
    id_vars=['Code', 'Entity'],  # Keep these as columns
    var_name='Year',             # New column for former column names
    value_name='Consumption'     # New column for the values
)
```

**Figure:** Side-by-side comparison of wide vs long tables

### Section 3: Long → Wide (Pivoting)

**Slides 8-11: Pivot Operation**
- Start with long format (result from melt)
- Ask: "What if we want to compare 1999 vs 2019 for all countries?"
- Long format makes this awkward — need to filter twice
- Introduce `pivot()` — reshapes long data into wide format

**Code example:**
```python
# Long to Wide
wide_df = long_df.pivot(
    index='Code',      # What becomes rows
    columns='Year',    # What becomes columns
    values='Consumption'  # What fills the cells
)
```

### Section 4: When to Use Which Format

**Slides 12-14: Decision Guide**

| Task | Better Format | Why |
|------|---------------|-----|
| Line plot over time | Long | `hue='Country'` works naturally |
| Compare two time points | Wide | Columns are directly accessible |
| Faceted plots | Long | `col='Country'` works naturally |
| Summary statistics by group | Long | `groupby()` works naturally |
| Correlation between years | Wide | Each year is a variable |
| Scatterplot (Year1 vs Year2) | Wide | Each axis is a column |

**Key message:** Neither format is "better" — choose based on what you're trying to do.

### Section 5: Exercise

**Slides 15-17: Hands-on Practice**
- Use Coffee_Per_Cap.csv (wide format)
- Task 1: Melt to long format
- Task 2: Create a line plot of consumption over time for 3 countries
- Task 3: Pivot back to wide format
- Task 4: Create a scatterplot of 1999 vs 2019 consumption

---

## Figures Needed

| Figure | Description |
|--------|-------------|
| w_01.png | Wide format table visualization (Coffee_Per_Cap sample) |
| w_02.png | Long format table visualization (same data, melted) |
| w_03.png | Side-by-side comparison: wide vs long |
| w_04.png | Melt operation diagram (arrows showing transformation) |
| w_05.png | Pivot operation diagram (arrows showing transformation) |
| w_06.png | Line plot from long format (consumption over time by country) |
| w_07.png | Scatterplot from wide format (1999 vs 2019) |

---

## Files to Create

1. `concept_2_4.qmd` — Slides (~17 slides)
2. `Main_2_4.ipynb` — Figure generation notebook
3. `Exercise_2_4.ipynb` — Student exercise notebook
4. `custom.css` — Copy from part-2-3
5. `data/` — Symlink or copy Coffee_Per_Cap.csv

---

## Connection to 2.3

Part 2.3 already:
- Introduces long vs wide format (first 2 slides)
- Uses Coffee_Per_Cap.csv in wide format for multi-boxplots
- Uses scatterplot of 1999 vs 2019 (which requires wide format)

Part 2.4 builds on this by:
- Explaining HOW to convert between formats
- Showing WHEN each format is useful
- Providing practice with `melt()` and `pivot()`

---

## Questions for Review

1. **Dataset:** Should we use Coffee_Per_Cap.csv (familiar from 2.3) or introduce a new dataset?
   - Recommendation: Use Coffee_Per_Cap for continuity

2. **Depth:** How much pandas syntax detail?
   - Recommendation: Focus on the concepts, show basic syntax, don't cover all edge cases

3. **Scope:** Should we cover `pivot_table()` (with aggregation) or just `pivot()`?
   - Recommendation: Just `pivot()` — keep it simple, `pivot_table` is for Part 6

4. **Exercise:** In-class exercise or homework or both?
   - Recommendation: Both, with exercise being scaffolded and homework being independent

---

## Estimated Effort

- Slides: ~17 slides
- Figures: 7 figures
- Notebooks: 2 (Main + Exercise)
- Time: Similar scope to other units

---

## Summary

This unit teaches students the practical skill of reshaping panel data. The key pedagogical point is that **format is a choice** — neither long nor wide is inherently better, but each makes different operations easier. Students will leave able to:

1. Identify when their data is in the "wrong" format for their task
2. Use `melt()` to go wide → long
3. Use `pivot()` to go long → wide
4. Choose the right format for common visualization and analysis tasks
