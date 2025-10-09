## Part 1 Restructured: The SELECT-TRANSFORM-ENCODE Framework

## Core Pedagogical Principle
Every data visualization follows three steps. Students must internalize this framework from Day 1.

### The Three Steps:
1. **SELECT** - What subset of data are we looking at?
2. **TRANSFORM** - How do we summarize or reshape it?
3. **ENCODE** - How do we turn numbers into visual elements?

---

## Part 1.0: Introduction to the Framework (NEW - 30 minutes)

### Learning Objectives:
- Understand that all visualizations follow the same three-step process
- Practice identifying these steps in existing visualizations
- Build mental model for the course

### Class Activity:
Start with your class survey data showing "Do you feel confident in Excel?"

**Walk through together:**
- SELECT: All student responses about Excel confidence
- TRANSFORM: Count how many said "Yes" vs "No" 
- ENCODE: Draw bars with height = count

**Key insight:** "The bar chart is doing the counting FOR you"

### Student Exercise:
Show them 3 visualizations from later in the course. Have them identify:
- What data was SELECTED?
- How was it TRANSFORMED?
- How was it ENCODED?

---

## Part 1.1: Categorical Variables - Automatic Counting

### The Framework Applied:
| Visualization | SELECT | TRANSFORM | ENCODE |
|--------------|---------|-----------|---------|
| Bar chart (majors) | All major responses | Group by major → Count | Height = count |
| Pie chart (CA vs Other) | All locations | Group by category → Count | Angle = proportion |

### Key Teaching Moments:
- "Notice we're always counting. The visualization does this automatically."
- "What if we wanted to count manually?" (Show `value_counts()`)
- "Different encodings (bar vs pie) for same transformation"

### Add Small Data Operation (5 mins):
- When looking at coffee shops by state: "What if we only want western states?"
- Introduce filtering: `df[df['state'].isin(['CA', 'OR', 'WA'])]`
- "We changed our SELECT step"



### Extra Notes

- Maybe do a data transformation here, turning an nominal categorical variable into a binary one
- Maybe do all data operations here: filtering, grouping, transforming

---

## Part 1.2: Numerical Variables - Automatic Binning

### The Framework Applied:
| Visualization | SELECT | TRANSFORM | ENCODE |
|--------------|---------|-----------|---------|
| Histogram (age) | All customer ages | Group by bins → Count | Height = count |
| Box plot (coffee consumption) | All consumption values | Calculate quartiles | Box position = quartiles |

### Key Teaching Moments:
- "A histogram is a bar chart that creates its own groups (bins)"
- Show the connection: Manual bins → Bar chart = Histogram
- "Box plots transform differently - they calculate statistics, not counts"

### Reveal the Hidden Grouping:
```python
# What a histogram actually does:
df['age_bin'] = pd.cut(df['age'], bins=range(20,80,10))
df.groupby('age_bin').count()  # This IS a histogram!
```

---

## Part 1.3: Time Series - Sequential Data

### The Framework Applied:
| Visualization | SELECT | TRANSFORM | ENCODE |
|--------------|---------|-----------|---------|
| Line graph (prices) | All daily prices | None (raw values) | Position = price |
| Line graph (monthly avg) | All prices | Group by month → Mean | Position = mean price |
| Multi-boxplot (by month) | All prices | Group by month → Quartiles | Box = quartiles |

### Key Teaching Moments:
- "Sometimes we plot raw data (no transformation)"
- "Sometimes we transform first (monthly averages)"
- "The question determines the transformation"

### Extra Notes

- Maybe include the Global Starbucks Open Hour example here, talking about filtering 

---

## Part 1.4: Relationships - Asking About Patterns

### The Framework Applied:
| Visualization | SELECT | TRANSFORM | ENCODE |
|--------------|---------|-----------|---------|
| Scatter (income vs age) | All people | None | Position x,y |
| Scatter (GDP vs coffee) | All countries | Log transform | Position x,y |
| Multi-boxplot (wages by education) | All workers | Group by ed → Quartiles | Box position |
| Multi-line (hourly transactions) | All transactions | Group by shop+hour → Count | Line height |

### Key Teaching Moments:
- "Different questions need different transformations"
- "Log transformation spreads out bunched data"
- Introduce Starbucks promo example here: "Sometimes we need custom grouping"

### The Starbucks Revelation:
"Which offer is most effective? We need to transform the data to answer this:"
- Raw data → Group by offer → Count (how many sent?)
- Raw data → Filter transactions → Group by offer → Count (how many used?)
- Divide these: "We created a new metric through transformation!"

---

## Part 1.5: Complex Transformations - You're in Control

### The Framework Applied:
| Question | SELECT | TRANSFORM | ENCODE |
|----------|---------|-----------|---------|
| Effectiveness by offer | Transactions only | Group → Calculate ratio | Bar chart |
| Growth rates | Two time periods | Calculate % change | Line or scatter |
| Patterns by subgroup | Filtered subset | Group → Aggregate | Your choice |

### Key Teaching Moments:
- "Now you control all three steps"
- "The question determines the transformation"
- "Sometimes we need multiple transformations in sequence"

### Synthesis Exercise:
Give them a business question and raw data. Make them:
1. Decide what to SELECT
2. Design the TRANSFORM
3. Choose the ENCODE
4. Justify why this answers the question

---

## Implementation Tips

### For Every Example:
1. Start with the question
2. Show the raw data
3. Fill out the framework table together
4. Show the visualization
5. Ask: "What transformation happened behind the scenes?"

### Student Practice:
**The Framework Table** (use for every visualization)
| What are we SELECTING? | How are we TRANSFORMING? | How are we ENCODING? |
|------------------------|---------------------------|----------------------|
| [Students fill in] | [Students fill in] | [Students fill in] |

### Assessment Ideas:
- Show a visualization, have students reverse-engineer the three steps
- Give raw data and a question, have students plan (not execute) the three steps
- "Which transformation would best answer this question?"

---

## Why This Works

### Cognitive Benefits:
1. **Reduces cognitive load** - One framework for everything
2. **Makes implicit explicit** - No more "magic" visualizations
3. **Builds mental model** - Students can reason about new situations
4. **Empowers creativity** - "I can transform data to answer MY question"

### Practical Benefits:
1. **Natural integration** - Data operations aren't separate topics
2. **Just-in-time learning** - Introduce operations when needed
3. **Saves 2 weeks** - No separate Part 2
4. **Better retention** - Connected to purpose, not abstract

### Connection to Later Parts:
- Part 3-5: "Statistical tests are just more sophisticated TRANSFORMs"
- Part 6: "Your project needs custom SELECT and TRANSFORM steps"

---

## Migration Notes

### What moves where:
- **Filtering** → Taught in SELECT step throughout Part 1
- **Basic grouping** → Revealed as what happens in bar charts/histograms
- **Custom grouping** → Part 1.4 with Starbucks example
- **Log transform** → Part 1.4 with GDP/coffee scatter
- **Complex operations** → Part 1.5 as "custom transformations"
- **Data cleaning** → Part 6 "Real Data Workshop" before projects
- **Cut entirely** → GMT timezone, inflation adjustment, complex string parsing

### Time savings:
- Old Part 2: 2.5 weeks
- New integrated approach: 0 additional weeks (embedded in Part 1)
- Net gain: 2.5 weeks for more statistics/modeling