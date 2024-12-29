import { authController, verifyEmail } from "@controller/email-verification";
import express, { Router } from "express";
const router: Router = express.Router()

router.route("/auth/verify-token").get(authController.verifyEmail)
