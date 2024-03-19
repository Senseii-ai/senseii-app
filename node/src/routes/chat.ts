import express, { Router } from "express";
import { chat, continueChat, startChat } from "../controller/chat";

const router: Router = express.Router()

router.route("/").get(chat)
router.route("/start").post(startChat)
router.route("/continue").post(continueChat)

export default router