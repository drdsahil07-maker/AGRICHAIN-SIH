import { Router } from 'express';
import { simulateCall } from '../controllers/voice.controller';

const router = Router();
router.post('/simulate', simulateCall);

export default router;
