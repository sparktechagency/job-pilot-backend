"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecruiterModel = void 0;
const mongoose_1 = require("mongoose");
// Define Mongoose Schema for Recruiter
const recruiterSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    RecID: { type: String, required: true },
    jobTitle: { type: String, required: true },
    companyName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    linkedin: { type: String, required: true },
    imageUrl: { type: String, required: false },
    email: { type: String, required: false },
}, { timestamps: true });
// Create Mongoose Model
exports.RecruiterModel = (0, mongoose_1.model)('Recruiter', recruiterSchema);
