const { Notification } = require("../models/Notification");
const { User } = require("../models/User");
const { Op } = require("sequelize");

// Notify all agronomists
exports.notifyAgronomists = async (message) => {
  const agronomists = await User.findAll({ where: { role: "AGRONOMIST" } });
  const notifications = agronomists.map((user) => ({
    user_id: user.id,
    message,
  }));
  await Notification.bulkCreate(notifications);
};

// Notify a specific user
exports.notifyUser = async (userId, message) => {
  await Notification.create({ user_id: userId, message });
};

// Fetch notifications (only active ones)
exports.getUserNotifications = async (userId) => {
  return await Notification.findAll({
    where: {
      user_id: userId,
      deleted_at: null,
    },
    order: [["created_at", "DESC"]],
  });
};

// Soft delete a notification
exports.deleteNotification = async (notificationId, userId) => {
  await Notification.update(
    { deleted_at: new Date() },
    { where: { id: notificationId, user_id: userId } }
  );
};

// Create structured notification (with title, type, metadata)
exports.createStructuredNotification = async (userId, title, message, type, metadata = {}) => {
  const fullMessage = JSON.stringify({
    title,
    message,
    type,
    metadata,
  });
  
  const notification = await Notification.create({
    user_id: userId,
    message: fullMessage,
  });
  
  return {
    id: notification.id,
    user_id: notification.user_id,
    title,
    message,
    type,
    metadata,
    read: notification.read,
    created_at: notification.created_at,
  };
};

// Create structured notification for multiple users (bulk)
exports.createBulkStructuredNotifications = async (userIds, title, message, type, metadata = {}) => {
  const fullMessage = JSON.stringify({
    title,
    message,
    type,
    metadata,
  });
  
  const notifications = userIds.map((userId) => ({
    user_id: userId,
    message: fullMessage,
  }));
  
  const created = await Notification.bulkCreate(notifications);
  
  return created.map(notification => ({
    id: notification.id,
    user_id: notification.user_id,
    title,
    message,
    type,
    metadata,
    read: notification.read,
    created_at: notification.created_at,
  }));
};

// Mark notification as read
exports.markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    where: { id: notificationId, user_id: userId, deleted_at: null },
  });
  
  if (!notification) {
    throw new Error('Notification not found');
  }
  
  notification.read = true;
  await notification.save();
  
  let parsedMessage;
  try {
    parsedMessage = JSON.parse(notification.message);
  } catch {
    parsedMessage = { title: 'Notification', message: notification.message, type: 'SYSTEM', metadata: {} };
  }
  
  return {
    id: notification.id,
    user_id: notification.user_id,
    title: parsedMessage.title,
    message: parsedMessage.message,
    type: parsedMessage.type,
    metadata: parsedMessage.metadata,
    isRead: notification.read,
    created_at: notification.created_at,
  };
};

// Mark all notifications as read for a user
exports.markAllAsRead = async (userId) => {
  const [updatedCount] = await Notification.update(
    { read: true },
    { where: { user_id: userId, read: false, deleted_at: null } }
  );
  return updatedCount;
};

// Get unread count for a user
exports.getUnreadCount = async (userId) => {
  return await Notification.count({
    where: { user_id: userId, read: false, deleted_at: null }
  });
};

// Get paginated notifications with parsed messages
exports.getUserNotificationsPaginated = async (userId, limit = 50, offset = 0) => {
  const { count, rows } = await Notification.findAndCountAll({
    where: { user_id: userId, deleted_at: null },
    order: [["created_at", "DESC"]],
    limit,
    offset,
  });
  
  const unreadCount = await exports.getUnreadCount(userId);
  
  const parsedRows = rows.map(notif => {
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(notif.message);
    } catch {
      parsedMessage = { title: 'Notification', message: notif.message, type: 'SYSTEM', metadata: {} };
    }
    
    return {
      id: notif.id,
      user_id: notif.user_id,
      title: parsedMessage.title,
      message: parsedMessage.message,
      type: parsedMessage.type,
      metadata: parsedMessage.metadata,
      isRead: notif.read,
      created_at: notif.created_at,
    };
  });
  
  return {
    total: count,
    unreadCount,
    notifications: parsedRows,
  };
};

// Get single notification by ID
exports.getNotificationById = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    where: { id: notificationId, user_id: userId, deleted_at: null },
  });
  
  if (!notification) {
    return null;
  }
  
  let parsedMessage;
  try {
    parsedMessage = JSON.parse(notification.message);
  } catch {
    parsedMessage = { title: 'Notification', message: notification.message, type: 'SYSTEM', metadata: {} };
  }
  
  return {
    id: notification.id,
    user_id: notification.user_id,
    title: parsedMessage.title,
    message: parsedMessage.message,
    type: parsedMessage.type,
    metadata: parsedMessage.metadata,
    isRead: notification.read,
    created_at: notification.created_at,
  };
};

// Delete all read notifications for a user
exports.deleteAllReadNotifications = async (userId) => {
  const [deletedCount] = await Notification.update(
    { deleted_at: new Date() },
    { where: { user_id: userId, read: true, deleted_at: null } }
  );
  return deletedCount;
};

// Get all agronomist user IDs
exports.getAllAgronomistIds = async () => {
  const agronomists = await User.findAll({ 
    where: { role: "AGRONOMIST", isActive: true },
    attributes: ['id']
  });
  return agronomists.map(a => a.id);
};

// Get all farmer user IDs
exports.getAllFarmerIds = async () => {
  const farmers = await User.findAll({ 
    where: { role: "FARMER", isActive: true },
    attributes: ['id']
  });
  return farmers.map(f => f.id);
};

// Notify all farmers
exports.notifyAllFarmers = async (title, message, type, metadata = {}) => {
  const farmerIds = await exports.getAllFarmerIds();
  return await exports.createBulkStructuredNotifications(farmerIds, title, message, type, metadata);
};

// Notify all agronomists with structured message
exports.notifyAllAgronomistsStructured = async (title, message, type, metadata = {}) => {
  const agronomistIds = await exports.getAllAgronomistIds();
  return await exports.createBulkStructuredNotifications(agronomistIds, title, message, type, metadata);
};