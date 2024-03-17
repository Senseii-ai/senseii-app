import { Types } from "mongoose";

// product mangaer
// hobbies
// exams

interface Goal {
  user: Types.ObjectId;
  goalName: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  selected: boolean;
}

interface Goals {

}