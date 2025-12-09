"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const library_interface_1 = require("./library.interface");
// Mongoose schema definition
const fileUploadSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'], // Category is just a string now
    },
    fileType: {
        type: String,
        enum: Object.values(library_interface_1.FileType), // Restricts the type to "video" or "pdf"
        required: [true, 'File type is required'],
    },
    fileUrl: {
        type: String,
    },
    viewCount: {
        type: Number,
        default: 0,
    },
    videoDuration: {
        type: String,
    },
    thumbnailUrl: {
        type: String,
        required: [true, 'Thumbnail URL is required'], // URL or path after file upload
    },
});
// Mongoose Model
exports.LibraryModel = mongoose_1.default.model('FileUpload', fileUploadSchema);
