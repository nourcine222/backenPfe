const Payment = require('../models/payment');
const cloudinary = require('../config/cloudinary'); // Utility function for uploading files

// Create a new payment
exports.createPayment = async (req, res) => {
    try {
        const { studentId, programId, instituteId, status } = req.body;

        // Check if file exists
        if (!req.file) {
            return res.status(400).json({ message: 'Receipt file is required' });
        }

        // Upload file to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        const payment = new Payment({
            studentId,
            programId,
            instituteId,
            receipt: result.secure_url,
            status: status || 'Pending'
        });

        await payment.save();
        res.status(201).json({ message: 'Payment created successfully', payment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all payments (for RH and Institute Admin)
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('studentId programId instituteId');
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('studentId programId instituteId');
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        payment.status = status;
        await payment.save();
        res.status(200).json({ message: 'Payment status updated', payment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a payment
exports.deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Delete the receipt from Cloudinary
        const receiptUrl = payment.receipt;
        const publicId = receiptUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);

        await payment.deleteOne();
        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get payments by institute ID
exports.getPaymentsByInstitute = async (req, res) => {
    try {
        const { instituteId } = req.params;
        const payments = await Payment.find({ instituteId }).populate('studentId programId instituteId');

       
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
