import express, { Router } from 'express';
import { testVitals, newBloodPressureRecords } from '../controller/vitals';

const router: Router = express.Router();

router.route('/ping').get(testVitals);
router.route('/getBloodPressure').post(newBloodPressureRecords);

export default router;
