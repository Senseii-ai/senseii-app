# Getting better responses

## Write Clear Instructions

### Include details in the query

This section is about including details in the prompt being sent to the modle
to define what the user wants. There can be two ways of doing this.

- Either use a `O Series` model to define what the user wants in a better way.
- Or, make the system prompt good enough so the model knows what it's role
  in the entire system, so that even if user is not defining things properly,
  the model can ask followup questions.

> [!IMPORTANT]
> I am going with **Making the system prompts better**.

### Ask the model to adopt a persona

`System Prompts` can be used to define the persona of the model. It is like
giving hidden instructions as the owner of the application, of what the role
of the model is in the entire system. It can also be used to do additional
checks, telling the model to ask followup questions in case the user missed
something, etc.

> [!IMPORTANT]
> I am using system prompts to tell the overall flow the model has to follow
> when interacting with the user. What the model can and cannot do. Even things
> like what is the model expert in, what is the role of it, in a system of multiple
> agents. _prompt I used is attached below_

### Use Delimiters to clearly indicate distinct parts of the input

Triple quotations, XML tags or sections titles etc. can be used to distinct a piece
of text from the others.

> [!IMPORTANT]
> I have not found any use of it as of now.

### Specify the steps required to complete a task

If the flow is already quite clearly defined, we can define how to solve a task using
a sequence of text.

[Good example](https://platform.openai.com/docs/guides/prompt-engineering#tactic-specify-the-steps-required-to-complete-a-task)

> [!IMPORTANT]
> We are using this technique to tell the model (assistant) how to get information
> out from the user, that is crucial for the system to work.

### Provide examples

This is also known as "few shot prompting" and we provide examples to the model,
that tells it, how the response should look like, What structure they should follow
and so on.

> [!IMPORTANT]
> We plan to use few shot programming to generate diet and workout plans.

## Provide reference

### Provide reference text

Providing information relevant to the questions being asked by the user can
improve the output performance by huge margin and reduce hallucinations.

Context window of LLMs are limited, so there should be a way to dynamically
fetch information relevant to a user question. These dynamically inserted
information are called embeddings.

> [!IMPORTANT]
> There are multiple uses of it.
> There is no need to use embeddings for generating workout and meal plans.
> We haven't found any relevant use-case for embeddings yet.
> In future, we can use embeddings to provide research backed plans to the user,
> or when they have any questions like that.

### Instruct model to answer with citations from a refernece text

Either the engineer, or the user can provide the model with relevant documents
and text, with instructions to answer questions only by referenceing the provided
document. Models can also be instructed to cite the generated response, telling
the users to double check the correctness of the response.

> [!IMPORTANT]
> As mentioned above, we can use this to answer user questions using medical
> research papers.

## Split complex tasks into smaller sutasks

### Intent classification to identify most relevant instructions for a user query

We can use this to classify the nature of user request.

[Good example](https://platform.openai.com/docs/guides/prompt-engineering#tactic-use-intent-classification-to-identify-the-most-relevant-instructions-for-a-user-query)
This can be used to convert the interaction with the models into a finite state
machine. Start by imagining you entire system as a finite state machine, where
at each state, there are a number of steps that can be taken, and this is true
for every state.

This can be achieved by defining fixed categories and hardcoding instructions that
are relevant for handling tasks of a given category. This can reduce the size of
system messages quite heavily.

Based on the category of the user request, the model can be provided with more
specific instructions, that it will use to handle the next steps.

> [!IMPORTANT]
> This can be used to categorize what user wants and then getting the right steps
> to follow to assist the user.
> THINK MORE.

### Dialogue applications that require long converstaions

There are practically three ways of doing this.

- Manually handle the process of summarising chats when it exceeds the contenxt window
  length (This is almost irrelevant for the assistant API).
- Summarize prior converstaions asynchronously in the background throughout the entire
  conversation.
- Use embeddings, to store and retrieve converstaions relevant to the current context.

> [!IMPORTANT]
> For my system, currently we are relying on threads to store the state of any user
> interaction with my system. I have setup syncing logic with the database as well.
> But, this is a must have feature in the long run, since more the users use the
> application, longer the history will be, but every information is extremely relevant.

### Summarize long documents

When the relevant converstaion exceeds the context length, one more way of
summarising everything is to recursively summarise the conversations, This can
be done in two ways

- Splitting the entire conversation, summarise each individual chunk in parallel,
  recursively split + summarise until the entire conversation can be chunked into
  a specific length.
- Take a chunk of conversation, summarise it, then combine it with another un-summarised
  chunk.

## Give the model time to think

### Instruct the model to workout it's own solution before concluding

Tell the model to reason from first principles before coming to conclusion. There
are many ways of doing this, but here is a [Good example](https://platform.openai.com/docs/guides/prompt-engineering#tactic-instruct-the-model-to-work-out-its-own-solution-before-rushing-to-a-conclusion)

> [!IMPORTANT]
> I am not yet sure how to leverage this with my solution.

### Using inner monologue

Tell the model to encolse all it's thoughts into special characters, with specific
so that you as an engineer can hide them from the user.

> [!IMPORTANT]
> We don't need this feature, since we are don't have a use-case of hiding things
> from the user.

## Use external tools
