"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faqValidationSchema = void 0;
const zod_1 = require("zod");
exports.faqValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        question: zod_1.z.string().min(5, 'Question must be at least 5 characters long').max(200, 'Question cannot exceed 200 characters'),
        description: zod_1.z.string().min(10, 'Description must be at least 10 characters long').max(1000, 'Description cannot exceed 1000 characters'),
    })
});
