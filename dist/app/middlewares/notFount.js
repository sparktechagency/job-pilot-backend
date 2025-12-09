"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const notFound = (req, res, next) => {
    const errorDetails = {
        success: false,
        message: `The requested ${req.originalUrl} endpoint not found!`,
        error: `The requested ${req.originalUrl} endpoint does not exist on this server.`,
    };
    // Send a detailed response for easier debugging
    res.status(http_status_codes_1.default.NOT_FOUND).json(errorDetails);
};
exports.default = notFound;
