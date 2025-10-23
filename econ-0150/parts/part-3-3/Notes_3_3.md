## Part 3.3 | Closeness of Sample to Population

### How close are the sample mean ($\bar{x}$) and the population mean ($\mu$)?

#### Notes after class

I think this was generally fine. Students struggled more with the CDF questions than I expected. But I broke the question currently in the slides into subquestions and went through those. I think a more structured segment that does some more systematic questions of pdfs and cdfs would be helpful.

The other big this is that I think this should follow hypothesis testing. It's a little harder to talk about closeness without having introduced the idea that we can change the centerpoint. I got tripped up by this a couple of times. It might not be nice to spend an entire class covering hypothesis testing with a known sigma, since we don't actually do that. So maybe there's a way to introduce the idea of closeness, then show how S follows a normal distribution around the sigma, and that this throws off the p values using a normal.

I like the exercise. I think it would be worth having them do the test, then doing it with a much larger sample on the computer to actually show the result in large sample. The conclusions should be:

- Each one of your sample means falls somewhere inside or outside the CI. Some inside, some outside.
- Roughly 95% of them fall inside.
- It's not exactly 95%. And if I only used one, it would be either 0 or 100.
- But if I repeat this 10,000 times, it is basically exactly 95%. 
- So the idea is that this process of constructing confidence intervals is guaranteed to produce intervals around the sample mean that contain the truth 95% of the time (this is the thing that's hard to say with hypothesis testing coming second).

I think it would be better to do changing of the centerpoint first with a simulation, with a cdf and pdf warmup, then talk about the distribution of S with a better setup (show figures of the samples like in 3.2) and simulate them, then do an exercise using S instead of sigma, and show that it's too confident, then introduce the t-dist at the very end, leaving the t-test for 3.4. This might be too long, but I think it could be structured to be right.

Then talk about just the t-dist and t-test with regression in 3.4.

I also think I want to introduce more figures that resemble the GLM, with data on the y-axis and a horizontal line at the mean.

#### Outline

- We've found the sample mean follows a normal distribution centered on the truth with a standard deviation of $\sigma / \sqrt(n)$, what we call the standard error.
- With a known $\sigma$ we could know the probability a sample mean will be close to the true mean.
- Lets do this mathematically: find the probability a randomly drawn sample will fall within one standard error of the true mean.
- This is what we call a confidence interval: 
  - If we drew many samples, $p = P(\bar{x} \in [\mu-\sigma / \sqrt(n), \mu+\sigma / \sqrt(n)])$ of them would be no further than $\sigma / \sqrt(n)$ away from the mean.
  - This doesn't tell us that the true mean will be on THIS interval witih probability $p$, since $\bar{x}$ changes with every sample. 
  - It tells us that constructing the interval in this way will contain the truth with $p$ probability.

- Lets simulate this and see if we're close.
  - start with one. have each student find whether it's within one standard error. count them up and compare to the theory.
  - then have each do 1000

- But with an unknown population, how do we know the $\sigma$ we used to construct the confidence interval?
- Just like with $\bar{x}$, theres sampling variability of the sample standard deviation, $S$, around the population standard deviation, $\sigma$.
- If we calculate the sample standard error, there's a bit of extra variability from $S$ that we did not have in the population standard error with $\sigma$.
- The t-distribution systematizes this added variability in that goes along with using $S$ instead of $\sigma$.
- There's some math behind the scenes to show this which we do not need to do.
- Show t vs N.
- Exercise:
  - Show how we're too confident if use the Normal instead of the t.
  - The probability we estimate is smaller than what we see in the samples
  - 

- Lets calculate the area in the tails.
- So this lets us use the information in the sample to make claims about the truth.
- Lets do an example.

---