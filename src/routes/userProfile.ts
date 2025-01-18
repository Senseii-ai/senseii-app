import { userProfileController } from '@controller/userProfile'
import express, { Router } from 'express'

const router: Router = express.Router()

router.route("/goals/new").post(userProfileController.CreateNewGoal)
router.route("/goals").get(userProfileController.GetUserGoals)

export default router
