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
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const heic_convert_1 = __importDefault(require("heic-convert"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_codes_1 = require("http-status-codes");
const convertHeicToPngMiddleware = (UPLOADS_FOLDER) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // Check if req.file is present and if it's a HEIC/HEIF file
        if (req.file &&
            (req.file.mimetype === 'image/heic' || req.file.mimetype === 'image/heif')) {
            try {
                // Read the HEIC file as a buffer (Buffer is compatible with heic-convert)
                const heicBuffer = yield fs_1.promises.readFile(req.file.path);
                // Convert the HEIC buffer to PNG format
                const pngBuffer = yield (0, heic_convert_1.default)({
                    buffer: heicBuffer.buffer, // Use `.buffer` to convert Buffer to ArrayBuffer
                    format: 'PNG',
                });
                // Create a new file name based on the original file name and the current date-time
                const originalFileName = path_1.default.basename(req.file.originalname, path_1.default.extname(req.file.originalname));
                const currentDateTime = new Date()
                    .toISOString()
                    .replace(/:/g, '-')
                    .replace(/\..+/, '');
                const pngFileName = `${originalFileName}_${currentDateTime}.png`;
                const pngFilePath = path_1.default.join(UPLOADS_FOLDER, pngFileName);
                // Write the converted PNG buffer to a new file
                yield fs_1.promises.writeFile(pngFilePath, new Uint8Array(pngBuffer));
                // Remove the original HEIC file
                yield fs_1.promises.unlink(req.file.path);
                // Update file properties for the newly created PNG file
                req.file.path = pngFilePath;
                req.file.filename = pngFileName;
                req.file.mimetype = 'image/png';
            }
            catch (error) {
                // Handle any errors during the conversion process
                console.error('Error converting HEIC to PNG:', error);
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to convert HEIC to PNG.');
            }
        }
        next();
    });
};
exports.default = convertHeicToPngMiddleware;
// import { Request, Response, NextFunction } from 'express';
// import { promises as fs } from 'fs';
// import path from 'path';
// import convert from 'heic-convert';
// import { Express } from 'express';
// import ApiError from '../../errors/ApiError';
// import { StatusCodes } from 'http-status-codes';
// // Interface for file types
// interface File extends Express.Multer.File {
//   path: string;
//   filename: string;
//   mimetype: string;
// }
// const convertHeicToPngMiddleware = (UPLOADS_FOLDER: string) => {
//   return async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     // Check if req.file is present and if it's a HEIC/HEIF file
//     if (
//       req.file &&
//       (req.file.mimetype === 'image/heic' || req.file.mimetype === 'image/heif')
//     ) {
//       try {
//         // Read the HEIC file as a buffer (Buffer is compatible with heic-convert)
//         const heicBuffer = await fs.readFile(req.file.path);
//         // Convert the HEIC buffer to PNG format
//         const pngBuffer = await convert({
//           buffer: new Uint8Array(heicBuffer), // Convert Buffer to Uint8Array (ArrayBufferView)
//           format: 'PNG',
//         });
//         // Create a new file name based on the original file name and the current date-time
//         const originalFileName = path.basename(
//           req.file.originalname,
//           path.extname(req.file.originalname)
//         );
//         const currentDateTime = new Date()
//           .toISOString()
//           .replace(/:/g, '-')
//           .replace(/\..+/, '');
//         const pngFileName = `${originalFileName}_${currentDateTime}.png`;
//         const pngFilePath = path.join(UPLOADS_FOLDER, pngFileName);
//         // Write the converted PNG buffer to a new file
//         await fs.writeFile(pngFilePath, new Uint8Array(pngBuffer));
//         // Remove the original HEIC file
//         await fs.unlink(req.file.path);
//         // Update file properties for the newly created PNG file
//         req.file.path = pngFilePath;
//         req.file.filename = pngFileName;
//         req.file.mimetype = 'image/png';
//       } catch (error) {
//         // Handle any errors during the conversion process
//         console.error('Error converting HEIC to PNG:', error);
//         throw new ApiError(
//           StatusCodes.BAD_REQUEST,
//           'Failed to convert HEIC to PNG.'
//         );
//       }
//     }
//     next();
//   };
// };
// export default convertHeicToPngMiddleware;
