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


#load the data
agric <- read.csv("Data/world_in_data/world_in_data.csv")

coffee<- read.csv("Data/coffee_bean_production/coffee_bean_production.csv")

#clean the coffee data

# Drop rows where Code is empty or NA
coffee <- coffee[coffee$Code != "" & !is.na(coffee$Code), ]

# Drop Entity=World
coffee <- coffee[coffee$Entity != "World", ]

###############################################################################
# Count number of unique years
total_years <- length(unique(coffee$Year))

# Filter to keep only countries that appear in all years
coffee_years <- coffee %>%
  group_by(Code) %>%
  filter(n() == total_years) %>%
  ungroup()

table(coffee_years$Code)

#save a panel data for coffee production
write.csv(coffee_years, "Data/coffee_prod_in_years.csv", row.names = FALSE)
###############################################################################

# Keep only Year=2023
coffee <- coffee[coffee$Year == 2023, ]

#Change the variable names Code to Country.code 
colnames(coffee)[colnames(coffee) == "Code"] <- "Country.Code"
colnames(coffee)[colnames(coffee) == "Entity"] <- "Country.Name"

#merge the data using the Country.Code, keep only matched rows
merged_data <- merge(agric, coffee, by = "Country.Code", all = FALSE)

#drop the variable Country.Name.y 
merged_data <- merged_data[, !names(merged_data) %in% c("Country.Name.y")]

#rename the variable Country.Name.x to Country_Name
colnames(merged_data)[colnames(merged_data) == "Country.Name.x"] <- "Country_Name"

#rename the variable Country.Code to Country_Code
colnames(merged_data)[colnames(merged_data) == "Country.Code"] <- "Country_Code"

#rename the variable Employment.in.agriculture....of.total.employment. to Employment_in_agriculture
colnames(merged_data)[colnames(merged_data) == "Employment.in.agriculture....of.total.employment."] <- "Employment_in_agriculture"

#rename the variable coffe_prod to Coffee_Prod
colnames(merged_data)[colnames(merged_data) == "coffe_prod"] <- "Coffee_Prod"

#save the merged data
write.csv(merged_data, "Data/coffee_prod_agr.csv", row.names = FALSE)

################################################################################
#the variable Coffee_Prod is the coffee production in tons, remove the zeros for simplicity
merged_data$Coffee_Prod <- merged_data$Coffee_Prod / 1000  

#scatter plot of coffee production and employment in agriculture

ggplot(merged_data, aes(y = Coffee_Prod, x = Employment_in_agriculture)) +
  geom_point() +
  labs(title = "Coffee Production vs Employment in Agriculture",
       y = "Coffee Production (in Tons)",
       x = "Employment in Agriculture (% of total employment)") +
  theme_minimal()

#save the plot
ggsave("HW_figures/HW_2.1_c.png", width = 10, height = 6)

ggplot(merged_data, aes(x = Employment_in_agriculture, y = Coffee_Prod)) +
  geom_point() +
  scale_x_log10() +
  scale_y_log10() +
  labs(title = "Log-Log Plot: Coffee Production vs Employment in Agriculture",
       x = "Employment in Agriculture (% of total employment, log scale)",
       y = "Coffee Production (in Tons, log scale)") +
  theme_minimal()

################################################################################
#try to run the examples for HW2.2

#the variable Coffee_Prod is the coffee production in tons, remove the zeros for simplicity
coffee_years$coffe_prod <- coffee_years$coffe_prod / 1000

#sum all the coffee production every year and generate it in a new data frame 
coffee_years_sum <- coffee_years %>%
  group_by(Year) %>%
  summarise(coffe_prod = sum(coffe_prod, na.rm = TRUE))

#Plot a line graph of the global coffee production across time
ggplot(coffee_years_sum, aes(x = Year, y = coffe_prod)) +
  geom_line(color = "blue") +
  labs(title = "Global Coffee Production Over Time",
       x = "Year",
       y = "Coffee Production (in Tons)") +
  theme_minimal()

#save the plot
ggsave("HW_figures/HW_2.2_a.png", width = 10, height = 6)

#Plot a line graph of coffee production across time for all countries
ggplot(coffee_years, aes(x = Year, y = coffe_prod, color = Entity)) +
  geom_line() +
  labs(title = "Coffee Production Over Time by Country",
       x = "Year",
       y = "Coffee Production (in Tons)") +
  theme_minimal() +
  theme(legend.position = "none") # Hide legend for clarity

#save the plot
ggsave("HW_figures/HW_2.2_b.png", width = 10, height = 6)

#Generate a scatter plot of coffee production in 1961 and coffee production in 2023
coffee_1961 <- coffee_years[coffee_years$Year == 1961, ]
coffee_2023 <- coffee_years[coffee_years$Year == 2023, ]
# Merge the two data frames on Entity
coffee_comparison <- merge(coffee_1961, coffee_2023, by = "Entity", suffixes = c("_1961", "_2023"))

# Define outliers based on a threshold (e.g., absolute difference > 2000)
coffee_comparison <- coffee_comparison %>%
  mutate(diff = abs(coffe_prod_2023 - coffe_prod_1961))

# Adjust threshold as needed
label_data <- coffee_comparison %>%
  filter(diff > 2000 | coffe_prod_2023 > 500 | coffe_prod_1961 > 2000)

# Plot
ggplot(coffee_comparison, aes(x = coffe_prod_1961, y = coffe_prod_2023)) +
  geom_point() +
  geom_abline(slope = 1, intercept = 0, linetype = "dashed", color = "red") +
  geom_text_repel(data = label_data, aes(label = Entity), size = 3) +
  labs(title = "Coffee Production in 1961 vs 2023",
       x = "Coffee Production in 1961 (in Tons)",
       y = "Coffee Production in 2023 (in Tons)") +
       scale_x_continuous(limits = c(0, 4000)) +
       scale_y_continuous(limits = c(0, 4000)) +
  theme_minimal()


#save the plot
ggsave("HW_figures/HW_2.2_c.png", width = 10, height = 6)


#plot a line graph of coffee production only in Brazil 
coffee_brazil <- coffee_years[coffee_years$Entity == "Brazil", ]

ggplot(coffee_brazil, aes(x = Year, y = coffe_prod)) +
  geom_line(color = "green4") +
  labs(title = "Coffee Production in Brazil Over Time",
       x = "Year",
       y = "Coffee Production (in Tons)") +
  theme_minimal()


#save the plot
ggsave("HW_figures/HW_2.2_e.png", width = 10, height = 6)
