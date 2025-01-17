import { NutritionPlan } from "@senseii/types";
import { infoLogger } from "./logger/logger";

export const ParseJSONToMarkdown = (json: string) => {
  infoLogger({ message: "parsing this now" });
  const mealPlan: NutritionPlan = JSON.parse(json);

  const testOutput = `
| Month | Savings |
| ----- | ------- |
| January | $250 |
`;
  return testOutput;
};
