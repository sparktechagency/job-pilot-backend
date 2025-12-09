"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    const responseData = {
        code: data.code,
        success: data.success,
        message: data.message || null,
        data: data.data || null,
    };
    if (data.meta) {
        responseData.meta = data.meta;
    }
    // Make sure we're using the correct status code
    res.status(data.code).json(responseData);
};
exports.default = sendResponse;
