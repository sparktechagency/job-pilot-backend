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
exports.fcmTokenController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const user_model_1 = require("../user/user.model");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
// Save FCM token
const saveFCMToken = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authenticatedReq = req;
    if (!authenticatedReq.user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }
    const { id } = authenticatedReq.user;
    const { fcmToken } = req.body;
    if (!fcmToken) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "FCM token is required");
    }
    const user = yield user_model_1.User.findByIdAndUpdate(id, {
        $set: { fcmToken },
        $addToSet: { fcmTokens: fcmToken }
    }, { new: true }).select('name email fcmToken notificationPreferences');
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: "FCM token saved successfully",
        data: user,
    });
}));
// Update notification preferences
const updateNotificationPreferences = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authenticatedReq = req;
    if (!authenticatedReq.user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }
    const { id } = authenticatedReq.user;
    const { preferences } = req.body;
    const user = yield user_model_1.User.findByIdAndUpdate(id, {
        $set: { notificationPreferences: preferences }
    }, { new: true }).select('name email notificationPreferences');
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: "Notification preferences updated successfully",
        data: user,
    });
}));
// Remove FCM token (logout)
const removeFCMToken = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authenticatedReq = req;
    if (!authenticatedReq.user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }
    const { id } = authenticatedReq.user;
    const { fcmToken } = req.body;
    const user = yield user_model_1.User.findByIdAndUpdate(id, {
        $unset: { fcmToken: "" },
        $pull: { fcmTokens: fcmToken }
    }, { new: true }).select('name email');
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: "FCM token removed successfully",
        data: user,
    });
}));
exports.fcmTokenController = {
    saveFCMToken,
    updateNotificationPreferences,
    removeFCMToken,
};
