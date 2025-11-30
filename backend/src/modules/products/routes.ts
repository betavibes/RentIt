import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProductStatus, updateProduct, deleteProduct } from './controller';
import { getCategories, createCategory, updateCategory, deleteCategory } from './categories.controller';
import { getOccasions, createOccasion, updateOccasion, deleteOccasion } from './occasions.controller';
import { getAgeGroups, createAgeGroup, updateAgeGroup, deleteAgeGroup } from './age-groups.controller';
import { authMiddleware } from '../../middleware/auth';
import { adminMiddleware } from '../../middleware/admin';

const router = Router();

// Public Routes
router.get('/', getProducts);
router.get('/categories/all', getCategories); // Moved before :id to avoid conflict
router.get('/:id', getProductById);

// Admin Routes
router.post('/', authMiddleware, adminMiddleware, createProduct);
router.patch('/:id/status', authMiddleware, adminMiddleware, updateProductStatus);
router.put('/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

router.post('/categories', authMiddleware, adminMiddleware, createCategory);
router.put('/categories/:id', authMiddleware, adminMiddleware, updateCategory);
router.delete('/categories/:id', authMiddleware, adminMiddleware, deleteCategory);

// Occasion Routes
router.get('/occasions/all', getOccasions);
router.post('/occasions', authMiddleware, adminMiddleware, createOccasion);
router.put('/occasions/:id', authMiddleware, adminMiddleware, updateOccasion);
router.delete('/occasions/:id', authMiddleware, adminMiddleware, deleteOccasion);

// Age Group Routes
router.get('/age-groups/all', getAgeGroups);
router.post('/age-groups', authMiddleware, adminMiddleware, createAgeGroup);
router.put('/age-groups/:id', authMiddleware, adminMiddleware, updateAgeGroup);
router.delete('/age-groups/:id', authMiddleware, adminMiddleware, deleteAgeGroup);

export default router;
