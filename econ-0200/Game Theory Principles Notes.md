## Game Theory Principles Notes

#### Class 3

mob lab PD game

mob lab reverse matching pennies (play this many times to develop social norms)

#### Lecture 5

set up the continuous problem

get to the point where you need to find the max

talk about the slope at this point

talk about how to find a slope of a linear function

talk about how to find the slope of a quadratic

talk about how it's different at different places

then talk about some rules

then do the max

second order condition

#### Rationality Lecture

I've had a lot of excellent questions about rationality assumptions

let's talk about two examples: other regarding preferences and a preference for having the most

this would play out with two levels

start with money 

then talk about indifference

then go to the game

then solve the game

#### HW4

Hi folks,

I published HW4 grading. Take a look and check the solution guide if you need guidance. If the autograder didn't like your formatting, no worries, just hit regrade and we'll give you the credit you earned.

Also I posted solutions to the questions we covered on in the quazi-review session on Friday. Don't hesitate to reach out if you have questions. 

Be thinking about how you might model the deception played by offenses and defenses this evening. We'll start covering it this week.

Taylor

#### Week 7

Hi folks,

I hope your weekend is lovely! 

The past few weeks we've started wrapping up deterministic play. We finished most of the remaining ideas with the relationships between simultaneous games and sequential games. We showed that some games can have both sequential and simultaneous components, and that some sequential games can have NE that are not SPNE. In fact, not all games have NE or SPNE in pure strategies. 

This week in game theory we're going to show one of the cornerstone ideas in Game Theory: Mixed Strategy Nash Equilibrium (MSNE). We're going to start with the intuition, using the ideas of expected value and indifference, then we're going to play some games, and build a solution concept. As it turns out, all games have MSNE even games without pure strategy NE.

Take a skim through chapter 7 before class on Monday.

I've also posted HW 5 and an updated syllabus. Take a look at the calendar. I'm moved the dates for the homework so we don't have due dates right after the MiniExams. The MiniExam dates have not changed.

Yours,

Taylor

#### Lecture 7

expected value

pk game

no ps nash equilibrium

what if I pick left only? the other will know what to do, and I won't like it

what if I roll a die, and go right only if it comes up 6?

what's they're expected value?

talk about summing probabilities to one

they'll play with certainty and I won't like it

what if I flip this, and choose right unless it comes up 6?

again, we can calculate their expected value and see they'll play with certainty

again this isn't good for me

so I can't play in a way that makes them play with certainty

is there another way?

we can make a strategy that is exploitation proof

the opponent's indifference property 

what if we forced them to play randomly

show how we get to 1/2

then show the br graph 

this is very similar to how we solved continuous games, particularly the cournot

this is how she'll play to force the other player to not be able to win with certainty

you can get the action wrong but still have the right beliefs 

in fact, even with correct beliefs about the other player's strategy, both players will be guaranteed to lose sometimes

moblab

then maybe talk about how the payoffs can be whatever our true preferences are

and let's say the striker's favorite player as a child made a game winning pk that went to the left

she wishes to do the same

so the left is actually worth 2 not 1

these have both been zero sum games with no Nash equilibrium

but this idea of mixing works in other contexts too

let's look at a coordination game

let's try to find beliefs that make neither player wish to change their mind after the game is over

if one believes the other will play with certainty, then they should also play with certainty

but if one isn't sure about the other's play, what we call strategic uncertainty, she may play be uncertain herself about what to play

this may lead her to play with uncertainty

these probabilities are both the actual mixtures and the subjective beliefs about the other's play

the player is correct about the other's play

this pair is the mixed strategy equilibrium

this can only happen when the other player is indifferent

these have very undesirable properties

it's a low payoff in this game

you're losing very often

and it's also fragile

any small change in beliefs can break the equilibrium

which is a good thing for the players

so both players might want to break it slightly

#### March 4

remember: we're trying to understand how we might actually play in games. some games are easy. some games are more complicated. like the PK game, many games have no easy solution.

start with a two player version of three player game.

mention that it's zero sum.

showcase the ev model. show the br as a upper shell.

show the br with each step of the upper shell.

this indifference point is the minimum of the other player's expected value. this is good for p2 because this is a zero sum game. this is what we call a stable MSNE: we move toward it and we don't want to move away. 

draw arrows along the upper shell pointing toward the MSNE. 

the interpretation here is that a stable MSNE is one that isn't broken when we make mistakes. 

interior MSNE in zero sum games have this property. 

