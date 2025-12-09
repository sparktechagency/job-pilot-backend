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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_model_1 = require("../user/user.model");
const jwtHelper_1 = require("../../../helpers/jwtHelper");
const config_1 = __importDefault(require("../../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const emailHelper_1 = require("../../../helpers/emailHelper");
const createOtp_1 = __importDefault(require("./createOtp"));
// Helper function for user status validation
const validateUserStatus = (user) => {
    if (user.isDeleted) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Your account has been deleted.');
    }
    if (user.isBlocked) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Your account is blocked.');
    }
};
const loginIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload);
    const user = yield user_model_1.User.findOne({
        email: payload.email,
    }).select('+password');
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User not found.');
    }
    // For social auth users, they can't use password login
    if (user.authType !== 'local') {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Please use ${user.authType} login for this account.`);
    }
    validateUserStatus(user);
    // Check if password exists and is a string
    if (!user.password || typeof user.password !== 'string') {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid user account configuration.');
    }
    const isPasswordValid = yield bcrypt_1.default.compare(payload.password, user.password);
    if (!isPasswordValid) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'The password you entered is incorrect. Please check and try again.');
    }
    const _a = user.toObject(), { password } = _a, userWithoutPassword = __rest(_a, ["password"]);
    const accessTokenPayload = {
        id: user._id,
        email: user.email,
        role: user.role,
    };
    const accessToken = jwtHelper_1.jwtHelper.createToken(accessTokenPayload, config_1.default.jwt.accessSecret, config_1.default.jwt.accessExpirationTime);
    const refreshToken = jwtHelper_1.jwtHelper.createToken(accessTokenPayload, config_1.default.jwt.accessSecret, config_1.default.jwt.refreshExpirationTime);
    return {
        user: userWithoutPassword,
        tokens: {
            accessToken,
            refreshToken,
        },
    };
});
// Social login service
const socialLogin = (user) => __awaiter(void 0, void 0, void 0, function* () {
    validateUserStatus(user);
    const accessTokenPayload = {
        id: user._id,
        email: user.email,
        role: user.role,
    };
    const accessToken = jwtHelper_1.jwtHelper.createToken(accessTokenPayload, config_1.default.jwt.accessSecret, config_1.default.jwt.accessExpirationTime);
    const refreshToken = jwtHelper_1.jwtHelper.createToken(accessTokenPayload, config_1.default.jwt.accessSecret, config_1.default.jwt.refreshExpirationTime);
    const _a = user.toObject(), { password } = _a, userWithoutPassword = __rest(_a, ["password"]);
    return {
        user: userWithoutPassword,
        tokens: {
            accessToken,
            refreshToken,
        },
    };
});
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email, isEmailVerified: true });
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User not found.');
    }
    // Social auth users can't reset password this way
    if (user.authType !== 'local') {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Password reset not available for ${user.authType} accounts.`);
    }
    validateUserStatus(user);
    const { oneTimeCode, oneTimeCodeExpire } = (0, createOtp_1.default)();
    user.otpCountDown = 180;
    user.isResetPassword = true;
    user.oneTimeCode = oneTimeCode;
    user.oneTimeCodeExpire = oneTimeCodeExpire;
    yield user.save();
    yield (0, emailHelper_1.sendResetPasswordEmail)(user.email, oneTimeCode);
    return user;
});
const resendOTP = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User not found.');
    }
    // Reset OTP countdown and generate a new OTP
    user.otpCountDown = 180; // Reset countdown to 180 seconds
    const { oneTimeCode, oneTimeCodeExpire } = (0, createOtp_1.default)(); // Generate new OTP
    user.oneTimeCode = oneTimeCode;
    user.oneTimeCodeExpire = oneTimeCodeExpire;
    yield user.save();
    // Send the OTP via email
    yield (0, emailHelper_1.sendResetPasswordEmail)(user.email, oneTimeCode);
    return user;
});
const verifyEmail = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, oneTimeCode } = payload;
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'No account found with this email address. Please check and try again.');
    }
    if (user.oneTimeCode !== String(oneTimeCode) || !user.oneTimeCodeExpire) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'The OTP provided is invalid. Please check and try again.');
    }
    if (new Date() > new Date(user.oneTimeCodeExpire)) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'The OTP has expired. Please request a new one.');
    }
    if (user.isEmailVerified && !user.isResetPassword) {
        user.isEmailVerified = true;
        user.oneTimeCode = null;
        user.oneTimeCodeExpire = null;
        user.otpCountDown = null;
        return yield user.save();
    }
    if (user.isEmailVerified && user.isResetPassword) {
        user.isEmailVerified = true;
        user.isResetPassword = false;
        user.oneTimeCode = null;
        user.oneTimeCodeExpire = null;
        user.otpCountDown = null;
        return yield user.save();
    }
    user.isEmailVerified = true;
    user.isResetPassword = false;
    user.oneTimeCode = null;
    user.oneTimeCodeExpire = null;
    user.otpCountDown = null;
    yield user.save();
    const accessTokenPayload = {
        id: user._id,
        email: user.email,
        role: user.role,
    };
    const accessToken = jwtHelper_1.jwtHelper.createToken(accessTokenPayload, config_1.default.jwt.accessSecret, config_1.default.jwt.accessExpirationTime);
    const refreshToken = jwtHelper_1.jwtHelper.createToken(accessTokenPayload, config_1.default.jwt.accessSecret, config_1.default.jwt.refreshExpirationTime);
    return {
        tokens: {
            accessToken,
            refreshToken,
        },
    };
});
const resetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, ConfirmPassword, newPassword } = payload;
    console.log("==============>>>>>>>>>>", email, ConfirmPassword, newPassword);
    if (newPassword !== ConfirmPassword) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Passwords do not match.');
    }
    const user = yield user_model_1.User.findOne({ email }).select('+password');
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User not found.');
    }
    // Social auth users can't reset password this way
    if (user.authType !== 'local') {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Password reset not available for ${user.authType} accounts.`);
    }
    validateUserStatus(user);
    user.password = newPassword;
    user.ConfirmPassword = ConfirmPassword;
    yield user.save();
    return user;
});
const changePassword = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("userId From service", userId);
    const user = yield user_model_1.User.findById(userId).select('+password');
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User not found.');
    }
    // Social auth users can't change password
    if (user.authType !== 'local') {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Password change not available for ${user.authType} accounts.`);
    }
    console.log("============>>>>", user);
    validateUserStatus(user);
    // Check if current password exists and is a string
    if (!user.password || typeof user.password !== 'string') {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid user account configuration.');
    }
    if (payload.currentPassword === payload.newPassword) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Your new password cannot be the same as the current password. Please choose a different password.');
    }
    const isCurrentPasswordValid = yield bcrypt_1.default.compare(payload.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Your current password is incorrect.');
    }
    user.password = payload.newPassword;
    user.ConfirmPassword = payload.newPassword; // Should be newPassword, not currentPassword
    yield user.save();
    return user;
});
const refreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(refreshToken);
    const decoded = jwtHelper_1.jwtHelper.verifyToken(refreshToken, config_1.default.jwt.accessSecret);
    const user = yield user_model_1.User.findById(decoded.id).select('+password');
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User not found.');
    }
    const accessTokenPayload = {
        id: user._id,
        email: user.email,
        role: user.role,
    };
    const accessToken = jwtHelper_1.jwtHelper.createToken(accessTokenPayload, config_1.default.jwt.accessSecret, config_1.default.jwt.accessExpirationTime);
    return {
        accessToken,
    };
});
exports.AuthService = {
    loginIntoDB,
    verifyEmail,
    forgotPassword,
    resendOTP,
    resetPassword,
    changePassword,
    refreshToken,
    socialLogin
};
