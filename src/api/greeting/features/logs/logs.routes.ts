import { Router } from 'express';
import * as logsService from './logs.services.js';

const router = Router();

router.get('/',  logsService.getGreetingLogs);
router.get('/:id', logsService.getGreetingLogById);
router.put('/:id', logsService.updateGreetingLog);
router.delete('/:id', logsService.deleteGreetingLog);
router.delete('/', logsService.clearAllGreetingLogs);

export default router;