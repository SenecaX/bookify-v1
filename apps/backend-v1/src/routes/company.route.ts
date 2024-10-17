import { Router } from 'express';
import {
  createCompanyController,
  getCompanyByNameController,
  updateCompanyController  // Import the update controller
} from '../controllers/company.controller';
import { authMiddleware } from '../middlewares/auth.middleware';  // Apply auth if necessary

const router = Router();

// Route to create a company
router.post('/', authMiddleware, createCompanyController);

// Route to update a company
router.put('/:id', authMiddleware, updateCompanyController);  // New route to handle updates

router.get('/:name', getCompanyByNameController);


export default router;
