import express, { Router } from 'express';
import addNewUser from '../controller/user';

const router: Router = express.Router();

router.route('/').get(addNewUser);

export default router;
