import chalk from "chalk";

interface InfoParams {
  message: string;
  status?: "success" | "failed";
}

export const infoLogger = ({ message, status }: InfoParams) => {
  console.log(
    chalk.white(
      chalk.bgGreen("INFO"),
      `STATUS: ${status}`,
      `MESSAGE: ${message}`,
    ),
  );
};
