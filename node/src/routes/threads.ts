import { Router } from "express";
import {
  createEmptyThread,
  getThreadMessaegs,
} from "../controller/threads";

const router: Router = Router();

router.route("/").post(createEmptyThread);
router.route("/threads/:id/messages").get(getThreadMessaegs);
// router.route("/user/:id/threads").get(getThreads);
export default router;