then add a third action for player 1 that is dominated. show it on the ev graph, that it never will be chosen by player 1, so player 2 need not mix over it. 

eliminate it via IESDS. we're left with mixing over only two.

but what if player 1 would play D in some cases?

change the numbers so that p1 would pick D sometimes. then draw out the upper shell BR. 

we're going to only do this with zero sum games. here, we know that lower is bad for P1 but good for P2.

like with two action games, we cannot play this game in pure strategies.

we have to look at the two points of indifference. let's look at the first one. player 2 is making player 2 indifferent between two actions. but does player 2 like this mixture?

what if we increased the probability on R? would p2 increase or decrease their payoff?

like in the two action game, we move down if we can. the left indifference point is not a MSNE because it has a unilateral deviation. 

the right one is an MSNE because we cannot switch and do better. 

it is stable because we will try to return to it if we make mistakes.

in zero sum games there will only be one. 

this toolset let's us examine sequential games in mixed strategies

#### March 18

I'm going to show you a small patch of sunshine in what has been a rather gloomy area of game theory: cooperation

we've looked at single shot simultaneous move games like the PD

you make a decision at the same time as your rival and observe your payoffs only after the game has ended

but often we observe how our rival has played before playing with them again

sometimes this looks like a couple of rounds

let's say Alice and Bob ...

we can set this repetition up using a game tree

after the first game has ended, we observe how the game was played, then play again

this allows us to condition our future behavior on how our rival played in the past

if our rival played cooperatively, maybe we want to reward them

even though the NE of the stage game is to defect, maybe we know our rival wants to reward cooperation

what should we do?

well this is tough to see

like with sequential games, we can use backward induction

let's look at the last round

what should we do if we have played cooperatively in the previous round, and know our rival will play cooperation?

defect!!

what about if we didn't play cooperatively?

defect!!

our rival knows this too

so then, they have no incentive to try to be cooperative in the last round, because they can do better by defecting too

ok ok, fine, that's the last round, which is strange because it's the last round

but does this matter for the rest of the game?

well yes

so now I know my generally cooperative rival will defect on my in the next round

there is no future to consider after the second to last round

we've pruned off the final round

it doesn't even depend on the second to last round

this makes the second to last round now the last round we need to consider

and when we see it this way, it's like the true last round in that the only thing we can do is play defect

this is gloomy but it's the end of the gloom for today

there's another type of repetition: repeated games which have no predetermined end period

in infinitely repeated games, like repeated games of any kind, players can play contingent strategies, strategies that depend on the behavior in proceeding games

there are so many strategies here that it isn't worth trying to write them out

the contingent strategies that we pay most attention to are called trigger strategies

a player plays cooperatively until their rival defects, then the player applies a punishment

one example is called grim trigger, where the player plays cooperate until the rival defects, and then plays defect forever

another example is called tit-for-tat (TFT), in which the player plays cooperate in the first round, and simply copies what the rival did in the previous round

how might we think about playing this game against a grim rival?

what if we were to play defect in the first round?

we get the extra payoff, but then get zeros forever

we could add all this up to get ...

this is what we call present value

here when we calculate PV, we're assuming we like the future as much as the present

we'll change this in a second

what if we played always cooperate? 

our payoff would be a sequence of cooperative payoffs which is infinitely large

this infinity is kinda strange and makes it hard to compare payoffs that are infinite

for example, let's look at playing an alternating strategy against TFT

in the first round I defect, then play cooperate, then defect, and so on

you can already tell this shouldn't have a present value as high as playing always cooperate against grim, but this one also goes to infinity

we also don't value the future as much as the present

if I gave you the choice to get $100 today or next year, you would choose today

this is for many reasons

one reason is that we aren't always guaranteed that the game will continue, so the possibility of a payoff in the future is worth less

we can 

#### March 20

I want to do grim trigger vs deviation

and I want to do moblab with a live coin

the main things I want is for them to 

\- get a real sense of delta

\- see that the deviation is against a particular strategy

\- have to think through how to play for course credit

start with doing grim trigger to get set up and give them some practice and do it with a coin

talk about how this delta condition is specific to grim

then do moblab 

#### Lecture

something about nuclear war and continuation probability 

we think about regime change in international relations

but if we have a stable rival, the continuation probability is high, and the threat of grim trigger...

the weight of the future is high 

#### Solar Eclipse

