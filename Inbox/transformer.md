# Transformer Architecture and Attention

Category: AI Fundamentals / Large Language Models

Purpose: Understand how LLMs process language, learn relationships between words, and generate responses.

## What is a Transformer?

A Transformer is a deep learning architecture used to process sequential data such as text. It helps AI models understand relationships between different tokens in a sentence and use those relationships to generate meaningful output.

Before Transformers, many language models used architectures such as RNNs and LSTMs, which processed sequences step by step. Transformers introduced the attention mechanism as a central way to process relationships between tokens.

The Transformer architecture was introduced in the 2017 research paper Attention Is All You Need.

### Simple example

Consider the sentence:

> The boy went to the shop because he needed milk.

As humans, we understand that "he" refers to "the boy."

But the words are separated:

* "The boy" appears at the beginning.

* "He" appears later in the sentence.

To interpret "he" correctly, we need to consider the relationship between different parts of the sentence.

A Transformer uses a mechanism called Attention to learn and process such relationships.

Remember: A Transformer is the overall architecture, while Attention is one of its important components.

## What is Attention?

Attention is a mechanism that allows a model to determine how much information from other tokens is relevant when processing a particular token.

In simple English, Attention helps the model focus on the words that matter for understanding the current word.

### Example: Understanding pronouns

Consider:

> The boy went to the shop because he needed milk.

When processing the token "he", the model can use information from other tokens, including "boy", to build a representation of "he" that reflects the sentence's context.

Conceptually:

```
The boy went to the shop because he needed milk.
    ↑                                       ↑
    └──────── relevant relationship ────────┘
```

The model calculates attention scores between tokens. These scores help determine how much information to take from other tokens.

For example, "boy" may receive a higher attention score than "shop" when processing "he".

These scores are calculated mathematically based on the model's learned parameters and the input.

### Why is Attention important?

Without a mechanism for connecting different parts of a sentence, it would be harder for a model to represent long-distance relationships.

Attention helps models:

* Connect words that are far apart.

* Use surrounding context to interpret ambiguous words.

* Learn grammatical and semantic relationships.

* Build contextual representations of tokens.

Important: Attention does not simply select one word and ignore all others. It can combine information from multiple tokens using different attention weights.

## How does Attention learn relationships?

Attention does not contain manually written rules such as:

```
"If you see he, find the nearest male noun."
```

Instead, the model learns useful patterns during training.

For example, it sees many sentences in which pronouns refer to people or objects mentioned earlier.

During training:

```
Training text
     ↓
Model processes tokens
     ↓
Model predicts the next token
     ↓
Prediction error is calculated
     ↓
Model parameters are adjusted
     ↓
Attention patterns improve over training
```

Over time, the model learns relationships that help it predict and process language.

Key point: Attention scores are not fixed. They depend on the input sentence and the learned parameters of the model.

## How does a Transformer process text?

A simplified Transformer-based LLM processes text through the following stages.

```
Input Text
    ↓
Tokenization
    ↓
Token IDs
    ↓
Token Embeddings
    ↓
Add Positional Information
    ↓
Transformer Layers
    ↓
Contextual Representations
    ↓
Output Layer
    ↓
Next-Token Probabilities
    ↓
Generate Next Token
```

### Tokenization

The input text is divided into tokens.

For example:

```
"I love Java"
      ↓
["I", " love", " Java"]
```

Tokens are the basic units of text processed by the model.

### Token IDs

Each token is mapped to a numerical ID.

```
"I"      → 101
" love"  → 205
" Java"  → 309
```

These numbers are illustrative. Actual token IDs depend on the tokenizer.

### Token Embeddings

Token IDs are used to retrieve learned embedding vectors.

An embedding is a numerical representation of a token.

For example:

```
"Java" → [0.21, -0.73, 0.45, ...]
```

These vectors provide the numerical representations that the Transformer processes.

### Positional Information

Attention alone does not inherently tell the model the original order of tokens.

Consider:

* The dog chased the cat.

* The cat chased the dog.

The words are similar, but their order changes the meaning.

Transformers use positional information so the model can distinguish the positions and order of tokens.

Different Transformer models use different positional encoding techniques.

### Transformer Layers

The input representations pass through multiple Transformer layers.

Each layer typically includes:

* An Attention mechanism

* A Feed-Forward Network

* Residual connections

* Layer normalization

Attention allows tokens to exchange relevant contextual information. The Feed-Forward Network further transforms each token's representation.

By stacking many layers, the model can learn increasingly complex patterns.

## What is Multi-Head Attention?

Multi-Head Attention means using multiple attention mechanisms, called attention heads, in parallel.

Each head can learn different patterns or relationships in the input.

For example, in a sentence, different heads might learn relationships involving:

* Pronouns and their references.

* Subjects and verbs.

* Relationships between nearby words.

* Relationships between distant words.

These are possible learned patterns, not fixed roles assigned to each head.

The outputs from the different heads are combined to create a richer representation.

### Simple mental model

```
Input Tokens
     ↓
 ┌───────┬───────┬───────┐
 │ Head 1│ Head 2│ Head 3│
 └───────┴───────┴───────┘
     ↓
Combine Head Outputs
     ↓
Contextual Representation
```

## Transformer vs. Attention vs. LLM

These terms are related, but they refer to different things.

|
Concept

|

Explanation

|
| --- | --- |
|

Attention

|

A mechanism that calculates relationships between tokens and combines information from them.

|
|

Transformer

|

A neural-network architecture that uses Attention and other components.

|
|

LLM

|

A trained language model that processes and generates language.

|

### Analogy

Think of building a car:

* Transformer: The overall car design.

* Attention: An important component inside the car.

* LLM: The completed, trained system that performs language tasks.

An LLM can use the Transformer architecture, but not every LLM must use a Transformer.

## Transformer, LLM, and RAG — How do they work together?

RAG and Transformers solve different problems.

RAG retrieves relevant information. The LLM processes that information and generates a response.

Example:

An employee asks:

> How many days can I work from home?

The company has an internal HR policy document.

```
                 User Question
                      ↓
                     RAG
                      ↓
           Retrieve HR Policy Chunks
                      ↓
          Add Retrieved Text as Context
                      ↓
              Transformer-Based LLM
                      ↓
             Process Context and Query
                      ↓
               Generate Answer
```

The LLM uses the retrieved company policy to answer the employee's question.

RAG does not replace the Transformer. It provides external information to the language model.

## Next Topic: Query, Key, and Value (Q, K, V)

Query, Key, and Value are the mathematical components used in the Attention mechanism.

A simple way to remember them:

|
Component

|

Meaning

|
| --- | --- |
|

Query (Q)

|

What information is this token looking for?

|
|

Key (K)

|

What information does each token offer for matching?

|
|

Value (V)

|

What information does each token contribute?

|

Attention compares Queries with Keys to calculate attention scores. Those scores are then used to combine Values.

This is the mathematical foundation of how Attention works.

## Quick Revision

* Transformer: Overall neural-network architecture used by many modern LLMs.

* Attention: Helps the model determine which tokens are relevant to one another.

* Context: Surrounding information that helps interpret a token.

* Multi-Head Attention: Multiple attention heads learn different relationships in parallel.

* Token Embeddings: Numerical representations of tokens.

* Positional Information: Helps the model account for token order.

* Feed-Forward Network: Further transforms token representations.

* LLM: A trained model that processes and generates language.

* RAG: Retrieves external information and provides it to an LLM as context.

> Core takeaway: A Transformer uses Attention and other neural-network components to process relationships between tokens, allowing an LLM to build contextual representations and generate language.
