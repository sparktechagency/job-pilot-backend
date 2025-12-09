"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = exports.deleteUserValidationSchema = void 0;
const zod_1 = require("zod");
// Add this to your user.validation.ts
exports.deleteUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string({
            required_error: 'Password is required to delete account',
        }).min(1, 'Password cannot be empty'),
    }),
});
const createUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z
            .string({
            required_error: 'First name is required.',
            invalid_type_error: 'First name must be string',
        })
            .min(1, 'First name cannot be empty.'),
        email: zod_1.z
            .string({
            required_error: 'Email is required.',
        })
            .email('Invalid email address.'),
        phoneNumber: zod_1.z.string({
            required_error: 'Phone number is required.',
            invalid_type_error: 'Phone number must be string',
        }),
        isHumanTrue: zod_1.z.boolean().optional(),
        Designation: zod_1.z.string({ required_error: 'Designation is required.' }),
        password: zod_1.z
            .string({
            required_error: 'Password is required.',
        })
            .min(8, 'Password must be at least 8 characters long.'),
        ConfirmPassword: zod_1.z
            .string({
            required_error: 'Password is required.',
        })
            .min(8, 'Password must be at least 8 characters long.'),
    }),
});
const updateUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z
            .string({
            required_error: 'First name is required.',
            invalid_type_error: 'First name must be string',
        })
            .min(1, 'First name cannot be empty.')
            .optional(),
        email: zod_1.z
            .string({
            required_error: 'Email is required.',
        })
            .email('Invalid email address.')
            .optional(),
        phoneNumber: zod_1.z
            .string({
            required_error: 'Phone number is required.',
            invalid_type_error: 'Phone number must be string',
        })
            .optional(),
        address: zod_1.z
            .string({
            required_error: 'Address is required.',
            invalid_type_error: 'Address must be string',
        })
            .optional(),
    }),
});
exports.UserValidation = {
    createUserValidationSchema,
    updateUserValidationSchema, deleteUserValidationSchema: exports.deleteUserValidationSchema,
};
