## Part 5 | Multivariate GLM

- Part 5.1 | Categorical Controls
- Part 5.2 | Numerical Controls
- Part 5.3 | Interactions
- Part 5.4 | Model Selection (Brilliant: maybe do R^2, F-test, choosing variables with mse, etc)

#### Part 5.1 | Categorical Controls

start with the basic gender wage gap: this is important to know. pretty powerful that we can just make this with the tools we have. this kind of skillset has the ability to change the dialogue. 

but we know many things can be related to wages. you are sitting here increasing your earnings potential by educating yourself. does something like education actually show up in the data as being related to wages? Yes!

but does the gender wage gap still show up? 

well we can test it. if i draw a line through the female data will it have a different intercept than if i draw a line through the male data?

we can do this with an indicator variable!



this does two things for us. first it lets us check whether there is a difference between the vertical position of the two lines. Second, it lets us check trends within the two categories.

to illustrate why this second test matters, let me show you an example (simpsons paradox).

a positive relationship can be hidden by multiple negative relationships

#### Part 5.2 | Interactions

this didn't flow well. going from model 1 to model 2 could be much easier by actually showing the model 1 figure right before model 2. also i don't know if the intuition for the non-interacted coefficient being the zero group ONLY WHEN there's an interacted term, i don't know if that came through very clearly.

we spent a lot of time getting set up with Colab today. I wish we had done more of that early on. students are all excited about the projects. i wish we had started after doing scatterplots in part 1. I think they can get started setting up visualizations of their questions before needing the statistical models to test. 



#### Part 5.3 | Numerical Controls

so we've established the gender wage gap is real and present. one hypothesis for where the gender wage gap comes from is mothers leaving the workforce temporarily to have children. you knew I would bring this back to Maxine!

we might wonder whether the gender wage gap is not only due to differences in childrearing decisions, but shows up for two people with the same number of children? 

well you can see in the dataset a column that represents the number of family members in the household. we're going to compare people with the same number of children. How do we do this?

well first we can estimate the relationship between children and wages.

and also the relationship between 

well we could filter for each number of family members and run a separate model for each separately. but this is clunky.

so far we've done everything in two dimensions. instead, we can add another dimension. the general linear model in 3 dimensions is a plane. 