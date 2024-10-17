import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { blockProviderTimeController, bookAppointmentController, cancelAppointmentController, fetchAvailableSlotsController, fetchBlockedTimesByProviderController, fetchProviderAppointmentsController } from '../controllers/appointment.controller';

const router = Router();

// Route to fetch available slots
router.get('/:providerId/availability', authMiddleware, fetchAvailableSlotsController);

router.post('/book', authMiddleware, bookAppointmentController);

router.get('/provider/appointments', authMiddleware, fetchProviderAppointmentsController);

router.post('/providers/:providerId/block-time', authMiddleware, blockProviderTimeController);

router.get('/providers/:providerId/blocked-times', authMiddleware, fetchBlockedTimesByProviderController);

router.put('/:appointmentId/cancel', authMiddleware, cancelAppointmentController);



export default router;
