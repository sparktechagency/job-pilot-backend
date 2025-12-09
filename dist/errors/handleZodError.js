"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (error) => {
    const errorMessages = error.errors.map(el => {
        return {
            path: el.path[el.path.length - 1],
            message: el.message,
        };
    });
    const code = 400;
    return {
        code,
        message: 'Zod Validation Error',
        errorMessages,
    };
};
exports.default = handleZodError;
