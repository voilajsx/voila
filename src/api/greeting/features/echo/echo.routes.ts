import express from 'express';
import { EchoService } from './echo.services.js';

const router = express.Router();

// POST /api/greeting/echo
router.post('/', EchoService.echoMessage);

// GET /api/greeting/echo/:message
router.get('/:message', EchoService.echoMessageGet);

export default router;