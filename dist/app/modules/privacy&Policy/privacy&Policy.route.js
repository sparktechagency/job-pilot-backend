"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.privacyPolicyRouter = void 0;
// privacy&Policy.routes.ts
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const privacy_Policy_controller_1 = require("./privacy&Policy.controller");
const router = express_1.default.Router();
// Create privacy policy route
router.post('/create', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), privacy_Policy_controller_1.privacyPolicyController.createPrivacyPolicy);
router.patch('/update/:privacyPolicyId', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), privacy_Policy_controller_1.privacyPolicyController.updatePrivacyPolicy);
router.get('/read', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.analyst, user_constant_1.USER_ROLE.user), privacy_Policy_controller_1.privacyPolicyController.readPrivacyPolicy);
exports.privacyPolicyRouter = router;
