import express, { Router } from 'express';
import { CreateNewUser, LoginUser } from '../controller/user';

const router: Router = express.Router();

router.route('/register').get(CreateNewUser);
router.route('/login').get(LoginUser);

export default router;
