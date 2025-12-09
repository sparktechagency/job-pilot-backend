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
exports.notificationController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const notification_service_1 = require("./notification.service");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
// Helper function to get user ID safely
const getUserId = (req) => {
    const authenticatedReq = req;
    if (!authenticatedReq.user || !authenticatedReq.user.id) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }
    return authenticatedReq.user.id;
};
// Get notifications with filtering
const getNotificationUnderUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = getUserId(req);
    const filters = req.query;
    const result = yield notification_service_1.notificationService.getNotificationUnderUser(id, filters);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No Notification Found!");
    }
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: "Notifications retrieved successfully",
        data: result
    });
}));
// Mark as read
const markNotificationAsRead = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = getUserId(req);
    const { notificationId } = req.params;
    const result = yield notification_service_1.notificationService.markAsRead(notificationId, id);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Notification not found");
    }
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: "Notification marked as read",
        data: result
    });
}));
// Mark all as read
const markAllNotificationsAsRead = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = getUserId(req);
    const { type } = req.body;
    const result = yield notification_service_1.notificationService.markAllAsRead(id, type);
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: type ? `All ${type} notifications marked as read` : "All notifications marked as read",
        data: result
    });
}));
// Get unread count
const getUnreadNotificationCount = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = getUserId(req);
    const { type } = req.query;
    const count = yield notification_service_1.notificationService.getUnreadCount(id);
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: "Unread count retrieved successfully",
        data: { unreadCount: count }
    });
}));
// Send test notification
const sendTestNotification = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = getUserId(req);
    const { title, text, type } = req.body;
    const notification = yield notification_service_1.notificationService.sendRealTimeNotification(id, title || 'Test Notification', text || 'This is a test notification from your app!', type || 'info');
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: "Test notification sent successfully",
        data: notification
    });
}));
exports.notificationController = {
    getNotificationUnderUser,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadNotificationCount,
    sendTestNotification,
};
