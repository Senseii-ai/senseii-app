import { IChat, serverMessage } from "@senseii/types";
import { Schema, model } from "mongoose";
import { z } from "zod";

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
  threadId: {
    type: String
  }
})

export type ServerMessage = z.infer<typeof serverMessage>

// const chatStore = {
//   saveChat = (chatId: string, message: ServerMessage )=> {
//     try{
//       const response = ChatModel.findOneAndUpdate({id: chatId}, {$push: {messages: message}})
//     } catch(error){
//
//     }
//   }
// }

export const ChatModel = model<ChatsDocument>("Chats", ChatSchema)
