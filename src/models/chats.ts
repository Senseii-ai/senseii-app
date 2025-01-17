import { IChat } from "@senseii/types";
import { Schema, model } from "mongoose";

interface ChatsDocument extends IChat, Document { }

const MessageSchema = new Schema({
  role: {
    type: String,
    enum: ["user", "assistant"], // Matches z.enum(["user", "assistant"])
    required: true,
  },
  content: {
    type: String, // Matches z.string()
    required: true,
  },
});


const ChatSchema: Schema<ChatsDocument> = new Schema({
  userId: {
    type: String,
    required: true,
  },
  messages: {
    type: [MessageSchema]
  },
})

export const ChatModel = model<ChatsDocument>("Chats", ChatSchema)
