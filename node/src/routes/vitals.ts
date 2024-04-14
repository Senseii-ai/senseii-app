import express, { Router } from 'express';
import { testVitals, newBloodPressureRecords } from '../controller/vitals';

const router: Router = express.Router();

// TODO: Define input and output parameters for these routes to show in OpenAPI schema.
router.route('/ping').get(testVitals);
router.route('/getBloodPressure').post(newBloodPressureRecords);

export default router;
