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
exports.recruitersController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const recruiters_service_1 = require("./recruiters.service");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const recruiters_model_1 = require("./recruiters.model");
const createRecruiters = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    // Generate UserId (Auto-increment 5-digit number with 'R-' prefix)
    const lastRecruiter = yield recruiters_model_1.RecruiterModel.findOne().sort({ RecID: -1 });
    let newRecruiterId = 'R-00001'; // Default to the first user ID
    if (lastRecruiter) {
        const lastUserId = parseInt(lastRecruiter.RecID.replace('R-', ''), 10); // Remove the 'R-' prefix and convert to number
        newRecruiterId = `R-${(lastUserId + 1).toString().padStart(5, '0')}`; // Add 'R-' and pad the number to 5 digits
    }
    payload.RecID = newRecruiterId;
    if (req.file) {
        payload.imageUrl = `/uploads/recruiters/${req.file.filename}`;
    }
    const result = yield recruiters_service_1.recruitersService.createRecruitersFromDB(payload);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Recruiter Not Created Successfully!");
    }
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.ACCEPTED,
        message: "Recruiter Created Successfully.",
        data: result
    });
}));
const readAllRecruiter = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield recruiters_service_1.recruitersService.getAllRecruiters();
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Didn't get Data Successfully!");
    }
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.ACCEPTED,
        message: "Recruiters get Successfully.",
        data: result
    });
}));
const readSingleRecruiter = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { RId } = req.params;
    const result = yield recruiters_service_1.recruitersService.getSingleRecruiters(RId);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Didn't get Data Successfully!");
    }
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.ACCEPTED,
        message: "Recruiters get Successfully.",
        data: result
    });
}));
const updateRecruiter = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const { RId } = req.params;
    if (req.file) {
        payload.imageUrl = `/uploads/recruiters/${req.file.filename}`;
    }
    const result = yield recruiters_service_1.recruitersService.updateRecruiter(RId, payload);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Update unsuccessful!");
    }
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.ACCEPTED,
        message: "Update Done Successfully",
        data: result
    });
}));
const deleteRecruiter = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { RId } = req.params;
    const result = yield recruiters_service_1.recruitersService.deleteRecruiter(RId);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Delete unsuccessful!");
    }
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.ACCEPTED,
        message: "Delete Done Successfully",
        data: result
    });
}));
exports.recruitersController = {
    createRecruiters,
    readAllRecruiter,
    readSingleRecruiter,
    deleteRecruiter,
    updateRecruiter
};