although the university reached out to the scheduling coordinator for the sun and the moon, the palenarty bodies did not agree to realign their paths with our existing academic plan. due to this unfortunate scheduling inflexibility of the cosmos, the solar eclipse has been double booked with our class. instead of waiting 20 years, I will be recording that days lecture. that day only, I strongly encourage you to align your calendars with the sun, not the university. 

#### Lectures

start by talking about the family tree of economics ideas, starting with david ricardo, then smith, then condorcet and borda

talk about the french revolution and the american revolution

then about how condorcet and borda weren't able to give as good of answers as smith and so the mechanism of markets has prevailed as a coordination devise in our field and world

but not everything is done well by markets, so we often use other mechanisms 

Al Roth and DA with kidney exchanges and residency matching for example

but the biggest non-market mechanism we talk about as a field is voting

what we're about to do is show why these mechanisms haven't gained as much popularity as the pricing mechanism, but if you're feeling like prices and the systems that accompany them are broken, you might be wondering if voting can offer a way out

but if you're anything like me, you probably also feel like our voting systems in this country are also in need of fixing

we have two unpopular parties, which actually isn't new, even if the unpopularity is stronger than in the past

I'm very comfortable talking about today's politics, but it's truly not as important as what we're about to discuss, and it brings with it emotions that can distract from the core reasons our systems feel broken

so if you'd like to talk about politics, drop by office hours

today, I want to talk about incentives

the first place to start is to think about what happens when we start with two parties and think about mutating a popular third party

could it invade?

the answer is no

unless it is perfectly situated between the two existing parties, it takes voters away from one party over the other

to illustrate this, lets build a model of voting that gives us the median voter theorem

we lay voters out on a line, with the left and the right represeting political preferences

the game goes in two steps

first, the parties decide where to place their platforms: how left and right are their platforms?

well lets think about unilateral deviations...

<do the thing>

second, voters cast their votes simply for their preferred platform

this means they vote for the closest platform

this means parties want to pick the platform that's closest to the middle

this is the principle of minimum differentiation

but we don't see this today

we've actually seen parties become more extreme

one explanation for this still uses the median voter theorem but with primaries

as primaries have become stronger, as we famously removed superdelegates from the democratic nomination process after 2016 which overwhelmingly went for Clinton over Sanders

who is chosen by the primaries is now much more determined by the preferences of party members and not who is most likely to match the preferences of the full electorate

this is the first conclusion: process can matter

this is similar to evolutionary games

you might be wondering: if now that we've moved the parties to the extremes, couldn't there now be more space for a third party to enter in the middle? 

the answer is yes, but it's still difficult to make the case for it to be ESS

unless it's perfectly situated between the two existing parties, it will necessarily take a voter away from their second most preferred party

if the second most preferred party is more likely to win, then the voter should not vote for the third party

if the two parties get too far apart, then a third party could invade from the middle

so both parties are (in theory) tempered by the possibility of mutation and invasion

we haven't seen a successful invasion since before the civil war

this challenge of adding more alternatives is at the heart of why voting is difficult to truly implement for decisions with many alternatives that are not so nicely ordered on a line

so far we've required that people have preferences one a line

we could do this on a plane too

but maybe things aren't as simple as this

we want our social choices to be made from the individual rankings of voters

we don't want to restrict how people's preferences look

we want voters' preferences to be whatever they are

preferences are just rankings

we want to allow people to report rankings without being restricted

this is what we call "unrestricted domain", where instead of putting people on a line, we want them to just say what they like, without any restrictions

one way we've made political decisions with unrestricted domain in this country is plurality voting

Plurality Voting: each voter casts one vote, the alternative with the most votes wins

the incentives that are downstream of these challenges have pushed us toward two parties with plurality voting

if a third party emerges but is small, any voter casting a vote for the third party is "wasting" their vote

so voters should not vote for the third party if they care about the election

and the two major parties care about third parties

the third party could act as a "spoiler", taking votes away from one of the parties to an extent that the major party now loses

major parties therefore have incentives to suppress third parties

let's do a little example

lets say harry, ron, and hermione are painting their gazebo and trying to decide on a color

lets say we have two colors: red and blue

harry: RB

ron: BR

hermione: RB

ginny: BR

neville: RB

luna: RB

fred: BR

george: RB

william: BR

so R wins 5 to 4

but lets say bolstered by this success, harry proposes another color green, which he prefers to red and blue

their preferences are

harry: GRB

ron: BGR

hermione: RGB

ginny: BRG

neville: GRB

luna: RBG

fred: BGR

george: RGB

william: BGR

now B wins 4 to 3 to 2

this is problem

