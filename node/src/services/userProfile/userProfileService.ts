import { CreateUserGoalDTO } from "@models/temp.types";
import { userProfileStore } from "@models/userProfile";

export const userProfileService = {
  CreateNewGoal: async (args: CreateUserGoalDTO) => {
    return await userProfileStore.AddNewGoal(args)
  }
}
