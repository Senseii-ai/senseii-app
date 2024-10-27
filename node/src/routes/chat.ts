import express, { Router } from "express";
import {
  chatNutrition,
  getChats,
  getChatMessages,
  chat,
} from "../controller/chat";
import { chatCore } from "../controller/testChat";

const router: Router = express.Router();

// defining the apis here
// /start : starts a new chat
// /continue: continues the chat if id is provided
// /testChat: is deprecated
//
/**
 * @openapi
 * /continueChat
 * post:
 *  summary: continues a chat, if the thread id is provided.
 *  requestBody:
 *    required: true
 *    content:
 *      application/json:
 *      schema:
 *        type: object
 *        properties:
 *          threadId:
 *            type: string
 *            description: Unique thread ID belonging to a chat
 *          message:
 *            type: object
 *            description: The user message
 *            properties:
 *              role:
 *                type: string
 *                enum: "user"
 *                description: the role of the user
 *                content:
 *                 type: string
 *                 description: the content of the message
 *   response:
 *     200:
 *       description: Chat created successfully
 *       content: application/json
 *       # remaining here
 *
 */

// app.use("/api/chat", ChatRouter);
router.route("/").post(chat);
router.route("/user/:userId/chats").get(getChats);

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

router.route("/nutritionChat").post(chatNutrition);
router.route("/testChat").post(chatCore);
router.route("/user/:userId/chat/:chatId").get(getChatMessages);

export default router;
