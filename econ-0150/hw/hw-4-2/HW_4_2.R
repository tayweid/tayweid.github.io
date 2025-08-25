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
library(haven)
library(stargazer)

#load xpt data 
BRFSS <- read_xpt("Data/BRFSS.xpt")

#keep only the variables _BMI5, SEX, AGE, INCOME2, EDUCA, MARITAL, MENTHLTh
BRFSS <- BRFSS %>%
  select(`_BMI5`, SEX, AGE, INCOME2, EDUCA, MARITAL, MENTHLTH, `_CNTY`, `_STATE`)

#generate a variable GEOID equal `_STATE` + `_CNTY` 
BRFSS <- BRFSS %>%
  mutate(GEOID = paste0(sprintf("%02d", `_STATE`), sprintf("%03d", `_CNTY`))) %>%
  select(-`_STATE`, -`_CNTY`)


# Add and save your API key
census_api_key("932c5fe910c462d161f71af34e34b42705517abf", overwrite = TRUE, install = TRUE)

# Reload the session after setting the key
readRenviron("~/.Renviron")

# Define the year and variable (Median Household Income)
year <- 2011

# Use direct variable code for unemployment rate
vars <- c("S2301_C04_001")

# Download county-level unemployment rate in Pennsylvania
county_unemp <- get_acs(
  geography = "county",
  variables = vars,
  year = year,
  survey = "acs5"
) %>%
  select(GEOID, NAME, estimate) %>%
  rename(
    county_id = GEOID,
    county_name = NAME,
    unemployment_rate = estimate
  ) %>%
  mutate(Year = year)

#rename county_id to GEOID
county_unemp <- county_unemp %>%
  rename(GEOID = county_id)

# Merge BRFSS with county unemployment data using GEOID, only keep matched observations 
BRFSS <- merge(BRFSS, county_unemp, by = "GEOID", all.x = FALSE)

#replace the value 88 of MENTHLTH by 0
BRFSS$MENTHLTH[BRFSS$MENTHLTH == 88] <- 0
#replace the value 99 and 77 of MENTHLTH by NA
BRFSS$MENTHLTH[BRFSS$MENTHLTH == 99 | BRFSS$MENTHLTH == 77] <- NA
#replace the value 99 and 77 of INCOME2 by NA
BRFSS$INCOME2[BRFSS$INCOME2 == 99 | BRFSS$INCOME2 == 77] <- NA
#replace the value 99 of AGE by NA
BRFSS$AGE[BRFSS$AGE == 99] <- NA

#generate a dummy variable equal 1 if EDUCA is 5 or 6 
BRFSS <- BRFSS %>%
  mutate(College = ifelse(EDUCA %in% c(5, 6), 1, 0))

#drop EDUCA
BRFSS <- BRFSS %>%
  select(-EDUCA)

#generate a dummy variable equal 1 if MARITAL is 1
BRFSS <- BRFSS %>%
  mutate(Married = ifelse(MARITAL == 1, 1, 0))

#drop MARITAL
BRFSS <- BRFSS %>%
  select(-MARITAL)

#generate a dummy variable equal 1 if SEX is 2
BRFSS <- BRFSS %>%
  mutate(Female = ifelse(SEX == 2, 1, 0))

#drop MARITAL
BRFSS <- BRFSS %>%
  select(-SEX)

#divide _BMI5 by 100 to convert it to kg/m^2
BRFSS <- BRFSS %>%
  mutate(BMI5= `_BMI5` / 100) %>%
  select(-`_BMI5`)

#save the data
write.csv(BRFSS, "Data/BRFSS_cleaned.csv", row.names = FALSE)

################################################################################
##HW 4.2##

#b)

#regress BMI5 on unemployment_rate
model_bmi_unemp <- lm(BMI5 ~ unemployment_rate, data = BRFSS)

#print the summary of the model
summary(model_bmi_unemp)

#use stargazer to save the table in latex
stargazer(model_bmi_unemp, type = "latex", title = "Regression of BMI on Unemployment Rate",
          dep.var.labels = "BMI", covariate.labels = "Unemployment Rate",
          out = "HW_tables/HW_4.2_b.tex")

#c)

#regress MENTHLTH on unemployment_rate
model_menthlth_unemp <- lm(MENTHLTH ~ unemployment_rate, data = BRFSS)

#print the summary of the model
summary(model_menthlth_unemp)

#use stargazer to save the table in latex
stargazer(model_menthlth_unemp, type = "latex", title = "Regression of Mental Health Days on Unemployment Rate",
          dep.var.labels = "Mental Health Days", covariate.labels = "Unemployment Rate",
          out = "HW_tables/HW_4.2_c.tex")

##HW 4.4##

#a)

#regress MENTHLTH on unemployment_rate and add controls
model_menthlth_unemp <- lm(MENTHLTH ~ unemployment_rate + AGE + Female + INCOME2 + College + Married, data = BRFSS)


#print the summary of the model
summary(model_menthlth_unemp)

#use stargazer to save the table in latex


#use stargazer to save the table in latex
stargazer(model_menthlth_unemp, type = "latex", title = "Regression of Mental Health Days on Unemployment Rate",
          dep.var.labels = "Mental Health Days", covariate.labels = "Unemployment Rate",
          out = "HW_tables/HW_4.4_2_a.tex")
