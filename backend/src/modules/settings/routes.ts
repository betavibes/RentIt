import express from 'express';
import { authMiddleware } from '../../middleware/auth';
import { adminMiddleware } from '../../middleware/admin';
import {
    getAllSettings,
    getSettingsByCategory,
    updateSetting,
    updateMultipleSettings
} from './controller';

const router = express.Router();

// All routes require admin authentication
router.use(authMiddleware, adminMiddleware);

router.get('/', getAllSettings);
router.get('/category/:category', getSettingsByCategory);
router.put('/:key', updateSetting);
router.put('/bulk/update', updateMultipleSettings);

export default router;
