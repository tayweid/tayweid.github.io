## Part 3.4 | Hypothesis Tests

### What is the probability we are wrong?



- But you'll notice a problem: we don't observe $\mu$, so how do we know where to place the center of the normal distribution?
- Well maybe you've noticed, the central limit theorem tells us about the distribution of $\bar{x}$ around $\mu$, which is mathematically equivalent to the distribution of the 'closeness' of $\bar{x}$ to $\mu$. So it's mathematically equivalent to either talk about the distribution of closeness of $\bar{x}$ and $\mu$ or center the normal distribution on $\bar{x}$.
- But be careful here. The centeral limit theorem doesn't tell us about the distribution of the truth! The truth does have variability. It's fixed. It tells us how close $\bar{x}$ will be to the truth. Which is mathematically equivalent to centering the ditribution on $\bar{x}$.
- We can show that these things are idential with a simulation. The truth is in the confidence interval around the sample mean every time the sample mean is in the confidence interval around the turth. 
- All we've done here is change the centerpoint. This shift means we don't have to know $\mu$ to determine how confident we are about the location of the truth!!!
