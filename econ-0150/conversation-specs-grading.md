# Conversation: Grade Inflation, Specs Grading, and Assessment Redesign

---

## User

when people complain about grade inflation, what distribution of grades would they ideally want

## Claude

Great question — and one that's more nuanced than most people realize when they invoke the term.

The classic ideal that grade inflation critics have in mind is roughly a **normal distribution centered on C/C+** (around a 2.3–2.5 GPA), which was more or less the empirical reality at many U.S. universities through the 1960s. In that world:

- A's are genuinely rare — reserved for exceptional work, maybe the top 10–15% of students.
- B's represent clearly above-average performance.
- C means "satisfactory" or "meeting expectations" — and most students land here.
- D's and F's occupy the lower tail, representing substandard and failing work respectively.

So the complaint is essentially that the distribution has **shifted rightward and compressed**. The modal grade at many institutions is now an A or A-, the mean GPA is often above 3.3, and the lower tail has nearly vanished. The distribution has gone from roughly bell-shaped to heavily left-skewed.

That said, there are a few layers worth distinguishing:

**The "standards" argument** is that grades should reflect fixed, absolute benchmarks of mastery, and if you're giving 40% of students A's, you've either lowered the bar or the word "A" has lost informational content. This is the most common complaint.

**The "signaling" argument** is more economic — grades are supposed to help employers and graduate schools discriminate among candidates, and a compressed distribution destroys the signal. From this perspective, you don't necessarily care whether the distribution is normal; you care that it has enough **variance** to be informative. Even a uniform distribution would be more useful than one where 70% of students get A's.

**The "effort incentive" argument** says that if a B+ is effectively the floor, students face weak marginal incentives to push toward excellence, since the grade payoff to extra effort is minimal.

The counterarguments are worth knowing too: students today may genuinely be better prepared (selection effects, especially at selective schools), the shift toward evaluating mastery rather than ranking on a curve is arguably more pedagogically sound, and C-centered grading was itself partly an arbitrary convention rather than some natural law.

