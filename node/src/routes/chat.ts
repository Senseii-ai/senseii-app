import express, { Router } from "express";
import { chat } from "../controller/chat";

const router: Router = express.Router()

router.route("/").get(chat)

export default router