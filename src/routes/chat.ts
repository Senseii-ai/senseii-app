import express, { Router } from "express";
import {
  openAIController,
} from "../controller/chat";

const router: Router = express.Router();

router.route("/").post(openAIController.Chat);
router.route("/:chatId").get(openAIController.GetChatMessages);
router.route("/:chatId/save").post(openAIController.SaveChat)
// router.route("/user/:email/chats").get(openAIController.GetChats);

export default router;
