import { StreamHandler, createStreamStart } from "@utils/http"
import getOpenAIClient from "./client"
import { CoreAssistantId } from "./assistants"
import { userProfileStore } from "@models/userProfile"
import { infoLogger } from "@utils/logger"
import { AppError, HTTP, RunRequestDTO } from "@senseii/types"
import { openAIUtils } from "./utils"

const client = getOpenAIClient()

export const openAIService = {
  StreamComplete: (data: RunRequestDTO, handler: StreamHandler) => streamComplete(data, handler),
}

/**
 * streamComplete creates a streamable run on the backend.
*/
const streamComplete = async (data: RunRequestDTO, handler: StreamHandler, assistantId?: string) => {
  try {
    infoLogger({ message: "creating a streamable run", status: "INFO", layer: "SERVICE", name: "OPENAI" });
    // start stream processing
    handler.onMessage(createStreamStart())

    let assistant_id = assistantId ? assistantId : CoreAssistantId as string
    let threadId = ""
    const thread = await userProfileStore.GetThreadByChatId(data)
    // thread found in database.
    if (thread.success) {
      infoLogger({ message: `chat ${data.chatId} found` })
      threadId = thread.data.threadId
    } else {
      // error occured
      if (thread.error.code === HTTP.STATUS.NOT_FOUND) {
        // chat not found in database.
        infoLogger({ message: `chat ${data.chatId} does not exist, creating new` })
        threadId = await openAIUtils.CreateThreadWIthMessage(data.content, "user")
      } else {
        // internal server error
        handler.onError(thread.error)
        return
      }
    }

    // create a stream and process it.
    const run = client.beta.threads.runs.stream(threadId, {
      assistant_id
    })
    await openAIUtils.ProcessStream(run, client, threadId, handler)
    infoLogger({ message: "creating a streamable run -> success [THIS IS A CHECK]", status: "success", layer: "SERVICE", name: "OPENAI" });
  } catch (error) {

    infoLogger({ message: "some error occured", status: "success", layer: "SERVICE", name: "OPENAI" });
    // FIX: Need to change this.
    // All the thrown errors come here.
    //
    // 1:
    const err: AppError = {
      code: HTTP.STATUS.INTERNAL_SERVER_ERROR,
      message: 'inernal server error',
      timestamp: new Date().toISOString()
    }
    handler.onError(err)
    return
  }
}




// export async function createStreamableRun(
//   client: AzureOpenAI,
//   threadId: string,
//   assistantId: string,
//   callbacks: StreamCallbacks,
// ) {
//   infoLogger({ message: "creating a streamable run", status: "INFO", layer: "SERVICE", name: "OPENAI" });
//   try {
//     let stream = await client.beta.threads.runs.create(threadId, {
//       assistant_id: assistantId,
//       stream: true,
//     });
//
//     // Process stream events until completion
//     await processStream(stream, client, threadId, callbacks);
//
//     infoLogger({ status: "success", layer: "SERVICE", name: "OPENAI", message: "run successful" });
//     callbacks.onComplete?.();
//   } catch (error) {
//     callbacks.onError?.(error);
//     throw error;
//   }
// }




