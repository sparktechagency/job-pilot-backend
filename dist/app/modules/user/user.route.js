"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const fileUploadHandler_1 = __importDefault(require("../../middlewares/fileUploadHandler"));
const convertHeicToPngMiddleware_1 = __importDefault(require("../../middlewares/convertHeicToPngMiddleware"));
const user_constant_1 = require("./user.constant");
const UPLOADS_FOLDER = 'uploads/users';
const upload = (0, fileUploadHandler_1.default)(UPLOADS_FOLDER);
const router = express_1.default.Router();
//create user
router
    .route('/create-user')
    .post(upload.fields([
    {
        name: "profileImage",
        maxCount: 1
    },
    {
        name: "CV",
        maxCount: 1
    },
]), (0, convertHeicToPngMiddleware_1.default)(UPLOADS_FOLDER), user_controller_1.UserController.createUser);
router.post('/create-admin', upload.fields([
    {
        name: "profileImage",
        maxCount: 1
    },
    {
        name: "CV",
        maxCount: 1
    },
]), (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), user_controller_1.UserController.createAdmin);
router.post('/create-analyst', upload.fields([
    {
        name: "profileImage",
        maxCount: 1
    },
    {
        name: "CV",
        maxCount: 1
    },
]), (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), user_controller_1.UserController.createAnalyst);
router.post('/create-manual-user', upload.fields([
    {
        name: "profileImage",
        maxCount: 1
    },
    {
        name: "CV",
        maxCount: 1
    },
]), (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), user_controller_1.UserController.createManualUser);
router.post('/profile-image', upload.single('profileImage'), (0, convertHeicToPngMiddleware_1.default)(UPLOADS_FOLDER), user_controller_1.UserController.updateUserImage);
// router.post(
//   '/fill-up-user-data',
//   auth('common'),
//   uploadDrivingLicense.fields([
//     { name: 'drivingLicenseFront', maxCount: 1 },
//     { name: 'drivingLicenseBack', maxCount: 1 },
//   ]),
//   convertHeicToPngMiddleware(UPLOADS_DRIVING_LICENSE_FOLDER),
//   UserController.fillUpUserDetails
// );
// sub routes must be added after the main routes
router.get('/profile', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.analyst), user_controller_1.UserController.getMyProfile);
router.patch('/profile-update', (0, auth_1.default)(user_constant_1.USER_ROLE.user), 
// validateRequest(UserValidation.updateUserValidationSchema),
upload.fields([
    {
        name: "profileImage",
        maxCount: 1
    },
    {
        name: "CV",
        maxCount: 1
    },
]), (0, convertHeicToPngMiddleware_1.default)(UPLOADS_FOLDER), user_controller_1.UserController.updateMyProfile);
router.get('/get-one-users/:id', (0, auth_1.default)('admin'), user_controller_1.UserController.getSingleUserFromDB);
router.post('/delete-account', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.analyst), 
// Remove temporarily
user_controller_1.UserController.deleteUserWithPassword);
router.delete('/delete/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), // Only admin and superAdmin can delete users
user_controller_1.UserController.deleteUserById);
router.patch('/profile-update/:id', // Add :id parameter
(0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), // Only admin/superAdmin can update other users
upload.fields([
    {
        name: "profileImage",
        maxCount: 1
    },
    {
        name: "CV",
        maxCount: 1
    },
]), (0, convertHeicToPngMiddleware_1.default)(UPLOADS_FOLDER), user_controller_1.UserController.updateUserById // New controller method
);
//main routes
router
    .route('/')
    .get((0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.analyst), user_controller_1.UserController.getAllUsers)
    .delete(user_controller_1.UserController.deleteMyProfile);
router.get('/single-user/:id', user_controller_1.UserController.getSingleUserById);
router.get('/search-user/:Uid', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), user_controller_1.UserController.searchByUid);
exports.UserRoutes = router;
