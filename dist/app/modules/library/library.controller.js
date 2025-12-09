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
exports.libraryController = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const library_service_1 = require("./library.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const get_video_duration_1 = __importDefault(require("get-video-duration"));
const createLibraryItem = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const payload = req.body;
    const files = req.files;
    // Handle main file (video)
    if ((files === null || files === void 0 ? void 0 : files.fileUrl) && ((_a = files.fileUrl[0]) === null || _a === void 0 ? void 0 : _a.filename)) {
        const fileName = files.fileUrl[0].filename;
        // Set the file URL (this will be stored in DB or sent to frontend)
        payload.fileUrl = `/uploads/library/${fileName}`;
        // Get absolute file path to read locally
        const filePath = path_1.default.resolve(process.cwd(), 'uploads', 'library', fileName);
        console.log('Resolved File Path:', filePath);
        if (fs_1.default.existsSync(filePath)) {
            console.log('File exists at path:', filePath);
            try {
                const durationInSeconds = yield (0, get_video_duration_1.default)(filePath);
                const minutes = Math.floor(durationInSeconds / 60);
                const seconds = Math.floor(durationInSeconds % 60);
                payload.videoDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
            catch (err) {
                console.error('Error fetching video duration:', err);
                payload.videoDuration = null;
            }
        }
        else {
            console.error('File does not exist at path:', filePath);
            payload.videoDuration = null;
        }
    }
    // Handle thumbnail
    if ((files === null || files === void 0 ? void 0 : files.thumbnailUrl) && ((_b = files.thumbnailUrl[0]) === null || _b === void 0 ? void 0 : _b.filename)) {
        payload.thumbnailUrl = `/uploads/library/${files.thumbnailUrl[0].filename}`;
    }
    // Save to DB
    const result = yield library_service_1.libraryService.createLibraryItem(payload);
    (0, sendResponse_1.default)(res, {
        code: 201,
        message: "Library Created successfully.",
        data: result
    });
}));
const readAllCreateLibraryItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 20;
    const result = yield library_service_1.libraryService.readAllCreateLibraryItem(pageNumber, limitNumber);
    (0, sendResponse_1.default)(res, {
        code: 200,
        message: "Library Items Get successfully.",
        data: result
    });
});
const deleteLibraryItem = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield library_service_1.libraryService.deleteLibraryItem(id);
    (0, sendResponse_1.default)(res, {
        code: 200,
        message: "Library Items Delete successfully.",
        data: result
    });
}));
const getOneItemById = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId } = req.params;
    const result = yield library_service_1.libraryService.getOneItemByIdFromDB(itemId);
    (0, sendResponse_1.default)(res, {
        code: 200,
        message: "Library Item Get successfully.",
        data: result
    });
}));
const updateLibraryItem = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { LId } = req.params;
    const payload = req.body;
    const files = req.files;
    if ((files === null || files === void 0 ? void 0 : files.fileUrl) && ((_a = files.fileUrl[0]) === null || _a === void 0 ? void 0 : _a.filename)) {
        // Correct path from project root
        const filePath = path_1.default.resolve(process.cwd(), 'uploads', 'library', files.fileUrl[0].filename);
        console.log('Resolved File Path:', filePath);
        if (fs_1.default.existsSync(filePath)) {
            console.log('File exists at path:', filePath);
            try {
                const durationInSeconds = yield (0, get_video_duration_1.default)(filePath);
                const minutes = Math.floor(durationInSeconds / 60);
                const seconds = Math.floor(durationInSeconds % 60);
                payload.videoDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
            catch (err) {
                console.error('Error fetching video duration:', err);
                payload.videoDuration = null;
            }
        }
        else {
            console.error('File does not exist at path:', filePath);
            payload.videoDuration = null;
        }
    }
    if ((files === null || files === void 0 ? void 0 : files.thumbnailUrl) && ((_b = files.thumbnailUrl[0]) === null || _b === void 0 ? void 0 : _b.filename)) {
        payload.thumbnailUrl = `/uploads/library/${files.thumbnailUrl[0].filename}`;
    }
    const result = yield library_service_1.libraryService.updateLibraryItem(LId, payload);
    (0, sendResponse_1.default)(res, { code: 201, message: "Library update successfully.", data: result });
}));
exports.libraryController = {
    createLibraryItem,
    readAllCreateLibraryItem,
    deleteLibraryItem,
    getOneItemById,
    updateLibraryItem
};
