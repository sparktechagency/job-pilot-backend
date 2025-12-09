"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.faqRouter = void 0;
const user_constant_1 = require("./../user/user.constant");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const FAQ_controller_1 = require("./FAQ.controller");
const router = express_1.default.Router();
// post , get , get single , update, delete
router.post('/create', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), FAQ_controller_1.faqController.createFaq);
router.patch('/update/:faqId', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), FAQ_controller_1.faqController.updateFaq);
router.get('/read-all', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.analyst, user_constant_1.USER_ROLE.user), FAQ_controller_1.faqController.readAllFaq);
router.get('/get-single-faq/:faqId', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), FAQ_controller_1.faqController.readSingleFaq);
router.delete('/delete/:faqId', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), FAQ_controller_1.faqController.deleteFaq);
exports.faqRouter = router;
