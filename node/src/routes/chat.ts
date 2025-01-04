import express, { Router } from "express";
import {
  openAIController,
} from "../controller/chat";

const router: Router = express.Router();

router.route("/").post(openAIController.Chat);
// router.route("/user/:userId/chat/:chatId").get(getChatMessages);
router.route("/user/:email/chats").get(openAIController.GetChats);

export default router;
