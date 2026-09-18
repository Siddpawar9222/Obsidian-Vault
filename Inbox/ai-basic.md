# Evolution of Artificial Intelligence (AI)

## What is Artificial Intelligence?

Artificial Intelligence (AI) is a technology that enables computers to perform tasks that normally require human intelligence, such as learning, reasoning, understanding language, and making decisions.

AI has evolved from systems that follow predefined rules to systems that can learn from data, generate content, and perform tasks using tools.

Important: These are different AI approaches, not strict stages where each new one completely replaces the previous one.

## Rule-Based (Convential) AI

Definition: Rule-Based AI makes decisions using predefined rules written by developers.

It follows the logic: `IF condition THEN action`.

Example: Fraud Detection

```
IF transaction amount > ₹1,00,000
THEN flag transaction as suspicious
```

Limitations:

* Requires humans to define and update rules.

* Cannot automatically learn new patterns.

* Struggles with complex situations.

Why Machine Learning? To enable systems to learn patterns from data instead of depending only on manually written rules.

## Machine Learning (ML)

Definition: Machine Learning is a subset of AI where computers learn patterns from data and use them to make predictions or decisions.

Instead of writing every rule, developers provide historical data to train a model.

Example: Fraud Detection

A model learns from past transactions labeled as fraudulent or legitimate and predicts whether a new transaction may be fraudulent.

Limitations:

* Requires good-quality training data.

* Can struggle with changing patterns.

* Often designed for specific tasks.

Why Deep Learning? To learn more complex patterns from large amounts of data, especially images, audio, and language.

## Deep Learning (DL)

Definition: Deep Learning is a subset of Machine Learning that uses neural networks with multiple layers to learn complex patterns.

The layers learn different levels of features from data.

Example: Netflix Recommendations

Deep learning can help recommendation systems learn patterns in users' viewing behavior and recommend content they may enjoy.

Limitations:

* Can require large datasets and computing power.

* Training can be expensive.

* Models can be difficult to interpret.

Why Generative AI? To move beyond predicting or classifying data and enable systems to generate new content.

## Generative AI

Definition: Generative AI creates new content based on patterns learned during training.

It can generate text, images, audio, video, and computer code.

Example: ChatGPT

An LLM (Large Language Model) can explain Java concepts, generate code, summarize documents, and answer questions.

LLMs generate text by predicting the next token based on the context.

Limitations:

* Can generate incorrect information (hallucinations).

* May lack access to current or private data.

* Generating an answer does not mean completing a real-world task.

Why Agentic AI? To enable AI systems to use tools, take actions, and work through multiple steps toward a goal.

## Agentic AI

Definition: Agentic AI refers to systems that use AI models, tools, and feedback to work toward a goal.

An agent can decide what action to take, observe the result, and choose the next action.

Common components:

* LLM: Understands requests and helps decide actions.

* Tools: APIs, databases, code execution, and other external capabilities.

* Memory: Stores useful information or task progress.

* RAG: Retrieves relevant external information for the LLM.

* Orchestration: Coordinates the workflow.

Example: AI Customer Support Agent

An AI agent can retrieve a customer's ticket, check company policies, escalate the ticket through an authorized API, and explain the result.

Limitations:

* May choose incorrect actions.

* Can get stuck in loops.

* Tool access introduces security risks.

* Important actions require authorization and safeguards.

## AGI (Artificial General Intelligence)

Definition: AGI is a proposed form of AI that can learn, reason, and solve a broad range of intellectual tasks rather than being limited to specific tasks.

Example:

A hypothetical AGI could adapt to unfamiliar tasks across programming, mathematics, research, and other domains.

Current status: AGI has no universally accepted definition or test, and achieving it remains a research goal.

Important: Agentic AI is not automatically AGI. An agent can use tools and complete tasks without having general-purpose intelligence.

## Quick Revision

|
AI Approach

|

Main Purpose

|
| --- | --- |
|

Rule-Based AI

|

Follow predefined rules

|
|

Machine Learning

|

Learn patterns from data

|
|

Deep Learning

|

Learn complex patterns using neural networks

|
|

Generative AI

|

Generate new content

|
|

Agentic AI

|

Take actions toward goals

|
|

AGI

|

Broad, general-purpose intelligence

|

## Key Relationships

* Deep Learning is a subset of Machine Learning.

* Generative AI can be built using Deep Learning.

* Agentic AI can use Generative AI models, tools, memory, and RAG.

* RAG helps an LLM retrieve external information.

* AGI is a proposed level of general capability, not simply the next version of Agentic AI.

One-line summary: AI evolved from following human-written rules to learning from data, generating content, and using tools to perform tasks. AGI represents the goal of achieving broad, general-purpose intelligence.