From a data analysis standpoint, you might find it interesting that the empirical work on this (Stuart Rojstaczer's gradeinflation.com data, for instance) shows the shift has been remarkably steady — about 0.1 GPA points per decade since the Vietnam War era, when draft deferments first created institutional pressure to inflate. So it's not even a sudden regime change; it's a slow, persistent drift that compounds over half a century.

---

## User

I do think it's important to make good grades meaningful. and I think it's right that the meaningfulness is based on student competency. and i think it should be possible for everyone to get an A if everyone earns it, no distribution. but that's hard to do, being consistent semester to semester. and if we don't show the variation in good vs very good, I think that's a problem too. any ideas for how to make things feel better?

## Claude

This is a really thoughtful framing — you're basically saying you want criterion-referenced grading (not norm-referenced), but you're worried about two practical problems: ceiling compression and drift. Here are some ideas, roughly from lighter-touch to more structural:

**Raise the ceiling instead of lowering the floor.** If a lot of students are clustering at A, the problem might not be that the A is too easy — it might be that you're not giving them enough room to show what exceptional looks like. Adding a challenging integrative component (a capstone analysis, an open-ended data project where they have to make genuine analytical decisions) can create natural separation at the top without punishing anyone. The routine competencies get you to B+; the ability to think originally with the tools gets you the A.

**Decompose the grade into visible competencies.** Specs grading (Linda Nilson's framework) is built almost exactly for your values. You define discrete skills — can you reshape a dataframe, can you choose an appropriate visualization, can you interpret a coefficient — and students demonstrate mastery of each on a satisfactory/not-yet basis. The letter grade maps to how many competency bundles they complete, with higher grades requiring harder bundles. Everyone *can* get an A, the standards are fixed and legible, and it's naturally consistent across semesters because the specs don't drift the way point totals do. For a course like yours this could work really well since data analysis skills decompose cleanly.

**Anchor with exemplars.** One reason standards drift is that your internal sense of "B+ work" recalibrates unconsciously as the pool changes. Keeping a small library of anonymized student work from past semesters — this is what an A analysis looks like, this is what a B looks like — gives you a stable reference point. It also helps students understand the standard before they submit, which is good pedagogy on its own.

**Use plus/minus seriously and tie it to Bloom's levels.** If you're not already, giving yourself the full A/A-/B+/B/B- range and explicitly defining what separates them in terms of cognitive depth (reproducing a technique vs. selecting the right technique vs. critiquing a technique) gives you six meaningfully different grades in the "good to excellent" range. That's a lot of signal even if nobody gets below a B-.

**Separate mastery from distinction.** One option that sidesteps the whole problem: give a mastery grade (meets standards or doesn't, which determines the base letter) and then a separate portfolio-based distinction for work that shows genuine analytical sophistication. This is basically how honors theses work, scaled down. It lets you say "everyone met the bar" without pretending all the work was equivalent.

The meta-point is that the tension you're feeling comes from trying to pack too much information into a single letter. Any time you can add a dimension — whether it's specs vs. bundles, mastery vs. distinction, or routine vs. integrative — you relieve the pressure on that one symbol to do everything at once.

---

## User

say more about specs grading

## Claude

Specs grading comes from Linda Nilson's *Specifications Grading* (2015), and the core insight is almost embarrassingly simple: instead of scoring student work on a points continuum and hoping the numbers add up to something meaningful, you define in advance exactly what "satisfactory" looks like for each assignment, and then you grade pass/not-yet on that basis.

**The basic architecture:**

You break your course into a set of competency bundles — Nilson calls them "modules" but think of them as clusters of related skills. For a course like yours, these might be something like:

- Data wrangling (filtering, reshaping, merging with pandas)
- Univariate visualization and description
- Bivariate relationships and correlation
- Regression fundamentals
- Communicating analytical findings

Each bundle has one or more assignments attached to it, and each assignment has a spec — a checklist of concrete criteria that define satisfactory work. Not a rubric with a 1–5 scale on each dimension, but a binary: does the work meet every criterion on the list, or doesn't it? If it meets the spec, it passes. If it doesn't, the student revises and resubmits.

**How letter grades emerge:**

The grade maps to how many bundles a student completes and at what level of difficulty. You build a menu, something like:

- **A:** Complete all five bundles including the advanced-tier assignments in each
- **B:** Complete all five bundles at the standard tier
- **C:** Complete four of five bundles at the standard tier
- **D:** Complete three of five bundles

This is where the "everyone can earn an A" principle lives naturally. There's no curve, no scarcity. But the A requires genuinely harder work — not just more volume, but higher cognitive demand. The advanced tier in a visualization bundle might ask students to critique a published visualization and redesign it with justified choices, whereas the standard tier asks them to produce a correct chart from a given specification.

**The revision mechanism is key.**

The pass/not-yet system only works if students get meaningful opportunities to revise. Nilson recommends using a token system — every student starts the semester with a fixed number of tokens (say, three or four), and they can spend a token to get a second attempt at an assignment that didn't meet spec. This is elegant because it solves several problems at once: it makes the high standard feel fair rather than punitive, it builds in the learning-from-failure loop that actually develops competency, and the limited supply of tokens teaches students to manage a scarce resource and put in serious effort on first attempts.

**Why it solves your specific concerns:**

*Consistency across semesters:* The specs are written documents. They don't drift the way your subjective sense of an 87 vs. an 83 does. If the spec says "the visualization must include axis labels, a title, an appropriate chart type for the variable types involved, and a written interpretation of the main pattern in two to three sentences," that's the same bar in spring 2026 and fall 2028.

*Ceiling compression:* The tiered bundle structure creates natural separation. Students who do the standard work and students who do the advanced work are in different grade categories, and the distinction is based on demonstrated capability rather than point accumulation.

*Meaningful A's:* Because the advanced tier requires genuine analytical thinking — not just executing procedures but making and defending choices — the A really does mean something. And because it's criterion-referenced, a semester where every student earns an A is a triumph rather than a sign of inflation.

**The practical challenges to be honest about:**

Writing good specs is hard upfront work. You have to be precise enough that grading is nearly mechanical (which is the whole point — it should take you *less* time to grade, not more), but not so prescriptive that you kill creativity. For data analysis assignments, the sweet spot is usually specifying the technical requirements tightly while leaving the interpretive components open-ended with a clear minimum threshold.

The other challenge is student buy-in at the start. Students are deeply conditioned to think in points, and the first few weeks can feel disorienting. Being very transparent about the philosophy — "I want your grade to mean something real about what you can do" — helps a lot, especially with a group that's going to enter a job market where data skills actually matter.

If you're interested in exploring this further, Robert Talbert has written extensively about implementing specs grading in practice (his blog and his book *Grading for Growth* with David Clark), and his examples tend to be more concrete and implementation-focused than Nilson's original, which is more of a theoretical framework.

---

## User

just bought the book

## Claude

Nice — I think you'll find it clicks fast given how naturally your course content breaks into discrete skills. If you start sketching out bundles or specs as you read, I'm happy to help you workshop them.

---

## User

I'm already using points this semester but I think it's possible to map points to competencies

## Claude

Absolutely — and that's probably the smartest way to transition anyway rather than rebuilding everything from scratch mid-semester.

The basic move is to look at your existing assignments and ask: what skill is this actually testing? If you have, say, a homework where students wrangle a messy dataset and produce a visualization, that's evidence of competency in two bundles even though it lives in your gradebook as a single point value. You're just making the latent structure explicit.

One concrete approach: go through your remaining assignments and tag each one (or each part of one) with the competency it maps to. Then at the end of the semester, you can look at each student's profile not just as "they got 847 out of 1000 points" but as "they consistently demonstrated strong data wrangling skills, solid visualization instincts, but shaky regression interpretation." Even if the letter grade still comes from the point total this semester, you've done the analytical work to know what your bundles are and whether your assignments actually cover them.

That exercise also tends to reveal gaps — you might find that you have eight assignments testing wrangling but only one that really tests whether students can choose the right analytical approach for a question. That's useful information for redesigning next semester even if you don't change anything right now.

The other thing it sets you up for is writing the specs. Once you know which skill each assignment targets, you can look at the work that earned full points and ask what specifically made it satisfactory. Those patterns become your specs.

---

## User

if you were to look at my curriculum, would that be enough to plan out the competencies according to Nilson?

## Claude

It would be a great start — I could map out a first draft of competency bundles based on the topics and progression, and then you'd refine it based on what you actually emphasize and what you've seen students struggle with.

If you share your syllabus, schedule, or assignment list (whatever you have — even a Quarto file with your lecture topics), I can take a pass at:

- Identifying the natural skill clusters
- Proposing a tiered structure (standard vs. advanced) for each bundle
- Flagging where your current assignments already map cleanly and where there might be gaps

The main thing I wouldn't be able to see from the curriculum alone is what your implicit standards are — the difference between work you think of as "this student really gets it" versus "they followed the steps but couldn't adapt." That's the part you'd need to layer in from your grading experience. But having the skeleton to react to is a lot easier than building it from nothing.

Want to share what you've got?

---

## User

tomorrow I will. how do people put down on paper how to make those judgements?

## Claude

This is the hard part of the whole enterprise — externalizing tacit expert judgment. A few approaches people use:

**Contrasting exemplars.** You take a piece of student work you'd grade highly and one that's merely adequate, put them side by side, and force yourself to articulate *what specifically* makes one better. Not "this one is more sophisticated" but "this one noticed that the outlier was driving the correlation and investigated it, while this one just reported the r value." The concrete differences that emerge from that comparison become your criteria. This is essentially what you'd do with the exemplar library I mentioned earlier, but now you're mining it for language rather than just using it as a reference.

**The "what would make me hand this back" test.** Instead of trying to describe excellence (which is hard), describe the minimum. Look at an assignment and ask: what would a student have to get wrong or omit for me to say "this isn't there yet, revise it"? That's your spec. Missing axis labels, wrong chart type for the data, interpretation that contradicts what the visualization shows, code that runs but on the wrong subset of data. These tend to be much easier to articulate than positive quality, and for specs grading they're actually what you need — the pass/not-yet threshold.

**Bloom's taxonomy as a scaffold.** The reason it's hard to articulate the difference between good and great is that the difference is usually about cognitive level, and we don't naturally think in those terms. But if you force yourself to use the framework — can they *reproduce* a technique, can they *select* the right technique for a new situation, can they *evaluate* whether a technique was appropriate — the tiers almost write themselves. Your standard tier is "apply this method correctly to a structured problem." Your advanced tier is "given an ambiguous question and a messy dataset, decide what to do and justify why."

**Think-aloud protocols with yourself.** Literally grade a few assignments out loud — narrate what you're noticing, what's making you confident or hesitant about the quality. Record yourself or jot notes as you go. People who study expert judgment find that experts often can't state their criteria in the abstract but can articulate them fluently when they're reacting to a specific case. You're using the concrete work to pull the tacit knowledge out.

**Peer calibration.** If you have a TA or a colleague who also teaches data analysis, grade a few pieces of work independently and then compare. The disagreements are where the real learning happens — they force you to say "I marked this down because..." and discover what you actually value. Even without a colleague, imagining how you'd defend a grade to a student who questioned it surfaces the same reasoning.

The honest reality is that this is iterative. Your first draft of specs will be imperfect — too vague in some places, too rigid in others. You'll discover the problems when you try to apply them and hit a case where the spec says pass but your gut says not yet, or vice versa. That gap between the written spec and your judgment is information — it tells you the spec needs revision. Nilson and Talbert both emphasize that the specs are living documents, especially in the first semester you use them.

---

## User

what is blooms taxonomy?

## Claude

Bloom's taxonomy is a framework for categorizing what we're actually asking students to do when we give them a task. It was originally developed by Benjamin Bloom and colleagues in 1956, then revised in 2001 by Anderson and Krathwohl. The revised version is what most people use now.

It organizes cognitive tasks into six levels, roughly from least to most demanding:

**Remember** — retrieve facts or definitions. "What is the mean?" A student can answer this by memorizing.

**Understand** — explain or paraphrase a concept. "Explain in your own words what a p-value represents." They have to have internalized it enough to restate it, not just recall a formula.

**Apply** — use a method in a straightforward situation. "Here's a dataset, compute the correlation coefficient." They know the procedure and can execute it when told to.

**Analyze** — break a problem into parts and examine relationships. "Here are two variables that are correlated — what might explain this relationship, and what would you need to investigate before drawing a causal conclusion?" Now they're reasoning about structure rather than following steps.

**Evaluate** — make and defend judgments. "Here's a published visualization from the New York Times. Is this an effective and honest representation of the data? Why or why not?" They need criteria, they need to apply those criteria, and they need to justify their assessment.

**Create** — produce something new by synthesizing what they know. "Here's a policy question and three datasets. Design an analysis that would help inform the answer." They're making choices about what to do, not being told what to do.

The reason it matters for what you're thinking about is that most intro courses unintentionally cluster assignments at the Apply level — here's a dataset, do this technique, report the number. That's fine for building foundational skills, but it means you have very little room to distinguish between a student who can follow recipes and a student who actually thinks like an analyst. The taxonomy gives you a vocabulary for deliberately designing tasks at different levels, which maps directly onto the standard-vs-advanced tier structure in specs grading.

For your course specifically, the taxonomy might help you see that a student who can produce a correct seaborn plot when told what to plot (Apply) is demonstrably different from a student who can look at a new dataset and decide what's worth visualizing and why (Analyze/Create), even though both students "know matplotlib."

---

## User

so what level is "which visualization would you use for this variable?"

## Claude

It depends on how much ambiguity is in the question, which is actually what makes it a good example for seeing how the levels shade into each other.

If the question is "you have a single categorical variable with five categories, which visualization would you use?" — that's mostly **Apply**. There's a lookup table in the student's head (categorical variable → bar chart) and they're matching the situation to the rule. It feels like a choice but there's really only one reasonable answer.

If the question is "you have a continuous variable with some extreme outliers and you want to communicate its distribution to a general audience, what do you use?" — now it's pushing into **Analyze**, because they have to weigh competing considerations. A histogram shows the shape but might obscure the outliers depending on bin width. A box plot makes the outliers visible but loses the shape detail. They have to think about what matters for this context.

And if you add "...and justify your choice" — that's **Evaluate**, because now they need criteria and they need to argue that their criteria are the right ones for the situation.

So the same stem question can live at three different levels depending on how constrained the scenario is and whether you ask them to defend the choice. That's actually a useful design principle — you can take a single question format your students are already comfortable with and dial the cognitive demand up or down by adjusting the ambiguity and requiring justification. The standard tier gives them the clean case, the advanced tier gives them the messy one.

---

## User

what if I just give them the variable

## Claude

That's the interesting case. You haven't told them it's categorical or continuous or anything — they have to look at the actual data and figure that out first. So now there are two cognitive steps: classify the variable, then select the visualization.

If the variable is unambiguous — clearly a list of city names, clearly a column of decimal numbers — the classification is easy and the whole thing stays pretty close to Apply. They look, they recognize, they match to a rule.

But in practice, real data is full of cases where that first step isn't obvious. A variable coded as integers 1 through 5 — is that numeric or ordinal? A variable like zip code that's technically a number but semantically a category. Income recorded in brackets. Age recorded as a continuous measure versus age groups. The moment the student has to make a *decision* about what kind of variable they're looking at, they're doing genuine analysis, because the classification requires judgment and that judgment shapes everything downstream.

So the pedagogical move you're implicitly describing is really smart — by not pre-digesting the variable for them, you're forcing them to do the part that actually matters in real analysis. Anyone can pick a chart type from a decision tree. The hard part is knowing what you're looking at in the first place. And that maps nicely to a tier distinction: the standard version tells them the variable type and asks them to choose a chart, the advanced version just hands them the column and says go.

---

## User

right. the way I've been setting up my exams is like this. I give them a dataset and ask them to visualize it.

## Claude

That's doing a lot of work in a single prompt. The student has to figure out what variables are in the dataset, what types they are, what relationships might be interesting, choose a visualization that's appropriate, and then actually produce it. You've collapsed Remember through Analyze (and maybe into Create) into one open-ended task.

The challenge is that when the prompt is that open, it becomes harder for you to tell *where* a student fell short. If someone turns in a bad chart, is it because they misidentified the variable type? Picked the wrong chart for the right reason? Picked the right chart but executed it poorly? Didn't understand what was interesting in the data? Each of those is a different competency failing, but the single artifact — the chart — blends them all together.

That's actually where specs grading could help you a lot, because you could decompose the task into the implicit steps and assess each one. Something like:

- Correctly identify the variable type(s) — pass/not yet
- Choose an appropriate chart type and justify the choice — pass/not yet
- Produce a technically correct and readable visualization — pass/not yet
- Interpret the main pattern the visualization reveals — pass/not yet

You don't have to change the exam prompt at all. You're still handing them a dataset and saying "visualize it." But now you and the student both know what you're actually looking for, and a student who nails the interpretation but has sloppy axis labels gets different feedback than one who produces a beautiful chart of the wrong thing.

Does the exam ask them to explain their choices, or just produce the visualization?

---

## User

I don't usually ask for explanation. for some reason I lean hard against it. like it's hard to grade.

you mentioned breaking out the question into sub parts to identify where their thing breaks down. how do you assign partial credit with that?

## Claude

Your instinct against explanation is worth taking seriously — student explanations in intro courses are often painful to read and genuinely hard to evaluate consistently. "I chose a bar chart because it seemed right" doesn't tell you anything, and distinguishing between a mediocre explanation and a good one is exactly the kind of subjective judgment that makes grading feel arbitrary. So your resistance isn't laziness, it's a legitimate concern about reliability.

But here's the thing — the decomposition approach basically replaces the need for explanation with something better. If you break the task into subparts, the student's *choices* at each step reveal their thinking without them having to narrate it. If they correctly identified a categorical variable and then produced a histogram, you can see exactly where the reasoning broke down. The work itself is the explanation.

And that's where partial credit gets interesting. In a traditional points system, you'd look at a flawed visualization and try to decide: is this worth 7 out of 10? 6? That's agonizing because you're collapsing multiple dimensions of quality into one number. But if you've decomposed the task into four components — variable identification, chart selection, execution, interpretation — then partial credit is just "you passed three of four." A student who identifies the variables correctly, picks an appropriate chart, executes it cleanly, but writes a wrong interpretation gets credit for what they demonstrated and a clear signal about what to work on.

That's actually more generous *and* more rigorous than points. In a points system, a wrong interpretation might cost 2 points out of 10, which feels arbitrary. In the decomposed version, they clearly met three competencies and missed one. No ambiguity about what happened or how to improve.

The tricky design question is whether the components are independent or sequential. If someone misidentifies the variable type, their chart selection is going to be wrong *as a consequence*, not because they don't understand chart selection. You have to decide: do you evaluate chart selection relative to the variable type they identified, or relative to the actual variable type? The more forgiving approach — evaluating each step given the previous step's output — means a student who makes one early mistake doesn't cascade into failing everything. That feels right for an intro course.

---

## User

but what if they do the first two right, the third wrong, then the fourth right?

## Claude

That's a genuinely interesting case because it tells you something important about the student. They know what the variable is, they know the right chart, they botched the production, but they still understood the underlying pattern in the data. That's a student who thinks like an analyst but has a technical skill gap — probably the opposite of the student who produces a flawless chart but writes a nonsensical interpretation.

In a points system, those two students might get the same score, which is a real loss of information.

But your question is exposing a deeper issue: what is component 4 actually asking? Is the student interpreting *their chart*, or interpreting *the data*? If their chart is wrong but their interpretation is right, either they interpreted the data directly (which means the chart was irrelevant to their process) or they interpreted a broken chart and happened to get lucky.

You'd need to decide what you actually care about. If the goal is "can you read a visualization and extract meaning," then the interpretation should be of the chart they produced — and if the chart is wrong, a correct interpretation of a wrong chart is arguably the impressive move. If the goal is "do you understand what's happening in this data," then it's fine to give credit for a right answer regardless of the chart quality.

This is one of those places where the decomposition forces you to get clear about what you're actually teaching. Which is uncomfortable in the moment but is exactly the work that makes the specs solid. What do you think you care about more — can they read a chart, or can they understand data?

---

## User

hhmm not sure that's a clear answer

## Claude

Yeah, that's fair — I drew a false distinction. The whole point of your course is that visualization *is how* you understand data. They're not separate skills, they're the same skill at different stages. So asking which you care about more doesn't actually help.

Let me back up to the real problem. You're worried about the case where the component scores paint an incoherent picture of the student. And that's a legitimate concern because it suggests the decomposition might be carving the task at the wrong joints.

One possibility is that four components is too many for a single task. Maybe the natural unit isn't four independent skills but two: **can you set up the right analysis** (variable identification plus chart selection) and **can you execute and make sense of it** (production plus interpretation). Those two clusters are more internally coherent — the first is about analytical thinking, the second is about technical follow-through. A student who gets the first right and the second wrong is a recognizable type. So is the reverse. And the weird interleaving problem mostly disappears because you're not trying to give independent credit to things that aren't actually independent.

The other possibility is that the decomposition is fine but you shouldn't expect every combination to occur. Grading systems don't need to handle every logical possibility gracefully — they need to handle the cases that actually show up. The right-wrong-right pattern might be rare enough that when it does happen, you just look at it and make a judgment call. That's not a failure of the system, that's the system correctly telling you "this student is weird, use your brain."

Which of those feels closer to useful?

---

## User

not sure. what about first two right, third wrong, fourth wrong but follows from the wrong third?

## Claude

That's the easy case, honestly. That student made one mistake. The interpretation is wrong relative to the data, but it's correct reasoning applied to a flawed chart. If you penalize them on both components three and four, you're double-counting a single error.

And this is exactly why I think the two-cluster version might be the right cut. Setup (variable ID + chart choice) and execution (production + interpretation) — that student gets the first cluster and misses the second, which accurately reflects what happened: they knew what to do but fumbled doing it. One mistake, one penalty.

But notice what just happened in this conversation. You pushed on the four-component model with specific cases, and the edge cases kept revealing that components three and four aren't really independent. That's not a problem — that's the decomposition telling you where the real joints are. You've been doing exactly the kind of reasoning that produces good specs: propose a structure, stress-test it with cases, revise.

The question is whether components one and two are actually independent of each other either. Could a student correctly identify a variable as categorical but then choose a histogram? That would suggest they know terminology but don't actually understand what it implies. Or does getting the variable type right almost always lead to a reasonable chart choice? If those two are tightly coupled in practice, maybe the whole task is really just one competency — *can you go from raw data to a meaningful visualization* — and partial credit is the wrong frame entirely. It's pass/not yet on the whole thing, and the subcomponents are just diagnostic feedback rather than separate scores.

---

## User

yeah students dont usually have a lot of issues with diagraming data

## Claude

So the mechanical part — identify variable, pick chart, produce it — is basically one thing and most students can do it. Which means all that decomposition work we just did was slicing up the part that doesn't need slicing.

The real question is what *do* they struggle with? If making the chart is easy, then when you look at exam submissions and think "this one is clearly better than that one," what are you actually seeing? Is it that the stronger student chose a more interesting variable or relationship to visualize? That their interpretation goes deeper? That they noticed something subtle in the data?

Because that would mean the competency your course is really trying to develop isn't "can you make a chart" — it's something more like "can you look at data and find something worth saying." And that's a much harder thing to write specs for, which might be why you lean against asking for explanation. The explanation is where that skill would become visible, but it's also where the grading gets subjective.

What does a strong exam submission look like compared to a weak one, assuming both students made technically correct charts?

---

## User

well in the past it's been easy enough that it's hard to tell the difference. so I'm trying to make it a better assessment. it's sort of like everyone in my class gets it.

## Claude

So we've come full circle. The grade distribution in your class isn't really an inflation problem — it's a ceiling problem. The assessment isn't reaching high enough to reveal the variation that exists. Everyone looks the same because the task isn't hard enough to show the differences.

And that reframes the whole specs grading question. You don't need to decompose the existing task into finer components — you need a harder task. The current one is establishing a floor, which is valuable, but it's the floor.

The interesting question is what "harder" means for your course. It's probably not more complex data wrangling or fancier chart types — that's just more Apply. The jump is something like: here's a dataset with five variables, and here's a question someone actually wants answered. Now make choices. Which variables matter? What relationships should you explore? What does the visualization reveal, and what doesn't it tell you? What would you look at next?

That's where you'd start seeing real separation, because it requires judgment that can't be pattern-matched from lecture examples. And it's also where explanation becomes unavoidable — not "explain why you chose a bar chart" (which is boring and obvious) but "explain what you found and why it matters" (which is the actual skill of an analyst).

Does that feel like where you want to push, or does that feel like a different course than the one you're teaching?

---

## User

yeah that's exactly it.
