import express, { Router } from "express";
import { continueChat, startChat } from "../controller/chat";
import { chatCore } from "../controller/testChat";

const router: Router = express.Router()

// defining the apis here
// /start : starts a new chat
// /continue: continues the chat if id is provided
// /testChat: is deprecated

//router.route("/").get(chat)
router.route("/start").post(startChat)
router.route("/continue").post(continueChat)
router.route("/testChat").post(chatCore)

export default router
