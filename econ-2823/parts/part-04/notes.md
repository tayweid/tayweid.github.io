# Part 04: APIs for Acquiring Data

## Introduction

This unit introduces Application Programming Interfaces (APIs) as a tool for acquiring data programmatically. Rather than manually downloading datasets from websites, APIs allow you to send structured requests to a server and receive data in a machine-readable format, typically JSON. This is a fundamental skill for economists and data scientists who need to collect data from a wide variety of sources, including government databases, financial platforms, and social media.

We begin with simple, open APIs that require no authentication, then move to more complex examples that require API keys. Along the way, we cover essential Python concepts such as dictionaries, lists, for loops, functions, and the pandas library for organizing data into dataframes. By the end of this unit, you should be comfortable making API requests, parsing JSON responses, handling pagination, and converting results into structured data for analysis.

The examples in this unit span a broad range of data sources: from knowing who is currently in space, to searching the FBI Most Wanted list, to querying academic papers, to pulling demographic data from the US Census.

## Preliminaries

Before making API requests, we need two core Python libraries:

```python
import requests    # handles HTTP requests to web APIs
import pandas as pd  # data manipulation and dataframe creation
```

The `requests` library is Python's standard tool for making HTTP calls. The `pandas` library provides the DataFrame structure we will use to organize the data we retrieve.

## Open Notify (Who's in Space!)

Our first example uses a completely open API that requires no authentication. The Open Notify API provides information about astronauts currently in space.

```python
resp = requests.get('http://api.open-notify.org/astros.json')
```

The `requests.get()` function sends an HTTP GET request to the specified URL and stores the response in a variable. We can check whether the request was successful by examining the status code:

```python
if resp.status_code == 200:
    print("Good GET")
resp.status_code
```

A status code of 200 means the request was successful. Other common codes include 404 (not found) and 403 (forbidden).

The response object contains additional metadata, such as server information (`resp.headers`) and the time elapsed during the request (`resp.elapsed`).

### Working with JSON Responses

The data returned by most APIs comes in JSON format, which Python represents as dictionaries and lists. The `resp.json()` method converts the response body into a Python dictionary:

```python
data = resp.json()
type(data)  # dict
```

The response is a dictionary with key-value pairs. For example, the `'message'` key has value `'success'`, the `'number'` key tells us how many people are in space, and the `'people'` key contains a list of dictionaries, each with `'craft'` and `'name'` fields.

```python
data.keys()         # dict_keys(['message', 'people', 'number'])
data['people']      # List of dicts with 'craft' and 'name'
data['people'][0]   # First astronaut entry
data['people'][-1]  # Last astronaut entry
```

### Lists and Dictionaries

Lists are ordered collections accessed by numerical index (starting at 0). Dictionaries are unordered collections accessed by key name. The `len()` function returns the number of items, and `type()` returns the data type.

We can iterate through the people list to extract names:

```python
names = [person['name'] for person in data['people']]
```

### Converting to a DataFrame

Lists of dictionaries map directly to pandas DataFrames:

```python
df = pd.DataFrame(data['people'])
df
```

DataFrames have built-in methods for analysis. For example, `df.value_counts('craft')` counts the number of astronauts per spacecraft.

To save data for use in other tools (such as R), export to CSV:

```python
df.to_csv('people_in_space.csv', index=False)
```

## FBI Most Wanted

The FBI provides an API for their Most Wanted list, documented at https://www.fbi.gov/wanted/api. This example demonstrates pagination -- the practice of splitting large result sets across multiple pages.

```python
resp = requests.get('https://api.fbi.gov/wanted/v1/list')
data = resp.json()
```

The response contains several keys. The `'items'` key holds the actual wanted persons data, while `'page'` indicates which page of results was returned, and `'total'` gives the total number of entries.

### Handling Pagination

Since a single request only returns one page of results, we need to loop through multiple pages:

```python
all_items = []
for page in range(1, 9):
    resp = requests.get('https://api.fbi.gov/wanted/v1/list', params={'page': page})
    all_items.extend(resp.json()['items'])
```

The `params` argument passes query parameters to the API. After collecting all pages, we combine them into a DataFrame:

```python
df = pd.concat([pd.json_normalize(item) for item in all_items], ignore_index=True)
```

We can also pass more specific parameters to the API. For example, to request only entries from the Pittsburgh field office:

```python
resp = requests.get('https://api.fbi.gov/wanted/v1/list',
                     params={'field_office': 'pittsburgh'})
```

### Displaying Images

The FBI API returns URLs for photos of wanted persons. We can display these using IPython's HTML display capabilities:

```python
from IPython.display import display, HTML
for item in data['items']:
    if item.get('images'):
        display(HTML(f'<img src="{item["images"][0]["original"]}" width="100">'))
```

## Bing Search

The Bing Search API demonstrates an authenticated API that requires an API key. After signing up for an Azure account, you obtain a key that grants access to the search service.

```python
key = open('bing_key.txt').read().strip()

headers = {"Ocp-Apim-Subscription-Key": key}
params = {"q": "Pittsburgh economics", "textDecorations": True, "textFormat": "HTML"}

resp = requests.get("https://api.bing.microsoft.com/v7.0/search",
                     headers=headers, params=params)
results = resp.json()
```

