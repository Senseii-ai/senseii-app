import { userProfileStore } from "@models/userProfile";
import { CreateUserGoalDTO } from "@senseii/types";
import getOpenAIClient from "@services/openai/client";
import { openAIUtils } from "@services/openai/utils";

const client = getOpenAIClient()

export const userProfileService = {
  CreateNewGoal: async (args: CreateUserGoalDTO) => {
    const threadId = await openAIUtils.CreateEmptyThread()
    return await userProfileStore.AddNewGoal(args, threadId)
  }
}
