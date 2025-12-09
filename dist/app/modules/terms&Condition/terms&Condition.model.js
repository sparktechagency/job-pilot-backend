"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsConditionModel = void 0;
const mongoose_1 = require("mongoose");
// Create the PrivacyPolicy Mongoose schema
const termsConditionSchema = new mongoose_1.Schema({
    text: { type: String, required: true }, // This will store the text of the privacy policy
});
// Create the Mongoose model using the schema
exports.TermsConditionModel = (0, mongoose_1.model)('termsCondition', termsConditionSchema);
