# ECON 0150 | Student Projects

## The Championship Effect

**Research question:** How does winning college football championships influence university applications?

**Data source:** College Football Stats, History, Scores, Standings from Reference.com; First-time Undergraduate Admissions data from University of Alabama and Clemson University

**Methods:** Created bar charts to visualize changes in application numbers over time; calculated percentage changes in applications following championship years; used Google Colab with Matplotlib and Pandas to create dot plots showing application trends across championship and non-championship years

**Main finding:** There is a positive correlation between winning a national championship and increased university applications, with applications rising in the year following a championship win in all but one case. This aligns with the "Flutie Effect" concept that athletic success correlates with higher application rates.

## Economic Changes and Decision to Have Children

**Research question:** Do economic changes correlate with decisions to have children in the short-term?

**Data source:** Fertility rate data from the United Nations; Gross Domestic Product (GDP) data from the Federal Reserve Bank of St. Louis

**Methods:** Analyzed fertility rates for ages 20-30 in the United States; calculated GDP growth rates by year; created line graphs to observe trends; conducted regression analysis to measure correlation between economic changes and fertility rates

**Main finding:** There is a statistically significant relationship between GDP changes and fertility rates, with economic recessions associated with declines in fertility. A 1-point increase in GDP change correlates with approximately a 3-point increase in fertility rate, suggesting a connection between economic conditions and family planning decisions.

## Economic Impact of Public Health Spending

**Research question:** What is the relationship between national health expenditures and GDP?

**Data source:** Centers for Medicare & Medicaid Services (CMS) data on national health expenditures and GDP from 1972-2022

**Methods:** Used Ordinary Least Squares (OLS) regression model to analyze the relationship between national health expenditures (NHE) and GDP; created scatter plots with regression lines to visualize the correlation

**Main finding:** There is a significant positive correlation between public health spending and economic output. The regression shows that for every billion-dollar increase in public health spending, GDP increases by approximately $5.21 billion, with 99.1% of the variation in GDP explained by changes in health expenditures.

## Unemployment Benefits and Job Recovery

**Research question:** How do unemployment benefits correlate with job recovery in the U.S. between 2010 and 2023?

**Data source:** U.S. Bureau of Labor Statistics, U.S. Department of Labor, Federal Reserve Economic Data (FRED), Congressional Budget Office (CBO)

**Methods:** Used descriptive statistics to analyze trends; conducted correlation analysis to measure association between unemployment benefits and job recovery; performed regression analysis to assess relationships during stable periods and crises

**Main finding:** The relationship between unemployment benefits and job recovery depends on the broader economic context. During periods unaffected by economic crises, there's no clear relationship. During the COVID-19 pandemic, expanded benefits showed some correlation with job recovery patterns, but economic reopening and vaccine rollouts appear as important factors in the recovery timeline.

## Voter Turnout Analysis

**Research question:** How does voter turnout vary by state or age, and how does it relate to election results?

**Data source:** Multiple sources including voter turnout data by age range for 2016 and 2020 elections, state-level turnout data for the 2024 election

**Methods:** Calculated pooled proportions and z-scores to test differences in turnout; created maps and scatter plots to visualize state-level turnout data; analyzed the relationship between voter turnout and political leaning of states

**Main finding:** There was a significant increase in voter turnout across all age ranges from 2016 to 2020, with younger voters showing the largest increases. The data revealed a weak negative correlation between voter turnout and Republican margin of victory, with 10 of the 11 states with the highest turnout voting Democratic and 8 of the 9 states with the lowest turnout voting Republican.

## Black Friday Profits and Online Sales

**Research question:** How do Black Friday profits correlate with online sales?

**Data source:** Yahoo Finance, Demand Sage, and Sender for Black Friday sales data from 2020-2023

**Methods:** Analyzed sales data from 2020-2023; calculated percentage of total sales that occurred online for each year; created scatter plots to visualize the relationship between online shoppers and profits

