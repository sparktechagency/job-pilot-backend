"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recruitersValidation = void 0;
const zod_1 = require("zod");
const recruiterValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Recruiter name is required'),
        jobTitle: zod_1.z.string().min(1, 'Job title is required'),
        companyName: zod_1.z.string().min(1, 'Company name is required'),
        phoneNumber: zod_1.z.string().min(10, 'Phone number should be at least 10 characters'),
        linkedin: zod_1.z.string().url('Invalid LinkedIn URL').min(1, 'LinkedIn URL is required'),
        imageUrl: zod_1.z.string().url().optional(), // Optional field for image URL
    })
});
exports.recruitersValidation = {
    recruiterValidationSchema
};
