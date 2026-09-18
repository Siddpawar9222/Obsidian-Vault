# AI Fundamentals — Retrieval-Augmented Generation (RAG)

Revision notes · Beginner to practical understanding

## What is RAG?

RAG (Retrieval-Augmented Generation) is an AI architecture that allows a Large Language Model (LLM) to answer questions using relevant external information retrieved from documents, databases, or other knowledge sources.

Instead of retraining the LLM whenever new information becomes available, RAG retrieves the required information and provides it to the LLM as context.

Core idea:

> Retrieve relevant information first, then generate an answer using that information.

## Why do we need RAG?

LLMs are trained on large datasets, but they may not know:

* Private company documents

* Internal employee policies

* Newly updated information

* Specific business data

* Information that was never included in their training data

### Real-world problem

Imagine your company has an internal HR policy document.

```
Company HR Policy

Employees can work from home
up to 3 days per week.
```

An employee asks an LLM:

> "How many days can I work from home?"

A general-purpose LLM may not know your company's specific policy.

One solution is to retrain or fine-tune the model, but that is not usually necessary just to provide access to company documents.

RAG solves this by retrieving the relevant policy and giving it to the LLM when the question is asked.

## RAG is an Architecture, Not a Model

RAG is not a specific AI model or a single software tool.

It is an architectural workflow that connects multiple components:

* Documents or external knowledge sources

* Document processing and chunking

* Embedding model

* Vector database

* Retriever

* LLM

Each component has a specific responsibility.

## How RAG Works

RAG has two major workflows:

Document ingestion — Prepare knowledge

Company Documents

PDFs, policies, manuals, articles

Chunking

Split documents into smaller pieces

Embedding Model

Convert chunks into vectors

Vector Database

Store vectors, text and metadata

Retrieval and generation — Answer questions

User Question

"How many days can I work remotely?"

Embed the Question

Create a query vector

Retrieve Relevant Chunks

Search the vector database

LLM + Retrieved Context

Question and relevant policy are provided

Generated Answer

"You can work remotely up to 3 days per week."

Important: Document ingestion is generally performed beforehand. The system does not need to reprocess every document for every user question.

## What is Chunking?

Chunking means dividing a large document into smaller, meaningful pieces called chunks.

Example:

Original document

Employee Handbook

* Leave Policy

* Work-from-Home Policy

* Salary Policy

* Insurance Policy

Chunking

Chunk 1

Leave Policy

Chunk 2

Work-from-Home Policy

Chunk 3

Salary Policy

Chunk 4

Insurance Policy

### Why is chunking important?

* Large documents may exceed the amount of context an LLM can process.

* Smaller chunks make it easier to retrieve only the relevant information.

* Focused chunks can improve retrieval accuracy and reduce unnecessary context.

Example: If the user asks about remote work, the system can retrieve the work-from-home policy instead of sending the entire employee handbook to the LLM.

## How RAG uses the concepts we learned

|
Concept

|

Role in RAG

|
| --- | --- |
|

LLM

|

Generates the final response

|
|

Tokens

|

Represent text in a form the model processes

|
|

Embedding model

|

Converts text into vector representations

|
|

Vector database

|

Stores and searches vectors

|
|

Chunking

|

Breaks documents into smaller pieces

|
|

Retriever

|

Finds relevant information

|
|

RAG

|

Connects retrieval with answer generation

|

Remember the distinction:

* Embedding model creates embeddings.

* Vector database stores and searches embeddings.

* Retriever selects relevant content.

* LLM uses the retrieved content to generate an answer.

## Why is RAG useful?

### Access to private knowledge

An organization can use its internal documents without training a new LLM from scratch.

### Updated information

When a document changes, the system can update its stored chunks and embeddings. The LLM itself does not necessarily need retraining.

### Relevant context

Instead of providing thousands of documents to the LLM, RAG retrieves a smaller set of relevant chunks.

### Reduced unsupported answers

