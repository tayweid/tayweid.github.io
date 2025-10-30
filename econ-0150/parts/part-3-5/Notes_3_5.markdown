## Part 3.5 | Minimizing the Mean Squared Error

### Hypothesis testing is the simplest linear model.

#### Notes For Next Time

- Introduce the variance in the context of the sum of squared errors and show that the mean minimizes the sum of squared errors
- It was good to ask them about the histogram of the b parameters.
- I liked mentioning that this is the same idea as hypothesis testing, but the big innovation is that we're using the ideas we've just developed to make claims not just about a population mean, but about the parameter of a statistical model.
- Talking about the x variable on $\beta_0$ being just ones makes it easier to explain what we do when we run the model using $y\sim 1$.

#### Outline

- So far in part 3 we've built a model that allows us to not need to know the underlying population distribution to answer questions about the population mean.
- The sampling distribution approaches a t-distribution with a standard deviation of the sample standard error.
  - Show a figure of a bunch of population distributions with the sampling distributions on top.
- Knowing the distribution then allows us to quantify our surprise about any null hypothesis using the area in the tails more extreme than our sample mean.
- What we're going to do today is show you how these same ideas allow us to build a statistical model and make claims about it.
- GLM is basically just drawing lines through data.
- Which line? The one that minimizes 'wrongness', measured with the MSE.
- Lets start with the simplest version. 
- The sample mean is that it minimizes the sum of squared errors.
- So when we plot the distribution of $b$ we're plotting the distribution of the means, which itself follows a normal distribution.
- Then it's easy to perform tests on $b$ in the standard way. 
- Lets test whether wait times are greater in the afternoon. 
- Here we're making a claim about the wait times being longer in the afternoon, so we want to compare the difference to zero.
- Our hypothesis test is whether the coefficient is equal to zero. This is the default null hypothesis built into regression model software. 
- Using an intercept we're essentially using an $x$ value equal to 1 for all rows. So we write $y \sim 1$, telling the software to try to find the best $b$ parameter to predict $y$. 