## Outline

- We've found the distribution of sample means
- Lets use it!
- We know that 'closeness' of $\bar{x}$ and $\mu$ follows a normal distribution.
- Do a little derivation of why it's $\sigma / \sqrt(n)$
- So if we knew $\sigma$ we could know the probability a sample mean will be close to the true mean
- Lets do this mathematically: find the probability a randomly drawn sample will fall within $\sigma / \sqrt(n)$ of the true mean?
- Lets simulate this.
- This is what we call a confidence interval. We're $P(\bar{x} \in [\mu-\sigma / \sqrt(n), \mu+\sigma / \sqrt(n)])$ confident the sample will be no further than $\sigma / \sqrt(n)$ away from the mean.
- This is what we call a confidence interval.
- But you'll notice a problem: we don't observe $\mu$, so how do we know where to place the center of the normal distribution? 
- Well maybe you've noticed, the central limit theorem tells us about the distribution of $\bar{x}$ around $\mu$, which is mathematically equivalent to the distribution of the 'closeness' of $\bar{x}$ to $\mu$. So it's mathematically equivalent to either talk about the distribution of closeness of $\bar{x}$ and $\mu$ or center the normal distribution on $\bar{x}$.
- But be careful here. The centeral limit theorem doesn't tell us about the distribution of the truth! The truth does have variability. It's fixed. It tells us how close $\bar{x}$ will be to the truth. Which is mathematically equivalent to centering the ditribution on $\bar{x}$.
- We can show that these things are idential with a simulation. The truth is in the confidence interval around the sample mean every time the sample mean is in the confidence interval around the turth. 
- All we've done here is change the centerpoint. This shift means we don't have to know $\mu$ to determine how confident we are about the location of the truth!!!
- But we have one remaining question: how do we know about $\sigma$? We used $\sigma$ to construct the confidence interval. Don't we need to know THAT?
- Well what did we do to not need to know $\mu$? We used $\bar{x}$, the sample equivalent.
- Lets think about using the sample equivalent of $\sigma$, $S$. 
- But just like $\bar{x}$, theres sampling variability of $S$ around $\sigma$.
- Lets simulate this.
- So there's a bit of extra variability in $S$. 
- In turns out that we can systematize this added variability in the t-distribution, which is just like N but with the extra variability built in.
- Show t vs N.
- Lets calculate the area in the tails.
- So this lets us use the information in the sample to make claims about the truth.
- Lets do an example.

---