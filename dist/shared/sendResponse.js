"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    const resData = {
        code: data.code,
        message: data.message,
        data: {
            attributes: data.data,
        },
    };
    res.status(data.code).json(resData);
};
exports.default = sendResponse;