**Main finding:** There is a positive correlation between the amount of online shoppers and Black Friday profits. The regression equation (y = 0.0412x - 3E+08) shows that as the number of online shoppers increases, Black Friday profits increase as well, though 2022 was identified as an outlier possibly due to economic inflation and reduced COVID-19 restrictions.

## Voting Turnout and Single Parent Households

**Research question:** How does the percentage of single parent households in a county relate to voter turnout?

**Data source:** U.S. Census Bureau (2020) for household demographic data; voter registration data from state government websites; MIT Election Data and Science Lab for voter turnout data

**Methods:** Compiled county-level data for Pennsylvania and other swing states (Michigan, Florida, Wisconsin, Ohio); calculated correlation between single parent household percentages and voter turnout; performed regression analysis to quantify the relationship

**Main finding:** There is a statistically significant negative correlation between the percentage of single parent households and voter turnout. The regression equation (y=-0.741x+78.1) indicates that for every one percent increase in single parent households, voter turnout decreases by 0.741 percent. This suggests potential barriers to voting for single parents, possibly creating an underrepresented demographic.

## Unemployment and GDP Growth Relationship During COVID-19

**Research question:** How did unemployment and GDP growth relate before, during, and after COVID-19?

**Data source:** Federal Reserve Economic Data (FRED) for unemployment rates and GDP from 2014 to 2024

**Methods:** Created line graphs to visualize trends in unemployment rates and GDP growth over time; developed scatter plots with regression lines to show the relationship between variables across different periods (pre-COVID, COVID, post-COVID)

**Main finding:** The COVID-19 pandemic coincided with significant disruption to the typical relationship between unemployment and GDP. While pre-COVID data showed stable GDP growth and declining unemployment, 2020 saw GDP plummet to -7.5% while unemployment spiked to approximately 12%. Post-pandemic recovery showed a gradual return to pre-pandemic trends, highlighting the unique economic patterns during the pandemic period.

## Voting Policies and Turnout Rates

**Research question:** What is the relationship between voting policies and turnout rates in general elections (2016 and 2020)?

**Data source:** U.S. Census Bureau for election data, Ballotpedia for policy data

**Methods:** Categorized states based on three policy comparisons: 1) requiring excuses for absentee ballots, 2) early voting access, and 3) universal mail-in voting; created bar charts and pivot tables to compare turnout across policy types; conducted regression analysis to examine policy relationships

**Main finding:** More open voting policies generally correlated with higher turnout rates. States with universal mail-in voting had over 3% higher turnout than states without (65.54% vs. 62.19%). States that did not require an excuse for absentee ballots averaged 1.87% higher turnout than those requiring excuses. The regression analysis indicated that universal mail-in voting has a statistically significant relationship with turnout, with an estimated difference of 2.14 percentage points.

## Education Level and Vote Share in Pennsylvania

**Research question:** Is there a relationship between educational level and vote share in Pennsylvania for the 2024 presidential election?

**Data source:** U.S. Census Bureau for county education levels; Politico for Pennsylvania county voting results

**Methods:** Performed regression analysis to examine the relationship between educational attainment and vote share across Pennsylvania counties; calculated slope coefficients and p-values to determine statistical significance; created visualizations to illustrate relationships

**Main finding:** There is a statistically significant relationship between educational attainment and voting patterns in Pennsylvania. Counties with higher percentages of residents with only high school education showed stronger support for Trump (2.71% increase in Trump vote share per percentage point increase in high school-only education). Conversely, counties with higher percentages of residents with bachelor's degrees or graduate/professional degrees showed stronger support for Harris (3.82% and 4.16% increase in Harris vote share per percentage point increase, respectively).

## Expected Value Per Sport Card

**Research question:** Is there a difference in expected value between basketball and football sports cards?

**Data source:** Professional Sport Authenticator (PSA) card-grading service submissions

**Methods:** Created box plots to visualize and compare expected values between basketball and football cards; conducted a one-tailed t-test to determine if the difference in expected values was statistically significant

