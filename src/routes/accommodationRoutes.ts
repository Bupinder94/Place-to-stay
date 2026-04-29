import { Router } from 'express';
import * as controller from '../controllers/accommodationController';

const router = Router();

router.get('/location', controller.getByLocation);
router.get('/type-location', controller.getByTypeAndLocation);

export default router;
