import { Response } from "express";
import { IAuthRequest } from "@middlewares/auth";
import { infoLogger } from "../utils/logger/logger";
import { z } from "zod";
import { createSSEHandler, setSSEHeaders } from "@utils/http";
import { AppError, HTTP } from "@senseii/types";
import { openAIService } from "@services/openai/service";

export const openAIController = {
  Chat: (req: IAuthRequest, res: Response): Promise<void> => chat(req, res),
};

const runCreateDTO = z.object({
  content: z.string(),
  chatId: z.string(),
});

const chat = async (req: IAuthRequest, res: Response) => {
  infoLogger({
    message: "streamable chat triggered",
    status: "INFO",
    layer: "CONTROLLER",
    name: "OAI CONTROLLER",
  });
  const requestId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
  // set headers
  setSSEHeaders(res);
  // create stream handlers.
  const handler = createSSEHandler(res, requestId);
  // check request object validity.
  const userId = req.userId as string;
  const validatedObject = runCreateDTO.safeParse(req.body);
  if (!validatedObject.success) {
    const err: AppError = {
      code: HTTP.STATUS.BAD_REQUEST,
      message: "invalid request",
      timestamp: new Date().toISOString(),
    };
    // FIX: This probably needs to be checked.
    return handler.onError(err);
  }
  // create streamable run.
  const { chatId, content } = validatedObject.data;
  await openAIService.StreamComplete({ chatId, content, userId }, handler);
};

// FIX: This needs to be re-implemented.
// export const getChats = async (req: IAuthRequest, res: Response) => {
//   try {
//     const userId = req.params.userId;
//     const userProfile = await getUserByUserId(userId);
//     if (userProfile === null) {
//       res.status(404).json({
//         status: "failed",
//         message: "User Does not Exist",
//         data: [],
//       });
//       return;
//     }
//
//     const threadIds = userProfile.chats.reduce((threads: chat[], item) => {
//       if (item.threadId) {
//         threads.push({
//           id: item.id,
//           title: item.summary,
//           threadId: item.threadId,
//           userId: userId,
//         });
//       }
//       return threads;
//     }, []);
//
//     const chats = await getChatsFromThreadIds(threadIds.slice(0, 10));
//     infoLogger({ status: "success", message: "chats found successfully" });
//     return res.status(200).json({
//       status: "success",
//       message: "all chats found successfully",
//       data: chats,
//     });
//   } catch (error) {
//     return res.status(400).json({
//       status: "failed",
//       message: "previous chats not found",
//       data: [],
//     });
//   }
// };

// export const getChatMessages = async (req: IAuthRequest, res: Response) => {
//   infoLogger({ message: "I WAS TRIGGERED", status: "success" });
//   try {
//     const { userId, chatId } = req.params;
//     // NOTE: Maybe this implementation needs to be changed
//     const chat = await getThreadByChatId(chatId);
//     if (!chat) {
//       throw new Error("Chat not found");
//     }
//     const response = await OpenAIClient.beta.threads.messages.list(
//       chat?.threadId as string,
//     );
//     res.status(200).json({
//       status: "success",
//       message: "Chat found successfully",
//       data: {
//         title: chat.summary,
//         messages: response.data,
//         userId: userId,
//         id: chat.id,
//       },
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: "failed",
//       message: "Chat not found successfully",
//       data: error,
//     });
//   }
// };
//
// chat API
// export const chatTemp = async (req: IAuthRequest, res: Response) => {
//   try {
//     infoLogger({ status: "INFO", message: `initiating chat ${req.body.chatId}` })
//     // Define headers.
//     const headers = {
//       "Content-Type": "text/event-stream",
//       "Cache-Control": "no-cache",
//       Connection: "keep-alive",
//     };
//     const { chatId, content } = req.body
//     const userId = req.userId as string
//     if (typeof chatId !== "string") {
//       throw new Error("threadId or message not provided");
//     }
//
//     // setup SSE
//     res.writeHead(200, headers);
//
//     // check if a chat with that thread Id already exists.
//     const existingThreadId = await (chatId);
//
//     const inputMessage: MessageCreateParams = {
//       role: "user",
//       content: content,
//     };
//     const coreAssistantId: string = getCoreAssistantId();
//
//     // Define Streaming callbacks
//     const callbacks: StreamCallbacks = {
//       onMessage: async (message) => {
//         const chunk = JSON.stringify({ content: message });
//         res.write(`data: ${chunk}\n\n`);
//       },
//       onError: async (error) => {
//         const errorChunk = JSON.stringify({ error: error.message });
//         res.write(`data: ${errorChunk}\n\n`);
//       },
//       onComplete: async () => {
//         res.write("data: DONE\n\n");
//         res.end();
//       },
//     };
//
//     if (existingThreadId) {
//       // chat already exists, logic to continue chats.
//       infoLogger({ message: "Thread already exists" });
//
//       const updatedThread = await addMessageToThread(
//         OpenAIClient,
//         existingThreadId.threadId,
//         inputMessage,
//       );
//
//       infoLogger({ message: "chat already exists, continuing" });
//       await createStreamableRun(
//         OpenAIClient,
//         updatedThread.thread_id,
//         coreAssistantId,
//         callbacks,
//       );
//     } else {
//       // Chat does not exists, logic to create a new chat
//       infoLogger({ message: "Chat does not exists, creating new" });
//       const threadId = await getNewThreadWithMessages(
//         inputMessage,
//         OpenAIClient,
//       );
//       await createStreamableRun(
//         OpenAIClient,
//         threadId,
//         coreAssistantId,
//         callbacks,
//       );
//
//       // post streaming tasks
//       const summary = await summariseChat(threadId);
//       if (!summary) {
//         throw new Error("Error generating Summary");
//       }
//
//       await addChatToUser(
//         chatId,
//         userId,
//         threadId,
//         summary,
//       );
//     }
//   } catch (error) {
//     console.error(error);
//     const errorResponse = JSON.stringify({
//       status: "error",
//       message: "Error chatting with Senseii",
//       error: error,
//     });
//     res.write(`data: ${errorResponse}\n\n`);
//     res.end();
//   }
// };
//
