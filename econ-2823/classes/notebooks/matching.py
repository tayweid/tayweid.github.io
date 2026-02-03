import numpy as np
from scipy.stats import randint

np.random.seed(seed=917213144)

### GAME LENGTHS
def sgameRand(low,high, term):
    listOut = []
    rv = randint(1,100).rvs()
    listOut = [rv]
    while rv <= term: 
        rv = randint(1,100).rvs()
        listOut = listOut+[rv]
    return listOut

# here's the random draws variable
res={i: [ sgameRand(1,100,80) for i in range(20) ] for i in range(1,4) }

# sum of round lengths by session
[sum([len(val) for val in res[key]]) for key in res.keys() ]


### MATCHING 
import random


def randomMatch(n):
    # Random matching for n pairs
    subjs = [i for i in range(1,2*n+1)]
    random.shuffle(subjs)
    return [frozenset([subjs[i], subjs[-(i+1)]]) for i in range(n)]


def randomSeq(lastMatch):
    # random Matching, with no overlap to the last match
    n=len(lastMatch)
    if n>1:
        outputM = set(lastMatch)
        lastSet = set(lastMatch)
        while len(outputM.intersection(lastSet)) > 0:
            output = randomMatch(n)
            outputM = set(output)
        return output
    else:
        return randomMatch(n)

# Spit out the matchings for an experiment with n pairs and k cycles
def randomExp(n, k):
    lastMatch = randomMatch(n)
    out = [ [list(x) for x in lastMatch] ]
    for j in range(2,k+1):
        lastMatch = randomSeq(lastMatch)
        out = out +  [ [list(x) for x in lastMatch] ]
    return out


# OUTPUT FOR 1/8/9/10/11/12 pairs
expMatch = { 2*n : randomExp(n, 20)  for n in [1,8,9,10,11,12] }