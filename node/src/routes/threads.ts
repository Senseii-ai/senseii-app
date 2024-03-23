import { Router } from "express";
import { createEmptyThread, getThreadMessaegs } from "../controller/threads";

const router: Router = Router()

router.route("/newThread").get(createEmptyThread)
router.route('/getThreadMessages').get(getThreadMessaegs)
export default router