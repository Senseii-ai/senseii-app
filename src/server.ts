// import "tsconfig-paths/register"
import "tsconfig-paths";
import express, { Express } from "express";
require("dotenv").config();
import connectDB from "@db/connect";
import { userRouter, vitalsRouter, chatRouter, userProfileRouter } from "@routes";
import cors from "cors";
import bodyParser from "body-parser";
import { infoLogger } from "@utils/logger";
import swaggerUi from "swagger-ui-express";
import { swaggerDocs } from "@utils/swagger";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import { handleWebhook } from "@controller/clerk.webhook";
import { authenticateUser } from "@middlewares/auth";
import cookieParser from "cookie-parser"
import checkMiddleware from "@middlewares/check";

const port = process.env.PORT || 9090

const layer = "SERVER"

const app: Express = express();
// app.use(checkMiddleware)
app.use(cors());
app.use(cookieParser())


app.post("/api/webhooks", bodyParser.raw({ type: 'application/json' }), handleWebhook);
app.get("/ping", (req, res) => {
  infoLogger({ message: "PING", status: "alert", layer })
  res.status(200).json({ message: "pong" })
})

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(clerkMiddleware());
app.use(authenticateUser)

// FIX: for production drop this route below authenticator.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// app.use("/user", requireAuth(), userRouter);
app.use("/api/vitals", requireAuth(), vitalsRouter);
app.use("/chat", requireAuth(), chatRouter);
app.use("/user", requireAuth(), userProfileRouter)

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
