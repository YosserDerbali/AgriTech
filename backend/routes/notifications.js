// const express = require('express');
// const router = express.Router();
// const notificationController = require('../controllers/notificationController');
// const { authenticate } = require('../middleware/auth');

// // All notification routes require authentication
// router.use(authenticate);

// // Get all notifications for current user
// router.get('/', notificationController.getNotifications);

// // Get unread count
// router.get('/unread/count', notificationController.getUnreadCount);

// // Mark all as read
// router.post('/mark-all-read', notificationController.markAllAsRead);

// // Mark single notification as read
// router.patch('/:notificationId/read', notificationController.markAsRead);

// // Delete notification
// router.delete('/:notificationId', notificationController.deleteNotification);

// module.exports = router;