import "tsconfig-paths";
import express, { Express } from "express";
require("dotenv").config();
import connectDB from "@db/connect";
import { userRouter, vitalsRouter, chatRouter } from "@routes";
import cors from "cors";
import bodyParser from "body-parser";
import { infoLogger } from "@utils/logger";
import swaggerUi from "swagger-ui-express";
import { swaggerDocs } from "@utils/swagger";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import { handleWebhook } from "@controller/clerk.webhook";

// FIX: replace with actual port number
const port = 9090;

const app: Express = express();
app.use(cors());


app.post("/api/webhooks", bodyParser.raw({ type: 'application/json' }), handleWebhook);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(clerkMiddleware());

// FIX: for production drop this route below authenticator.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/user", requireAuth(), userRouter);
app.use("/api/vitals", requireAuth(), vitalsRouter);
app.use("/chat", requireAuth(), chatRouter);

const start = async () => {
  await connectDB();
  app.listen(port, () => {
    infoLogger({
      layer: "SERVER",
      status: "success",
      message: `server listening on port ${port}`,
    });
  });
};

start();
