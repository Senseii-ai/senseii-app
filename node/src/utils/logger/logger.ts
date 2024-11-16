import chalk from "chalk";

interface InfoParams {
  message: string;
  status?: "success" | "failed" | "INFO";
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
      status === "success" ? chalk.bgGreen("SUCCESS") : status === "failed" ? chalk.bgRed("[ERROR]") : chalk.bgYellowBright("[INFO]"),
      chalk.bgGray(`TIME ${getCurrentTime()}`),
      `STATUS: ${status ? status : ""}`,
      `MESSAGE: ${message}`,
    ),
  );
};
