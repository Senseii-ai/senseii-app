import express, { Router } from "express";
import { CreateNewUser, LoginUser, getUser } from "../controller/user";

const router: Router = express.Router();

router.route("/signup").post(CreateNewUser);
router.route("/login").post(LoginUser);
router.route("/").post(getUser);

export default router;
