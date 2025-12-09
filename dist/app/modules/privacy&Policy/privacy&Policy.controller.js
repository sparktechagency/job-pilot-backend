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
exports.privacyPolicyController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const privacy_Policy_service_1 = require("./privacy&Policy.service");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const createPrivacyPolicy = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    // Validate that text is provided
    if (!payload.text || payload.text.trim() === '') {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Privacy policy text is required!");
    }
    const result = yield privacy_Policy_service_1.privacyPolicyService.createPrivacyPolicyInDB(payload);
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: "Privacy Policy created successfully!",
        data: result
    });
}));
const updatePrivacyPolicy = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const { privacyPolicyId } = req.params;
    // Validate that text is provided for update
    if (!payload.text || payload.text.trim() === '') {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Privacy policy text is required for update!");
    }
    const result = yield privacy_Policy_service_1.privacyPolicyService.updatePrivacyPolicyFromDB(payload, privacyPolicyId);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Privacy Policy Not Update Successfully!");
    }
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: "Successfully Updated",
        data: result
    });
}));
const readPrivacyPolicy = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield privacy_Policy_service_1.privacyPolicyService.readPrivacyPolicyFromDB();
    // Check if result exists (not null/undefined) instead of checking length
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "No Privacy Policy Data Found");
    }
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: 'Get privacy policy data successfully!',
        data: result
    });
}));
exports.privacyPolicyController = {
    createPrivacyPolicy,
    updatePrivacyPolicy,
    readPrivacyPolicy
};
