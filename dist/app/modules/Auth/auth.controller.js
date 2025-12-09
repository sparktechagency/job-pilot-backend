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
exports.AuthController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const auth_service_1 = require("./auth.service");
const mongoose_1 = require("mongoose");
//login
const loginIntoDB = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Login Route1", req.body);
    const result = yield auth_service_1.AuthService.loginIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: 'Login Successful',
        data: result,
    });
}));
// Social login success handler
const socialLoginSuccess = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return (0, sendResponse_1.default)(res, {
            code: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            message: 'Social authentication failed',
            data: null,
        });
    }
    const result = yield auth_service_1.AuthService.socialLogin(req.user);
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: 'Social login successful',
        data: result,
    });
}));
// Social login failure handler
const socialLoginFailure = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.UNAUTHORIZED,
        message: 'Social authentication failed',
        data: null,
    });
}));
//forgot password
const forgotPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const result = yield auth_service_1.AuthService.forgotPassword(email);
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: 'OTP sent to your email, please verify your email within the next 3 minutes',
        data: result,
    });
}));
//resend otp
const resendOTP = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const result = yield auth_service_1.AuthService.resendOTP(email);
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: 'OTP sent to your email, please verify your email within the next 3 minutes',
        data: result,
    });
}));
//verify email
const verifyEmail = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyData = req.body;
    const result = yield auth_service_1.AuthService.verifyEmail(verifyData);
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: 'Verify Email Successful',
        data: result,
    });
}));
//reset password
const resetPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const resetPasswordData = req.body;
    yield auth_service_1.AuthService.resetPassword(resetPasswordData);
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: 'Reset Password Successful',
        data: {},
    });
}));
//change password
const changePassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Use type assertion to access the user property
    const user = req.user;
    const id = user === null || user === void 0 ? void 0 : user.id;
    console.log("========>>>> controller user from token", id);
    // Add proper validation
    if (!id) {
        return (0, sendResponse_1.default)(res, {
            code: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            message: 'User not authenticated',
            data: null,
        });
    }
    const changePasswordData = req.body;
    // Convert string ID to ObjectId
    const objectId = new mongoose_1.Types.ObjectId(id);
    const result = yield auth_service_1.AuthService.changePassword(objectId, changePasswordData);
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: 'Change Password Successful',
        data: result,
    });
}));
//refresh token
const refreshToken = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const result = yield auth_service_1.AuthService.refreshToken(refreshToken);
    res.cookie('refreshToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    });
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: 'Login Successful',
        data: result,
    });
}));
exports.AuthController = {
    loginIntoDB,
    verifyEmail,
    forgotPassword,
    resetPassword,
    changePassword,
    refreshToken,
    resendOTP,
    socialLoginSuccess,
    socialLoginFailure,
};
