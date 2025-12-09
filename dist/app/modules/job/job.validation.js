"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobValidationSchema = void 0;
const zod_1 = require("zod");
// Define Zod validation schema
exports.jobValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        companyName: zod_1.z.string().min(1, 'Company name is required'),
        jobTitle: zod_1.z.string().min(1, 'Job title is required'),
        userId: zod_1.z.string().min(1, 'User name is required'),
        adminId: zod_1.z.string().min(1, 'Admin ID is required'),
        status: zod_1.z.enum(['Applied', 'Interviewing', 'Offer', 'Rejected']).refine((val) => ['Applied', 'Interviewing', 'Offer', 'Rejected'].includes(val), {
            message: 'Invalid status', // Custom error message
        }),
        appliedDate: zod_1.z.date(),
        jdLink: zod_1.z.string().url('Invalid job description link'),
    }),
});
