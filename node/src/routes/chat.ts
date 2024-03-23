import express, { Router } from "express";
import { chat, continueChat, startChat } from "../controller/chat";
import { chatCore } from "../controller/testChat";

const router: Router = express.Router()

router.route("/").get(chat)
router.route("/start").post(startChat)
router.route("/continue").post(continueChat)
router.route("/testChat").post(chatCore)

export default router