import { ServerMessage } from "@models/chats";
import { userProfileStore } from "@models/userProfile";
import { CreateUserGoalDTO, Result } from "@senseii/types";
import getOpenAIClient from "@services/openai/client";
import { openAIUtils } from "@services/openai/utils";

const client = getOpenAIClient()

export const userProfileService = {
  CreateNewGoal: async (args: CreateUserGoalDTO): Promise<Result<string>> => {
    const threadId = await openAIUtils.CreateEmptyThread()
    return await userProfileStore.AddNewGoal(args, threadId)
  },
  SaveChat: async (args: ServerMessage[], chatId: string): Promise<Result<null>> => {
    return await userProfileStore.SaveChat(args, chatId)
  }
}
