**Title:** Applying Bayes' Rule with Hypotheses: The Two-Coins Problem

---

**Introduction**

Now that we've covered the basics of Bayes' Rule and worked through some foundational examples, let's dive into a scenario that highlights how Bayes' Rule helps us update our beliefs about hypotheses based on new evidence. This example involves making inferences about which hypothesis is true given the data we observe.

---

**The Two-Coins Problem**

*Imagine you have a box containing two coins:*

- **Coin A**: A fair coin with an equal chance of landing heads or tails (P(Heads) = 0.5).
- **Coin B**: A biased coin that always lands heads (P(Heads) = 1).

*You randomly select one coin from the box (without looking) and flip it three times. All three times, the coin lands on heads.*

**Question:** *Given this outcome, what is the probability that you selected Coin B, the biased coin?*

---

**Setting Up the Hypotheses and Evidence**

First, let's define our hypotheses and the evidence:

- **Hypothesis H₁**: You picked Coin A (the fair coin).
- **Hypothesis H₂**: You picked Coin B (the biased coin).
- **Evidence E**: The coin landed heads three times in a row.

Our goal is to compute **P(H₂ | E)**: the probability that the coin is Coin B given the observed evidence.

---

**Applying Bayes' Rule**

Bayes' Rule states:

$$
P(H_i | E) = \frac{P(E | H_i) \cdot P(H_i)}{P(E)}
$$
Where:
- $ P(H_i | E) $ is the posterior probability of hypothesis $ H_i $ given evidence $ E $.
- $P(E | H_i)$ is the likelihood of observing evidence $E$ if hypothesis $H_i$ is true.
- $P(H_i)$ is the prior probability of hypothesis $H_i$.
- $P(E)$ is the total probability of observing evidence $E$.

---

**Calculating the Priors**

Since you randomly select one of two coins:

- P(H₁) = 0.5
- P(H₂) = 0.5

---

**Calculating the Likelihoods**

- **Likelihood under H₁ (fair coin):**

  Since Coin A is fair, the probability of getting heads on one flip is 0.5. Therefore, the probability of getting three heads in a row is:
$$
  P(E | H₁) = (0.5) \times (0.5) \times (0.5) = (0.5)^3 = 0.125
  $$
  

- **Likelihood under H₂ (biased coin):**

  Since Coin B always lands heads:
  $$
  P(E | H₂) = 1 \times 1 \times 1 = 1^3 = 1
  $$
  

---

**Calculating the Total Probability of the Evidence**

Using the Law of Total Probability:

$$
P(E) = P(E | H₁) \cdot P(H₁) + P(E | H₂) \cdot P(H₂)
$$
Plugging in the values:
$$
P(E) = (0.125 \times 0.5) + (1 \times 0.5) = 0.0625 + 0.5 = 0.5625
$$


---

**Computing the Posterior Probability $P(H₂ | E)$**

Now, apply Bayes' Rule:

$$
P(H₂ | E) = \frac{P(E | H₂) \cdot P(H₂)}{P(E)} = \frac{1 \times 0.5}{0.5625} \approx 0.8889
$$
**Interpretation:**

Given the evidence of three consecutive heads, there is approximately an **88.89%** chance that you picked the biased coin.

---

**Verifying with $P(H₁ | E)$**

For completeness, let's also compute $P(H₁ | E)$:

$$
P(H₁ | E) = \frac{P(E | H₁) \cdot P(H₁)}{P(E)} = \frac{0.125 \times 0.5}{0.5625} \approx 0.1111
$$
This makes sense because $P(H₁ | E) + P(H₂ | E) = 1$, as there are only two possible hypotheses.

---

**Conclusion**

This example illustrates how Bayes' Rule allows us to update our beliefs about which hypothesis is more likely to be true in light of new evidence. Despite both coins having an equal chance of being selected initially, observing three heads in a row significantly increases the probability that you selected the biased coin.

---

**Key Takeaways**

- **Bayes' Rule is essential for updating probabilities when new evidence is available.**
- **Defining clear hypotheses and calculating accurate likelihoods are crucial steps.**
- **Even with equal prior probabilities, the evidence can heavily favor one hypothesis over another.**
- **Understanding the role of the total probability $P(E)$ is vital for correct calculations.**

---

**Questions for Reflection**

1. *How would the posterior probabilities change if you observed four heads in a row instead of three?*
2. *What if Coin B had a 90% chance of landing heads instead of 100%? How would that affect $P(H₂ | E)$?*

---

**Further Exploration**

To deepen your understanding, try modifying the problem:

- **Change the Number of Flips:** What happens to the posterior probabilities if you flip the coin more times?
- **Alter the Bias of Coin B:** Suppose Coin B lands heads with probability 0.9. Recalculate $P(H₂ | E)$.
- **Unequal Priors:** What if you had reason to believe that one coin was more likely to be selected than the other? Adjust $P(H₁)$ and $P(H₂)$ accordingly and see how it affects the outcome.

---

By working through these variations, you'll gain a stronger grasp of how Bayes' Rule operates in different contexts and how sensitive it is to changes in the components of the formula.