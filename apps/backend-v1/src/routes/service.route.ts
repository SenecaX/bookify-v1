import { Router } from 'express';
import { createServiceController, deleteServiceController, editServiceController, fetchServicesController } from '../controllers/service.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Route to create a service
router.post('/', authMiddleware, createServiceController);

// Route to fetch services for a company
router.get('/', authMiddleware, fetchServicesController);

// Route to update a service
router.put('/:serviceId', authMiddleware, editServiceController);

// Route to delete a service
router.delete('/:serviceId', authMiddleware, deleteServiceController);

export default router;
