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
exports.UserService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_model_1 = require("./user.model");
const emailHelper_1 = require("../../../helpers/emailHelper");
const createOtp_1 = __importDefault(require("../Auth/createOtp"));
const mongoose_1 = __importDefault(require("mongoose"));
//create new user
const createUserToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { oneTimeCode, oneTimeCodeExpire } = (0, createOtp_1.default)();
    payload.otpCountDown = 180;
    payload.oneTimeCode = oneTimeCode;
    payload.oneTimeCodeExpire = oneTimeCodeExpire;
    console.log("payload==============>>>>>>>>>>>", payload);
    const newUser = yield user_model_1.User.create(payload);
    if (!newUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create user');
    }
    if (!newUser.isEmailVerified) {
        // Send email verification
        yield (0, emailHelper_1.sendEmailVerification)(newUser.email, oneTimeCode);
    }
    return newUser;
});
const createAdminAnalystUserToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.otpCountDown = 180;
    console.log("payload==============>>>>>>>>>>>", payload);
    const newUser = yield user_model_1.User.create(payload);
    if (!newUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create user');
    }
    if (!newUser.isEmailVerified) {
        // Send email verification
        yield (0, emailHelper_1.sendEmailInvitation)(newUser.email, payload.password, newUser.role);
    }
    return newUser;
});
//get all user
const getAllUsersFromDB = (pageNumber, limitNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find({ role: 'user' })
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber) // Skip (page - 1) * limit records
        .limit(limitNumber); // Limit to the specified number of records;
    return users;
});
const getAllUsersByRoleFromDB = (pageNumber, limitNumber, role) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find({ role: role })
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber) // Skip (page - 1) * limit records
        .limit(limitNumber); // Limit to the specified number of records;
    return users;
});
//get single user
const getSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isExistUserById(id);
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    return user;
});
//update my profile
const updateMyProfile = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    return user_model_1.User.findByIdAndUpdate(id, payload, { new: true });
});
//fill up user details data
const fillUpUserDetails = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    return user_model_1.User.findByIdAndUpdate(userId, payload, { new: true });
});
const updateUserImage = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    return user_model_1.User.findByIdAndUpdate(userId, payload, { new: true });
});
//get my profile
const getMyProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistUser = yield user_model_1.User.isExistUserById(userId);
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    return isExistUser;
});
// In your UserService - complete hard delete
const deleteUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Attempting to COMPLETELY DELETE user with ID:', userId);
        // Validate MongoDB ObjectId format
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid user ID format');
        }
        // Check if user exists
        const user = yield user_model_1.User.findById(userId);
        if (!user) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
        }
        // Prevent deleting super admin
        if (user.role === 'superAdmin') {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Cannot delete super admin user');
        }
        // Perform COMPLETE deletion (hard delete)
        const deletedUser = yield user_model_1.User.findByIdAndDelete(userId);
        if (!deletedUser) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to delete user');
        }
        // Return meaningful result
        return {
            _id: deletedUser._id,
            email: user.email,
            name: `${user.firstName} ${user.lastName || ''}`.trim(),
            role: user.role,
            deletedAt: new Date(),
            message: 'User permanently deleted from database'
        };
    }
    catch (error) {
        console.error('Error in deleteUserById service:', error);
        // If it's already an ApiError, re-throw it
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        // For other errors, throw a proper ApiError
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
});
const changeUserStatus = (id, action) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate if the user exists
    const user = yield user_model_1.User.isExistUserById(id);
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    // Prepare the update payload
    let updatePayload = {};
    switch (action) {
        case 'block':
            updatePayload = { isBlocked: true, status: 'Blocked' };
            break;
        case 'unblock':
            updatePayload = { isBlocked: false, status: 'Active' };
            break;
        case 'delete':
            updatePayload = { isDeleted: true, status: 'Delete' };
            break;
        case 'active':
            updatePayload = { isDeleted: false, isBlocked: false, status: 'Active' };
            break;
        default:
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid action!');
    }
    // Update and return the user
    return user_model_1.User.findByIdAndUpdate(id, updatePayload, { new: true });
});
//delete my profile
const deleteMyProfile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield getSingleUserFromDB(id);
    return user_model_1.User.findByIdAndUpdate(id, { status: 'Delete', isDeleted: true }, { new: true });
});
//Update user email verification and send OTP.
const isUpdateUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const { oneTimeCode, oneTimeCodeExpire } = (0, createOtp_1.default)();
    const updatedUser = yield user_model_1.User.findOneAndUpdate({ email }, {
        isEmailVerified: false,
        isResetPassword: false,
        oneTimeCode,
        oneTimeCodeExpire,
    }, { new: true });
    if (!updatedUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User not found for update!');
    }
    // Send email verification
    yield (0, emailHelper_1.sendEmailVerification)(updatedUser.email, oneTimeCode);
    return updatedUser;
});
const getSingleUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id);
    return result;
});
const searchByUidFromDB = (Uid) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.find({ userId: Uid });
    return result;
});
// Add this to your existing user.service.ts
const deleteUserWithPassword = (userId, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select('+password');
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User doesn't exist!");
    }
    // Check if user has local auth (has password)
    if (user.authType === 'local') {
        if (!password) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Password is required to delete account');
        }
        // Check if user has a password (should not be undefined for local auth)
        if (!user.password) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User account has no password set');
        }
        // Verify password - now TypeScript knows user.password is string
        const isPasswordMatch = yield user_model_1.User.isMatchPassword(password, user.password);
        if (!isPasswordMatch) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid password');
        }
    }
    // Soft delete the user
    return user_model_1.User.findByIdAndUpdate(userId, {
        status: 'Delete',
        isDeleted: true,
        email: `deleted_${Date.now()}@deleted.com`, // Optional: anonymize email
        phoneNumber: null, // Optional: remove personal data
        fcmToken: null // Optional: remove device tokens
    }, { new: true });
});
const updateUserById = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('=== UPDATE USER BY ID SERVICE ===');
    console.log('User ID:', userId);
    console.log('Update payload:', payload);
    // Check if user exists
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User not found');
    }
    // Check if email is being updated and if it's already taken
    if (payload.email && payload.email !== user.email) {
        const existingUserWithEmail = yield user_model_1.User.findOne({
            email: payload.email,
            _id: { $ne: userId } // Exclude current user
        });
        if (existingUserWithEmail) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Email already exists');
        }
    }
    // Prepare update data
    const updateData = Object.assign({}, payload);
    // Remove any undefined or null values
    Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === null) {
            delete updateData[key];
        }
    });
    console.log('Final update data:', updateData);
    // Update user
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, updateData, {
        new: true, // Return updated document
        runValidators: true // Run schema validators
    }).select('-password -ConfirmPassword'); // Exclude passwords
    if (!updatedUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User not found after update');
    }
    console.log('User updated successfully:', updatedUser.email);
    return updatedUser;
});
exports.UserService = {
    createUserToDB,
    getAllUsersFromDB,
    getAllUsersByRoleFromDB,
    getSingleUserFromDB,
    getMyProfile,
    updateMyProfile, deleteUserWithPassword,
    updateUserImage,
    fillUpUserDetails,
    deleteMyProfile,
    isUpdateUser, updateUserById,
    changeUserStatus, deleteUserById,
    createAdminAnalystUserToDB,
    searchByUidFromDB
};
