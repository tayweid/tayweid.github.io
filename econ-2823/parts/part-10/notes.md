# Part 10: Databases and SQL

## Introduction

This unit introduces relational databases and the Structured Query Language (SQL) for managing and querying data. While spreadsheets and CSV files work well for small datasets, databases provide powerful tools for search, filtering, aggregation, and joining data across multiple tables. These capabilities become essential when working with large or complex datasets.

We work with SQLite, a lightweight database engine that stores an entire database in a single file and integrates easily with Python. The examples use a contrived research database about Antarctic expeditions, which contains four related tables. We cover the core SQL operations -- selecting, filtering, sorting, aggregating, and joining -- and then apply these skills to a real-world dataset of Pittsburgh 311 service requests.

By the end of this unit, you should be comfortable writing SQL queries to extract and manipulate data from relational databases, and understand how to integrate SQL with Python and pandas for analysis workflows.

## Simple Examples with the SQLite Command Prompt

An example database about Lovecraftian research expeditions is contained in the file `survey.db`. This database illustrates the core concepts of relational data storage.

Three common options for data storage are text files, spreadsheets, and databases. Text files are easiest to create and work well with version control, but require building custom search and analysis tools. Spreadsheets handle simple analyses but struggle with large or complex datasets. Databases include powerful built-in tools for search and analysis and can handle large, complex data.

The database consists of four tables:

| Table Name | Data Inside It |
| --- | --- |
| *Person* | names of the researchers |
| *Site* | the sites where research was conducted |
| *Survey* | the research measurements taken |
| *Visited* | trips made to sites |

The tables are connected through primary keys and foreign keys, forming a relational structure. For example, the `Survey` table references both the `Person` table (via researcher ID) and the `Visited` table (via trip ID).

### Accessing the Database via SQLite

From a terminal, you can open the database directly:

```
sqlite3 survey.db
SELECT * FROM Person;
```

To format the output more readably:

```
.mode column
.header on
```

### Accessing via Python

We can also use Python's `sqlite3` module to connect to the database:

```python
import sqlite3
conn = sqlite3.connect('survey.db')
```

And execute queries:

```python
c = conn.cursor()
c.execute('SELECT * FROM Person')
c.fetchall()
```

### Via Pandas

For ease of presentation and analysis, we use pandas alongside the database connection:

```python
import pandas as pd
pd.read_sql('SELECT * FROM Person', conn)
```

The `pd.read_sql()` function executes a SQL query and returns the result as a DataFrame.

## Database Contents

We can inspect the database structure by querying the `sqlite_master` table:

```python
pd.read_sql('SELECT name FROM sqlite_master WHERE type="table"', conn)
```

This reveals the four tables: Person, Site, Survey, and Visited. We can display each table's contents with `SELECT * FROM table_name`.

The **Person** table contains researcher IDs and names. The **Site** table contains site names with latitude and longitude. The **Survey** table contains individual measurements (identified by trip, researcher, quantity type, and reading value). The **Visited** table links trips to sites with dates.

When finished working with a database, close the connection properly:

```python
conn.commit()  # Write any changes
conn.close()   # Drop the connection
```

## SQL Statements Overview

The general structure of a SQL query is:

```sql
SELECT    [DISTINCT | ALL] attribute-list
FROM      table-list
WHERE     selection-condition
GROUP BY  grouping-attribute(s)
HAVING    grouping-condition
ORDER BY  {attribute ASC | DESC} pairs
```

Not all clauses are required for every query. At minimum, a query needs `SELECT` and `FROM`.

To avoid repeating the `pd.read_sql()` syntax, we define a helper function:

```python
from IPython.display import display, HTML

def db_table(query, dispQuery=True):
    if dispQuery:
        display(HTML('<b>' + query + '</b>'))
    return pd.read_sql(query, conn)
```

## Selecting Data

The `SELECT` statement specifies which columns to retrieve, and `FROM` specifies the table:

```python
db_table("SELECT family, personal FROM Person;")
```

SQL is case insensitive for keywords, so `SELECT`, `select`, and `SeLeCt` all work. By convention, SQL keywords are written in uppercase and table/field names in lowercase for readability.

Column order in the output matches the order specified in the query, not the order in the table:

