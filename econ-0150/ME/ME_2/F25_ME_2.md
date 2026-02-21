**Name: ________________________________________________________________________________________________________ **                          **Student ID: ________________________________________________________________________________________________________ **

## ECON 0150 | MiniExam 2 | Version A

This MiniExam will take 16 minutes with a quick break to follow. MiniExams are designed to both test your knowledge and challenge you to apply familiar concepts in new environments. Treat it as if you're trying to show me that you understand the material. Answer clearly, completely, and concisely. 

#### Academic Conduct Code

The following academic conduct code is designed to protect the integrity of your work. Print your name/initials beside the three academic honesty agreements. I pledge to my fellow students, the university, and the instructor, that:

________ I will complete this MiniExam solely using my own work.
________ I will not use any digital resources unless explicitly allowed by the instructor.
________ I will not communicate directly or indirectly with others during the MiniExam.

---

##### Q1. Calculate Grouping Results (see Table 1)

After grouping the subscription data by Plan_Type and calculating MAX Monthly_Revenue:

**How many rows will the output have?** ________________________________________

**What will be the maximum monthly revenue for Premium?**
[45]  [65]  [75]  [85]

**If we instead calculated the SUM, which plan type would have the LOWEST total?**
[Basic]  [Standard]  [Premium]



##### Q2. Apply Filter and Aggregate (see Table 2)

Fill in the exact result of the following operations using the product inventory data:
1. Filter for Stock_Level <= 50
2. Group by Category
3. Calculate MEAN Price for each group (round to nearest dollar)

| Category | Mean_Price |
| -------- | ---------- |
| ________ | __________ |
| ________ | __________ |



##### Q3. Identify Filtered Rows (see Table 3)

Given the airline flights data, which rows remain after applying:
**Filter: (Delay_Minutes > 15) AND (Distance_Miles < 1000)**

Circle the Flight_IDs that would remain in the filtered dataset:

**[F001]    [F002]    [F003]    [F004]    [F005]    [F006]**





##### Q4. Construct a Filter Expression (no table needed)

Write out an expression using the following operations to find all students who either failed (Grade < 60) OR have perfect attendance (Absences == 0). 

1. (Grade < 60)
2. (Absences == 0)
3. (Grade >= 60)
4. (Absences > 0)                                                ____________________________________________________________________________________________________





##### Q5. Analyse a Filter (see Table 5)

The bank wants to identify problematic accounts that meet BOTH criteria:
1. Account is either overdrawn (Balance < 0) OR inactive (Last_Transaction > 90 days ago)

2. Account does NOT have premium status (Status != 'Premium')

**How many accounts meet these criteria?** ________________________________________

**What is the LOWEST balance among the accounts that meet these criteria?** ________________________________________

**If we removed the Status requirement, how many accounts would be included?** ________________________________________









## Data Tables

### Table 1: Subscription Revenue
| User_ID | Plan_Type | Monthly_Revenue |
|---------|-----------|-----------------|
| U001    | Basic     | 15              |
| U002    | Premium   | 65              |
| U003    | Standard  | 35              |
| U004    | Basic     | 15              |
| U005    | Premium   | 75              |
| U006    | Standard  | 35              |
| U007    | Basic     | 15              |
| U008    | Premium   | 85              |

### Table 2: Product Inventory
| Product_ID | Category     | Price | Stock_Level |
|------------|-------------|-------|-------------|
| P001       | Electronics | 89    | 25          |
| P002       | Clothing    | 35    | 150         |
| P003       | Electronics | 125   | 45          |
| P004       | Home        | 22    | 30          |
| P005       | Clothing    | 48    | 200         |
| P006       | Home        | 56    | 40          |





### Table 3: Airline Flights

| Flight_ID | Delay_Minutes | Distance_Miles |
|-----------|---------------|----------------|
| F001      | 5             | 450            |
| F002      | 25            | 1200           |
| F003      | 18            | 800            |
| F004      | 0             | 350            |
| F005      | 30            | 600            |
| F006      | 12            | 1500           |



### Table 5: Bank Accounts

| Account_ID | Balance | Last_Transaction | Status    |
|------------|---------|------------------|-----------|
| A001       | 1500    | 15               | Standard  |
| A002       | -250    | 120              | Basic     |
| A003       | 5000    | 95               | Premium   |
| A004       | -50     | 5                | Standard  |
| A005       | 200     | 180              | Basic     |
| A006       | -100    | 30               | Premium   |
| A007       | 800     | 92               | Standard  |
| A008       | 3000    | 2                | Premium   |