"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateError = (error) => {
    const errorMessages = [
        {
            path: error.keyValue ? Object.keys(error.keyValue)[0] : 'unknown',
            message: `${Object.keys(error.keyValue)[0]} already exists`,
        },
    ];
    const code = 409;
    return {
        code,
        message: 'Duplicate entry detected',
        errorMessages,
    };
};
exports.default = handleDuplicateError;