```python
db_table("SELECT personal, family FROM Person")  # Swapped column order
```

You can repeat columns and use the `*` wildcard to select all columns:

```python
db_table("SELECT * FROM Person")
```

## Sorting and Removing Duplicates

### DISTINCT

The `DISTINCT` keyword removes duplicate rows from results:

```python
db_table('SELECT DISTINCT quant FROM Survey')
```

When applied to multiple columns, `DISTINCT` removes rows where the entire combination of values is duplicated:

```python
db_table('SELECT DISTINCT taken, quant FROM Survey')
```

### ORDER BY

By default, results have no guaranteed order. The `ORDER BY` clause sorts results:

```python
db_table('SELECT * FROM Person ORDER BY id DESC')
```

`ASC` sorts ascending (default), `DESC` sorts descending. You can sort by multiple columns:

```sql
SELECT taken, person, quant FROM Survey ORDER BY taken ASC, person DESC;
```

Combining `DISTINCT` and `ORDER BY` lets us see which scientists performed which types of measurements:

```python
db_table('SELECT DISTINCT quant, person FROM Survey ORDER BY quant ASC')
```

## Filtering

The `WHERE` clause filters rows based on conditions:

```python
db_table('SELECT * FROM Visited WHERE site = "DR-3"')
```

The database first evaluates the `WHERE` condition for each row, then applies the `SELECT` to determine which columns to display. This means you can filter on columns that are not in the output:

```python
db_table('SELECT id FROM Visited WHERE site = "DR-1"')
```

### Boolean Operators

Multiple conditions can be combined with `AND` and `OR`:

```python
db_table('SELECT * FROM Visited WHERE site = "DR-1" AND dated < "1930-01-01"')
```

Be careful with operator precedence. `AND` binds more tightly than `OR`, so:

```sql
WHERE quant = "sal" AND person = "lake" OR person = "roe"
```

is interpreted as `(quant = "sal" AND person = "lake") OR (person = "roe")`. Use parentheses to make intent explicit:

```sql
WHERE quant = "sal" AND (person = "lake" OR person = "roe")
```

### IN and LIKE

The `IN` operator checks membership in a set:

```python
db_table('SELECT * FROM Survey WHERE person IN ("lake", "roe")')
```

The `LIKE` operator performs pattern matching with `%` as a wildcard:

```python
db_table('SELECT * FROM Visited WHERE site LIKE "DR%"')
```

### LIMIT and OFFSET

For large tables, `LIMIT` restricts the number of returned rows, and `OFFSET` skips rows from the top:

```python
db_table('SELECT * FROM Visited LIMIT 2')
db_table('SELECT * FROM Visited LIMIT 2 OFFSET 2')
```

## Missing Data

Databases represent missing values with `null`. This is distinct from zero, False, or the empty string -- it means "we don't know."

Null behaves unexpectedly in comparisons. If a value is null, then both `value < X` and `value >= X` evaluate to null (not true), so the row is excluded from both results.

Arithmetic with null also produces null: `1 + null` is null, `5 * null` is null.

You cannot use `=` or `!=` to compare with null:

```python
db_table('SELECT * FROM Visited WHERE dated = NULL')   # Returns nothing!
db_table('SELECT * FROM Visited WHERE dated != NULL')  # Returns nothing!
```

Instead, use the special operators `IS NULL` and `IS NOT NULL`:

```python
db_table('SELECT * FROM Visited WHERE dated IS NULL')
db_table('SELECT * FROM Visited WHERE dated IS NOT NULL')
```

When filtering with `!=`, be aware that null values will be silently excluded. To include records with unknown values, add an explicit null check:

```python
db_table('SELECT * FROM Survey WHERE quant = "sal" AND (person != "lake" OR person IS NULL)')
```

## Aggregation

Aggregation functions combine multiple rows into a single result:

- `min()` -- minimum value
- `max()` -- maximum value
- `avg()` -- arithmetic mean
- `count()` -- number of values
- `sum()` -- total

```python
db_table('SELECT min(reading), max(reading) FROM Survey WHERE quant = "sal" AND reading <= 1.0')
```

Aggregation functions ignore null values, which is usually the desired behavior.

### GROUP BY

