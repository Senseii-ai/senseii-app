import express, { Router } from 'express';
import { CreateNewUser } from '../controller/user';

const router: Router = express.Router();

router.route('/').get(CreateNewUser);

export default router;
