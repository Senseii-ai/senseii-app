import chalk from "chalk";

interface InfoParams {
  message: string;
  status?: "success" | "failed" | "INFO" | "alert";
  layer?: "DB" | "SERVICE" | "CONTROLLER" | "SERVER";
  name?: string;
}

class Logger {
  private layer?: "DB" | "SERVICE" | "CONTROLLER" | "SERVER";
  private name?: string;

  constructor(
    layer?: "DB" | "SERVICE" | "CONTROLLER" | "SERVER",
    name?: string
  ) {
    this.layer = layer;
    this.name = name;
  }

  static routeLogger(route: string, method: string) {
    console.log(Logger.routeMessage(`[${method.toUpperCase()}:[${route}]`));
  }

  static infoLogger({ message, status, layer, name }: InfoParams) {
    let output = "";
    const prefix = Logger.getPrefix(layer, name);
    switch (status) {
      case "success":
        output = Logger.successMessage(message);
        break;
      case "INFO":
        output = Logger.infoMessage(message);
        break;
      case "failed":
        output = Logger.errorMessage(message);
        break;
      default:
        output = Logger.alertMessage(message);
        break;
    }
    console.log(prefix + output);
  }

  private static getPrefix(
    layer?: "DB" | "SERVICE" | "CONTROLLER" | "SERVER",
    name?: string
  ): string {
    if (layer == "SERVICE" || layer == "CONTROLLER" || layer == "DB") {
      return `[${layer}]:[${name}]`;
    }
    return `[${layer}]`;
  }

  private static getCurrentTime(): string {
    const date = new Date(Date.now());
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return chalk.white(
      chalk.bgGray(" TIME: " + `${hours}:${minutes}:${seconds}`) + " "
    );
  }

  private static successMessage(message: string): string {
    return chalk.black(
      chalk.bgGreen("SUCCESS ") + Logger.getCurrentTime() + chalk.white(message)
    );
  }

  private static routeMessage(message: string): string {
    return chalk.black(
      chalk.bgHex("#FFC0CB")("INFO") +
        Logger.getCurrentTime() +
        chalk.white(message)
    );
  }

  private static infoMessage(message: string): string {
    return chalk.black(
      chalk.bgCyan("INFO") + Logger.getCurrentTime() + chalk.white(message)
    );
  }

  private static errorMessage(message: string): string {
    return chalk.white(
      chalk.bgRed("ERROR ") + Logger.getCurrentTime() + message
    );
  }

  private static alertMessage(message: string): string {
    return chalk.black(
      chalk.bgYellow("ALERT ") + Logger.getCurrentTime() + chalk.white(message)
    );
  }
}

// Export an instance of Logger for default usage
export const logger = new Logger();

// Export Logger class for custom usage
export { Logger };

export const routeLogger = Logger.routeLogger;
export const infoLogger = Logger.infoLogger;