To aggregate separately for different groups, use `GROUP BY`:

```python
db_table('SELECT person, count(reading), round(avg(reading), 2) FROM Survey WHERE quant = "rad" GROUP BY person')
```

You can group by multiple columns:

```python
db_table('''
SELECT person, quant, count(reading) AS count_reading, round(avg(reading), 2) AS avg_reading
FROM Survey
WHERE person IS NOT NULL
GROUP BY person, quant
ORDER BY person, quant
''')
```

The `AS` keyword renames output columns for clarity.

When no rows match a `WHERE` clause, aggregation returns null rather than zero.

## Calculating New Values

SQL can compute new values on the fly without modifying stored data:

```python
db_table('SELECT 1.05 * reading AS mod_reading FROM Survey WHERE quant = "rad"')
```

Temperature conversion example:

```python
db_table('SELECT taken, round(5 * (reading - 32) / 9, 1) AS Celsius, reading AS Fahrenheit FROM Survey WHERE quant = "temp"')
```

String concatenation uses the `||` operator:

```python
db_table('SELECT personal || " " || family AS full_name FROM Person')
```

## Combining Data

To combine data from multiple tables, use `JOIN`. A basic join without conditions creates a Cartesian product (every combination of rows):

```python
db_table('SELECT * FROM Site JOIN Visited')
```

To make a meaningful join, add an `ON` clause specifying how tables are related:

```python
db_table('SELECT * FROM Site JOIN Visited ON Site.name = Visited.site')
```

Use `Table.field` notation to avoid ambiguity when tables have columns with the same name.

Multiple tables can be joined together:

```python
db_table('''
SELECT Site.lat, Site.long, Visited.dated, Survey.quant, Survey.reading
FROM Site JOIN Visited JOIN Survey
    ON Site.name = Visited.site
    AND Visited.id = Survey.taken
    AND Visited.dated IS NOT NULL
''')
```

### Types of Joins

- **INNER JOIN** -- returns only rows where the join condition is met in both tables
- **LEFT JOIN** -- returns all rows from the left table, with matching rows from the right (nulls where no match)
- **RIGHT JOIN** -- returns all rows from the right table, with matching rows from the left
- **FULL JOIN** -- returns all rows from both tables, with nulls where there is no match

SQLite supports inner joins and left outer joins.

### Primary and Foreign Keys

A **primary key** uniquely identifies each record in a table (e.g., `Person.id`). A **foreign key** is a value in one table that references a primary key in another table (e.g., `Survey.person` references `Person.id`). These relationships are what make joins meaningful.

## Exercises

Practice exercises include:

1. Write a query that lists all radiation readings from the DR-1 site (requires joining Survey and Visited tables)
2. Write a query that lists all sites visited by people named "Frank" (requires joining Person, Survey, and Visited)
3. Write a query showing site location, visit date, visitor name, measurement type, and reading, excluding null values (requires joining all four tables)

## Subqueries

A subquery is a `SELECT` statement nested inside another statement, enclosed in parentheses. Subqueries typically return a single value or a set of values used for comparison:

```sql
SELECT trackid, name, albumid
FROM tracks
WHERE albumid = (
    SELECT albumid FROM albums WHERE title = 'Abbey Road'
);
```

Subqueries can also be used with `IN` to check membership in a dynamically generated set:

```sql
SELECT customerid, firstname, lastname
FROM customers
WHERE supportrepid IN (
    SELECT employeeid FROM employees WHERE country = 'Canada'
);
```

## A Note on Data Hygiene

Good database design follows four rules:

1. **Atomic values** -- every value should be indivisible. Store first and last names in separate columns rather than a single name field.
2. **Unique primary keys** -- every record should have a unique identifier, whether a meaningful field (like a person ID) or an arbitrary serial number.
3. **No redundancy** -- information should be stored in one place. If a visit date is wrong, you should only need to update one record.
4. **Explicit units** -- units of measurement should be stored alongside data values. Without this, we cannot distinguish parts per million from parts per thousand.

## Inserting and Modifying Data

SQL provides commands for modifying data:

```sql
INSERT INTO Site VALUES('DR-1', -49.85, -128.57);
```

Create new tables from queries:

