## Part 1.5 (Optional) | Reshaping Panel Data

### From Scatterplots to Line Plots

Instead of measuring changes between just two years (1999 and 2019), how might we visualize each country's full trend over all 30 years? We could use a line plot with Year on the x-axis and Consumption on the y-axis, colored by Country.

The problem is that wide format has no `Year` column! We need to reshape the data.

---

### Reshaping: Wide to Long

We can convert between formats. Going from wide to long is called "melting" or "unpivoting."

![Wide to Long](i/w_03.png)

In Python pandas, use `melt()`:

```python
# Wide to Long
percap_long = percap.melt(
    id_vars='Code',          # Keep as identifier column
    var_name='Year',         # Name for the former column headers
    value_name='Consumption' # Name for the values
)
```

`id_vars` specifies columns to keep as identifiers. Everything else gets "melted" into rows. Each year column becomes rows in a new "Year" column.

![Melt Result](i/w_04.png)

---

### Reshaping: Long to Wide

Going from long to wide is called "pivoting" or "spreading."

In Python pandas, use `pivot()`:

```python
# Long to Wide
percap_wide = percap_long.pivot(
    index='Code',            # What becomes rows
    columns='Year',          # What becomes columns
    values='Consumption'     # What fills the cells
)
```

Each unique Year value becomes its own column.

---

### Python Exercise | Reshaping

```python
# Wide to Long
percap_long = percap.melt(id_vars='Code', var_name='Year', value_name='Consumption')

# Long to Wide
percap_wide = percap_long.pivot(index='Code', columns='Year', values='Consumption')
```
