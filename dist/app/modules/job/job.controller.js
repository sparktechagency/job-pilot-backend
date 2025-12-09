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
exports.jobController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const job_service_1 = require("./job.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_constant_1 = require("./user.constant");
const createAppliedJob = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('📁 File received:', req.file);
    console.log('📦 Request body:', req.body);
    const payload = req.body;
    // Use type assertion for authenticated request
    const authenticatedReq = req;
    if (!authenticatedReq.user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }
    const adminId = authenticatedReq.user.id;
    // Handle file upload
    if (req.file) {
        payload.companyLogo = `/uploads/jobs/${req.file.filename}`;
        console.log('✅ Company logo path:', payload.companyLogo);
    }
    else {
        console.log('⚠️ No company logo file received');
    }
    const result = yield job_service_1.jobService.createAppliedIntoDB(Object.assign(Object.assign({}, payload), { adminId }));
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: "Job assigned successfully",
        data: result
    });
}));
const getJobStatusPercentage = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query; // Optional: get specific user's data
    // Use type assertion for authenticated request
    const authenticatedReq = req;
    const currentUserId = authenticatedReq.user.id;
    let result;
    // If user has 'user' role, only show their data
    if (authenticatedReq.user.role === user_constant_1.USER_ROLE.user) {
        result = yield job_service_1.jobService.getJobStatusPercentage(currentUserId);
    }
    // If admin/analyst and specific userId provided, show that user's data
    else if (userId && typeof userId === 'string') {
        result = yield job_service_1.jobService.getJobStatusPercentage(userId);
    }
    // Otherwise show all data (for admins)
    else {
        result = yield job_service_1.jobService.getJobStatusPercentage();
    }
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: "Job status percentages retrieved successfully",
        data: result,
    });
}));
const readAllJobApplied = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, page, limit } = req.query;
    // Parse 'page' and 'limit' query parameters as numbers
    // Default to page 1 and limit 10 if not provided or invalid
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 20;
    let result;
    // Check if status is provided
    if (!status) {
        result = yield job_service_1.jobService.readAllJobAppliedIntoDB(pageNumber, limitNumber);
    }
    else {
        // Pass the status from the query dynamically to filterByStatusFromDB
        result = yield job_service_1.jobService.filterByStatusFromDB(status, pageNumber, limitNumber);
    }
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: "Get All job Applied Data!",
        data: result
    });
}));
const readAllJobAppliedForSingleUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, page, limit } = req.query;
    // Use type assertion for authenticated request
    const authenticatedReq = req;
    const userId = authenticatedReq.user.id;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 20;
    const result = yield job_service_1.jobService.filterByStatusForSingleUserFromDB(status, pageNumber, limitNumber, userId);
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: "Get All job Applied Data!",
        data: result
    });
}));
const readSingleJobApplied = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { appliedJobId } = req.params;
    const result = yield job_service_1.jobService.readSingleJobAppliedIntoDB(appliedJobId);
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: "Get single data!",
        data: result
    });
}));
const updateJobApplied = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const { appliedJobId } = req.params;
    console.log('📁 Update file received:', req.file);
    console.log('📦 Update payload:', payload);
    // Handle file upload for update
    if (req.file) {
        payload.companyLogo = `/uploads/jobs/${req.file.filename}`;
        console.log('✅ Updated company logo path:', payload.companyLogo);
    }
    const result = yield job_service_1.jobService.updateJobAppliedIntoDB(appliedJobId, payload);
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: "Update Successful.",
        data: result
    });
}));
const deleteAppliedJob = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { appliedJobId } = req.params;
    const result = yield job_service_1.jobService.deleteAppliedJobFromDB(appliedJobId);
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: "Delete Successful",
        data: result
    });
}));
const dashboardData = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { period } = req.query;
    console.log('..........', period);
    // Ensure 'period' is a string and is one of 'day', 'week', or 'month'
    if (typeof period === 'string' && ['day', 'week', 'month'].includes(period)) {
        const result = yield job_service_1.jobService.dashboardDataFromDB(period);
        (0, sendResponse_1.default)(res, {
            code: http_status_codes_1.StatusCodes.OK,
            message: 'Your dashboard data retrieved successfully',
            data: result,
        });
    }
    else {
        const result = yield job_service_1.jobService.dashboardAllDataNoTimePeriodFromDB();
        (0, sendResponse_1.default)(res, {
            code: http_status_codes_1.StatusCodes.OK,
            message: 'Your dashboard data retrieved successfully".',
            data: result
        });
    }
}));
const dashboardDataFromSpecificMonth = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract month and year from query parameters
    const { month, year } = req.query;
    // Convert month and year to numbers
    const monthNumber = Number(month); // Convert to number
    const yearNumber = Number(year); // Convert to number
    // Ensure the month and year are valid numbers
    if (isNaN(monthNumber) || isNaN(yearNumber)) {
        return next(new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid month or year"));
    }
    // Pass the numbers to the service
    const result = yield job_service_1.jobService.dashboardDataFromSpecificMonth(monthNumber, yearNumber);
    // Send the response
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: "Your dashboard data fetched successfully",
        data: result
    });
}));
const getUserJobData = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Use type assertion for authenticated request
    const authenticatedReq = req;
    const userId = authenticatedReq.user.id;
    console.log(authenticatedReq.user);
    const result = yield job_service_1.jobService.getUserJobData(userId);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No Data Found!");
    }
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: "All Data Get Successfully.",
        data: result
    });
}));
exports.jobController = {
    createAppliedJob,
    readAllJobApplied,
    readSingleJobApplied,
    getJobStatusPercentage,
    updateJobApplied,
    deleteAppliedJob,
    dashboardData,
    readAllJobAppliedForSingleUser,
    dashboardDataFromSpecificMonth,
    getUserJobData
};
