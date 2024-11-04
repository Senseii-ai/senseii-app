import { INutritionPlan } from "../types/interfaces";
import { infoLogger } from "./logger/logger";

export const ParseJSONToMarkdown = (json: string) => {
  infoLogger({ message: "parsing this now" });
  const mealPlan: INutritionPlan = JSON.parse(json);

  const testOutput = `
| Month | Savings |
| ----- | ------- |
| January | $250 |
`;
  return testOutput;
};
