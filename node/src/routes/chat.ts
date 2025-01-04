import express, { Router } from "express";
import {
  openAIController,
} from "../controller/chat";

const router: Router = express.Router();

router.route("/").post(openAIController.Chat);
router.route("/user/:email/chat/:chatId").get(openAIController.GetChatMessages);
router.route("/user/:email/chats").get(openAIController.GetChats);

export default router;
