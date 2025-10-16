## Part 3.1 | Random Variables: Data vs Population

### Data is a sample drawn from an unknown population. 

- Measures of centrality and variability
- Sample vs population
- Population is an unknown random variable
- Working with random variables



1. we've spent the first part of the semester focussing on undersanding our data
2. we developed the skillset to develop understanding from data
3. I have some data on the sleep patterns of two groups. which group sleeps longer?
   - well we can see that the distributions of these two groups overlap
   - some in both groups sleep longer than some in the other group
   - but we can compare the means: group A sleeps longer on average
   - but we can also see that there's a lot of overlap
   - in fact the shortest sleeper is in group A
   - this is because there is more variability in group A
   - the variance is larger in group A
4. group A and group B are some individuals sampled from two different counties in the US. what if I were to ask you instead, which county sleeps longer?
   - you can see this is a slightly different question: we're not asking about the data, which we know everything about, we're asking about the population
   - the population here is not just all the individuals living in the two counties at the moment, but all the people who could live in the counties: if we drew everyone from the counties we would still only have a sample not the population
   - the information about the population is what we call a random variable
   - data is a sample drawn from some random variable!
5. we'll use population and random variable interchangably as the thing being measured: sleep time; pdf/pmf is the actual probabilities for each amount of time; observation is the realization of the random variable; and sample is the the collection of observations
6. in this case i know the random variables. I made them up and drew samples from them. 
   - if we know the random variable we can ask many kinds of questions about the population.
   - some examples
7. Python Exercise 3.1 (done here, but notes below)
8. random variables come in many shapes and sizes
   - show the distribution figure
9. but what if we don't know the random variable generating our data?
   - next time!



### Python Exercise 3.1

I generated this sleep data with a computer. I know the population random variable exactly. I have some questions for you about the sleep times in County A.