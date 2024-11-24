import "tsconfig-paths"
import express, { Express, Request, Response } from "express";
require("dotenv").config();
import connectDB from "@db/connect";
import { userRouter, vitalsRouter, chatRouter, healthRouter, threadsRouter } from "@routes";
import cors from "cors";
import swaggerDocs from "@utils/swagger";
import { authenticateUser } from "middlewares/auth";
import bodyParser from "body-parser";
import { createAllAssistants } from "@services/openai/utils";
import { infoLogger } from "@utils/logger";

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
app.use("/auth", userRouter);
app.use(authenticateUser);
app.use("/api/vitals", vitalsRouter);
app.use("/api/chat", chatRouter);
app.use("/api/health", healthRouter);
createAllAssistants()

// list of test routers
app.use("/api/threads", threadsRouter);

app.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

const start = async () => {
  await connectDB();
  app.listen(port, () => {
    infoLogger({ status: "success", message: `server listening on port ${port}` })
  });

  swaggerDocs(app, port);
};

start();

// TODO: Add the feature for Core assistant to give some examples in the beginning of convo.
