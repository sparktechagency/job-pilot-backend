"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRouter = void 0;
// notification.routes.ts
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const notification_controller_1 = require("./notification.controller");
const router = express_1.default.Router();
// Get notifications with filtering
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.analyst), notification_controller_1.notificationController.getNotificationUnderUser);
// Get unread count
router.get('/unread-count', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.analyst), notification_controller_1.notificationController.getUnreadNotificationCount);
// Mark as read
router.patch('/:notificationId/read', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.analyst), notification_controller_1.notificationController.markNotificationAsRead);
// Mark all as read
router.patch('/mark-all-read', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.analyst), notification_controller_1.notificationController.markAllNotificationsAsRead);
// Send test notification
router.post('/test', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.analyst), notification_controller_1.notificationController.sendTestNotification);
exports.notificationRouter = router;
