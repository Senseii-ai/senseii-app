import OpenAI from "openai"
import { Run } from "openai/resources/beta/threads/runs/runs"
import { Message, MessagesPage } from "openai/resources/beta/threads/messages/messages"

export const incompleteRunStatus = ["queued", "in_progress", "cancelling"]

export const createRun = async (threadId: string, assistantId: string, client: OpenAI)=>{
    const run = await client.beta.threads.runs.create(
        threadId, {
            assistant_id: assistantId
        }
    )

   const messages = await responsePoller(run, client)
   return messages
}

const responsePoller = async(run: Run, client: OpenAI): Promise<MessagesPage> =>{
    try {
     let runCheck = run
     let messages
    while (incompleteRunStatus.includes(run.status)){
        await new Promise(resolve => setTimeout(resolve, 1000))
        runCheck = await client.beta.threads.runs.retrieve(run.thread_id, run.id)
    }
    
    if (runCheck.status == "completed"){
        messages = await client.beta.threads.messages.list(runCheck.thread_id)
    }
    if (!messages){
        throw new Error("Run failed")
    }
    return messages
    } catch (error) {
        console.error(error)
        throw error
    }
}