"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryRoute = void 0;
const express_1 = __importDefault(require("express"));
const library_controller_1 = require("./library.controller");
const fileUploadHandler_1 = __importDefault(require("../../middlewares/fileUploadHandler"));
const user_constant_1 = require("../user/user.constant");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// Define the upload folder
const UPLOADS_FOLDER_USER_DOCUMENTS = 'uploads/library';
const upload = (0, fileUploadHandler_1.default)(UPLOADS_FOLDER_USER_DOCUMENTS);
router.post('/create', 
// validateRequest(libraryValidation.fileUploadSchema),
(0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.analyst, user_constant_1.USER_ROLE.superAdmin), upload.fields([
    {
        name: "fileUrl",
        maxCount: 1
    },
    {
        name: "thumbnailUrl",
        maxCount: 1
    }
]), library_controller_1.libraryController.createLibraryItem);
router.get('/get-all', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.analyst, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.user), library_controller_1.libraryController.readAllCreateLibraryItem);
router.delete('/delete/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), library_controller_1.libraryController.deleteLibraryItem);
// update and get by id route need to add
router.get('/get-single/:itemId', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.analyst), library_controller_1.libraryController.getOneItemById);
router.patch('/update/:LId', 
// validateRequest(libraryValidation.fileUploadSchema),
(0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.analyst, user_constant_1.USER_ROLE.superAdmin), upload.fields([
    {
        name: "fileUrl",
        maxCount: 1
    },
    {
        name: "thumbnailUrl",
        maxCount: 1
    }
]), library_controller_1.libraryController.updateLibraryItem);
exports.LibraryRoute = router;
