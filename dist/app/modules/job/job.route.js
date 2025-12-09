"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobRouter = void 0;
const user_constant_1 = require("./../user/user.constant");
const express_1 = __importDefault(require("express"));
const job_controller_1 = require("./job.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const fileUploadHandler_1 = __importDefault(require("../../middlewares/fileUploadHandler"));
const UPLOADS_FOLDER = 'uploads/jobs';
const upload = (0, fileUploadHandler_1.default)(UPLOADS_FOLDER);
const router = express_1.default.Router();
router.post('/create', upload.single('companyLogo'), (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), 
// validateRequest(jobValidationSchema),
job_controller_1.jobController.createAppliedJob);
router.get('/get-all', // status as query
(0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.analyst, user_constant_1.USER_ROLE.superAdmin), job_controller_1.jobController.readAllJobApplied);
router.get('/get-one-user-jobs', // status as query
(0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.analyst, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.user), job_controller_1.jobController.readAllJobAppliedForSingleUser);
router.get('/get-single/:appliedJobId', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.analyst, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.user), (0, auth_1.default)('admin'), job_controller_1.jobController.readSingleJobApplied);
router.patch('/update/:appliedJobId', upload.single('companyLogo'), (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.analyst, user_constant_1.USER_ROLE.superAdmin), job_controller_1.jobController.updateJobApplied);
router.delete('/delete/:appliedJobId', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.analyst, user_constant_1.USER_ROLE.superAdmin), job_controller_1.jobController.deleteAppliedJob);
// router.get(
//     '/filter-by-status', // status
//     auth('admin'),
//     jobController.filterByStatus // This calls the filterByStatus controller
// );
router.get('/dashboard-data', // period in query
(0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.analyst, user_constant_1.USER_ROLE.superAdmin), job_controller_1.jobController.dashboardData);
router.get('/dashboard-data-for-specific-month', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.analyst, user_constant_1.USER_ROLE.superAdmin), job_controller_1.jobController.dashboardDataFromSpecificMonth);
router.get('/status-percentage', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.analyst, user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.user), job_controller_1.jobController.getJobStatusPercentage);
router.get('/get-user-dashboard', (0, auth_1.default)(user_constant_1.USER_ROLE.user), job_controller_1.jobController.getUserJobData);
exports.JobRouter = router;
