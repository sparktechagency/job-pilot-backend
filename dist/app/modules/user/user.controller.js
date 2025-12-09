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
exports.UserController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const user_service_1 = require("./user.service");
const user_model_1 = require("./user.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const mongoose_1 = __importDefault(require("mongoose"));
// Helper function to get user ID safely using type assertion
const getUserId = (req) => {
    // Use type assertion to access the user property
    const user = req.user;
    if (!user || !user.id) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }
    return user.id;
};
// Helper function to get user ID with all possible properties
const getUserIdWithFallback = (req) => {
    const user = req.user;
    const userId = (user === null || user === void 0 ? void 0 : user.userId) || (user === null || user === void 0 ? void 0 : user.id) || (user === null || user === void 0 ? void 0 : user._id) || (user === null || user === void 0 ? void 0 : user.userid);
    if (!userId) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }
    return userId;
};
const deleteUserById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('=== DELETE USER BY ID REQUEST ===');
    const userIdToDelete = req.params.id;
    console.log('User ID to delete:', userIdToDelete);
    if (!userIdToDelete) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User ID is required');
    }
    // Validate user ID format (if using MongoDB)
    if (!mongoose_1.default.Types.ObjectId.isValid(userIdToDelete)) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid user ID format');
    }
    const adminUserId = getUserIdWithFallback(req);
    console.log('Admin performing deletion:', adminUserId);
    const result = yield user_service_1.UserService.deleteUserById(userIdToDelete);
    console.log('Service result:', result);
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: 'User deleted successfully',
        data: result,
    });
}));
const deleteUserWithPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('=== DELETE ACCOUNT REQUEST ===');
    const userId = getUserIdWithFallback(req);
    console.log('Final extracted userId:', userId);
    const { password } = req.body;
    console.log('Password from body:', password);
    if (!password) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Password is required to delete account');
    }
    const result = yield user_service_1.UserService.deleteUserWithPassword(userId, password);
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: 'Account deleted successfully',
        data: result,
    });
}));
const createUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userData = req.body;
    console.log("userData controller ===========>>>>>>>>>", userData);
    const files = req.files;
    // Handle file uploads and assign paths to userData
    if ((files === null || files === void 0 ? void 0 : files.profileImage) && ((_a = files.profileImage[0]) === null || _a === void 0 ? void 0 : _a.filename)) {
        userData.profileImage = `/uploads/users/${files.profileImage[0].filename}`;
    }
    if ((files === null || files === void 0 ? void 0 : files.CV) && ((_b = files.CV[0]) === null || _b === void 0 ? void 0 : _b.filename)) {
        userData.CV = `/uploads/users/${files.CV[0].filename}`;
    }
    // Check if the user already exists by email
    const isUserExist = yield user_model_1.User.findOne({ email: userData === null || userData === void 0 ? void 0 : userData.email });
    if (isUserExist) {
        if (!isUserExist.isEmailVerified) {
            const result = yield user_service_1.UserService.isUpdateUser(isUserExist.email);
            return (0, sendResponse_1.default)(res, {
                code: http_status_codes_1.StatusCodes.OK,
                message: 'User Exist! Need To Verify Email! OTP sent to your email, please verify your email within the next 3 minutes.',
                data: result,
            });
        }
        else {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User already exists');
        }
    }
    // Generate UserId (Auto-increment 4-digit number)
    const lastUser = yield user_model_1.User.findOne().sort({ userId: -1 });
    let newUserId = '0001';
    if (lastUser && lastUser.userId) {
        const lastUserId = parseInt(lastUser.userId, 10);
        newUserId = (lastUserId + 1).toString().padStart(4, '0');
    }
    userData.userId = newUserId;
    // Create the user in the database
    const result = yield user_service_1.UserService.createUserToDB(userData);
    if (result.isEmailVerified) {
        return (0, sendResponse_1.default)(res, {
            code: http_status_codes_1.StatusCodes.OK,
            message: "User's account created successfully.",
            data: result,
        });
    }
    return (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: 'OTP sent to your email, please verify your email within the next 3 minutes.',
        data: result,
    });
}));
const createAdmin = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userData = req.body;
    console.log("userData controller ===========>>>>>>>>>", userData);
    const files = req.files;
    userData.address = "N/A";
    userData.Designation = "N/A";
    userData.ConfirmPassword = userData.password;
    userData.role = "admin";
    // Handle file uploads and assign paths to userData
    if ((files === null || files === void 0 ? void 0 : files.profileImage) && ((_a = files.profileImage[0]) === null || _a === void 0 ? void 0 : _a.filename)) {
        userData.profileImage = `/uploads/users/${files.profileImage[0].filename}`;
    }
    if ((files === null || files === void 0 ? void 0 : files.CV) && ((_b = files.CV[0]) === null || _b === void 0 ? void 0 : _b.filename)) {
        userData.CV = `/uploads/users/${files.CV[0].filename}`;
    }
    // Check if the user already exists by email
    const isUserExist = yield user_model_1.User.findOne({ email: userData === null || userData === void 0 ? void 0 : userData.email });
    if (isUserExist) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User already exists');
    }
    // Generate UserId (Auto-increment 5-digit number)
    const lastUser = yield user_model_1.User.findOne().sort({ userId: -1 });
    let newUserId = '00001'; // Default starting value
    if (lastUser && lastUser.userId) {
        const lastUserId = parseInt(lastUser.userId, 10);
        newUserId = (lastUserId + 1).toString().padStart(5, '0');
    }
    userData.userId = newUserId;
    // Create the user in the database
    const result = yield user_service_1.UserService.createAdminAnalystUserToDB(userData);
    if (result.isEmailVerified) {
        return (0, sendResponse_1.default)(res, {
            code: http_status_codes_1.StatusCodes.OK,
            message: "User's account created successfully.",
            data: result,
        });
    }
    return (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: 'OTP sent to your email, please verify your email within the next 3 minutes.',
        data: result,
    });
}));
const createManualUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userData = req.body;
    console.log("userData controller ===========>>>>>>>>>", userData);
    const files = req.files;
    userData.address = "N/A";
    userData.ConfirmPassword = userData.password;
    userData.role = "user";
    // Handle file uploads and assign paths to userData
    if ((files === null || files === void 0 ? void 0 : files.profileImage) && ((_a = files.profileImage[0]) === null || _a === void 0 ? void 0 : _a.filename)) {
        userData.profileImage = `/uploads/users/${files.profileImage[0].filename}`;
    }
    if ((files === null || files === void 0 ? void 0 : files.CV) && ((_b = files.CV[0]) === null || _b === void 0 ? void 0 : _b.filename)) {
        userData.CV = `/uploads/users/${files.CV[0].filename}`;
    }
    // Check if the user already exists by email
    const isUserExist = yield user_model_1.User.findOne({ email: userData === null || userData === void 0 ? void 0 : userData.email });
    if (isUserExist) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User already exists');
    }
    // Generate UserId (Auto-increment 4-digit number)
    const lastUser = yield user_model_1.User.findOne().sort({ userId: -1 });
    let newUserId = '0001';
    if (lastUser && lastUser.userId) {
        const lastUserId = parseInt(lastUser.userId, 10);
        newUserId = (lastUserId + 1).toString().padStart(4, '0');
    }
    userData.userId = newUserId;
    // Create the user in the database
    const result = yield user_service_1.UserService.createAdminAnalystUserToDB(userData);
    if (result.isEmailVerified) {
        return (0, sendResponse_1.default)(res, {
            code: http_status_codes_1.StatusCodes.OK,
            message: "User's account created successfully.",
            data: result,
        });
    }
    return (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: 'OTP sent to your email, please verify your email within the next 3 minutes.',
        data: result,
    });
}));
const createAnalyst = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userData = req.body;
    console.log("userData controller ===========>>>>>>>>>", userData);
    const files = req.files;
    userData.address = "N/A";
    userData.Designation = "N/A";
    userData.ConfirmPassword = userData.password;
    userData.role = "analyst";
    // Handle file uploads and assign paths to userData
    if ((files === null || files === void 0 ? void 0 : files.profileImage) && ((_a = files.profileImage[0]) === null || _a === void 0 ? void 0 : _a.filename)) {
        userData.profileImage = `/uploads/users/${files.profileImage[0].filename}`;
    }
    if ((files === null || files === void 0 ? void 0 : files.CV) && ((_b = files.CV[0]) === null || _b === void 0 ? void 0 : _b.filename)) {
        userData.CV = `/uploads/users/${files.CV[0].filename}`;
    }
    // Check if the user already exists by email
    const isUserExist = yield user_model_1.User.findOne({ email: userData === null || userData === void 0 ? void 0 : userData.email });
    if (isUserExist) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User already exists');
    }
    // Generate UserId (Auto-increment 4-digit number)
    const lastUser = yield user_model_1.User.findOne().sort({ userId: -1 });
    let newUserId = '0001';
    if (lastUser && lastUser.userId) {
        const lastUserId = parseInt(lastUser.userId, 10);
        newUserId = (lastUserId + 1).toString().padStart(4, '0');
    }
    userData.userId = newUserId;
    // Create the user in the database
    const result = yield user_service_1.UserService.createAdminAnalystUserToDB(userData);
    if (result.isEmailVerified) {
        return (0, sendResponse_1.default)(res, {
            code: http_status_codes_1.StatusCodes.OK,
            message: "User's account created successfully.",
            data: result,
        });
    }
    return (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: 'OTP sent to your email, please verify your email within the next 3 minutes.',
        data: result,
    });
}));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, role } = req.query;
    console.log("===========>>", typeof (page), typeof (limit), role);
    // Default to page 1 and limit 10 if not provided or invalid
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const userRole = role;
    let users;
    if (role) {
        users = yield user_service_1.UserService.getAllUsersByRoleFromDB(pageNumber, limitNumber, userRole);
    }
    else {
        users = yield user_service_1.UserService.getAllUsersFromDB(pageNumber, limitNumber);
    }
    return (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: 'Users retrieved successfully.',
        data: users,
    });
}));
const getSingleUserFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield user_service_1.UserService.getSingleUserFromDB(id);
    return (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: 'User retrieved successfully.',
        data: result,
    });
}));
const getMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = getUserId(req);
    const result = yield user_service_1.UserService.getMyProfile(userId);
    return (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: 'Profile data retrieved successfully.',
        data: result,
    });
}));
const fillUpUserDetails = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = getUserId(req);
    const files = req.files;
    if ((files === null || files === void 0 ? void 0 : files.drivingLicenseFront) && ((_a = files.drivingLicenseFront[0]) === null || _a === void 0 ? void 0 : _a.filename)) {
        req.body.drivingLicenseFront = `/uploads/users/driving_licenses/${files.drivingLicenseFront[0].filename}`;
    }
    if ((files === null || files === void 0 ? void 0 : files.drivingLicenseBack) && ((_b = files.drivingLicenseBack[0]) === null || _b === void 0 ? void 0 : _b.filename)) {
        req.body.drivingLicenseBack = `/uploads/users/driving_licenses/${files.drivingLicenseBack[0].filename}`;
    }
    // Call your service with the userId and userData
    const result = yield user_service_1.UserService.fillUpUserDetails(userId, req.body);
    return (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: 'User details updated successfully.',
        data: result,
    });
}));
const updateMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = getUserId(req);
    const payload = req.body;
    const files = req.files;
    if ((files === null || files === void 0 ? void 0 : files.profileImage) && ((_a = files.profileImage[0]) === null || _a === void 0 ? void 0 : _a.filename)) {
        payload.profileImage = `/uploads/users/${files.profileImage[0].filename}`;
    }
    if ((files === null || files === void 0 ? void 0 : files.CV) && ((_b = files.CV[0]) === null || _b === void 0 ? void 0 : _b.filename)) {
        payload.CV = `/uploads/users/${files.CV[0].filename}`;
    }
    const result = yield user_service_1.UserService.updateMyProfile(userId, payload);
    return (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: 'User updated successfully.',
        data: result,
    });
}));
const updateUserImage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = getUserId(req);
    if (req.file) {
        req.body.image = '/uploads/users/' + req.file.filename;
    }
    const result = yield user_service_1.UserService.updateMyProfile(userId, req.body);
    return (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: 'User Image updated successfully.',
        data: result,
    });
}));
const changeUserStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const { action } = req.body;
    yield user_service_1.UserService.changeUserStatus(userId, action);
    return (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: `User ${action}ed successfully.`,
        data: {},
    });
}));
const deleteMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = getUserId(req);
    yield user_service_1.UserService.deleteMyProfile(userId);
    return (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: 'User deleted successfully.',
        data: {},
    });
}));
const updateUserById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log('=== UPDATE USER BY ID REQUEST ===');
    const userId = req.params.id;
    console.log('User ID to update:', userId);
    if (!userId) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User ID is required');
    }
    // Validate user ID format (if using MongoDB)
    if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid user ID format');
    }
    const payload = req.body;
    const files = req.files;
    console.log('Update payload:', payload);
    console.log('Files received:', files);
    // Handle file uploads and assign paths to payload
    if ((files === null || files === void 0 ? void 0 : files.profileImage) && ((_a = files.profileImage[0]) === null || _a === void 0 ? void 0 : _a.filename)) {
        payload.profileImage = `/uploads/users/${files.profileImage[0].filename}`;
        console.log('Profile image updated:', payload.profileImage);
    }
    if ((files === null || files === void 0 ? void 0 : files.CV) && ((_b = files.CV[0]) === null || _b === void 0 ? void 0 : _b.filename)) {
        payload.CV = `/uploads/users/${files.CV[0].filename}`;
        console.log('CV updated:', payload.CV);
    }
    // Check if user exists
    const existingUser = yield user_model_1.User.findById(userId);
    if (!existingUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    // Prevent updating certain sensitive fields
    const restrictedFields = ['password', 'ConfirmPassword', 'role', 'authType', 'socialId', 'isDeleted', 'isBlocked'];
    restrictedFields.forEach(field => {
        if (payload[field]) {
            console.warn(`⚠️ Attempt to update restricted field: ${field}`);
            delete payload[field];
        }
    });
    const result = yield user_service_1.UserService.updateUserById(userId, payload);
    console.log('User updated successfully:', result.email);
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: 'User updated successfully',
        data: result,
    });
}));
const getSingleUserById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.UserService.getSingleUserFromDB(id);
    if (!result) {
        return (0, sendResponse_1.default)(res, {
            code: http_status_codes_1.StatusCodes.NOT_FOUND,
            message: 'User not found.',
        });
    }
    return (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: 'User retrieved successfully.',
        data: result,
    });
}));
const searchByUid = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { Uid } = req.params;
    const result = yield user_service_1.UserService.searchByUidFromDB(Uid);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No User Found With This Id");
    }
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: "User Found Successfully!",
        data: result
    });
}));
exports.UserController = {
    createUser,
    getAllUsers,
    updateUserImage,
    getSingleUserFromDB,
    getMyProfile,
    updateMyProfile,
    fillUpUserDetails,
    deleteMyProfile,
    changeUserStatus,
    getSingleUserById,
    deleteUserWithPassword,
    createAdmin,
    createManualUser,
    updateUserById,
    createAnalyst,
    deleteUserById,
    searchByUid
};
