import "tsconfig-paths"
import express, { Express } from "express";
require("dotenv").config();
import connectDB from "@db/connect";
import { userRouter, vitalsRouter, chatRouter, authRouter } from "@routes";
import cors from "cors";
import bodyParser from "body-parser";
import { infoLogger } from "@utils/logger";
import swaggerUi from "swagger-ui-express"
import { swaggerDocs } from "@utils/swagger";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import { Webhook } from "svix";

const app: Express = express();
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
const port = 9090;

// app.use(express.json());
app.use(clerkMiddleware())
app.post(
  '/api/webhooks',
  bodyParser.raw({ type: 'application/json' }),
  async (req, res) => {
    infoLogger({ message: "New user created", status: "alert" })
    const SIGNING_SECRET = process.env.SIGNING_SECRET

    if (!SIGNING_SECRET) {
      throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env')
    }

    // Create new Svix instance with secret
    const wh = new Webhook(SIGNING_SECRET)


    // Get headers and body
    const headers = req.headers
    const payload = req.body

    // Get Svix headers for verification
    const svix_id = headers['svix-id']
    const svix_timestamp = headers['svix-timestamp']
    const svix_signature = headers['svix-signature']

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return void res.status(400).json({
        success: false,
        message: 'Error: Missing svix headers',
      })
    }

    let evt: any

    // Attempt to verify the incoming webhook
    // If successful, the payload will be available from 'evt'
    // If verification fails, error out and return error code
    try {
      evt = wh.verify(payload, {
        'svix-id': svix_id as string,
        'svix-timestamp': svix_timestamp as string,
        'svix-signature': svix_signature as string,
      })
    } catch (err) {
      console.log('Error: Could not verify webhook:', err)
      return void res.status(400).json({
        success: false,
        message: err,
      })
    }

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data
    const eventType = evt.type
    if (evt.type === 'user.created') {
      console.log('userId:', evt.data.id)
    }

    return void res.status(200).json({
      success: true,
      message: 'Webhook received',
    })
  },
)

// FIX: for production drop this route below authenticator.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use("/user", requireAuth(), userRouter)
app.use("/api/vitals", requireAuth(), vitalsRouter);
app.use("/chat", requireAuth(), chatRouter);

const start = async () => {
  await connectDB();
  app.listen(port, () => {
    infoLogger({ layer: "SERVER", status: "success", message: `server listening on port ${port}` })
  });
};

start();