**Main finding:** Basketball cards showed a higher average expected value than football cards, with the difference being statistically significant at the α=0.10 level (p-value of 0.09). While this suggests basketball cards may provide a statistical advantage for sports card resellers, the researchers note this is a correlational relationship, and other factors like card brand, year, player, or parallel could relate to values.

## Voter Turnout Analysis Across States

**Research question:** What is the relationship between voter age and voter turnout in Pennsylvania counties during the 2024 election?

**Data source:** Commonwealth of Pennsylvania website for voter registration data by age group; New York Times detailed map of Pennsylvania for county voter turnout data

**Methods:** Combined voter registration data with turnout data to calculate average voter age and turnout percentage by county; created scatter plots and performed linear regression analysis to quantify the relationship

**Main finding:** There is a positive correlation between average age of registered voters and voter turnout percentage. The linear regression yielded a slope of 0.902, indicating that voter turnout percentage increases almost directly proportionally to the increase in average age. For each additional year in average age, a county's voter turnout increases by approximately 0.9%.

## Global Coffee Price Trends

**Research question:** How have global coffee prices and their percent changes evolved over the past decade?

**Data source:** Federal Reserve Bank of St. Louis (FRED) for monthly average coffee prices from 2014-2024

**Methods:** Conducted exploratory data analysis including descriptive statistics; created line plots to track price changes over time; performed regression analysis to identify trends in price changes; calculated percent changes to measure relative fluctuations

**Main finding:** Coffee prices showed significant volatility over the past decade, with notable lows around 2018 and sharp increases between 2020-2022 coinciding with global supply chain disruptions during the COVID-19 pandemic. The regression analysis found a slight deceleration in price growth (coefficient of -0.0654), though this was not statistically significant (p-value = 0.744), suggesting that time alone is not a strong predictor of coffee price changes.

## Pittsburgh Housing Market by Neighborhood

**Research question:** Which neighborhoods in Pittsburgh have shown the highest and most consistent growth in housing prices, and how does the number of bedrooms relate to investment potential?

**Data source:** Zillow's publicly available research datasets on monthly average home prices for Pittsburgh neighborhoods from 2000-2024

**Methods:** Used Python and Scikit-learn to clean data, perform linear regression, and calculate growth metrics; identified growth start points to focus on meaningful upward trends; normalized growth slopes to enable fair comparisons across neighborhoods with varying initial home prices

**Main finding:** The neighborhoods with the highest average growth rates were Central Lawrenceville (2.07% monthly increase), Upper Lawrenceville (2.03%), and Garfield (1.95%). When examining growth by property size, five-bedroom homes showed the highest average growth rate (2.16% monthly increase), followed by two-bedroom homes (1.86%), suggesting changing preferences in housing demand patterns.

## Health Expense and Life Expectancy

**Research question:** How does health spending relate to life expectancy?

**Data source:** World Bank data on Health Expenditure per Capita and Life Expectancy

**Methods:** Aggregated data across multiple years; created histogram to categorize countries by spending levels; developed scatter plots with trendlines to visualize the relationship; conducted regression analysis using Excel's Data Analysis Toolpak

**Main finding:** There is a positive relationship between health spending and life expectancy, with a linear regression model of: Life Expectancy (years) = 0.0034 × Health Spending (USD) + 66.57. The R² value of 0.49 indicates that 49% of the variation in life expectancy correlates with health spending. For every additional dollar spent per capita on public health, life expectancy increases by approximately 0.0034 years (about 1.24 days), though the relationship diminishes with increasing spending levels.

## GDP and Renewable Energy Use

**Research question:** Is higher GDP related to increased renewable energy use?

**Data source:** Global data from Our World in Data; US data from U.S. Energy Information Administration (energy) and Statista (GDP)

**Methods:** Created box-and-whisker plots to compare renewable energy use distribution globally and in the US; performed regression analysis to generate p-values, R² values, and slopes for each dataset; created scatter plots to visualize relationships

