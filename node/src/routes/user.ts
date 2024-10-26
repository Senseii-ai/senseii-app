import express, { Router } from "express";
import { CreateNewUser, LoginUser, getUser } from "../controller/user";
import { getChats } from "../controller/chat";

const router: Router = express.Router();

router.route("/signup").post(CreateNewUser);
router.route("/login").post(LoginUser);
router.route("/").post(getUser);

export default router;
