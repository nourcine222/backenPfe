const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

// Only RH and Institute Admin can access these routes
router.post('/', paymentController.createPayment);
router.get('/', authMiddleware(['RH', 'admin']), paymentController.getAllPayments);
router.get('/:id', authMiddleware(['RH', 'admin']), paymentController.getPaymentById);
router.put('/:id', authMiddleware(['RH', 'admin']), paymentController.updatePaymentStatus);
router.delete('/:id', authMiddleware(['RH', 'admin']), paymentController.deletePayment);
router.get('/institute/:instituteId', authMiddleware(['RH', 'admin']), paymentController.getPaymentsByInstitute);

module.exports = router;
