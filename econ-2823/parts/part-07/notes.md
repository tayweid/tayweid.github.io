# Part 07: Finding Data on the Web

## Introduction

This unit covers techniques for extracting data from websites -- commonly known as web scraping. While APIs (covered in Part 04) provide structured data through well-defined endpoints, much of the data on the internet is embedded in HTML web pages without a formal API. Web scraping bridges this gap by programmatically downloading web pages and extracting the data we need.

We start with foundational concepts: how text is represented in code (escape characters), how HTML structures web content, and how regular expressions can be used to search for patterns in text. We then apply these tools to extract real data from live websites. Finally, we introduce modern Python libraries -- Beautiful Soup and lxml -- that provide more robust and maintainable approaches to parsing HTML.

Understanding web scraping is valuable for economists because many datasets of interest (sports statistics, real estate listings, government records, financial tables) are published on the web but not available through formal APIs or downloadable files.

## Collecting Data from the Web

When working with text in code, we frequently encounter special characters that have particular meaning to the programming language or to the data format we are working with.

### Escape Characters

In Python, the backslash `\` is an escape character that signals something special follows:

- `\n` -- newline (line break)
- `\t` -- tab
- `\"` -- literal double quote inside a string
- `\\` -- literal backslash

For example, consider an HTML string that includes quotes and formatting:

```python
s = '<h2>Hello</h2>\n\n\t<div id="main">Main text</div>'
print(s)
```

When printed, the escape characters are interpreted: `\n` produces actual line breaks and `\t` produces a tab. But when the string is displayed without `print()`, Python shows the raw escape sequences.

Because backslash is special in both Python strings and regular expressions, working with patterns that include backslashes requires care. One approach is to use raw strings by prefixing with `r`:

```python
pattern = r'\d{3}-\d{4}'  # matches phone number pattern like 555-1234
```

### HTML Basics

HTML (HyperText Markup Language) structures web content using tags enclosed in angle brackets. Tags often come in pairs:

```html
<h2>Hello</h2>
<div id="main">Content here</div>
<footer style="color:#003594">Footer text</footer>
```

Tags can have attributes like `id`, `class`, and `style` that provide styling information or unique identifiers. These attributes are extremely useful for web scraping because they help us target specific elements on a page.

CSS (Cascading Style Sheets) defines how HTML elements are displayed. Websites often assign `id` and `class` attributes to elements for styling purposes, and we can leverage this structure to locate and extract data.

## Search Patterns

Regular expressions (regex) are structured search patterns used to find and extract data from text. Python's `re` module provides the tools for working with regular expressions.

While regular expressions can be complex, you do not need to memorize every detail. Resources like https://regexr.com/ allow you to paste sample data and test patterns interactively.

```python
import re

text = "Contact us at info@example.com or support@company.org"
pattern = r'[\w\.-]+@[\w\.-]+\.\w{2,4}'
re.findall(pattern, text)
```

### Key Regex Syntax

- `.` -- matches any single character
- `*` -- zero or more repetitions
- `+` -- one or more repetitions
- `?` -- zero or one repetition
- `\d` -- any digit (0-9)
- `\w` -- any word character (letters, digits, underscore)
- `\s` -- any whitespace
- `[A-z]` -- any letter
- `{n}` -- exactly n repetitions
- `{n,m}` -- between n and m repetitions
- `( )` -- capture group (returned in output)
- `(?: )` -- non-capture group (required for matching but not returned)
- `|` -- boolean OR

## Some Examples

### Email Addresses

The pattern `(?:\s)?([\w\.-]+@[\w\.-]+\.\w{2,4})(?:\s\.)?` extracts email addresses by:

1. Optionally matching leading whitespace (non-capturing group `(?:\s)?`)
2. Capturing the email: word characters, dots, or hyphens before and after `@`, followed by a 2-4 character domain extension
3. Optionally matching trailing whitespace or period

### Twitter Handles and Hashtags

```python
pattern = r'(@[A-z]+)|(#[A-z]+)'
```

This matches Twitter usernames (starting with `@`) OR hashtags (starting with `#`), each followed by one or more letters.

### Phone Numbers

```python
pattern = r'(?:\d{1}\s)?\(?(\d{3})\)?-?\s?.?(\d{3})-?\s?.?(\d{4})'
```

This pattern extracts US phone numbers in various formats (with or without country code, parentheses, dashes, or spaces), returning the area code, exchange, and subscriber number as separate capture groups.

## Looking at HTML

Consider a simple HTML table:

```html
<table>
    <tr><td type="normal"><b>Column 1</b></td><td><b>Column 2</b></td></tr>
    <tr><td type="normal">Entry 1</td><td>Entry 2</td></tr>
    <tr><td type="other">Entry 3</td><td>Entry 4</td></tr>
</table>
```

To extract the content between `<td>` tags, we can use:

