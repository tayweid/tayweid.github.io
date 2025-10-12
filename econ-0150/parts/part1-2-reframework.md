## Part 1 Restructured: The SELECT-TRANSFORM-ENCODE Framework

## Core Pedagogical Principle
Every data visualization follows three steps. Students must internalize this framework from Day 1.

### The Three Steps:
1. **SELECT** - What subset of data are we looking at?
2. **TRANSFORM** - How do we summarize or reshape it?
3. **ENCODE** - How do we turn numbers into visual elements?



#### Additional Notes

I want to also maybe discuss the idea of data being the realization of an unknown random variable. The idea is that to connect data early in the semester to the ideas of probability and statistics later on. I think this should go along with setting up nice notation for data, with i as the cross-sectional index and t as the timeseries index. 

It might be worth doing a class on a data framework with the survey data. Talk about the 

This makes it easy to talk about Katherine's emphasis on the data generating process. "Look at this random variable. Who is doing the generating? What's included? What does it leave out? What does it miss?"

Maybe the thing goes like:

- Here's a datapoint x_i. This came from some random variable that we do not necessarily know. Some examples of random variables are like these <exmaple pdfs and pmfs>. 
- If we were to draw from a known random variable like this 10,000 times, we can see that the data we've collected matches the distribution very closely.
- But often we don't know what the distribution is. With most data, you will only see the realization of the random variable, not the random variable itself. 
- Data is just repeated realizations of some random variable. If I draw many realizations from a random variable, I have many datapoints. 
- We use this i to tell us the index of the datapoint, which is there to help us keep track of the datapoints.
- We can have multiple indexs, typically i and j. Lets say we have individual students in many sections of ECON 0150. We'll use i to denote the student and j to denote the section. 
- Then we can also look at data through time, which we typically index with t. So I can have a student i in class j with a test score at time t. I might call this datapoint x_{ijt}, which looks a bit fussy, but this way of writing things out turns out to be very helpful later on.
- You may be tempted to look at a distribution in your data and guess the random variable behind the data generating process. But guessing is not great science. And it turns out we have methods where we don't need to guess. 
- For now all we need to think about is the datapoints (what we call data) and not the data generating process itself. 
- How we interact with data depends largely on what we want to know. Even in simple datasets, there are too many to manage. 
- SELECT
- TRANSFORM
- ENCODE
- Go through some examples with the survey

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



#### Additional Notes

Part 2.3: Filtering - covers global opening hour, where we go through and filter by location and duration. This is cross-sectional data that we turn into a timeseries.

> Maybe we do this as a transition from cross-section into timeseries. 

Part 2.1: Cleaning - covers the survey and is so boring. 

>  Save this for Part 6.

Part 2.2: Transforming - covers maily coffee prices and global opening hours. 

> We've already talked about data operations as the second step, so the cpi conversion would fit naturally in timeseries. Maybe just drop the GMT example or add it to the discussion on timeseries, merging it with the filtering example. 

Part 2.4: Grouping - covers starbucks promos and is a bit too long.

> I think this might go well with categorical data. Maybe start with the existing simple categorical data, then talk about how sometimes we need to transform the data to be easy to summarize by category. Instead of just counting, sometimes we want other types of transformations. 

Part 2.5: Merging - covers elections data, an interesting example, but not an interesting concept.

> Maybe theres a way to use this in bivariate data. 

I wonder if there's a way to organize this so that by the end of Part 1 we've built up a framework for data using x_{ijt}, a framework for data operations, and a framework for visualizations. Building up a framework for data operations in the middle of this would releive my concern about sprinkling in different operations throughout. And it might even be possible to do a simple data cleaning when using GMT. 

I want to offload some of the exercises to videos since this will add time and content. Maybe it makes sense again to separate out this first part into two parts. 