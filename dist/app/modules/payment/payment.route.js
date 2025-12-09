"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoute = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const payment_controller_1 = require("./payment.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const payment_validation_1 = require("./payment.validation");
const router = express_1.default.Router();
router.post('/create', (0, validateRequest_1.default)(payment_validation_1.paymentValidation.paymentValidationSchema), (0, auth_1.default)(user_constant_1.USER_ROLE.user), payment_controller_1.paymentController.createPayment);
router.get('/read-single/:paymentId', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.analyst, user_constant_1.USER_ROLE.user), payment_controller_1.paymentController.getSinglePayment);
router.get('/read-all', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.analyst), payment_controller_1.paymentController.getAllPayment);
router.get('/read-single-under-user', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.analyst, user_constant_1.USER_ROLE.user), payment_controller_1.paymentController.getAllPaymentUnderUser);
exports.paymentRoute = router;
