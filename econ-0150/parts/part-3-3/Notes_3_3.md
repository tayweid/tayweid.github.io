## Part 3.3 | Closeness of Sample to Population

### How close are the sample mean ($\bar{x}$) and the population mean ($\mu$)?



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