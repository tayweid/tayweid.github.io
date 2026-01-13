## ECON 0150 | Log

#### September 16, 2025

so I think I want to record exercises like I did homework, with a direct to camera with a laptop, then have the screen recording to the side. eventually I want a concept video also rerecord, and have the Livestream recorded too, added as a separate card, with the script including discussion questions 

I also think the motivation isn't quite right yet. I think it's close. I want to start with a dataset that we want to learn something from, then walk through how we might answer the question from the data, which requires some skills.

#### September 9, 2025

I think I'm going to make another change:

Part 1: Exploratory Data Analysis

I want four different distributions with the same summary stats but very different histograms like anscomb for Part 1.2.

1. Cross Sectional Data: Categorical Data (Bar); Numerical Data (Histogram; Boxplot)
2. Timeseries Data (Line; Boxplot)
3. Panel Data: Long (MultiLine; MultiBoxplot); Wide (Scatterplot)
4. Bivariate (Boxplot; Scatterplot) with Anscomb
5. Geographic (Map; Chloropleth)

Part 2: Data Operations

1. Clean
2. Transform
3. Filter
4. Group
5. Reshape
6. Merge

#### September 3, 2025

- prepare the survey in slides and talk it through at the start of day 2. this way it's visually interesting, doesn't get caught up with notebooks before covering them, and shows not tells why summarization is powerful
- I'm thinking about putting data structures with variable types and then do classification by type, structure, and n, then maybe move time series into part 1 and numerical by category into part 2
- I want a better way to ask questions during exercises, like here's a nice figure, but find this specific number. less do what I just did, and more use the tool I just showed to answer this new question
- ok so part 1.0 will be EDA framework on day 2, in class looking at and working with the survey, leaving some questions for the homework
- then for next time i'm going to do
  1. part 1.1 crosssection categorical and bar (next time)
  2. part 1.2 crosssection numerical and hist and boxplot (next time)
  3. part 1.3 timeseries numerical and line and boxplot
  4. part 1.4 numerical by category (crosssection: box and strip and timeseries: multiline) maybe part 2?

Changes:

- Part 1.0: merge survey results with part 1.0 Variable Types and part 1.3 Data Structures and separate out the homework question variables so i don't cover them in class. then maybe even add in a time series plot showing excitement for the class over time. this is also where i have students get familiar with excel and python and datasets
- relabel Part 1.1 as Part 1.1: Crosssectional Categorical Variables (no changes)
- relabel Part 1.2 as Part 1.2: Crosssectional Numerical Variables (no changes)
- Part 1.3 is Timeseries Numerical, drawing on what's currently in Part 2.2, leaving the rest for Part 2 to talk about relationships between variables through time
- I'm realizing theres actually a lot of panel data in here. the multi-period boxplot is panel. and Timeseries Numerical by Category is also panel. 
- Part 1.4 is Transformations, where we start with a CPI adjustment, then do the global hours example
- 
- Part 2.0 is Framework and anscombe's
- Part 2.1 is Crosssectional Numerical by Numerical (scatterplot, current 2.1)
- Part 2.2 is Crossectional Numerical by Category (stripplot by category, new)
- Part 2.3 is Timeseries Numerical by Category (current 1.4)
- Part 2.4 is Timeseries Numerical by Numerical (oil prices and coffee prices example, maybe add this at the end of 2.1)
- Part 2.5 is Panel with Multi-Box and Scatter (current coffee consumption 2.1 example, maybe just keep this in 2.1)
- Part 2.6 is Geographic Data

#### January 24, 2025

Students had a lot of trouble getting set up with colab. Most of it was just using basic syntax with strings and file systems and such. I think it would be helpful to do demos with code to fall back on, but creating the notebook from scratch. 

I also want to use data from econ papers when we start building models. I think that would be SOOO cool.

I also don't think the intro sequence is in the right order. I feel I'm losing students interests early on by spending too much time on the simple stuff before getting into the cool stuff. Maybe there's a way to really lock students in with an example. I like the survey idea. But it's not really coming through at the moment. 

