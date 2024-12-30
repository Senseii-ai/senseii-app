import express, { Router } from "express";
import { getUser } from "@controller/user";

const router: Router = express.Router();

router.route("/").post(getUser);

export default router;
