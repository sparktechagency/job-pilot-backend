"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fcmTokenRouter = void 0;
// routes/fcmToken.routes.ts
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const fcmToken_controller_1 = require("./fcmToken.controller");
const router = express_1.default.Router();
router.post('/save-token', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.analyst), fcmToken_controller_1.fcmTokenController.saveFCMToken);
router.patch('/notification-preferences', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.analyst), fcmToken_controller_1.fcmTokenController.updateNotificationPreferences);
router.delete('/remove-token', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.analyst), fcmToken_controller_1.fcmTokenController.removeFCMToken);
exports.fcmTokenRouter = router;
