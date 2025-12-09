"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.libraryValidation = void 0;
const zod_1 = require("zod");
// Enum for file types
var FileType;
(function (FileType) {
    FileType["VIDEO"] = "video";
    FileType["PDF"] = "pdf";
})(FileType || (FileType = {}));
// Zod Validation Schema
const fileUploadSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, "Title is required"), // Ensure a title is provided
        description: zod_1.z.string().min(1, "Description is required"), // Ensure description is provided
        category: zod_1.z.string().min(1, "Category is required"), // Ensure category is provided
        fileType: zod_1.z.enum([FileType.VIDEO, FileType.PDF], { message: "File type must be 'video' or 'pdf'" }), // Enforce video or pdf
        fileUrl: zod_1.z.string().url("Invalid file URL format"), // Ensure fileUrl is a valid URL
        thumbnailUrl: zod_1.z.string().url("Invalid file URL format"), // Ensure thumbnailUrl is a valid URL
    })
});
exports.libraryValidation = {
    fileUploadSchema
};
