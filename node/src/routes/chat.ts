import express, { Router } from "express";
import {
  chatNutrition,
  getChats,
  getChatMessages,
  chat,
} from "../controller/chat";
import { chatCore } from "../controller/testChat";
import { CreateInitialPlan } from "../services/openai/assistants/nutrition/nutrition.functions";

const router: Router = express.Router();

router.route("/").post(chat);
router.route("/user/:userId/chat/:chatId").get(getChatMessages);
router.route("/user/:userId/chats").get(getChats);
router.route("/nutritionChat").post(CreateInitialPlan);
router.route("/nutritionChat").post(chatNutrition);
router.route("/testChat").post(chatCore);

export default router;
