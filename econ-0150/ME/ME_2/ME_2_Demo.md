**Name: ________________________________________________________________________________________________________ **                          **Student ID: ________________________________________________________________________________________________________ **

## ECON 0150 | MiniExam 2 | Demo

MiniExams are designed to both test your knowledge and challenge you to apply familiar concepts in new environments. Treat it as if you're trying to show me that you understand the material. Answer clearly, completely, and concisely. Data tables are provided at the end.

#### Academic Conduct Code

The following academic conduct code is designed to protect the integrity of your work. Print your name/initials beside the three academic honesty agreements. I pledge to my fellow students, the university, and the instructor, that:

________ I will complete this MiniExam solely using my own work.
________ I will not use any digital resources unless explicitly allowed by the instructor.
________ I will not communicate directly or indirectly with others during the MiniExam.

---

##### Q1. Identify the Relationship (see Table 1)

Table 1 shows Population and Air Quality Index (AQI) for six cities, where higher AQI means worse air quality.

a) As Population increases, does AQI tend to increase, decrease, or stay the same?

________________________________________

b) Is the pattern exact or approximate? Point to one city as evidence.

________________________________________________________________________________________________________

c) Based on the overall trend, would you expect a city with 600,000 people to have an AQI closer to 50 or 75?

________________________________________



##### Q2. Log Transforms (see Table 2)

Table 2 shows annual revenue for six companies.

a) Fill in the log2(1 + Revenue) column. Recall that log2 asks: "1 + Revenue equals 2 raised to what power?"

| Company | Revenue ($) | log2(1 + Revenue) |
|---------|-------------|-------------------|
| A       | 3           | _________________ |
| B       | 7           | _________________ |
| C       | 15          | _________________ |
| D       | 31          | _________________ |
| E       | 63          | _________________ |

b) Company F has revenue of $500,000. On the original scale, Company F's revenue is about 8,000 times larger than Company A's. On the log2 scale, roughly how far apart are they?

[2 units]    [6 units]    [17 units]    [8,000 units]

c) In one sentence, why might a log transform be useful when analyzing this data?

________________________________________________________________________________________________________



##### Q3. Why Visualization Matters

Dataset A and Dataset B both have the following summary statistics: mean of X = 9, mean of Y = 7.5, standard deviation of X = 3.3, standard deviation of Y = 2.0, and correlation = 0.82.

A classmate says: "Since the statistics are identical, the two datasets must show the same relationship."

Do you agree or disagree? Explain in one sentence.

________________________________________________________________________________________________________

________________________________________________________________________________________________________



##### Q4. Count by Category (see Table 3)

Table 3 shows transactions at a retail chain.

How many transactions fall into each Store Type? Fill in the table:

| Store Type | Count |
|------------|-------|
| __________ | _____ |
| __________ | _____ |
| __________ | _____ |



##### Q5. Filter: Single Condition (see Table 4)

Given the employee records data, keep only rows where Salary is greater than 55,000.

Circle the Emp_IDs that remain in the filtered dataset:

**[E001]    [E002]    [E003]    [E004]    [E005]    [E006]    [E007]    [E008]**



##### Q6. Filter: Multiple Values (see Table 4)

Using the same employee data, keep only rows where Department is "Sales" or "HR".

Circle the Emp_IDs that remain:

**[E001]    [E002]    [E003]    [E004]    [E005]    [E006]    [E007]    [E008]**



##### Q7. Compare Distributions by Category (see Table 5)

Table 5 shows test scores for students in two subjects.

a) What is the median score for Math? For Reading?

Math median: _______________     Reading median: _______________

b) Which subject shows more variation in scores? Point to specific evidence.

________________________________________________________________________________________________________

c) A classmate says "Math students are worse at tests." Based on this data alone, is that a fair conclusion? Why or why not?

________________________________________________________________________________________________________

________________________________________________________________________________________________________



##### Q8. Multi-Step Operation (see Table 4)

Using the employee records data, perform the following steps:
1. Filter for Salary greater than 50,000
2. Group by Department
3. Calculate the Mean Salary and Count for each group

Fill in the result:

| Department | Mean Salary | Count |
|------------|-------------|-------|
| __________ | ___________ | _____ |
| __________ | ___________ | _____ |
| __________ | ___________ | _____ |



##### Q9. Merge Two Tables (see Tables 6a and 6b)

Table 6a shows student grades. Table 6b shows student club memberships. Both tables share a Student_ID column. Merge the two tables on Student_ID (keeping only students that appear in both tables).

a) Fill in the merged table:

| Student_ID | Grade | Club       |
|------------|-------|------------|
| __________ | _____ | __________ |
| __________ | _____ | __________ |
| __________ | _____ | __________ |

b) How many rows are in the merged table? ________

c) Which students are missing from the result, and why?

