#clear the workspace
rm(list=ls())

#set the working directly 
setwd("C:/Users/janaa/OneDrive - University of Pittsburgh/3rd Year/Summer teaching/0150")

#load the libraries
library(tidyr)
library(ggplot2)
library(dplyr)
#install.packages("ggrepel")
library(ggrepel)
library(tidycensus)
library(tidyverse)

# Add and save your API key
census_api_key("932c5fe910c462d161f71af34e34b42705517abf", overwrite = TRUE, install = TRUE)

# Reload the session after setting the key
readRenviron("~/.Renviron")

# Define the year and variable (Median Household Income)
year <- 2023
vars <- c("B19013_001")  # Median household income

# Download county-level data for Pennsylvania only
pa_county <- get_acs(
  geography = "county",
  state = "PA",              # <--- Limits to Pennsylvania
  variables = vars,
  year = year,
  survey = "acs5"
) %>%
  select(GEOID, NAME, variable, estimate) %>%
  pivot_wider(names_from = variable, values_from = estimate) %>%
  rename(county_id = GEOID,
         county_name = NAME,
         median_income = B19013_001) %>%
  mutate(Year = year)

#choose a random sample of 30 counties from the dataset
set.seed(2025)  # Set seed for reproducibility

pa_sample_30 <- pa_county %>%
  slice_sample(n = 30)

#save the sample data
write.csv(pa_sample_30, "Data/pa_sample_30.csv")


# View basic summary statistics
summary_stats <- pa_sample_30 %>%
  summarise(
    sample_size = n(),
    sample_mean = mean(median_income, na.rm = TRUE),
    sample_sd   = sd(median_income, na.rm = TRUE)
  )

print(summary_stats)

# Run one-sample t-test against benchmark value $73,824
benchmark_income <- 73824

ttest_result <- t.test(pa_sample_30$median_income, mu = benchmark_income)

# Print results
print(ttest_result)

# Extract specific values
cat("Sample size (n):", length(pa_sample_30$median_income), "\n")
cat("Sample mean:", round(mean(pa_sample_30$median_income), 2), "\n")
cat("Standard deviation:", round(sd(pa_sample_30$median_income), 2), "\n")
cat("t-statistic:", round(ttest_result$statistic, 3), "\n")
cat("Degrees of freedom:", ttest_result$parameter, "\n")
cat("p-value:", round(ttest_result$p.value, 4), "\n")
cat("95% Confidence Interval:", paste(round(ttest_result$conf.int[1], 2), "to", round(ttest_result$conf.int[2], 2)), "\n")


###do the same exercise for census tracts 

# Download tract-level data for Pennsylvania only
pa_tract <- get_acs(
  geography = "tract",
  state = "PA",              
  variables = vars,
  year = year,
  survey = "acs5"
) %>%
  select(GEOID, NAME, variable, estimate) %>%
  pivot_wider(names_from = variable, values_from = estimate) %>%
  rename(county_id = GEOID,
         county_name = NAME,
         median_income = B19013_001) %>%
  mutate(Year = year)

#choose a random sample of 1500 counties from the dataset
set.seed(42)  # Set seed for reproducibility

pa_sample_tracts <- pa_tract %>%
  slice_sample(n = 60)

#save the sample data
write.csv(pa_sample_tracts, "Data/pa_sample_tracts.csv")


# View basic summary statistics
summary_stats <- pa_sample_tracts %>%
  summarise(
    sample_size = n(),
    sample_mean = mean(median_income, na.rm = TRUE),
    sample_sd   = sd(median_income, na.rm = TRUE)
  )

print(summary_stats)

# Run one-sample t-test against benchmark value $73,824
benchmark_income <- 73824

ttest_result <- t.test(pa_sample_tracts$median_income, mu = benchmark_income)

# Print results
print(ttest_result)

# Extract specific values
cat("Sample size (n):", length(pa_sample_tracts$median_income), "\n")
cat("Sample mean:", round(mean(pa_sample_tracts$median_income), 2), "\n")
cat("Standard deviation:", round(sd(pa_sample_tracts$median_income), 2), "\n")
cat("t-statistic:", round(ttest_result$statistic, 3), "\n")
cat("Degrees of freedom:", ttest_result$parameter, "\n")
cat("p-value:", round(ttest_result$p.value, 4), "\n")
cat("95% Confidence Interval:", paste(round(ttest_result$conf.int[1], 2), "to", round(ttest_result$conf.int[2], 2)), "\n")

