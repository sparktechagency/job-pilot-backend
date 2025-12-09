"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSchema = void 0;
const zod_1 = require("zod");
// Define Zod validation schema for Notification
exports.NotificationSchema = zod_1.z.object({
    body: zod_1.z.object({
        text: zod_1.z.string().min(1, "Text is required"), // Ensures text is a non-empty string
        userId: zod_1.z.string().length(24, "userId should be a valid ObjectId"), // Validates ObjectId length
    })
});
