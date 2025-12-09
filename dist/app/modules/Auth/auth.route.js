"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const user_constant_1 = require("./../user/user.constant");
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("../user/user.validation");
const user_controller_1 = require("../user/user.controller");
const auth_validation_1 = require("./auth.validation");
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post('/register', (0, validateRequest_1.default)(user_validation_1.UserValidation.createUserValidationSchema), user_controller_1.UserController.createUser);
router.post('/login', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.loginValidationSchema), auth_controller_1.AuthController.loginIntoDB);
router.post('/forgot-password', auth_controller_1.AuthController.forgotPassword);
router.post('/resend-otp', auth_controller_1.AuthController.resendOTP);
router.post('/verify-email', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.verifyEmailValidationSchema), auth_controller_1.AuthController.verifyEmail);
router.post('/reset-password', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.resetPasswordValidationSchema), auth_controller_1.AuthController.resetPassword);
//refresh token
router.post('/refresh-token', auth_controller_1.AuthController.refreshToken);
router.patch('/change-password', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.analyst, user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(auth_validation_1.AuthValidation.changePasswordValidationSchema), auth_controller_1.AuthController.changePassword);
exports.AuthRoutes = router;