```python
pattern = r'(?:<td.*?>)(.*?)(?:<\/td>)'
```

This pattern:

- `(?:<td.*?>)` -- matches the opening `<td>` tag (with any attributes), non-capturing
- `(.*?)` -- captures the content between tags (as few characters as possible)
- `(?:<\/td>)` -- matches the closing `</td>` tag, non-capturing

We can further refine our extraction by using the styling attributes. For example, to extract only `td` entries with `type="normal"`:

```python
pattern = r'(?:<td type="normal".*?>)(.*?)(?:<\/td>)'
```

This demonstrates how the structure of HTML can be leveraged to target specific data elements.

### Applying Regex to Web Data

We can combine `requests` to fetch a web page and `re` to extract data:

```python
import requests
import re

resp = requests.get('https://www.mqe.pitt.edu/courses')
html = resp.text
```

When working with regex on HTML, several flags are useful:

- `re.M` -- multiline mode (pattern resets across lines)
- `re.I` -- case insensitive matching
- `re.S` -- dot matches newline characters too

```python
pattern = re.compile(r'<some_pattern>', re.M | re.I | re.S)
results = pattern.findall(html)
```

We can define helper functions to strip HTML tags from extracted content:

```python
def strip_tags(text):
    return re.sub(r'<.*?>', '', text).strip()
```

After extracting and cleaning the data, we convert it to a DataFrame and optionally export:

```python
# Convert to dataframe
df = pd.DataFrame(results, columns=['Course', 'Title'])
df.to_csv('courses.csv', index=False)
```

## Other Things to Look For

Beyond table cell content, regex can extract various HTML elements:

- **Table rows**: `<tr>` tags contain entire rows of data
- **Table headers**: `<th>` tags often contain column names
- **Links**: `<a href="...">` tags contain URLs
- **Whitespace**: Use `.strip()` or regex substitution to clean extracted text

We can also use `re.search()` to find the position of matches and `re.finditer()` to iterate over all matches with their positions in the text:

```python
for match in re.finditer(pattern, html):
    print(match.start(), match.end(), match.group())
```

## More Modern Methods

While regular expressions are powerful and still useful for general text processing, dedicated HTML parsing libraries provide more robust and readable approaches for web scraping.

### Beautiful Soup

Beautiful Soup (`bs4`) parses HTML into a navigable tree structure:

```python
from bs4 import BeautifulSoup

resp = requests.get('https://www.mqe.pitt.edu/courses')
soup = BeautifulSoup(resp.text, 'html.parser')
```

We can then navigate the parsed HTML using tag names, CSS selectors, and attribute filters:

```python
# Find all <a> tags within <h4> tags
for h4 in soup.find_all('h4'):
    for link in h4.find_all('a'):
        print(link.text, link.get('href'))
```

Beautiful Soup can also filter tags by attributes and extract text content directly, making it far easier than writing complex regular expressions for structured HTML.

### lxml

The `lxml` library is another HTML parsing tool that supports XPath expressions for navigating the document tree:

```python
import lxml.html

page = lxml.html.fromstring(resp.text)
```

With lxml, we can use CSS selectors or XPath to locate elements:

```python
# Find all links with internal references
links = page.cssselect('a[href^="/"]')
```

Both Beautiful Soup and lxml handle malformed HTML more gracefully than raw regex, making them preferred for production scraping tasks.

### Extracting Tables

For extracting HTML tables specifically, pandas provides a convenient shortcut:

```python
tables = pd.read_html(resp.text)
```

This returns a list of DataFrames, one for each `<table>` element found on the page. You can then select the table you want by index.

## BBC Sports Tables

As a practical example, we can scrape sports league tables from the BBC website. After fetching the page and parsing it with Beautiful Soup or lxml, we identify the table structure and extract team names, standings, and statistics.

```python
resp = requests.get('https://www.bbc.com/sport/football/premier-league/table')
tables = pd.read_html(resp.text)
```

By examining the returned list of DataFrames, we find the standings table and can then perform analysis on it. We can also parameterize the URL to fetch tables for different leagues or seasons by modifying the URL stub.

## Summary

- Web scraping extracts data from HTML web pages when no formal API exists
- Escape characters (`\n`, `\t`, `\"`, `\\`) are important for handling text in Python
- Regular expressions provide flexible pattern matching for searching and extracting text data
- Key regex features: character classes (`\d`, `\w`), quantifiers (`*`, `+`, `?`), capture groups, and flags (`re.M`, `re.I`, `re.S`)
- HTML structures web content with tags; attributes like `id` and `class` help target specific elements
- Beautiful Soup and lxml are modern Python libraries for parsing HTML that are more robust than raw regex
- `pd.read_html()` is a quick way to extract HTML tables directly into DataFrames
- Always check a website's terms of service and robots.txt before scraping
- When available, prefer APIs over scraping for reliability and compliance
