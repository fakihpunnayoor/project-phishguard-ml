import { Router } from 'express';
import {
  scanUrl,
  getScanHistory,
  getScanStats,
  getScanById,
  getHealth
} from '../controllers/scanController.js';
import { scanRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Threat Intelligence Scan endpoint
router.post('/scan', scanRateLimiter, scanUrl);

// Scan History with query filtering
router.get('/history', getScanHistory);

// Platform Aggregated Telemetry Stats
router.get('/stats', getScanStats);

// Deep Scan Detail Query
router.get('/scan/:id', getScanById);

// System Health and Infrastructure Status
router.get('/health', getHealth);

export default router;
