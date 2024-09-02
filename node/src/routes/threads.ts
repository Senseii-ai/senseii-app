import { Router } from "express";
import {
  createEmptyThread,
  getThreadMessaegs,
  getThreads,
} from "../controller/threads";

const router: Router = Router();

router.route("/").post(createEmptyThread).get(getThreads);
router.route("/:id/messages").get(getThreadMessaegs);
export default router;
