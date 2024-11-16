import { AssistantCreateParams } from "openai/resources/beta/assistants";

export const SUMMARY_ASSISTANT: AssistantCreateParams = {
  name: "summary-assistant",
  instructions: `Review the Conversation:
    Read through the entire conversation to understand the main topics, themes, or intents discussed.
    Identify Key Points:
    Focus on the central topics, recurring themes, or most significant points raised.
    Look for specific actions, decisions, or conclusions made during the chat.
    Create a 2-3 Word Summary:
    Condense the main idea of the conversation into a 2-3 word phrase.
    Ensure it is concise, relevant, and representative of the discussion.
    Examples:
    For a conversation about scheduling a meeting: "Meeting Schedule."
    For a discussion about a new project: "Project Kickoff."
    For a chat about troubleshooting an issue: "Bug Fix."
    Ensure Clarity:
    Use clear and straightforward language.
    Avoid ambiguity or overly technical jargon unless it's contextually relevant.`,
  tools: [],
  model: "gpt-4o",
}


