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
exports.termsConditionController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const terms_Condition_service_1 = require("./terms&Condition.service");
const terms_Condition_model_1 = require("./terms&Condition.model");
const createTermsCondition = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    yield terms_Condition_model_1.TermsConditionModel.deleteMany({});
    const result = yield terms_Condition_service_1.termsConditionService.createTermsConditionInDB(payload);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Terms And Condition Not Created Successfully!");
    }
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.CREATED,
        message: "Terms And Condition Created Successfully!",
        data: result
    });
}));
const updateTermsCondition = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const { termsConditionId } = req.params;
    const result = yield terms_Condition_service_1.termsConditionService.updateTermsConditionFromDB(payload, termsConditionId);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Terms And Condition Not Update Successfully!");
    }
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: "Successfully Updated",
        data: result
    });
}));
const readTermsCondition = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield terms_Condition_service_1.termsConditionService.readTermsConditionFromDB();
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No Data Found");
    }
    (0, sendResponse_1.default)(res, {
        code: http_status_codes_1.StatusCodes.OK,
        message: 'Get Terms And Condition data successfully!',
        data: result
    });
}));
exports.termsConditionController = {
    createTermsCondition,
    updateTermsCondition,
    readTermsCondition
};
