import { Router } from 'express';
import * as controller from '../controllers/userController';

const router = Router();

router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.get('/session', controller.getSession);

export default router;
