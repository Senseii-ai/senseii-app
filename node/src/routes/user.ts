import express, { Router } from "express";
import { userProfileController } from "@controller/userProfile";

const router: Router = express.Router();


router.route("/:email/chat").post(userProfileController.SaveChat);

export default router;