I think it also might be good to post a python demo and have students come to the second class having gone through it. 

Maybe it would be best to start with data structures, then talk about data types. So it would be, here's cross-section, time series, and panel. Then we're going to focus on cross section in the survey. Talk about the different types of variables. 

Maybe it would make sense to call the exercises "startup exercises". I'm trying to organize the startup in a way to justifies the exercises as distinct from the examples. 

Maybe Part 1.0 is about organizing data into structures and types. Then call the exercises "examples". Then we go into more detail about thinking about categorical variables in Part 1.1 and so on.

Then I'll call Part 0 the survey demo that we'll do on day one. This demo would include discussion of data types and structures, univariate data, multivariate data, a t-test, a regression, and a fixed effect. 

Then Day Two would start on Part 1.0 with the exercises. 

#### August 24, 2024

https://fred.stlouisfed.org/

Katerine also mentioned introducing students to more economics-focussed ideas, not just the data analysis type skills

#### July 30, 2024

Part 1: Core statistics concepts, correlations, causal relationships. This part starts with a refresh of core statistics concepts and implements them using data in Excel. Then we build models of relationships between variables and talk about the arrow of causality. Then measuring the core concepts of central tendency and variance in data and using english to communicate what each idea means.

Part 2: Interpreting data with code. This part introduces code, working with data in code, running regression, multivariate regression, seasonality, dummies, fixed effects, etc. Then take code to data to interpret the dataset and use English to communicate what the data means and what it doesn’t.

Part 3: Communicating with data. This is the part where we start building tables and figures and embedding them in slides. 

Homework will be skill based. So they will get a dataset and have to do something with it. MiniExams will be concept based and done in class on paper. There will be one final project where they will have to apply their skills creatively to a case study and communicate their findings in slides.

#### July 16, 2024

The primary goal of the class is to equip students with the ability to interpret and communicate with data. This starts with applying statistics concepts to data, developing a skillset with code and spreadsheets, and then communicating with figures and tables.

The first part of the class will focus on statistics, with extra credit for doing a Brilliant or Coursera course on stats. The idea is to get students familiar with basic statistical tools before using them. Once we get the prereq, this will become more straightforward. Right now, the idea is to offload some of the familiarization to a great online program so the class can move forward with the core of the course. The second part will focus on working with data in Excel and python. I want students to be familiar with using Excel, but they need to know how to use python. It’s the main tool the field is moving to. It’s a slightly different way of thinking which is different from Excel and is useful no matter the language. It’s not possible to match every student to the software they will use in the future. Instead, I want students to have skills with the two major formats: spreadsheets and code. The third part of the course will focus on data analytics directly, understanding and communicating with data. This will involve 

Assessments will be in-class MiniExams and homework. Homework will vary in structure. Some will be skills based, so “what is the median height in the sample", or “summarize this data”, some will be project-based, so “write some code” or “use a figure to communicate this data”.

Also having not taught this course previously, I want to have regular meetings (every other week) with Buke as I deviate from her script. I want to talk about what’s working in her class, what I’m doing in the pilot class, and some ways to sharpen the redesign.

#### June 26, 2024

I talked with Kojo yesterday who was a Data Analyst for Smucker. He said older people use excel to communicate, but the more savvy people use Python and R. Maybe what I’ll try to do is give students the tools to use excel but then do most work in python or R.

#### June 25, 2024

I’m thinking Buke and I will meet once or twice this summer, then she will run her own course in the fall, then meet regularly throughout the semester. This will let me get a sense of what she’s doing and try to offer some extra support for moving in the direction the department wishes. 

I haven’t yet found a textbook i’m in love with. The closest I’ve found is **An Introduction to Data Analysis** by Tiffany Bergin.

I did find that Brilliant.org has a course on Data Analytics and Statistics, which looks very good, and could be used as extra credit.