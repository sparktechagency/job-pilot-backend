"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleValidationError = (error) => {
    const errorMessages = Object.values(error.errors).map((el) => {
        return {
            path: el.path,
            message: el.message,
        };
    });
    const code = 400;
    return {
        code,
        message: 'Validation Error',
        errorMessages,
    };
};
exports.default = handleValidationError;