we've added an option that doesn't win but we've changed what does win

the outcome depends on what's on the ballot even if what's on the ballot is not chosen

this violates what we call "independence of irrelevant alternatives (iia)"

a voting mechanism is IIA if adding or removing alternatives that are not chosen does not change the outcome

plurality does not satisfy IIA, which means 

you might think my example is contrived, but it's widely believed this happened in the 1992 and 2000 elections

the most famous one was florida with Al Gore, George Bush, and Ralph Nader

there were so many issues with that election, which we've since fixed

but the big one we have not fixed

Ralph Nader was the third party candidate who's voters tended to have Gore as their second choice

so if Nader had not been in the race, these voters would have gone to Gore

because the election in Florida was so close, and the entire election rested on Florida, these Nader voters could have changed the outcome of the presidential election nationally

some voters who preferred Nader did not vote for Nader because they knew they were throwing their vote away

we call these kinds of voters "strategic" voters because their conditioning their behavior on what everyone else is doing

they don't have a dominant strategy

we'll never know for sure how it would have gone because we don't collect enough data on second choices

but if this were true, Ralph Nader would be considered a "spoiler", which is only possible when election mechanisms like plurality are not IIA

but plurality is monotonic: if a voter adds a vote for A, then A is not less highly ranked

and plurality is non-dictatorial

in social choice theory we define a social choice mechanism, like the plurality, to be dictatorial if there is one voter who always gets their way no matter their preferences or the preferences of others

lets imagine everyone but one voter were to vote for A and one voter were to vote for B

according to plurality voting A will win no matter who was that one voter voting for B

this means it is not dictatorial

plurality is what we call anonymous: every voter counts exactly the same

you could switch the names of two voters and it would not change the election

plurality is also what we neutral: every alternative is treated exactly the same by the mechanism

if everyone were to swap A and B, then the social choice function would also swap A and B

plurality voting is a famously bad voting mechanism

maybe there are better alternatives to plurality

one improvement would be to do a version of instant runoff

we're experimenting with this type of voting here in the US

instead of using plurality alone, we take everyone's votes, take the two highest, and run plurality on these top two

so with our example, we would only look at R and B, of which B would win

this looks better, but there are still many ways this fails IIA that aren't shown in this example

there's another type of similar mechanism called ranked choice voting, which is sort of the darling of the voting community at the moment

some states have started using this, like Maine

instead of taking the top two, we can just repeatedly drop the lowest ranked option

with our example today this looks exactly like instant runoff

but as I'll show in the next lecture, this actually is more complex when we have more than three alterantives

ok this is a lot

isn't the idea just that we want to pick the alternative that's always preferred when we compare each alternative?

maybe we can just run alternatives head to head

this is what Condorcet proposed in the late 1700s, now called Condorcet tournaments

lets do a simplified example from before

lets say harry, ron, and luna are painting their gazebo and trying to decide on a color

their preferences are

harry: GRB

ron: BGR

luna: RBG

<show condorcet cycles>

this is what we call a condorcet cycle

even though the individual preferences are transitive, the pairwise comparisons give us a non-transitive social ordering

a social ordering is what we try to come up with from individual preferences so that we have a ranking of which things society likes better than others

just like how individual preferences are rankings, we want to turn these individual preferences into a ranking that represents everyones preferences all at once

with condorcet cycles we have a social ordering that is not transitive so isn't that helpful

run through spring break lecture from spring 2023

then maybe do arrows proof

#### Lecture

ME5

condorcet paradox and intransitive ordering

transitive group ordering need not arrive from individual group ordering

agenda paradox

let's say one of the members gets appointed as chair and gets to decide which two alternatives get voted on first, and which ends up in the second round of the bracket

each will choose a different order

then do reversal paradox from the textbook

this is so broad that we've studied it since condorcet 

in the 60s Kenneth Arrow proved a famous result 

the proof is too much to do in this class

but we can discuss the result

since then we've looked for ways around this problem 

I have some research in this area

we've looked at different kinds of conditions

one way forward is if voters have nicely ordered preferences

single peaked preferences 

this is what we talked about with the median voter theorem

another way forward is what we call robustness, which is a measure of how often a voting mechanism that satisfies iia, no dictatorship, and unanimity also creates a condorcet paradox

another way through is proposed to use another idea

if I rank three alternatives, the ranking alone doesn't capture how much I care

intensity ranking, as proposed by Donald Saari, is another way through

range voting

approval voting (Kenneth Arrow mentioned this in a podcast before he died)