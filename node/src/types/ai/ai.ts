import { Message } from "openai/resources/beta/threads/messages";

export interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  userId: string;
  path: string;
  messages: Message[];
}
