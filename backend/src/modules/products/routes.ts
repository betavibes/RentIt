import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProductStatus, updateProduct } from './controller';
import { getCategories, createCategory, updateCategory, deleteCategory } from './categories.controller';
import { authMiddleware } from '../../middleware/auth';
import { adminMiddleware } from '../../middleware/admin';

const router = Router();

// Public Routes
router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/categories/all', getCategories); // Changed path to avoid conflict with :id

// Admin Routes
router.post('/', authMiddleware, adminMiddleware, createProduct);
router.patch('/:id/status', authMiddleware, adminMiddleware, updateProductStatus);
router.put('/:id', authMiddleware, adminMiddleware, updateProduct);

router.post('/categories', authMiddleware, adminMiddleware, createCategory);
router.put('/categories/:id', authMiddleware, adminMiddleware, updateCategory);
router.delete('/categories/:id', authMiddleware, adminMiddleware, deleteCategory);

export default router;
