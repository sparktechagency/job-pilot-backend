"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentValidation = void 0;
const zod_1 = require("zod");
// Zod validation schema for 
const paymentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number().positive(), // Ensure the amount is a positive number
        transactionId: zod_1.z.string().min(1), // Ensure the transactionId is a non-empty string
    })
});
exports.paymentValidation = {
    paymentValidationSchema
};
