"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.termsConditionRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const terms_Condition_controller_1 = require("./terms&Condition.controller");
const router = express_1.default.Router();
// Create terms and conditions route
router.post('/create', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), terms_Condition_controller_1.termsConditionController.createTermsCondition);
router.patch('/update/:termsConditionId', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), terms_Condition_controller_1.termsConditionController.updateTermsCondition);
router.get('/read', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.analyst, user_constant_1.USER_ROLE.user), terms_Condition_controller_1.termsConditionController.readTermsCondition);
exports.termsConditionRouter = router;
