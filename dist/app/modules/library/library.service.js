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
exports.libraryService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const library_model_1 = require("./library.model");
const createLibraryItem = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield library_model_1.LibraryModel.create(payload);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Library is not Created successfully!");
    }
    return result;
});
const readAllCreateLibraryItem = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    // Calculate the number of records to skip based on the current page
    const skip = (page - 1) * limit;
    // Find the records with pagination and sorted by createdAt in descending order
    const result = yield library_model_1.LibraryModel.find({})
        .sort({ createdAt: -1 })
        .skip(skip) // Skip the records based on the page
        .limit(limit); // Limit the number of records to 'limit'
    // If no results are found, throw an error
    if (!result || result.length === 0) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No Data Exist in DB!");
    }
    return result;
});
const deleteLibraryItem = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield library_model_1.LibraryModel.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This item is not deleted!");
    }
    return result;
});
const getOneItemByIdFromDB = (itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield library_model_1.LibraryModel.findById(itemId);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No Data Found With this Id");
    }
    return result;
});
const updateLibraryItem = (LId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield library_model_1.LibraryModel.findByIdAndUpdate(LId, payload, { new: true });
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Library is not Created successfully!");
    }
    return result;
});
exports.libraryService = {
    createLibraryItem,
    readAllCreateLibraryItem,
    deleteLibraryItem,
    getOneItemByIdFromDB,
    updateLibraryItem
};
