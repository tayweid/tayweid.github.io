## Part 3.2 | Central Limit Theorem

### Why we don't need to know the population random variable.



1. so we don't know the distribution of the random variable
2. but we can take a sample and look at it's shape
3. you're going to help me collect data this class: open your exercise notebook and get a single observation and lets see what the distribution looks like
4. its hard to tell. this is very common. you'll see a distribution and not necessarily know what shape it takes on.
5. here's another one you might be more familiar with. use die rolls here. 
6. next i want you to collect a sample of size 2 and give me the sum
7. you're each giving me a different number. why? what's going on here?
8. why do you think they're getting a spike at 7? have you ever rolled two dice? there are so many ways to add up the two dice to equal 7 and only one to add up to 2 or 12. 
9. instead i want you to calculate the means. it doesn't change anything about the distribution but makes it easier for us to compare the shape as we increase the size. what do you notice about the distribution of sample means as we move to a sample size of 5?
10. why do you think this is happening?
11. i'm going to show you what happens when i keep increasing the sample size. i'm also going to overlay each figure with a distribution that we'll talk about in a second. 
12. when the sample size is small, the distribution of the sample means is very spread out. as we increase the sample size the distribution of the sample means gets more concentrated and it looks like that probability function i've overlayed is looking like a better and better guess of the distribution of sample means.
13. what is that distribution you ask? that's a normal distribution centered on the population mean with a standard deviation equal to the population standard deviation over the square root of the sample size, the standard error!
14. this is an amazing and general result.
15. we can even do it with stranger distributions! lets go through another one.
16. with very few restrictions, the distribution of the sample mean approaches a normal distribution centered on the truth with a standard deviation equal to the standard error. 
17. it does not equal a normal; it gets tighter as the sample size increases; we need the sample to be iid; if the sample is small we need the distribution of the population to be normal or symmetric. 



- exercise 3.2 have students each generate sample with different samples sizes, then i'll collect their sample means and plot them, then later i'll have them generate 10,000 of their own and plot them with different sample sizes
- i want to talk about the actual distribution this is generating which means getting into standard errors
- maybe there's a way to define a function that's not easily viewable to them that we can work with



1. we will only ever see a sample of a population. even with the census, we're taking a sample - no way to know every possible census we could have taken, there's still variability in the way the world could go
2. the sample is a subset (repeated draws) of the population
3. the population follows a distribution
4. a sample is just repeated realizations of a random variable
5. as we talked about before, if we know the distribution, our life is simple. we can measure whatever we like. how many people have ages above 50? what's the probability a randomly drawn person will be younger than 30? what's the probability a randomly drawn person will have an extreme age (under 10, above 90)? what is the average age in the population? we can simulate an answer by repeated sampling or we can use the mathematical properties of the distribution to integrate under the curve. and we could do this for any distribution we'd like.
6. but in practice we NEVER know the distribution
7. so what do we do? how would we answer the question: is the average age in pittsburgh greater than 45? can we answer it without asking everyone and without knowing the true distribution of ages?

8. yes. lets run a simulation. i have an unknown distribution. lets take repeated samples. 
9. we can look at the distribution of one sample, show the mean, and compare it to 45. 
10. what happens if we do this a bunch of times? well sometimes we get True and sometimes we get False. so which is it?
11. well, how comfortable are we being wrong? like, with the question at hand and the data, it looks like sometimes my guess is correct and sometimes its not. 
12. we can be less wrong if we increase the sample size - if i do repeated samples, i can see that i'm less wrong - so if I draw once, i'm going to be wrong with a lower probability
13. so the distribution of sample means has some known properties.
14. it turns out we know exactly THIS distribution - do a bit of derivation of the CLT
15. then show that the CLT estimate gives the same conclusion as doing a bunch of sampling
16. it's mathematically identical to move the confidence interval from the truth to the sample mean, and show that we draw the same conclusions
17. so we don't even need to know anything about the underlying population? thats right! this is the most unhearalded idea in modern science. we can say so much while starting with so little.
18. then do a t-test using regression, connecting the p-value to the number of times we got the wrong answer
19. there are lots of other ways to do (or explain) this, but they all mean the same thing: the central limit theorem, the sample mean follows a normal distribution with some standard deviation. but in practice we don't know the standard deviation. using the standard deviation of the sample introduces additional variability, which is captured in the t-distribution.