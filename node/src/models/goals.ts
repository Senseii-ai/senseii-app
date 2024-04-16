import { Types } from "mongoose";

// product mangaer
// hobbies
// exams

export interface IUserGoal {
  user: Types.ObjectId;
  goalName: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  selected: boolean;
}

export interface IUserGoals {
  user: Types.ObjectId;
  goals: IUserGoal[];
}
