import chalk from "chalk";

interface InfoParams {
  message: string;
  status?: "success" | "failed" | "INFO" | "alert";
}

function getCurrentTime(): string {
  const date = new Date(Date.now());

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return chalk.white(chalk.bgGray(" TIME: " + `${hours}:${minutes}:${seconds}`) + " ")
}

export const infoLogger = ({ message, status }: InfoParams) => {
  let output = ""
  switch (status) {
    case "success":
      output = successMessage(message)
      break
    case "INFO":
      output = infoMessage(message)
      break
    case "failed":
      output = errorMessage(message)
      break
    default:
      output = alertMessage(message)
      break
  }
  console.log(output)
};

const successMessage = (message: string) => {
  return chalk.black(chalk.bgGreen("SUCCESS ") + getCurrentTime() + chalk.white(message))
}

const infoMessage = (message: string) => {
  return chalk.black(chalk.bgCyan("INFO") + getCurrentTime() + chalk.white(message))
}

const errorMessage = (message: string) => {
  return chalk.white(chalk.bgRed("ERROR ") + getCurrentTime() + message)
}

const alertMessage = (message: string) => {
  return chalk.black(chalk.bgYellow("ALERT ") + getCurrentTime() + chalk.white(message))
}
