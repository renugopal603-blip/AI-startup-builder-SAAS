import express from 'express';
import { generateStateless, regenerateStartup, chatStartup } from '../controllers/aiBuilderController.js';

const router = express.Router();

router.post('/generate-stateless', generateStateless);
router.post('/regenerate/:startupId', regenerateStartup);
router.post('/chat/:startupId', chatStartup);

export default router;
