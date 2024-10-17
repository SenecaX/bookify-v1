import { Router } from 'express';
import { createUserController, deleteUserController, editUserController, fetchUsersController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Route to fetch users, applying auth middleware
router.get('/', authMiddleware, fetchUsersController);

// Route to edit user, applying auth middleware
router.put('/:userId', authMiddleware, editUserController);

// Route to delete (soft delete) user, applying auth middleware
router.delete('/:userId', authMiddleware, deleteUserController);

// Route to create user, applying auth middleware
router.post('/', authMiddleware, createUserController);

export default router;
