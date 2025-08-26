import { Router } from 'express';
import { authClass } from '@voilajsx/appkit';
import * as logsService from './logs.services.js';

const router = Router();
const auth = authClass.get();

router.get('/', auth.requireLoginToken(), logsService.getGreetingLogs);
router.get('/:id', auth.requireLoginToken(), logsService.getGreetingLogById);
router.delete('/:id', auth.requireUserRoles(['admin.tenant']), logsService.deleteGreetingLog);
router.delete('/', auth.requireUserRoles(['admin.system']), logsService.clearAllGreetingLogs);

export default router;