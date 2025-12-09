"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = void 0;
// notification.service.ts
const notification_model_1 = require("./notification.model");
const user_model_1 = require("../user/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
const firebase_1 = __importDefault(require("../../../config/firebase"));
// Enhanced send notification with preference checking
const sendRealTimeNotification = (userId_1, title_1, text_1, ...args_1) => __awaiter(void 0, [userId_1, title_1, text_1, ...args_1], void 0, function* (userId, title, text, type = 'info', data = {}) {
    try {
        // Check user's notification preferences
        const user = yield user_model_1.User.findById(userId).select('notificationPreferences fcmToken');
        if (!user) {
            throw new Error('User not found');
        }
        // Check if this notification type is enabled by user
        if (user.notificationPreferences && !user.notificationPreferences[type]) {
            console.log(`Notification type ${type} is disabled for user ${userId}`);
            return null;
        }
        // Create notification in database
        const notification = new notification_model_1.NotificationModel({
            title,
            text,
            userId,
            type,
            data,
            read: false,
        });
        yield notification.save();
        // Send push notification if user has FCM token
        if (user.fcmToken) {
            yield sendPushNotification(userId, text, title, Object.assign(Object.assign({}, data), { type }));
        }
        const populatedNotification = yield notification_model_1.NotificationModel.findById(notification._id)
            .populate('userId', 'name email');
        return populatedNotification;
    }
    catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
});
// Enhanced push notification function with proper Firebase typing
const sendPushNotification = (userId_1, text_1, title_1, ...args_1) => __awaiter(void 0, [userId_1, text_1, title_1, ...args_1], void 0, function* (userId, text, title, data = {}) {
    try {
        const user = yield user_model_1.User.findById(userId);
        if (!user) {
            console.log(`User ${userId} not found`);
            return null;
        }
        if (!user.fcmToken) {
            console.log(`No FCM token for user ${userId}`);
            return null;
        }
        // Properly typed Firebase message object
        const message = {
            notification: {
                title: title,
                body: text,
            },
            data: Object.assign(Object.assign({}, data), { type: data.type || 'info', click_action: 'FLUTTER_NOTIFICATION_CLICK', userId: userId.toString() }),
            token: user.fcmToken,
            android: {
                priority: 'high', // Use const assertion for literal type
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'default',
                        badge: 1,
                    },
                },
            },
        };
        const response = yield firebase_1.default.messaging().send(message);
        console.log('Push notification sent successfully:', response);
        return response;
    }
    catch (error) {
        console.error('Error sending push notification:', error);
        // Handle invalid token errors
        if (error.code === 'messaging/invalid-registration-token' ||
            error.code === 'messaging/registration-token-not-registered') {
            yield user_model_1.User.findByIdAndUpdate(userId, {
                $unset: { fcmToken: 1 }
            });
            console.log(`Removed invalid FCM token for user ${userId}`);
        }
        return null;
    }
});
// Alternative version using more specific typing for different platforms
const sendPushNotificationAlternative = (userId_1, text_1, title_1, ...args_1) => __awaiter(void 0, [userId_1, text_1, title_1, ...args_1], void 0, function* (userId, text, title, data = {}) {
    try {
        const user = yield user_model_1.User.findById(userId);
        if (!user || !user.fcmToken) {
            return null;
        }
        // More explicit typing with platform-specific configurations
        const message = {
            notification: {
                title,
                body: text,
            },
            data: Object.assign(Object.assign({}, data), { type: data.type || 'info', click_action: 'FLUTTER_NOTIFICATION_CLICK', userId: userId.toString() }),
            token: user.fcmToken,
            android: {
                priority: 'high', // This should now work with proper Firebase types
                notification: {
                    sound: 'default',
                    channelId: 'default',
                },
            },
            apns: {
                headers: {
                    'apns-priority': '10',
                },
                payload: {
                    aps: {
                        alert: {
                            title,
                            body: text,
                        },
                        sound: 'default',
                        badge: 1,
                    },
                },
            },
            webpush: {
                headers: {
                    Urgency: 'high',
                },
            },
        };
        const response = yield firebase_1.default.messaging().send(message);
        console.log('Push notification sent successfully:', response);
        return response;
    }
    catch (error) {
        console.error('Error sending push notification:', error);
        // Handle invalid token errors
        if (error.code === 'messaging/invalid-registration-token' ||
            error.code === 'messaging/registration-token-not-registered') {
            yield user_model_1.User.findByIdAndUpdate(userId, {
                $unset: { fcmToken: 1 }
            });
            console.log(`Removed invalid FCM token for user ${userId}`);
        }
        return null;
    }
});
// Multicast version for sending to multiple users
const sendPushNotificationToMultiple = (userIds_1, text_1, title_1, ...args_1) => __awaiter(void 0, [userIds_1, text_1, title_1, ...args_1], void 0, function* (userIds, text, title, data = {}) {
    try {
        const users = yield user_model_1.User.find({ _id: { $in: userIds } }).select('fcmToken');
        const validTokens = users
            .map(user => user.fcmToken)
            .filter((token) => !!token);
        if (validTokens.length === 0) {
            console.log('No valid FCM tokens found for the specified users');
            return null;
        }
        const message = {
            notification: {
                title,
                body: text,
            },
            data: Object.assign(Object.assign({}, data), { type: data.type || 'info', click_action: 'FLUTTER_NOTIFICATION_CLICK' }),
            tokens: validTokens,
            android: {
                priority: 'high',
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'default',
                        badge: 1,
                    },
                },
            },
        };
        const response = yield firebase_1.default.messaging().sendEachForMulticast(message);
        console.log(`Push notification sent to ${response.successCount} devices successfully`);
        // Handle failures
        response.responses.forEach((resp, idx) => {
            if (!resp.success) {
                console.error(`Failed to send to token ${validTokens[idx]}:`, resp.error);
            }
        });
        return response;
    }
    catch (error) {
        console.error('Error sending multicast push notification:', error);
        return null;
    }
});
// Get notifications with advanced filtering
const getNotificationUnderUser = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, filters = {}) {
    const { page = 1, limit = 20, type, read, startDate, endDate, sortBy = 'createdAt', sortOrder = 'desc' } = filters;
    // Build query
    const query = { userId };
    // Apply type filter
    if (type && type !== 'all') {
        query.type = type;
    }
    // Apply read status filter
    if (read !== undefined) {
        query.read = read === 'true';
    }
    // Apply date range filter
    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate)
            query.createdAt.$gte = new Date(startDate);
        if (endDate)
            query.createdAt.$lte = new Date(endDate);
    }
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    // Execute query with pagination
    const result = yield notification_model_1.NotificationModel.find(query)
        .sort(sort)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .populate('userId', 'name email');
    const total = yield notification_model_1.NotificationModel.countDocuments(query);
    // Get counts by type for filters
    const typeCounts = yield notification_model_1.NotificationModel.aggregate([
        { $match: { userId: new mongoose_1.default.Types.ObjectId(userId) } },
        {
            $group: {
                _id: '$type',
                count: { $sum: 1 },
                unread: {
                    $sum: { $cond: [{ $eq: ['$read', false] }, 1, 0] }
                }
            }
        }
    ]);
    // Get user preferences
    const user = yield user_model_1.User.findById(userId).select('notificationPreferences');
    return {
        notifications: result,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
        },
        filters: {
            typeCounts: typeCounts.reduce((acc, curr) => {
                acc[curr._id] = { total: curr.count, unread: curr.unread };
                return acc;
            }, {}),
            totalUnread: yield notification_model_1.NotificationModel.countDocuments({ userId, read: false }),
            userPreferences: user === null || user === void 0 ? void 0 : user.notificationPreferences
        }
    };
});
// Mark as read
const markAsRead = (notificationId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_model_1.NotificationModel.findOneAndUpdate({ _id: notificationId, userId }, { read: true }, { new: true }).populate('userId', 'name email');
    return result;
});
// Mark all as read
const markAllAsRead = (userId, type) => __awaiter(void 0, void 0, void 0, function* () {
    const query = { userId, read: false };
    if (type)
        query.type = type;
    const result = yield notification_model_1.NotificationModel.updateMany(query, { read: true });
    return result;
});
// Get unread count
const getUnreadCount = (userId, type) => __awaiter(void 0, void 0, void 0, function* () {
    const query = { userId, read: false };
    if (type)
        query.type = type;
    const count = yield notification_model_1.NotificationModel.countDocuments(query);
    return count;
});
// Delete notification
const deleteNotification = (notificationId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_model_1.NotificationModel.findOneAndDelete({
        _id: notificationId,
        userId,
    });
    return result;
});
exports.notificationService = {
    getNotificationUnderUser,
    sendRealTimeNotification,
    sendPushNotification,
    sendPushNotificationToMultiple,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    deleteNotification,
};
