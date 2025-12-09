"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketHelper = void 0;
const logger_1 = require("../../../shared/logger");
// Store user socket connections
const userSockets = new Map();
exports.socketHelper = {
    socket: (io) => {
        io.on('connection', (socket) => {
            logger_1.logger.info(`🔗 User connected: ${socket.id}`);
            // User joins their personal room
            socket.on('join-user-room', (userId) => {
                try {
                    socket.join(userId);
                    userSockets.set(userId, socket.id);
                    logger_1.logger.info(`👤 User ${userId} joined room with socket: ${socket.id}`);
                    // Send confirmation to client
                    socket.emit('room-joined', {
                        success: true,
                        userId,
                        message: 'Successfully joined user room'
                    });
                }
                catch (error) {
                    logger_1.logger.error(`Error joining room for user ${userId}:`, error);
                    socket.emit('room-join-error', { error: 'Failed to join room' });
                }
            });
            // Handle notification events
            socket.on('mark-notification-read', (data) => {
                try {
                    // Broadcast to all clients in the user room
                    io.to(data.userId).emit('notification-read', data.notificationId);
                    logger_1.logger.info(`📖 Notification ${data.notificationId} marked as read for user ${data.userId}`);
                }
                catch (error) {
                    logger_1.logger.error('Error marking notification as read:', error);
                }
            });
            // Handle disconnect
            socket.on('disconnect', (reason) => {
                logger_1.logger.info(`🔌 User disconnected: ${socket.id}, Reason: ${reason}`);
                // Remove user from tracking
                for (const [userId, socketId] of userSockets.entries()) {
                    if (socketId === socket.id) {
                        userSockets.delete(userId);
                        logger_1.logger.info(`🗑️  Removed user ${userId} from tracking`);
                        break;
                    }
                }
            });
            // Handle connection errors
            socket.on('connect_error', (error) => {
                logger_1.logger.error(`❌ Socket connection error: ${error.message}`);
            });
            // Ping-Pong for connection health
            socket.on('ping', () => {
                socket.emit('pong', { timestamp: new Date().toISOString() });
            });
        });
        // Log connection stats periodically
        setInterval(() => {
            logger_1.logger.info(`📊 Active socket connections: ${io.engine.clientsCount}`);
            logger_1.logger.info(`👥 Tracked users: ${userSockets.size}`);
        }, 300000); // Every 5 minutes
    },
    // Helper method to get user socket ID
    getUserSocket: (userId) => {
        return userSockets.get(userId);
    },
    // Helper method to send notification to specific user
    sendToUser: (io, userId, event, data) => {
        const socketId = userSockets.get(userId);
        if (socketId) {
            io.to(socketId).emit(event, data);
            return true;
        }
        return false;
    },
    // Broadcast to all users in a room
    broadcastToRoom: (io, room, event, data) => {
        io.to(room).emit(event, data);
    }
};
