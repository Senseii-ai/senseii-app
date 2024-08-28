import express, { Router } from "express";
import { CreateNewUser, LoginUser } from "../controller/user";

const router: Router = express.Router();

router.route("/signup").post(CreateNewUser);
router.route("/login").post(LoginUser);

export default router;