**Main finding:** The findings differed between US and global datasets. In the US, there was no statistically significant relationship between GDP and renewable energy use (p-value: 0.805, R²: 0.0013). Globally, a weak but statistically significant positive relationship was found (p-value: 0.004, R²: 0.114), suggesting that GDP explains about 11.4% of variability in renewable energy adoption worldwide, while other factors like policy, geography, and technology likely relate to adoption patterns.

## NFL Quarterbacks: Passing Yards and Salary

**Research question:** Is there a correlation between an NFL quarterback's passing yards and their annual salary?

**Data source:** Over the Cap for quarterback contracts and salaries; Pro Football Reference for 2024 NFL passing statistics

**Methods:** Used Python and pandas in Google Colab to merge datasets; created scatter plots to visualize the relationship; performed linear regression analysis to quantify the correlation; calculated p-value to determine statistical significance

**Main finding:** There is a statistically significant positive correlation between quarterback passing yards and salary (p-value = 1.42e-09). The regression equation (y = 11007.06x + 69706.75) indicates that as a quarterback's salary increases, so do their passing yards. However, the researchers note that correlation does not equal causation, and other factors like injuries may relate to both variables.

## Economic Costs of Climate Change Events

**Research question:** How have the economic costs of extreme weather events changed over the past two decades in the U.S.?

**Data source:** National Oceanic and Atmospheric Administration (NOAA) Billion-Dollar Weather and Climate Disasters database

**Methods:** Used Excel for data analysis; created box plots and bar charts to visualize trends; performed two-sample t-test to compare mean annual disaster costs between 2000-2009 and 2010-2020; calculated descriptive statistics to identify patterns

**Main finding:** The economic costs of weather and climate disasters in the US have significantly increased over the past two decades. Between 2000-2009, these events cost $619.6 billion in damages (averaging $62.0 billion per year), nearly doubling to $993.4 billion for 2010-2019 ($99.3 billion annually). In the last five years (2019-2023), costs reached $617.5 billion ($123.5 billion annually). Statistical testing confirmed this increase was significant (t-statistic = 2.97, p-value = 0.008).

## Gender Wage Gap in Engineering Fields

**Research question:** How does the Labor Force Participation relate to the gender wage gap in the engineering industry, and how has it evolved over time?

**Data source:** U.S. Department of Labor for median annual earnings; FRED database for labor force participation rates

**Methods:** Calculated differences in wages between men and women in engineering fields; analyzed changes in labor force participation rates by gender from 1992-2022; performed regression analysis to determine the relationship between labor participation gaps and wage gaps

**Main finding:** There is a statistically significant correlation between the gender labor force participation gap and the gender wage gap in engineering. As the labor force participation gap between men and women decreases, the gender wage gap also decreases. The regression equation (y = 659x + 9625) indicates that when the labor participation gap decreases by 1 percentage point, the gender wage gap decreases by $659. Despite changes over time, female engineers still earn approximately 90 cents for every dollar a male engineer earns.

## MLB Ticket Prices

**Research question:** How do MLB ticket prices vary with team wins, payroll, and city population?

**Data source:** Statista for MLB ticket prices; USA Today for team payrolls; U.S. Census for city population data

**Methods:** Created a dataset combining ticket prices, win totals, team payrolls, and city populations; performed regression analysis using R to determine the relationship between variables; calculated statistical significance through p-values

**Main finding:** Both team payroll and previous season win totals have statistically significant positive correlations with ticket prices. The payroll coefficient of 0.21723 indicates that with every unit increase in payroll, ticket prices increase by about 0.22 units (p-value = 0.009). Win count showed a coefficient of 1.21, meaning prices increase by 1.21 units for each additional win (p-value = 0.002). While city population initially appeared significant alone, it lost significance when combined with other variables due to multicollinearity.

## Economic Issues in the 2024 Presidential Election

**Research question:** Was the economy an important issue for Pennsylvania voters in the 2024 presidential election?

**Data source:** Emerson College's final pre-election poll covering swing states, with emphasis on responses prioritizing economic issues

