import { Router } from 'express';
import { createMentorInvite } from '../controllers/inviteController.js';

const router = Router();

router.post('/mentor', createMentorInvite);

export default router;