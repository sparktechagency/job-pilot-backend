"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fileUploadHandler;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function fileUploadHandler(UPLOADS_FOLDER) {
    // Ensure the upload folder exists
    if (!fs_1.default.existsSync(UPLOADS_FOLDER)) {
        fs_1.default.mkdirSync(UPLOADS_FOLDER, { recursive: true });
    }
    // Configure multer storage
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, UPLOADS_FOLDER); // Use the provided destination folder
        },
        filename: (req, file, cb) => {
            const fileExt = path_1.default.extname(file.originalname); // Get the file extension
            const filename = file.originalname
                .replace(fileExt, '') // Remove extension
                .toLowerCase()
                .split(' ')
                .join('-') +
                '-' +
                Date.now(); // Append a timestamp
            cb(null, filename + fileExt); // Set the final filename
        },
    });
    // File filter to allow only specific file types
    const fileFilter = (req, file, cb) => {
        const allowedTypes = [
            'image/jpg',
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/heic',
            'image/heif',
            'video/mp4',
            'audio/mp3', 'application/pdf'
        ];
        const fileExt = path_1.default.extname(file.originalname).toLowerCase();
        const isPdfByExtension = fileExt === '.pdf';
        if (allowedTypes.includes(file.mimetype) || isPdfByExtension) {
            cb(null, true); // Accept file
        }
        else {
            console.error(`File rejected: ${file.originalname} (MIME type: ${file.mimetype})`);
            cb(new Error('Only jpg, jpeg, png, gif, webp, heic, heif, mp4, mp3, and pdf formats are allowed!'));
        }
    };
    // Create and return the upload middleware
    return (0, multer_1.default)({
        storage,
        limits: {
            fileSize: 5 * 1024 * 1024 * 1024, // 20MB limit
        },
        fileFilter,
    });
}
