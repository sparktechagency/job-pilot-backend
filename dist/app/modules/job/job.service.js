"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const job_model_1 = require("./job.model");
const user_model_1 = require("../user/user.model");
const date_fns_1 = require("date-fns");
const mongoose_1 = require("mongoose");
const getJobStatusPercentage = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    let matchStage = {};
    // If userId is provided, filter by specific user
    if (userId && mongoose_1.Types.ObjectId.isValid(userId)) {
        matchStage.userId = new mongoose_1.Types.ObjectId(userId);
    }
    const result = yield job_model_1.JobModel.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$count' },
                statuses: {
                    $push: {
                        status: '$_id',
                        count: '$count',
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                statuses: {
                    $map: {
                        input: '$statuses',
                        as: 'status',
                        in: {
                            status: '$$status.status',
                            count: '$$status.count',
                        },
                    },
                },
                total: 1,
            },
        },
    ]);
    // If no documents found, return default structure
    if (result.length === 0) {
        const defaultStatuses = ['Shortlisted', 'Interview', 'Rejected', 'Offers'];
        return {
            statuses: defaultStatuses.map(status => ({
                status,
                count: 0,
                percentage: 0,
            })),
            total: 0,
        };
    }
    // Calculate total excluding "Applied" status
    const statusesWithoutApplied = result[0].statuses.filter((s) => s.status !== 'Applied');
    const totalWithoutApplied = statusesWithoutApplied.reduce((sum, s) => sum + s.count, 0);
    // Calculate percentages based on total without "Applied"
    const statusesWithPercentage = result[0].statuses.map((s) => {
        let percentage = 0;
        if (s.status !== 'Applied') {
            // For non-Applied statuses, calculate percentage based on total without Applied
            percentage = totalWithoutApplied > 0 ? (s.count / totalWithoutApplied) * 100 : 0;
        }
        // Applied status will have 0 percentage in this calculation
        return {
            status: s.status,
            count: s.count,
            percentage: Math.round(percentage * 100) / 100, // Round to 2 decimal places
        };
    });
    // Filter out Applied status if you don't want it in the response at all
    const filteredStatuses = statusesWithPercentage.filter((s) => s.status !== 'Applied');
    return {
        statuses: filteredStatuses,
        total: result[0].total,
        totalWithoutApplied, // Optional: include this if needed
    };
});
const createAppliedIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('🎯 Creating job with payload:', {
        companyName: payload.companyName,
        jobTitle: payload.jobTitle,
        companyLogo: payload.companyLogo,
        userId: payload.userId
    });
    const result = yield job_model_1.JobModel.create(payload);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Job assignment creation failed");
    }
    console.log('✅ Job created successfully:', {
        id: result._id,
        companyLogo: result.companyLogo
    });
    return result;
});
const readAllJobAppliedIntoDB = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_model_1.JobModel.find({})
        .populate('userId', 'firstName lastName email profileImage')
        .populate('adminId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    if (!result || result.length === 0) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No Data Found!");
    }
    // Transform the data with proper company logo URLs
    const transformedResult = result.map(job => {
        const jobObj = job.toObject();
        return Object.assign(Object.assign({}, jobObj), { companyLogo: jobObj.companyLogo ? jobObj.companyLogo : null, userInfo: jobObj.userId ? {
                firstName: jobObj.userId.firstName,
                lastName: jobObj.userId.lastName,
                email: jobObj.userId.email,
                profileImage: jobObj.userId.profileImage
            } : null, adminInfo: jobObj.adminId ? {
                firstName: jobObj.adminId.firstName,
                lastName: jobObj.adminId.lastName,
                email: jobObj.adminId.email
            } : null });
    });
    return transformedResult;
});
const readSingleJobAppliedIntoDB = (appliedJobId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_model_1.JobModel.findOne({ _id: appliedJobId });
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No Data Found");
    }
    return result;
});
const updateJobAppliedIntoDB = (appliedJobId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_model_1.JobModel.findByIdAndUpdate(appliedJobId, payload, { new: true });
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Update failed!");
    }
    return result;
});
const deleteAppliedJobFromDB = (appliedJobId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield job_model_1.JobModel.findByIdAndDelete(appliedJobId);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Delete Failed");
    }
    return result;
});
const filterByStatusFromDB = (status, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("status====>>>", typeof (status));
    const result = yield job_model_1.JobModel.find({ status: status })
        .sort({ createdAt: -1 }) // Sort by descending order
        .skip((page - 1) * limit) // Skip (page - 1) * limit records
        .limit(limit); // Limit to the specified number of records
    if (!result || result.length === 0) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Didn't find any data!");
    }
    return result;
});
const filterByStatusForSingleUserFromDB = (status, page, limit, id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("status====>>>", typeof (status));
    let result;
    if (status) {
        result = yield job_model_1.JobModel.find({ userId: id, status: status })
            .sort({ createdAt: -1 }) // Sort by descending order
            .skip((page - 1) * limit) // Skip (page - 1) * limit records
            .limit(limit); // Limit to the specified number of records
    }
    else {
        result = yield job_model_1.JobModel.find({ userId: id })
            .sort({ createdAt: -1 }) // Sort by descending order
            .skip((page - 1) * limit) // Skip (page - 1) * limit records
            .limit(limit); // Limit to the specified number of records
    }
    if (!result || result.length === 0) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Didn't find any data!");
    }
    return result;
});
const getTimeRange = (period, date = new Date()) => {
    switch (period) {
        case 'day':
            return { start: (0, date_fns_1.startOfDay)(date), end: (0, date_fns_1.endOfDay)(date) };
        case 'week':
            return { start: (0, date_fns_1.startOfWeek)(date), end: (0, date_fns_1.endOfWeek)(date) };
        case 'month':
            return { start: (0, date_fns_1.startOfMonth)(date), end: (0, date_fns_1.endOfMonth)(date) };
        default:
            throw new Error('Invalid period');
    }
};
const getPreviousTimeRange = (period, date = new Date()) => {
    switch (period) {
        case 'day':
            return { start: (0, date_fns_1.startOfDay)((0, date_fns_1.subDays)(date, 1)), end: (0, date_fns_1.endOfDay)((0, date_fns_1.subDays)(date, 1)) };
        case 'week':
            return { start: (0, date_fns_1.startOfWeek)((0, date_fns_1.subWeeks)(date, 1)), end: (0, date_fns_1.endOfWeek)((0, date_fns_1.subWeeks)(date, 1)) };
        case 'month':
            return { start: (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(date, 1)), end: (0, date_fns_1.endOfMonth)((0, date_fns_1.subMonths)(date, 1)) };
        default:
            throw new Error('Invalid period');
    }
};
const dashboardDataFromDB = (period) => __awaiter(void 0, void 0, void 0, function* () {
    const currentRange = getTimeRange(period); // Get current period range
    const previousRange = getPreviousTimeRange(period); // Get previous period range
    // Get counts for the current period
    const [userCountCurrent, jobCountCurrent, appliedJobCountCurrent, interviewScheduledJobsCurrent] = yield Promise.all([
        user_model_1.User.countDocuments({ createdAt: { $gte: currentRange.start, $lte: currentRange.end } }),
        job_model_1.JobModel.countDocuments({ createdAt: { $gte: currentRange.start, $lte: currentRange.end } }),
        job_model_1.JobModel.countDocuments({ status: "Applied", createdAt: { $gte: currentRange.start, $lte: currentRange.end } }),
        (yield job_model_1.JobModel.find({ status: "Interview", createdAt: { $gte: currentRange.start, $lte: currentRange.end } })).length,
    ]);
    // Get counts for the previous period
    const [userCountPrevious, jobCountPrevious, appliedJobCountPrevious, interviewScheduledJobsPrevious] = yield Promise.all([
        user_model_1.User.countDocuments({ createdAt: { $gte: previousRange.start, $lte: previousRange.end } }),
        job_model_1.JobModel.countDocuments({ createdAt: { $gte: previousRange.start, $lte: previousRange.end } }),
        job_model_1.JobModel.countDocuments({ status: "Applied", createdAt: { $gte: previousRange.start, $lte: previousRange.end } }),
        job_model_1.JobModel.find({ status: "Interview", createdAt: { $gte: previousRange.start, $lte: previousRange.end } }),
    ]);
    // Log the counts for debugging
    console.log("userCountCurrent==>> ", userCountCurrent);
    console.log("userCountPrevious==>> ", userCountPrevious);
    console.log("jobCountCurrent==>> ", jobCountCurrent);
    console.log("jobCountPrevious==>> ", jobCountPrevious);
    // Calculate percentage change
    const calculatePercentageChange = (current, previous) => {
        // If both current and previous are 0, there is no change
        if (previous === 0 && current === 0) {
            return 0; // No change
        }
        // If previous is 0 and current is not 0, the change is 100%
        if (previous === 0 && current !== 0) {
            return 100; // 100% increase
        }
        // Standard calculation for percentage change
        return ((current - previous) / previous) * 100;
    };
    console.log("userCountCurrent==> In Below> ", userCountPrevious);
    return {
        userCountCurrent,
        jobCountCurrent,
        appliedJobCountCurrent,
        interviewScheduledJobsCurrent,
        userCountPercentageChange: calculatePercentageChange(userCountCurrent, userCountPrevious),
        jobCountPercentageChange: calculatePercentageChange(jobCountCurrent, jobCountPrevious),
        appliedJobCountPercentageChange: calculatePercentageChange(appliedJobCountCurrent, appliedJobCountPrevious),
        interviewScheduledJobsPercentageChange: calculatePercentageChange(interviewScheduledJobsCurrent, interviewScheduledJobsPrevious.length),
    };
});
const dashboardAllDataNoTimePeriodFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // Get counts for the current period (all time)
    const [userCountCurrent, jobCountCurrent, appliedJobCountCurrent, interviewScheduledJobsCurrent] = yield Promise.all([
        user_model_1.User.countDocuments(), // Count all users (no time range filter)
        job_model_1.JobModel.countDocuments(), // Count all jobs (no time range filter)
        job_model_1.JobModel.countDocuments({ status: "Applied" }), // Count all applied jobs
        (yield job_model_1.JobModel.find({ status: "Interview" })).length, // Count all interview-scheduled jobs
    ]);
    // Calculate percentage change (using dummy previous values for now as there is no previous period concept here)
    const calculatePercentageChange = (current, previous) => {
        if (previous === 0 && current === 0) {
            return 0; // No change
        }
        if (previous === 0 && current !== 0) {
            return 100; // 100% increase
        }
        return ((current - previous) / previous) * 100; // Standard percentage change formula
    };
    // Returning data (no previous period concept here)
    return {
        userCountCurrent,
        jobCountCurrent,
        appliedJobCountCurrent,
        interviewScheduledJobsCurrent,
        userCountPercentageChange: calculatePercentageChange(userCountCurrent, 0), // Since no previous data is available, assuming 0 as previous
        jobCountPercentageChange: calculatePercentageChange(jobCountCurrent, 0),
        appliedJobCountPercentageChange: calculatePercentageChange(appliedJobCountCurrent, 0),
        interviewScheduledJobsPercentageChange: calculatePercentageChange(interviewScheduledJobsCurrent, 0),
    };
});
const dashboardDataFromSpecificMonth = (month, year) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the start and end date for the given month and year
    const currentRangeStart = new Date(year, month - 1, 1); // Month is 0-based, so subtract 1
    const currentRangeEnd = new Date(year, month, 0); // The last day of the month
    // Get the previous month
    let previousMonth = month - 1;
    let previousYear = year;
    if (previousMonth === 0) {
        previousMonth = 12; // December
        previousYear -= 1;
    }
    // Get the start and end date for the previous month
    const previousRangeStart = new Date(previousYear, previousMonth - 1, 1);
    const previousRangeEnd = new Date(previousYear, previousMonth, 0);
    // Get counts for the specified month
    const [userCountCurrent, jobCountCurrent, appliedJobCountCurrent, interviewScheduledJobsCurrent] = yield Promise.all([
        user_model_1.User.countDocuments({ createdAt: { $gte: currentRangeStart, $lte: currentRangeEnd } }),
        job_model_1.JobModel.countDocuments({ createdAt: { $gte: currentRangeStart, $lte: currentRangeEnd } }),
        job_model_1.JobModel.countDocuments({ status: "Applied", createdAt: { $gte: currentRangeStart, $lte: currentRangeEnd } }),
        (yield job_model_1.JobModel.find({ status: "Interview", createdAt: { $gte: currentRangeStart, $lte: currentRangeEnd } })).length,
    ]);
    // Get counts for the previous month
    const [userCountPrevious, jobCountPrevious, appliedJobCountPrevious, interviewScheduledJobsPrevious] = yield Promise.all([
        user_model_1.User.countDocuments({ createdAt: { $gte: previousRangeStart, $lte: previousRangeEnd } }),
        job_model_1.JobModel.countDocuments({ createdAt: { $gte: previousRangeStart, $lte: previousRangeEnd } }),
        job_model_1.JobModel.countDocuments({ status: "Applied", createdAt: { $gte: previousRangeStart, $lte: previousRangeEnd } }),
        job_model_1.JobModel.find({ status: "Interview", createdAt: { $gte: previousRangeStart, $lte: previousRangeEnd } }),
    ]);
    // Calculate percentage change
    const calculatePercentageChange = (current, previous) => {
        // If both current and previous are 0, there is no change
        if (previous === 0 && current === 0) {
            return 0; // No change
        }
        // If previous is 0 and current is not 0, the change is 100%
        if (previous === 0 && current !== 0) {
            return 100; // 100% increase
        }
        // Standard calculation for percentage change
        return ((current - previous) / previous) * 100;
    };
    return {
        userCountCurrent,
        jobCountCurrent,
        appliedJobCountCurrent,
        interviewScheduledJobsCurrent,
        userCountPercentageChange: calculatePercentageChange(userCountCurrent, userCountPrevious),
        jobCountPercentageChange: calculatePercentageChange(jobCountCurrent, jobCountPrevious),
        appliedJobCountPercentageChange: calculatePercentageChange(appliedJobCountCurrent, appliedJobCountPrevious),
        interviewScheduledJobsPercentageChange: calculatePercentageChange(interviewScheduledJobsCurrent, interviewScheduledJobsPrevious.length),
    };
});
const getUserJobData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid userId');
    }
    const oid = new mongoose_1.Types.ObjectId(userId);
    // Aggregate counts per status
    const countsAgg = yield job_model_1.JobModel.aggregate([
        { $match: { userId: oid } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    // Default status counts
    const base = {
        Applied: 0,
        Shortlisted: 0,
        Rejected: 0,
        Interview: 0,
        Offers: 0,
    };
    // Cast _id to keyof base to ensure it matches one of the valid statuses
    countsAgg.forEach(row => {
        if (row._id in base) {
            base[row._id] = row.count;
        }
    });
    const total = Object.values(base).reduce((a, b) => a + b, 0);
    // Return both status counts and full job data
    const jobs = yield job_model_1.JobModel.find({ userId: oid }).sort({ appliedDate: -1 }).lean();
    return { userId, total, counts: base, jobs };
});
exports.jobService = {
    createAppliedIntoDB,
    readAllJobAppliedIntoDB,
    readSingleJobAppliedIntoDB,
    updateJobAppliedIntoDB,
    deleteAppliedJobFromDB,
    filterByStatusFromDB,
    filterByStatusForSingleUserFromDB,
    dashboardDataFromDB,
    dashboardDataFromSpecificMonth,
    getUserJobData, getJobStatusPercentage,
    dashboardAllDataNoTimePeriodFromDB
};
