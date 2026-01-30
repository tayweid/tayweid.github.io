# ECON 0150 Replication Project Plan

## Vision

Transform Fall 2024 student final projects into a structured, accessible replication archive that current and future students can:
1. **Browse** - Explore past research questions and findings on the projects page
2. **Replicate** - Open notebooks in Google Colab and run the analysis themselves
3. **Extend** - Use guided exercises to practice applying concepts to real research
4. **Inspire** - Find ideas and examples for their own final projects

---

## Current State (as of January 2025)

### File Structure
```
projects/replication/
├── data/                          # Raw/shared datasets (for new projects)
├── replications/                  # Self-contained project folders
│   ├── 0001/
│   │   ├── paper.pdf
│   │   ├── slides.pdf
│   │   ├── notebook.ipynb
│   │   └── data/
│   │       └── *.csv
│   ├── 0002/
│   │   └── ...
│   └── 0067/
├── exceptional_projects.csv       # 9 standout projects
├── replication_index.csv          # Master index of all projects
├── replication_plan.md            # This file
└── Replication_Template.ipynb     # Template for notebooks
```

### Project Numbering
- **0001-0034**: Originally 1PM section (groups 01-34)
- **0035-0067**: Originally 230PM section (groups 01-33)
- Total: 67 projects

### Exceptional Projects
| ID | Topic |
|----|-------|
| 0005 | MLB Attendance & Manager Change |
| 0009 | BMI & GDP on Life Expectancy |
| 0015 | GDP & Dentist Density with Healthcare Interaction |
| 0037 | Gender Wage Gap |
| 0039 | Maple Trees |
| 0040 | Urban-Rural Polarization |
| 0050 | Tuition & Enrollment |
| 0055 | Income & Life Expectancy |
| 0067 | Inflation & Holiday Sales |

### Current Status
- 67 folders created with paper.pdf, slides.pdf, notebook.ipynb, data/
- 57 projects have notebooks (10 missing - never submitted)
- 1 replication complete (0037 - Gender Wage Gap)

---

## Replication Workflow

### Overview

For each project, the workflow is:
1. Read the original notebook to understand the analysis
2. Clean up the notebook to match the template structure
3. Rename data files to remove spaces
4. Update data loading to use URL-based paths
5. Add replication exercises
6. Update replication_index.csv with metadata

### Detailed Steps

#### Step 1: Review Original Notebook

Open the notebook and assess:
- What is the research question?
- What data is used?
- What methods are applied (OLS, t-test, visualization)?
- What is the main finding?
- How complex is the code?

#### Step 2: Rename Data Files

Data files should have no spaces in filenames. Use lowercase with underscores.

**Before:**
```
data/
├── Glassdoor Gender Pay Gap.csv
└── CLEAN_PAY_DATA.csv
```

**After:**
```
data/
├── glassdoor_gender_pay_gap.csv
└── clean_pay_data.csv
```

Command:
```bash
cd replications/[ID]/data
mv "File With Spaces.csv" "file_with_underscores.csv"
```

#### Step 3: Create Clean Notebook

Start with the template structure but adapt to the project's content:

```markdown
# ECON 0150 | Replication Notebook

**Title:** [Project Title]
**Original Authors:** [Names]
**Original Date:** Fall 2024

---

## About This Replication

**Research Question:** [Question from paper/slides]
**Data Source:** [Description of data]
**Methods:** [OLS regression, t-test, etc.]
**Main Finding:** [One sentence with key numbers]

**Course Concepts Used:**
- [List relevant concepts]

---

## Step 0 | Setup
[Imports and data loading]

## Step 1 | Data Exploration
[Summary stats, value counts, distributions]

## Step 2 | Data Preparation
[Cleaning, transformations, new variables]

## Step 3 | Visualization
[Key plots from the analysis]

## Step 4 | Statistical Analysis
[Models, hypothesis tests]

## Step 5 | Results Interpretation
[What the results mean]

---

## Replication Exercises
[3-4 exercises for students]
```

#### Step 4: Update Data Loading

Replace Google Drive mounting with URL-based loading:

**Before (original):**
```python
from google.colab import drive
drive.mount('/content/drive')
os.chdir('/content/drive/MyDrive/Colab Notebooks/Project/')
data = pd.read_csv('My Data File.csv')
```

**After (replication):**
```python
data_url = 'https://tayweid.github.io/econ-0150/projects/replication/replications/0037/data/glassdoor_gender_pay_gap.csv'
data = pd.read_csv(data_url)
```

#### Step 5: Add Replication Exercises

