import express, { Router } from "express";
import { createNewUser, getUser, loginUser } from "@controller/user";

const router: Router = express.Router();

router.route("/signup").post(createNewUser);
router.route("/login").post(loginUser);
router.route("/").post(getUser);

export default router;
