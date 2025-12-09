"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobModel = void 0;
const mongoose_1 = require("mongoose");
// Define the schema for JobModel
const jobSchema = new mongoose_1.Schema({
    companyName: { type: String, required: true },
    jobTitle: { type: String, required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    adminId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ["Applied", "Shortlisted", "Rejected", "Interview", "Offer"],
        required: true,
        default: 'Applied'
    },
    appliedDate: { type: Date, required: true },
    companyLogo: { type: String },
    jdLink: { type: String, required: true },
});
// speeds up match + group by
jobSchema.index({ userId: 1, status: 1 });
// Create the JobModel
exports.JobModel = (0, mongoose_1.model)('Job', jobSchema);
