"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const handleValidationError_1 = __importDefault(require("../../errors/handleValidationError"));
const handleZodError_1 = __importDefault(require("../../errors/handleZodError"));
const handleDuplicateError_1 = __importDefault(require("../../errors/handleDuplicateError"));
const logger_1 = require("../../shared/logger");
const globalErrorHandler = (error, req, res, next) => {
    // Log error
    config_1.default.env === 'development'
        ? console.log('🚨 globalErrorHandler ~~ ', error)
        : logger_1.errorLogger.error('🚨 globalErrorHandler ~~ ', error);
    let code = 500;
    let message = 'Something went wrong';
    let errorMessages = [];
    // Handle ZodError
    if (error.name === 'ZodError') {
        const simplifiedError = (0, handleZodError_1.default)(error);
        code = simplifiedError.code;
        message = `${simplifiedError.errorMessages
            .map(err => err.message)
            .join(', ')}`;
        errorMessages = simplifiedError.errorMessages;
    }
    // Handle ValidationError (e.g., Mongoose)
    else if (error.name === 'ValidationError') {
        const simplifiedError = (0, handleValidationError_1.default)(error);
        code = simplifiedError.code;
        message = `${simplifiedError.errorMessages
            .map(err => err.message)
            .join(', ')}`;
        errorMessages = simplifiedError.errorMessages;
    }
    // Handle DuplicateError (e.g., from database unique constraint violation)
    else if (error.name === 'DuplicateError') {
        const simplifiedError = (0, handleDuplicateError_1.default)(error);
        code = simplifiedError.code;
        message = `${simplifiedError.errorMessages
            .map(err => err.message)
            .join(', ')}`;
        errorMessages = simplifiedError.errorMessages;
    }
    // Handle ApiError (custom error type)
    else if (error instanceof ApiError_1.default) {
        code = error.code;
        message = error.message || 'Something went wrong';
        errorMessages = error.message
            ? [
                {
                    path: '',
                    message: error.message,
                },
            ]
            : [];
    }
    // Handle other general errors
    else if (error instanceof Error) {
        message = error.message || 'Internal Server Error';
        errorMessages = error.message
            ? [
                {
                    path: '',
                    message: error.message,
                },
            ]
            : [];
    }
    // Format multiple error messages as a comma-separated list in the message field
    const formattedMessage = errorMessages.length > 1
        ? errorMessages.map(err => err.message).join(', ')
        : message;
    // Send response with statusCode, success, message, and error
    res.status(code).json({
        code,
        message: `${formattedMessage}`,
        error: errorMessages, // Error details (path and message)
        stack: config_1.default.env === 'development' ? error === null || error === void 0 ? void 0 : error.stack : undefined, // Stack trace in development mode
    });
};
exports.default = globalErrorHandler;
