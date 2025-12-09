"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivacyPolicyModel = void 0;
// privacy&Policy.model.ts
const mongoose_1 = require("mongoose");
// Create the PrivacyPolicy Mongoose schema
const privacyPolicySchema = new mongoose_1.Schema({
    text: {
        type: String,
        required: [true, 'Privacy policy text is required'],
        trim: true,
        minlength: [10, 'Privacy policy text must be at least 10 characters long']
    },
}, {
    timestamps: true, // Add createdAt and updatedAt
});
// Create the Mongoose model using the schema
exports.PrivacyPolicyModel = (0, mongoose_1.model)('PrivacyPolicy', privacyPolicySchema);
