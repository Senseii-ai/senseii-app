import chalk from "chalk";
import { time } from "console";

interface InfoParams {
  message: string;
  status?: "success" | "failed";
}

function getCurrentTime(): string {
  const date = new Date(Date.now());

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

export const infoLogger = ({ message, status }: InfoParams) => {
  console.log(
    chalk.white(
      chalk.bgGreen("INFO"),
      `TIME: ${getCurrentTime()}`,
      `STATUS: ${status ? status : ""}`,
      `MESSAGE: ${message}`,
    ),
  );
};
