const express = require('express');
const router = express.Router();
const { createNotification, getNotifications, updateNotification, deleteNotification,getNotificationById } = require('../controllers/notificationController');

// Notification routes
router.post('/', createNotification);          // Create a new notification
router.get('/', getNotifications);             // Get all notifications
router.get('/:id', getNotificationById);       // Get notification by ID
router.put('/:id', updateNotification);        // Update notification
router.delete('/:id', deleteNotification);    // Delete notification

module.exports = router;
