import express, { Router } from "express";
import { continueChat, startChat } from "../controller/chat";
import { chatCore } from "../controller/testChat";

const router: Router = express.Router()

// defining the apis here
// /start : starts a new chat
// /continue: continues the chat if id is provided
// /testChat: is deprecated

router.route("/continue").post(continueChat)
router.route("/testChat").post(chatCore)

/**
  * @openapi
  * /startChat
  * post:
  *   summary: Starts a new chat using the input message passed by the user.
  *   requestBody:
  *     required: true
  *     content:
  *       application/json:
  *         schema:
  *           type: object
  *           properties:
  *             message:
  *               type: object
  *               description: The message to start the chat.
  *               properties:
  *               role:
  *                 type: string
  *                 enum: "user"
  *                 description: The role of the user.
  *               content:
  *                 type: string
  *                 description: the content of the message
  *   response:
  *     200:
  *       description: Chat created successfully
  *       content: application/json
  *       # remaining here
  */
router.route("/startChat").post(startChat)

export default router
