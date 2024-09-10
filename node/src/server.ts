import express, { Express, Request, Response } from "express";
require("dotenv").config();
import connectDB from "./db/connect";
import userRouter from "./routes/user";
import VitalRouter from "./routes/vitals";
import ChatRouter from "./routes/chat";
import HealthRouter from "./routes/health";
import threadRouter from "./routes/threads";
import cors from "cors";
import swaggerDocs from "./utils/swagger";
import chalk from "chalk";
import { authenticateUser } from "./middlewares/auth";
import bodyParser from "body-parser";

const app: Express = express();
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());
const port = 9090;

app.use(express.json());
app.use("/api", userRouter);
// app.use(authenticateUser);
app.use("/api/vitals", VitalRouter);
app.use("/api/chat", ChatRouter);
app.use("/api/health", HealthRouter);

// list of test routers
app.use("/api/threads", threadRouter);

app.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

const start = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(
      chalk.white(chalk.bgGreen("[INFO]:"), "Server listening to port 9090"),
    );
  });

  swaggerDocs(app, port);
};

start();