Add 3-4 exercises that extend the analysis. Good exercise types:
- Add a control variable
- Analyze a subset of the data
- Create a different visualization
- Check model assumptions
- Create a new variable

Example:
```markdown
## Replication Exercises

### Exercise 1: Add More Controls
Add `Education` and `Seniority` as additional control variables. Does the main coefficient change?

### Exercise 2: Subset Analysis
Pick one job title and run the regression just for that subset. Is there a pay gap within that occupation?

### Exercise 3: Alternative Outcome
Create total compensation (BasePay + Bonus) and re-run the analysis. Do results change?

### Challenge Exercise
[More open-ended question requiring interpretation]
```

#### Step 6: Update replication_index.csv

Fill in metadata columns:
- `data_source`: Brief description of the data
- `methods`: What statistical methods were used
- `main_finding`: One sentence summary with key numbers
- `status`: Change from "pending" to "complete"

---

## Completed Example: 0037 (Gender Wage Gap)

### Original State
- Authors: Charley Wan and Asliddin Nurboev
- Research Question: Does the gender wage gap change when controlling for job title?
- Data: Glassdoor Gender Pay Gap dataset (1,000 employees)
- Methods: OLS regression with and without job title controls
- Finding: Raw 9.5% gap disappears when controlling for job title

### Changes Made

1. **Header**: Added standard replication header with title, authors, date

2. **About Section**: Added research question, data source, methods, main finding, course concepts

3. **Data Files Renamed**:
   - `Glassdoor Gender Pay Gap.csv` → `glassdoor_gender_pay_gap.csv`
   - `CLEAN_PAY_DATA.csv` → `clean_pay_data.csv`

4. **Data Loading Updated**:
   ```python
   data_url = 'https://tayweid.github.io/econ-0150/projects/replication/replications/0037/data/glassdoor_gender_pay_gap.csv'
   data = pd.read_csv(data_url)
   ```

5. **Code Streamlined**: Removed individual job title analyses (original had separate analysis for all 10 job titles), kept core uncontrolled vs controlled comparison

6. **Exercises Added**:
   - Exercise 1: Add Education and Seniority controls
   - Exercise 2: Analyze a specific job title
   - Exercise 3: Total compensation analysis
   - Challenge: Occupational segregation interpretation

7. **Index Updated**: Added data_source, methods, main_finding; changed status to "complete"

### Final Structure
```
replications/0037/
├── paper.pdf
├── slides.pdf
├── notebook.ipynb
└── data/
    ├── glassdoor_gender_pay_gap.csv
    └── clean_pay_data.csv
```

---

## Projects Without Notebooks

10 projects have no notebook (students didn't submit one):
- 0006, 0012, 0016, 0019, 0022 (1PM section)
- 0035, 0047, 0051, 0059, 0061 (230PM section)

Options:
1. **Skip**: Mark as "no notebook" in index
2. **Create from scratch**: If paper/slides are good, could create a basic replication notebook

---

## URL Pattern

All data files are accessible at:
```
https://tayweid.github.io/econ-0150/projects/replication/replications/[ID]/data/[filename].csv
```

Example:
```
https://tayweid.github.io/econ-0150/projects/replication/replications/0037/data/glassdoor_gender_pay_gap.csv
```

---

## Quality Checklist

Before marking a replication as complete:

### Notebook
- [ ] Runs end-to-end without errors
- [ ] Data loads from URL (no Google Drive)
- [ ] Clear section headers matching template
- [ ] Code is clean (no debugging cells)
- [ ] Markdown explains each section
- [ ] 3-4 replication exercises included

### Data Files
- [ ] No spaces in filenames
- [ ] Lowercase with underscores
- [ ] All required data files present

### Metadata
- [ ] Research question is clear
- [ ] Data source is described
- [ ] Methods accurately described
- [ ] Main finding is one sentence with key numbers
- [ ] Status set to "complete"

---

## Next Steps

1. **Continue with exceptional projects**: 0005, 0009, 0015, 0039, 0040, 0050, 0055, 0067
2. **Then process remaining projects**: Work through 0001-0067, skipping those without notebooks
3. **Update projects.html**: Add cards for completed replications
4. **Upload to Google Drive**: Get Colab links for sharing

---

## Files Reference

| File | Purpose |
|------|---------|
| `replication_index.csv` | Master index of all 67 projects |
| `exceptional_projects.csv` | List of 9 standout projects |
| `Replication_Template.ipynb` | Template for creating notebooks |
| `replication_plan.md` | This documentation |

---

*Last updated: January 2025*