Note that this particular API has been discontinued, but the pattern of passing API keys via headers is common across many services.

## Open Alex

OpenAlex is a free, open API for academic paper metadata (https://openalex.org/). This example shows how to build more complex queries with functions:

```python
resp = requests.get('https://api.openalex.org/authors?search=taylor weidman')
data = resp.json()
```

We can define a reusable function to query OpenAlex and extract specific fields:

```python
def get_author_works(author_id, per_page=50):
    url = f'https://api.openalex.org/authors/{author_id}'
    resp = requests.get(url)
    return resp.json()
```

Functions in Python are defined with the `def` keyword. Parameters can have default values (like `per_page=50`), and the function body is indented.

## Canvas API Example

The Canvas Learning Management System provides an API that can be used to interact with course data programmatically. This requires an API key, which in Canvas can be generated from your account settings.

```python
key = open('canvas_key.txt').read().strip()
headers = {'Authorization': 'Bearer ' + key}

resp = requests.get('https://canvas.pitt.edu/api/v1/courses',
                     headers=headers)
courses = resp.json()
```

### Writing Helper Functions

Because we repeatedly inspect JSON data structures, it is helpful to define a function that prints the keys and types in a dictionary:

```python
def dict_summary(d):
    if isinstance(d, dict):
        for key in d:
            print(key, type(d[key]))
    else:
        print("Not a dictionary! Type:", type(d))
```

After identifying the course ID, we can query enrollments and extract student information:

```python
course_id = 12345
resp = requests.get(f'https://canvas.pitt.edu/api/v1/courses/{course_id}/enrollments',
                     headers=headers, params={'per_page': 100})
enrollments = resp.json()
```

Nested dictionaries are common in API responses. For example, each enrollment entry may contain a `'user'` key whose value is itself a dictionary with `'name'`, `'id'`, and other fields.

## Prebuilt Libraries for Using APIs

When an API is widely used, someone has often built a Python package to simplify interaction with it. For example, the `canvasapi` package wraps the Canvas API:

```python
from canvasapi import Canvas
canvas = Canvas("https://canvas.pitt.edu", key)
course = canvas.get_course(course_id)
users = course.get_users()
```

These libraries handle authentication, pagination, and data parsing automatically, saving significant effort.

## US Census

The US Census Bureau provides a rich API for accessing demographic data. You can obtain a free API key at https://www.census.gov/data/developers/data-sets.html.

```python
key = open('census_key.txt').read().strip()
```

### 2010 Census Data

The Census API allows you to query specific variables across geographies. First, we can examine the available variables:

```python
resp = requests.get('https://api.census.gov/data/2010/dec/sf1/variables.json')
variables = resp.json()
```

To query specific data -- for example, population counts by age and sex for all states:

```python
resp = requests.get('https://api.census.gov/data/2010/dec/sf1',
                     params={
                         'get': 'PCT012A017,PCT012A124',
                         'for': 'state:*',
                         'key': key
                     })
data = resp.json()
```

The response is a list of lists, where the first entry contains column headers. We convert this to a DataFrame:

```python
df = pd.DataFrame(data[1:], columns=data[0])
```

We can then compute derived quantities such as mortality rates by age group:

```python
df['PCT012A017'] = df['PCT012A017'].astype(int)
df['PCT012A124'] = df['PCT012A124'].astype(int)
```

### As a Package

The `CensusData` Python package (https://pypi.org/project/CensusData/) provides a more user-friendly interface to the Census API, with helper functions for searching variables and downloading data directly into DataFrames.

## Packages That Interact with APIs

Many large organizations offer APIs, and third-party Python packages often provide convenient wrappers. Some notable examples include:

- **sportsreference / sportsipy** -- sports statistics from various leagues
- **tweepy** -- Twitter API
- **praw** -- Reddit API
- **yfinance** -- Yahoo Finance data
- **fredapi** -- Federal Reserve Economic Data

For example, using the `sportsreference` package to get baseball statistics:

```python
from sportsreference.mlb.roster import Player
player = Player('troutmi01')
career_stats = player.dataframe
career_stats[['batting_average', 'home_runs', 'runs_batted_in']].mean()
```

## OpenAI API

The OpenAI API provides programmatic access to large language models. Like other authenticated APIs, it requires an API key:

```python
from openai import OpenAI
client = OpenAI(api_key=open('openai_key.txt').read().strip())

response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Explain GDP in one sentence."}]
)
print(response.choices[0].message.content)
```

This demonstrates how APIs extend beyond traditional data retrieval into interacting with AI services.

## Summary

- APIs allow you to retrieve data programmatically from web services using structured HTTP requests
- The `requests` library in Python handles GET requests; responses typically come in JSON format
- JSON maps to Python dictionaries and lists, which can be navigated using keys and indices
- Pagination requires looping through multiple pages of results using query parameters
- API keys provide authentication and should be stored securely (never hard-coded in notebooks)
- Lists of dictionaries convert directly to pandas DataFrames with `pd.DataFrame()`
- Many popular APIs have prebuilt Python packages that handle authentication and pagination automatically
- The US Census API is a rich source of demographic data for economic research
- Always read the API documentation to understand available endpoints, parameters, and rate limits
