"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: 'Email is Required',
            invalid_type_error: 'Email must be string',
        }),
        password: zod_1.z.string({
            required_error: 'Password is required',
            invalid_type_error: 'Password must be string',
        }),
    }),
});
const verifyEmailValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: 'Email is required',
        }),
        oneTimeCode: zod_1.z.string({
            required_error: 'One time code is required',
        }),
    }),
});
const resetPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: 'Email is required',
        }),
        newPassword: zod_1.z.string({
            required_error: 'New Password is required',
        }),
        ConfirmPassword: zod_1.z.string({
            required_error: 'confirm Password is required',
        }),
    }),
});
const changePasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string({
            required_error: 'Current Password is required',
        }),
        newPassword: zod_1.z.string({
            required_error: 'New Password is required',
        }),
    }),
});
exports.AuthValidation = {
    loginValidationSchema,
    verifyEmailValidationSchema,
    resetPasswordValidationSchema,
    changePasswordValidationSchema
};
