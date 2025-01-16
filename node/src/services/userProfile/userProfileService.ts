import { userProfileStore } from "@models/userProfile";
import { CreateUserGoalDTO } from "@senseii/types";

export const userProfileService = {
  CreateNewGoal: async (args: CreateUserGoalDTO) => {
    return await userProfileStore.AddNewGoal(args)
  }
}
