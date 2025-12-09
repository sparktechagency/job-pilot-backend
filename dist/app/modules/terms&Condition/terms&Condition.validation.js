"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privacyPolicyValidationSchema = void 0;
const zod_1 = require("zod");
// Zod schema for validating PrivacyPolicy
exports.privacyPolicyValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        text: zod_1.z.string().min(1, "Text cannot be empty"), // Ensuring text is not empty
    })
});
