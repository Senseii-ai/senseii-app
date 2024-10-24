import chalk from "chalk";

interface InfoParams {
  message: string;
}

interface SuccessParams {
  message: string;
  status: "success";
}

interface ErrorParams {
  message: string;
  status?: "failed";
}

export const infoLogger = ({ message }: InfoParams) => {
  console.log(chalk.black(chalk.bgWhite("INFO"), `MESSAGE: ${message}`));
};

export const errorLogger = ({ message, status }: ErrorParams) => {
  console.log(
    chalk.white(
      chalk.bgRed("[ERROR]"),
      `[STATUS]: ""`,
      `[MESSAGE]: ${message}`,
    ),
  );
};

export const successLogger = { message };
