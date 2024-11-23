import express, { Router } from "express";
import {
  getChats,
  getChatMessages,
  chat,
} from "../controller/chat";

const router: Router = express.Router();

router.route("/").post(chat);
router.route("/user/:userId/chat/:chatId").get(getChatMessages);
router.route("/user/:userId/chats").get(getChats);

export default router;
