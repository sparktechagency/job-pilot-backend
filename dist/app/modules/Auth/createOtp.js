"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createOtp = () => {
    const oneTimeCode = (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000).toString();
    const oneTimeCodeExpire = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes
    return { oneTimeCode, oneTimeCodeExpire };
};
exports.default = createOtp;
