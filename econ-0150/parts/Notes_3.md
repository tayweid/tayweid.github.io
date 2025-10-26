## Part 3 | Univariate GLM

- Data (sample) is a collection of observations
- Each observation is a realization of an unknown population random variable
- We want to know things about the unknown population random variable preceiely because it is unknown
- But this also presents a challenge: we can summarize the data, but the data has variability, and doesn't exactly match the population
- This presents a real challenge: how do we make inferences about the population when all we see is the sample? 
- Amazingly, the sample mean approaches a normal distribution centered on the truth with a standard deviation of $\sigma / \sqrt{n}$, the population standard error
- For now let's assume we know $\sigma$ and focus on how we learn about an unknown $\mu$
- This means we don't have to make any assumptions to know that the sample mean will be 'close' to the population mean most of the time
- The central limit theorem tells us about the distribution of 'closeness' between the sample mean and the population mean
- Importantly, the distance between $\bar{x}$ and $\mu$ is the same whether we measure from $\mu$ to $\bar{x}$ or from $\bar{x}$ to $\mu$
- Since we don't actually know $\mu$ in practice, we flip our perspective: instead of asking "where will $\bar{x}$ fall around the unknown $\mu$?", we ask "where could $\mu$ be around our observed $\bar{x}$?"
- This flip doesn't change the distribution shape or spread - we're just moving our reference point from the unknown ($\mu$) to the known ($\bar{x}$)
- To see this, let's look at confidence intervals:
  - If we knew $\mu$, we could say "$\bar{x}$ will fall within ±1.96 SE of $\mu$ about 95% of the time"
  - Flipping this: "$\mu$ will fall within ±1.96 SE of $\bar{x}$ about 95% of the time"
  - Same width interval, just centered on what we actually know ($\bar{x}$) instead of what we don't know ($\mu$)"
- But what about $\sigma$? In practice we don't know the population variables. So what do we do?
- Well with $\mu$ we centered the sampling distribution on $\bar{x}$ instead of $\mu$
- What if we replace $\sigma$ with $S$, the sample standard deviation?
- Just like with the sample mean, the sample standard deviation follows a normal distribution around the population standard deviation
- This sampling distribution gets smaller as the sample size grows
- The extra variability of the sample standard deviation means if we replace with $S$ the sample 
- So if we replace the population sandard error with the sample sandard error, our confidence interval is wrong
  - Do a simulation of this
  - Maybe center the sampling distribution on the truth and show each sampling distribution has different widths
  - Show that with this replacement we don't get the truth in the interval as often as we would expect
- If we swap both the mean and se into, the sampling distribution has both the variability in the sample mean AND in the spread of the distribution
- Using the sample se we get more sample means in the tails than we would using the population se
- But as the sample size gets larger this problem gets smaller
- There's some mathematics to show that including this second source of variabilitity, the sample se random variable, creates a distribution very similar to the normal, but with thicker tails, and approaches the normal distribution as the sample size gets larger
- Combining the recentering on xbar and the added variability from the sample se in place of the population se, we now don't need to know anything about the population random variable to build confidence intervals
- We know constructing a 90% confidence interval in this way using a t-distribution will contain the truth 90% of the time: 10% of the time a confidence interval constructed this way will not contain the population mean
- But lets flip the question: Lets say we hypothesize the population mean is $\mu_0$, or $\beta_0$. With $\bar{x}$ and $S$, what's the narrowest confidence interval that would include $\beta_0$?
- Lets call this confidence level $q$. If $\beta_0$ is very close to $\bar{x}$, $q$ will be small. This tells us we don't need to be very confident to
- The area inside the CI tells us the probability the population mean is closer than $\beta_0$
- The area outside the CI tells us the probability is more extreme than $\beta_0$
- This area outside the CI is what we call a p-value
- Small p-values tell us that our hypothesis is very far from the sample mean, meaning our hypothesis is likely wrong
- The p-value tells us the probability we would see our sample if our null hypothesis were true
- We often say this incorrectly, and stats people get upset. The incorrect way of saying this is that the p-value tells us the probability of our null hypothesis. But there's no randomness in the truth, just randomness in the sample.
- To get a little controversial, a p-value is a much better measure of the closeness of the sample mean to the population mean than using confidence intervals. They are very similar ideas as you've seen. But your choice of CI will impact whether your null is contained in the CI. But a p-value doesn't give you a choice. That lack of choice is better. We have a problem with people choosing CIs in a way to make their results look good, called p-hacking. Simply reporting p-values avoids much/some of this problem.
- Lets build a statistical model using this approach.
- We're going to write down a model that hypothesizes the population mean is $E[y] = \mu = \beta_0 = 0$. 
- All we want to do is draw a line through the data at it's mean. As we'll see later, this line actually minimizes the sum of squared errors. This is simular to the variance, except were not dividing by n. 
- What is the probability that we would see this model if the population mean were zero?
- Very small. All we have to do is find the area in the tails of the sampling distribution around the model that is more extreme than zero. 
- This is easy to do. All we have to do is find the area in the tails. 
- To find this lets draw a line of best fit, the line that minimizes the sum of squared errors through the data, and draw the t-distribution around it, and find the area in the tails. 
- This is done by python.
- What if our hypothesis is 2 instead?
- Well the default null with OLS is $\beta_0 = 0$. So lets just shift the y-values down by 2. Call this `y_shifted`  and test whether this is different from zero. 
- In this way we can test any hypothesis we'd like. Just shift the values and test the sampling distribution against zero. This is what we call a t-test.

## Part 4 | Bivariate GLM

CLAUDE PROMPT: ok i'm working on going from the basic ideas of a t-test, where we use the sample statistics and the clt to construct the sampling distribution which we use to tests null hypotheses to testing lines through data with the general linear model. and i'm working on slides to do that move. i have good slides talking about minimizing the sum of squared errors. but i want an intuitive and simple way to get from simply looking at the the sample mean to using the sum of squared errors and fitting lines in the univariate case first. can you talk through a way to make that connection without it feeling disconnected or like we're introducing unneccessary mechinery?