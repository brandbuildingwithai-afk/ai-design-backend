import { Router } from 'express';
import { generateDesign } from '../controllers/agent.controller';

const router = Router();

// Expects { prompt: string } in body
router.post('/design', generateDesign);

export default router;