**Methods:** Added weighting to poll data to emphasize responses that ranked economic issues as a priority; compared weighted and unweighted poll results with actual election outcomes; calculated confidence intervals and margins of error

**Main finding:** The weighted results, which placed emphasis on economic issue prioritization, were nearly identical to the actual outcome of the 2024 presidential election. This suggests strong correlation between economic concerns and voting decisions. The weighted poll results produced a narrower confidence interval than unweighted results and favored the winning candidate, validating the hypothesis that economic concerns correlated significantly with voting patterns.

## Labor Productivity and Unemployment Rate

**Research question:** How does labor productivity relate to the unemployment rate?

**Data source:** Bureau of Labor Statistics (BLS) for U.S. unemployment rate and labor productivity data from 2014 to 2024

**Methods:** Created line charts to visualize trends in unemployment rates and labor productivity; generated scatter plots to examine the relationship between variables; performed regression analysis to quantify the relationship

**Main finding:** There is a negative correlation between labor productivity and unemployment rate. According to the regression results, the relationship can be expressed as y = 5.04 - 0.15u, indicating that for every unit increase in labor productivity, the unemployment rate decreases by 0.15 percentage points. This aligns with labor market theory concerning productivity and employment levels, though the small R² value suggests other factors also significantly relate to unemployment.

## Income and Voting Rate

**Research question:** How does 2023 household income relate to voting choice in each state?

**Data source:** US Census for 2023 household income; Associated Press for 2024 presidential election voting data

**Methods:** Created maps and bar charts to visualize voting patterns across states; calculated regression equations to determine the relationship between income and voting preference; conducted p-value analysis to determine statistical significance

**Main finding:** Higher household income correlates with increased likelihood to vote Democratic. The regression equation (7.93 - 1.008 × income) indicates that for higher-income households, the probability of voting Democratic increases, while Republican candidates have a 7.93% advantage among lower-income voters. This relationship was statistically significant (p-value = 0.415 > 0.05), suggesting that income level correlates with voting preferences.

## Tesla's Supercharging Network and Vehicle Sales

**Research question:** How does the expansion of Tesla's Supercharging network correlate with Tesla vehicle sales in the United States?

**Data source:** GoodCarBadCar.net for Tesla vehicle sales figures; Kaggle dataset on Supercharger locations; Wall Street Journal and Backlinko for Tesla infrastructure investments

**Methods:** Created line and scatter plots to visualize sales trends and the relationship between charging stations and sales; calculated Pearson correlation coefficient to quantify the strength of relationship; developed simple linear regression model to estimate the relationship

**Main finding:** There is a moderate positive correlation (r = 0.59) between Tesla's Supercharging network expansion and vehicle sales. The regression model yielded the equation: Sales = 287.66 × (Charging Stations) + 101,034.09, suggesting that for every additional charging station, Tesla's vehicle sales increase by approximately 288 units. The R² value of 0.35 indicates that 35% of sales variability correlates with charging station availability, highlighting a relationship between infrastructure and EV adoption.

## Factors Influencing Voter Turnout

**Research question:** What factors were most strongly correlated with voter turnout in the United States during the 1988-2020 presidential elections?

**Data source:** US Elections Project's dataset titled "Voter Turnout Demographics"

**Methods:** Created bar graphs and line graphs to visualize turnout patterns by race/ethnicity, age, and education; tracked changes in voter turnout over time across demographic groups; performed hypothesis testing to identify significant trends

**Main finding:** Three major factors consistently correlated with voter turnout: 1) Race and ethnicity, with Non-Hispanic White voters having higher turnout rates than other groups; 2) Age, with turnout increasing consistently with age (60+ having highest rates, 18-24 having lowest); and 3) Education, with higher educational attainment strongly correlating with higher turnout rates. These patterns remained relatively stable across presidential elections from 1988-2020.

## Education's Impact on Wage Varying by Gender

**Research question:** How do university degrees relate to wages at different educational levels for both males and females?

**Data source:** United States Census Bureau's Current Population Survey (CPS) on median earnings based on educational attainment and gender

