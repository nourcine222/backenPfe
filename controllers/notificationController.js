const Notification = require('../models/Notification');

// Create a new notification
const createNotification = async (req, res) => {
  const { user_id, title, message, type, status } = req.body;

  try {
    const newNotification = new Notification({
      user_id,
      title,
      message,
      type,
      status: status || 'unread',
    });

    await newNotification.save();
    return res.status(201).json({ msg: 'Notification created successfully', notification: newNotification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    return res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get notification by ID
const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ msg: 'Notification not found' });
    return res.status(200).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update notification
const updateNotification = async (req, res) => {
  const { title, message, type, status } = req.body;

  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ msg: 'Notification not found' });

    notification.title = title || notification.title;
    notification.message = message || notification.message;
    notification.type = type || notification.type;
    notification.status = status || notification.status;

    await notification.save();
    return res.status(200).json({ msg: 'Notification updated successfully', notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ msg: 'Notification not found' });

    await notification.remove();
    return res.status(200).json({ msg: 'Notification deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
};
