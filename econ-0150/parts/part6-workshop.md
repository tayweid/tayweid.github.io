# Part 6: Real Data Workshop
## "Your Project Data Won't Look Like This"

### Duration: One 75-minute session (or split into two if needed)

---

## Opening (5 minutes)

### The Reality Check:
"So far, I've given you clean data. I've been your data janitor. Today, that ends."

**Show on screen:**
- Left side: The clean survey data they've been using
- Right side: The actual raw survey responses with all the mess

"For your final projects, you'll be finding your own data. Let's learn to handle the mess."

---

## Part A: Diagnosis First (10 minutes)
*"Before cleaning, you need to know what's dirty"*

### The Data Health Check:
```python
# The five-minute diagnostic
df.info()           # What columns and types do I have?
df.head()           # What does it look like?
df.describe()       # Are the numbers reasonable?
df.isnull().sum()   # How much is missing?
df.dtypes           # Are columns the right type?
```

### Live Demo with Student Data:
"Who has project data already? Let's diagnose it together."
- Run the diagnostic
- Identify problems as a class
- Make a "cleaning todo list"

---

## Part B: The Missing Data Dilemma (10 minutes)
*"Empty cells are decisions waiting to happen"*

### Three Options (with consequences):
1. **Drop it** 
   ```python
   df.dropna()  # Nuclear option - loses lots of data
   df.dropna(subset=['important_column'])  # Targeted - better
   ```
   *Use when: You have plenty of data, missing values are random*

2. **Fill it**
   ```python
   df.fillna(0)  # Sometimes makes sense (like sales on closed days)
   df.fillna(df.mean())  # Risky - creates fake precision
   df.fillna(method='ffill')  # Forward fill for time series
   ```
   *Use when: You understand WHY data is missing*

3. **Flag it**
   ```python
   df['price_missing'] = df['price'].isna()  # Create indicator variable
   ```
   *Use when: Missingness might be informative*

### Class Exercise:
Show a dataset where a store's sales are missing on Sundays (they're closed).
- "Should we drop these rows? Fill with 0? Fill with average?"
- Discuss how the research question determines the answer

---

## Part C: Type Troubles (10 minutes)
*"When Python thinks your numbers are words"*

### Common Type Problems:

**Problem 1: Numbers stored as text**
```python
# The symptom: can't do math
df['price'] = ['$12.99', '$8.50', '15.00', 'free']

# The fix:
df['price'] = df['price'].str.replace('$', '').str.replace('free', '0')
df['price'] = pd.to_numeric(df['price'], errors='coerce')
```

**Problem 2: Dates stored as text**
```python
# The symptom: can't sort chronologically
df['date'] = ['Jan 1, 2024', '2024-01-02', '1/3/24']

# The fix:
df['date'] = pd.to_datetime(df['date'], errors='coerce')
df['year'] = df['date'].dt.year
df['month'] = df['date'].dt.month
```

**Problem 3: Categories with typos**
```python
# The symptom: same category counted multiple times
df['city'].unique()  # ['Pittsburgh', 'Pittsburg', 'pittsburgh', 'Pitt']

# The fix:
df['city'] = df['city'].str.lower().str.strip()
df['city'] = df['city'].replace({'pittsburg': 'pittsburgh', 
                                   'pitt': 'pittsburgh'})
```

---

## Part D: Merging Multiple Sources (15 minutes)
*"Your project probably needs data from multiple places"*

### The Three Types of Joins:

**1. Adding more columns (merge)**
```python
# You have: student grades by ID
# You want to add: student demographics by ID
combined = pd.merge(grades, demographics, on='student_id', how='left')
```

**2. Adding more rows (concat)**
```python
# You have: January sales
# You want to add: February sales
combined = pd.concat([jan_sales, feb_sales], ignore_index=True)
```

**3. The lookup (merge with different keys)**
```python
# You have: store sales with zip codes
# You want to add: income data by zip code
combined = pd.merge(sales, income_data, 
                    left_on='store_zip', 
                    right_on='zipcode')
```

### ⚠️ The Merge Gotchas:
- Duplicate keys create row explosion
- Different spellings break matches ("NYC" vs "New York City")
- Missing keys create NaNs

**Live Example:** Merge coffee shop locations with census income data

---

## Part E: Creating What You Need (10 minutes)
*"Sometimes you need to engineer your own variables"*

### Common Transformations for Economics:

**Growth rates:**
```python
df['price_growth'] = df['price'].pct_change()
```

**Bins/categories from continuous:**
```python
df['age_group'] = pd.cut(df['age'], 
                          bins=[0, 18, 35, 50, 65, 100],
                          labels=['<18', '18-34', '35-49', '50-64', '65+'])
```

**Ratios and shares:**
```python
df['profit_margin'] = df['profit'] / df['revenue']
df['market_share'] = df['sales'] / df.groupby('year')['sales'].transform('sum')
```

**Flags and indicators:**
```python
df['is_recession'] = df['gdp_growth'] < 0
df['high_performer'] = df['score'] > df['score'].quantile(0.9)
```

---

## Part F: The Clean Data Checklist (5 minutes)

### Before You Analyze, Verify:
- [ ] Do the numbers make sense? (no negative ages, prices in reasonable range)
- [ ] Are dates in order? 
- [ ] Do categories match expectations? (no 'Untied States')
- [ ] Are units consistent? (not mixing dollars and thousands of dollars)
- [ ] Do totals add up? (if you have parts and whole)
- [ ] Is each row the unit you think it is? (person vs person-year)

---

## Interactive Project Clinic (10 minutes)

### Student Data Triage:
"Bring up your messiest data problem"
- Student shares screen
- Class diagnoses together
- Live code the solution
- "Who else might have this problem?"

### The "Data Cleaning Cookbook" Handout:
One-page reference with:
- The diagnostic code block
- Common fixes with examples
- Decision tree for missing data
- Merge syntax reference
- "When you see this error..." guide

---

## Closing Wisdom (5 minutes)

### The Three Laws of Real Data:

1. **It's always messier than you expect**
   - Budget 50% of your time for cleaning
   - Your first attempt won't catch everything

2. **Document what you do**
   ```python
   # Bad: df = df.dropna()
   # Good: df = df.dropna()  # Dropped 47 rows with missing prices (stores closed that day)
   ```

3. **Keep the raw data**
   ```python
   df_raw = pd.read_csv('data.csv')
   df_clean = df_raw.copy()  # Work on the copy
   # Now you can always check what you changed
   ```

### The Encouragement:
"Everyone's data is messy. Professional data scientists spend most of their time on this. You're not doing it wrong - this IS the job."

### For Their Projects:
"Start with SELECT-TRANSFORM-ENCODE from Part 1. When that breaks because of messy data, come back to these tools."

---

## If You Have Extra Time: Advanced Topics

### Web Scraping Basics (if relevant to projects):
```python
pd.read_html('website_url')[0]  # Gets first table from webpage
```

### API Data (if anyone's using it):
```python
pd.read_json('api_endpoint')
```

### Large Files:
```python
pd.read_csv('huge_file.csv', nrows=1000)  # Test on subset first
```

---

## Assessment Approach

### Not a test, but a "Project Data Check-in":
- Students bring their project data
- Submit before/after cleaning samples
- Short reflection: "What was the messiest part?"
- Peer review: Trade data problems with a partner

---

## Resources to Provide

### The One-Page "Data 911" Sheet:
- Error message decoder
- Common fixes flowchart  
- "Try this first" suggestions
- When to ask for help

### Office Hours Offer:
"Bring your messy data to office hours this week - we'll tackle it togeth