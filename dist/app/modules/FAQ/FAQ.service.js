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
exports.faqService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const FAQ_model_1 = require("./FAQ.model");
const createFaqIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield FAQ_model_1.FaqModel.create(payload);
    return result;
});
const updateFaqIntoDB = (payload, id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield FAQ_model_1.FaqModel.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Update Failed");
    }
    return result;
});
const readAllFaqFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield FAQ_model_1.FaqModel.find({});
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No FAQ Found!");
    }
    return result;
});
const readSingleFaqFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield FAQ_model_1.FaqModel.findById(id);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No FAQ Found");
    }
    return result;
});
const deleteFaqFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield FAQ_model_1.FaqModel.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Delete Failed");
    }
    return result;
});
exports.faqService = {
    createFaqIntoDB,
    updateFaqIntoDB,
    readAllFaqFromDB,
    readSingleFaqFromDB,
    deleteFaqFromDB
};