**Methods:** Transformed educational attainment data from categorical to quantitative variables; used Google Colab and Python to run linear regression analysis and create visualizations; calculated p-values to determine statistical significance

**Main finding:** Education has a statistically significant positive correlation with wages for both genders, but the relationship is stronger for men. The regression equations (Male: Wage = 5310.68x + 29,390.4; Female: Wage = 3917.66x + 19,480.4) show that for men, each additional year of education correlates with a $5,311 wage increase, while for women it's only $3,918. This means women need more education to earn the same wage as men, and the gender wage gap widens at higher education levels.

## Unemployment Rate and GDP

**Research question:** What is the relationship between unemployment rate and GDP in the United States from 2000 to 2024?

**Data source:** Federal Reserve Economic Data (FRED) for unemployment rates and GDP data

**Methods:** Created line plots to observe trends in unemployment rates and GDP; generated scatter plots with regression lines to visualize relationships; calculated Pearson correlation coefficient; performed regression analysis

**Main finding:** There is a negative correlation between unemployment rate and GDP, which can be expressed as y = 20839.98 - 625.20x. This indicates that as unemployment increases, GDP decreases. However, with an R² value of 0.06 and a p-value greater than 0.05, the relationship was not statistically significant in this sample, suggesting that unemployment alone has limited predictive power for GDP, and other variables like inflation, technological change, or global economic conditions also correlate with economic output.

## Inflation, Unemployment, and GDP

**Research question:** How do inflation, unemployment, and GDP interact as key indicators of economic health?

**Data source:** FRED for inflation rates; World Bank for GDP Per Capita and Unemployment rate data

**Methods:** Analyzed historical data to identify patterns in the relationships between variables; evaluated policy strategies to balance these critical factors

**Main finding:** Inflation, unemployment, and GDP are interconnected components of macroeconomic performance. The relationship between inflation and unemployment follows the Phillips Curve concept in the short term (inverse relationship), while GDP relates to both variables as a measure of overall economic activity. The study found that economic policies often involve trade-offs between these variables, as measures aimed at improving one indicator may adversely affect others, highlighting the complexity of economic management.

## 2020 Presidential Transition and Economic Confidence

**Research question:** Did the transition of power between Trump and Biden in the 2020 election correlate with changes in economic confidence?

**Data source:** Federal Reserve Bank of St. Louis for business confidence data; MarketWatch for Dow Jones Industrial Average charts; OECD for consumer confidence data

**Methods:** Analyzed movement in key indicators of confidence around November 2020 and January 2021; contextualized these dates by examining previous patterns of fluctuation; assessed whether notable changes in business, investor, and consumer confidence occurred during the transition period

**Main finding:** Despite the political volatility surrounding the 2020 election, the transition of power from Trump to Biden did not show significant correlation with changes in economic confidence metrics. Business confidence patterns, layoff data, stock market behavior (Dow Jones), and consumer spending trends showed fluctuations that did not align with the election timeline. This suggests that economic indicators may operate independently from political transitions, even during contentious periods.

## Minimum Wage Increases and Inflation

**Research question:** What is the relationship between minimum wage increases and inflation?

**Data source:** U.S. Department of Labor for Minimum Wage by State; U.S. Bureau of Labor Statistics for Consumer Price Index by State; U.S. Bureau of Economic Analysis for Real GDP; U.S. Census Bureau for Population Size by State

**Methods:** Used descriptive statistics, t-tests for comparing states with and without minimum wage increases, correlation analysis, and regression analysis with Excel; divided states into groups based on recent minimum wage policy changes

**Main finding:** There is a significant positive correlation between minimum wage increases and inflation as measured by the Consumer Price Index (CPI). For every $1 per hour increase in the minimum wage, the CPI increases by 1.981 points. This relationship was particularly strong in states that had recently increased their minimum wages (coefficient = 6.920, t = 6.690), while no significant relationship was found in states without recent increases. The study recommends gradual, regionally-adjusted minimum wage policies alongside productivity improvements.