________________________________________________________________________________________________________

________________________________________________________________________________________________________



##### Q10. Reshape Wide to Long (see Table 7)

Table 7 shows quarterly sales in wide format, where each quarter is its own column.

Reshape this table into long format so that each row represents one store in one quarter. Fill in the result:

| Store   | Quarter | Sales |
|---------|---------|-------|
| _______ | _______ | _____ |
| _______ | _______ | _____ |
| _______ | _______ | _____ |
| _______ | _______ | _____ |

How many rows does the long-format table have? ________



##### Q11. Scatter Plot by Category (see Table 8)

Table 8 shows study hours and test scores for students in two class formats: Online and In-Person. Imagine plotting Study Hours (x-axis) vs Test Score (y-axis), colored by Format.

a) Is the relationship between Study Hours and Test Score positive or negative for Online students?

________________________________________

b) Is the relationship positive or negative for In-Person students?

________________________________________

c) Which group shows a stronger relationship between hours and scores? Point to specific evidence.

________________________________________________________________________________________________________

d) In one sentence, what might explain this difference?

________________________________________________________________________________________________________



##### Q12. Choose the Right Visualization

For each research question below, name the most appropriate visualization from the following options:

- Scatter plot
- Boxplot by category
- Scatter plot colored by category

a) You have employee salary data and want to compare the distribution of salaries between hourly and salaried employees.

________________________________________

b) You have data on years of experience and salary for each employee. You want to know whether more experience is associated with higher pay.

________________________________________

c) You have data on years of experience, salary, and employment type (hourly vs. salaried) for each employee. You want to know whether the experience-salary relationship differs between hourly and salaried employees.

________________________________________










## Data Tables

### Table 1: City Air Quality
| City | Population (thousands) | AQI (higher = worse) |
|------|------------------------|----------------------|
| A    | 50                     | 32                   |
| B    | 150                    | 58                   |
| C    | 300                    | 45                   |
| D    | 500                    | 71                   |
| E    | 800                    | 83                   |
| F    | 1,200                  | 92                   |

### Table 2: Company Revenue
| Company | Revenue ($) |
|---------|-------------|
| A       | 3           |
| B       | 7           |
| C       | 15          |
| D       | 31          |
| E       | 63          |
| F       | 500,000     |

### Table 3: Store Transactions
| Transaction_ID | Store Type | Amount |
|----------------|------------|--------|
| T001           | Online     | 25     |
| T002           | In-Store   | 42     |
| T003           | Online     | 18     |
| T004           | Online     | 67     |
| T005           | In-Store   | 31     |
| T006           | Mobile     | 15     |
| T007           | Online     | 53     |
| T008           | In-Store   | 28     |

### Table 4: Employee Records
| Emp_ID | Department | Salary  | Years |
|--------|------------|---------|-------|
| E001   | Sales      | 45,000  | 3     |
| E002   | Tech       | 72,000  | 7     |
| E003   | Sales      | 58,000  | 5     |
| E004   | Tech       | 84,000  | 10    |
| E005   | HR         | 52,000  | 4     |
| E006   | Sales      | 62,000  | 8     |
| E007   | HR         | 48,000  | 2     |
| E008   | Tech       | 90,000  | 12    |

### Table 5: Student Test Scores
| Student | Subject | Score |
|---------|---------|-------|
| S01     | Math    | 65    |
| S02     | Math    | 72    |
| S03     | Math    | 78    |
| S04     | Math    | 85    |
| S05     | Math    | 95    |
| S06     | Reading | 80    |
| S07     | Reading | 84    |
| S08     | Reading | 86    |
| S09     | Reading | 88    |
| S10     | Reading | 92    |

### Table 6a: Student Grades
| Student_ID | Grade |
|------------|-------|
| S001       | 88    |
| S002       | 72    |
| S003       | 95    |
| S004       | 63    |

### Table 6b: Student Clubs
| Student_ID | Club    |
|------------|---------|
| S001       | Chess   |
| S002       | Debate  |
| S005       | Chess   |
| S003       | Science |

### Table 7: Quarterly Sales (Wide Format)
| Store   | Q1_Sales | Q2_Sales |
|---------|----------|----------|
| Store_A | 100      | 150      |
| Store_B | 200      | 180      |

### Table 8: Study Hours and Test Scores by Format
| Student | Format    | Study Hours | Test Score |
|---------|-----------|-------------|------------|
| S1      | Online    | 2           | 65         |
| S2      | Online    | 4           | 70         |
| S3      | Online    | 6           | 75         |
| S4      | Online    | 8           | 78         |
| S5      | In-Person | 2           | 60         |
| S6      | In-Person | 4           | 75         |
| S7      | In-Person | 6           | 85         |
| S8      | In-Person | 8           | 95         |
