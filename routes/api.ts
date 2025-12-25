import { Router } from 'express';
import rateCheck from '../middleware/rate-limiter';
import { getUserController } from '../controllers/userController';

const router = Router();

router.get('/users', rateCheck, getUserController);

export default router;
