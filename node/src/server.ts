import "tsconfig-paths"
import express, { Express, Request, Response } from "express";
require("dotenv").config();
import connectDB from "@db/connect";
import { userRouter, vitalsRouter, chatRouter, healthRouter, threadsRouter, authRouter } from "@routes";
import cors from "cors";
import { authenticateUser } from "middlewares/auth";
import bodyParser from "body-parser";
import { createAllAssistants } from "@services/openai/utils";
import { infoLogger } from "@utils/logger";
import swaggerUi from "swagger-ui-express"
import { swaggerDocs } from "@utils/swagger";

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
app.use("/auth", authRouter);
app.use("/user", userRouter)
// FIX: for production drop this route below authenticator.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use(authenticateUser);
app.use("/api/vitals", vitalsRouter);
app.use("/chat", chatRouter);
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
    infoLogger({ layer: "SERVER", status: "success", message: `server listening on port ${port}` })
  });
};

start();
