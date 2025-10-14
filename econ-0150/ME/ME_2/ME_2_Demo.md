**Name: ________________________________________________________________________________________________________ **                          **Student ID: ________________________________________________________________________________________________________ **

## ECON 0150 | MiniExam 2 | Demo

This MiniExam will take 16 minutes with a quick break to follow. MiniExams are designed to both test your knowledge and challenge you to apply familiar concepts in new environments. Treat it as if you’re trying to show me that you understand the material. Answer clearly, completely, and concisely. 

#### Academic Conduct Code

The following academic conduct code is designed to protect the integrity of your work. Print your name/initials beside the three academic honesty agreements. I pledge to my fellow students, the university, and the instructor, that:

________ I will complete this MiniExam solely using my own work.
________ I will not use any digital resources unless explicitly allowed by the instructor.
________ I will not communicate directly or indirectly with others during the MiniExam.

---

##### Q1. Trace the Filter Operation (see Table 1)

Given the bookstore sales data, which rows remain after applying:
**Filter: (Price < 30) OR (Category == 'Fiction')**

Circle the Book_IDs that would remain in the filtered dataset:

**[B001]    [B002]    [B003]    [B004]    [B005]    [B006]**



##### Q2. Multi-Step Data Operation (see Table 2)

Fill in the exact result of the following operations using the restaurant ratings data:
1. Filter for Rating >= 4
2. Group by Cuisine
3. Count rows in each group

| Cuisine | Count |
|---------|-------|
| _______ | _____ |
| _______ | _____ |
| _______ | _____ |



##### Q3. Build the Correct Filter

Find all transactions from the weekend with amounts between \$50 and \$200. Write out the correct expression using the following operations. 

1. (Amount >= 50)
2.  (Day == 'Saturday')
3.  (Amount <= 200)  
4.  (Day == 'Sunday')

________________________________________________________________________________________________________________________________________________________________



##### Q4. Understanding Transformations (see Table 4)

The delivery company wants to compare driver efficiency across regions with different wage levels. They have: `Deliveries_per_hour`, `Local_minimum_wage`. Circle the best transformation and explain why in ONE sentence:

**a)** Deliveries_per_hour + Local_minimum_wage  
**b)** Deliveries_per_hour - Local_minimum_wage  
**c)** Deliveries_per_hour / Local_minimum_wage  
**d)** Deliveries_per_hour * Local_minimum_wage  



##### Q5. Predict the Grouping Output (see Table 5)

After grouping the employee data by Department and calculating MEDIAN Salary:

**How many rows will the output have?** ________________________________________

**What will be the median salary for Sales?**
[52,000]  [55,000]  [58,000]  [60,000]

**Which aggregation would give Sales the HIGHEST value?**
[mean]  [median]  [min]  [max]  [sum]









## Data Tables

### Table 1: Bookstore Sales
| Book_ID | Category    | Price |
|---------|-------------|-------|
| B001    | Fiction     | 24.99 |
| B002    | Non-Fiction | 34.99 |
| B003    | Fiction     | 18.50 |
| B004    | Textbook    | 89.00 |
| B005    | Textbook    | 25.00 |
| B006    | Non-Fiction | 28.75 |

### Table 2: Restaurant Ratings
| Restaurant_ID | Cuisine | Rating |
|--------------|---------|---------|
| R001         | Italian | 4.5     |
| R002         | Thai    | 3.8     |
| R003         | Italian | 4.2     |
| R004         | Mexican | 3.5     |
| R005         | Thai    | 4.7     |
| R006         | Mexican | 4.1     |













### Table 3: Customer Ages

| Customer_ID | Age          |
|------------|--------------|
| C001       | twenty-five  |
| C002       | 32 years     |
| C003       | N/A          |
| C004       | 45           |

### Table 4: Delivery Efficiency
| Region    | Deliveries_per_hour | Local_minimum_wage |
|-----------|--------------------|--------------------|
| Downtown  | 3.2                | $15                |
| Suburbs   | 4.8                | $12                |
| Rural     | 2.4                | $10                |

### Table 5: Employee Salaries
| Emp_ID | Department | Salary  |
|--------|------------|---------|
| E001   | Sales      | 52,000  |
| E002   | Tech       | 75,000  |
| E003   | Sales      | 60,000  |
| E004   | Tech       | 82,000  |
| E005   | Sales      | 55,000  |
| E006   | Admin      | 48,000  |