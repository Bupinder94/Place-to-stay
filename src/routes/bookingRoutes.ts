import { Router } from 'express';
import * as controller from '../controllers/bookingController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, controller.createBooking);

export default router;
