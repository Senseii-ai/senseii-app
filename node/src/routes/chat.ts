import express, { Router } from "express";
import {
  // getChats,
  // getChatMessages,
  chat, openAIController,
} from "../controller/chat";
import { openAIService } from "@services/openai/service";

const router: Router = express.Router();

router.route("/").post(openAIController.Chat);
// router.route("/user/:userId/chat/:chatId").get(getChatMessages);
// router.route("/user/:userId/chats").get(getChats);

export default router;