```sql
CREATE TABLE JustLatLong(lat text, long text);
INSERT INTO JustLatLong SELECT lat, long FROM Site;
```

Update existing records:

```sql
UPDATE Site SET lat = -47.87, long = -122.40 WHERE name = 'MSK-4';
```

Delete records:

```sql
DELETE FROM Person WHERE id = 'danforth';
```

Always include a `WHERE` clause with `UPDATE` and `DELETE` to avoid modifying or removing all records.

## Creating Schemas

Database schemas are defined with `CREATE TABLE`, specifying column names and types:

```sql
CREATE TABLE Person(id text, personal text, family text);
CREATE TABLE Site(name text, lat real, long real);
CREATE TABLE Visited(id integer, site text, dated text);
CREATE TABLE Survey(taken integer, person text, quant text, reading real);
```

## Working with Python and Pandas

For real-world analysis, we combine SQL queries with pandas for further manipulation and visualization. Here we work with a Pittsburgh 311 service request database:

```python
import sqlite3
import pandas as pd

conn = sqlite3.connect('SQL/requests.db')
pd.read_sql('SELECT name FROM sqlite_master WHERE type="table"', conn)
```

Query pothole reports:

```python
query = '''
SELECT neighborhood, count(request_type) AS num_potholes
FROM requests
WHERE request_type = 'Potholes'
GROUP BY neighborhood
ORDER BY num_potholes DESC
'''
df = pd.read_sql(query, conn)
```

Track potholes over time using SQL string functions:

```python
query = '''
SELECT neighborhood, count(request_type) AS num_potholes, substr(created_on, 0, 5) AS year
FROM requests
WHERE request_type = 'Potholes' AND neighborhood != ''
GROUP BY neighborhood, year
ORDER BY year DESC, num_potholes DESC
LIMIT 20
'''
df = pd.read_sql(query, conn)
```

Python f-strings allow us to parameterize queries:

```python
request_type = "Potholes"
neighborhood = "Bloomfield"
query = f'''
SELECT neighborhood, count(request_type) AS num_potholes,
       substr(created_on, 0, 5) AS year,
       substr(created_on, 6, 2) AS month
FROM requests
WHERE request_type = '{request_type}' AND neighborhood='{neighborhood}'
GROUP BY neighborhood, year, month
ORDER BY year ASC, month ASC
'''
df = pd.read_sql(query, conn)
```

After extracting data, we can create time series visualizations:

```python
import matplotlib.pyplot as plt
df['t'] = pd.to_datetime(df['year'] + "-" + df['month'])

fig, ax = plt.subplots(figsize=(12, 8))
ax.plot(df['t'], df['num_potholes'])
ax.set_title('Bloomfield Potholes (Monthly)')
ax.set_ylabel('Potholes')
ax.set_xlabel('Date')
```

The resulting plot shows seasonal patterns in pothole reports, with spikes typically occurring in late winter and early spring after freeze-thaw cycles damage road surfaces.

## Security Note

When passing Python variables into SQL queries via string formatting (like f-strings), the queries may be vulnerable to SQL injection attacks. The classic illustration is the XKCD comic about "Bobby Tables" -- a student whose name is `Robert'); DROP TABLE Students;--`, which would delete the entire table if inserted directly into a query.

In production environments, always use parameterized queries to sanitize inputs. Your database administrators will have specific requirements for how to safely interact with production databases.

## Summary

- Relational databases store data in multiple linked tables, connected by primary and foreign keys
- SQL provides a declarative language for querying data: `SELECT`, `FROM`, `WHERE`, `GROUP BY`, `ORDER BY`
- `DISTINCT` removes duplicates; `ORDER BY` sorts results; `LIMIT` restricts the number of rows
- `WHERE` filters rows using boolean conditions (`AND`, `OR`, `IN`, `LIKE`)
- Null values require special handling with `IS NULL` and `IS NOT NULL`
- Aggregation functions (`min`, `max`, `avg`, `count`, `sum`) combine rows, optionally grouped by `GROUP BY`
- `JOIN` combines data from multiple tables based on key relationships
- SQL integrates seamlessly with Python and pandas via `sqlite3` and `pd.read_sql()`
- Always close database connections when finished, and be mindful of SQL injection risks