RAG can help reduce hallucinations by grounding answers in retrieved information. However, RAG does not guarantee correctness. The retrieved content may be incomplete, irrelevant, or outdated, and the LLM may still produce incorrect answers.

## Important RAG Design Decisions

RAG quality depends on how the system is designed.

|
Design decision

|

Why it matters

|
| --- | --- |
|

Chunk size

|

Too small may lose context; too large may include irrelevant information

|
|

Chunk overlap

|

Helps preserve context across chunk boundaries

|
|

Embedding model

|

Affects how well related information is represented

|
|

Number of retrieved chunks (`top-k`)

|

Too few may miss information; too many may add noise

|
|

Retrieval method

|

Affects which documents are selected

|
|

Context quality

|

Determines how useful the retrieved information is for the LLM

|

Example: If a question requires information spread across three chunks, retrieving only one chunk may produce an incomplete answer.

## RAG Tools and Platforms

![Portrait d'Harrison Chase : l'homme qui révolutionne les applications avec LLMs](https://images.openai.com/static-rsc-4/pJ3EXC-a4-Ymr-UoRs8QGyvP11b9VolQSyddCzg8YE1TTC4coej5o1U4eeK5OZrDIN1qUux3g05bCwVTLK1L0tu8K0DRZmCOTB_Wi0IEYlSfCz_kHceKZ8_plbpliuVrnUOilnZlwNrtpTReUd1lQUvkW54Ay2cD5wovOrJxWXQ?purpose=inline)

LangChain

A developer framework for building LLM applications and connecting models, retrievers, tools, and data sources.

![LlamaIndex IA - Construye agentes LLM sobre datos empresariales](https://images.openai.com/static-rsc-4/Jwyz2pGQx3aEvo88hfCxFHaSOdnH8jabqMSMBe9v1eQIxy_-qmfvCmMNFdzPKNgHOOxI3pMSShPq0BfaSJLeoet3PftCEu4tC6zcFl-iHXXVAcWa52sLB-JnJLWzuvBg20TFbjOmD9XuWqVoTWMy6WpMrqizWJHRCOACUFk6OQw?purpose=inline)

LlamaIndex

A framework focused on connecting LLMs with external data and building retrieval-based applications.

![Glean Announces Over \$260 Million Series E and Next-Generation Prompting as it Brings Work AI to the Enterprise](https://images.openai.com/static-rsc-4/DTLwYEFUDpQabWBg9llTFBTxGbC6dVE6tbkfvlb530VTZyIQQ_gULt8tkxFK_wB9V0RdzyWSU2F5uZwvwBikZywgUCMMdHIXQlxiLIPJRtIXVCEz9Wc0MkaxzSf25izgktajhLw5HYpyIM0aDqjZqQX3BobE-NKurWa7uZ69nDs?purpose=inline)

Glean

An enterprise AI platform for searching and accessing organizational knowledge.

![Amazon releases Q business chatbot with new features](https://images.openai.com/static-rsc-4/McfaG3IBE-5leeAPN732is1NN_qqh___3Go_sjjDJvzPRIGB035b1DvFn3sblyP04Y3e5oUWoVMg-K27jju_n2wl6kdX2Wl232KIPAMZpeR2OaiMD4As1BhdzPurb3ntBLc74aN2SyMna0tCvZVH-QNv1m7S0BaNkZznfL1V5Mo?purpose=inline)

Amazon Q

Amazon's generative AI assistant family, including offerings for business and software development.

## Quick Revision

RAG = Retrieval + Augmentation + Generation

* Retrieval: Find relevant information from external data.

* Augmentation: Add the retrieved information to the LLM's context.

* Generation: LLM generates an answer using the question and retrieved context.

Document pipeline:

`Documents → Chunking → Embeddings → Vector Database`

Question pipeline:

`Question → Query Embedding → Retrieval → Context + LLM → Answer`

### One-line definition

RAG is an architecture that retrieves relevant external information and supplies it to an LLM as context so the model can generate informed, context-specific answers without requiring retraining for every new dataset.
