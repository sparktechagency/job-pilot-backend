"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../app/modules/Auth/auth.route");
const user_route_1 = require("../app/modules/user/user.route");
const job_route_1 = require("../app/modules/job/job.route");
const library_route_1 = require("../app/modules/library/library.route");
const FAQ_route_1 = require("../app/modules/FAQ/FAQ.route");
const notification_route_1 = require("../app/modules/notification/notification.route");
const fcmToken_routes_1 = require("../app/modules/notification/fcmToken.routes");
const payment_route_1 = require("../app/modules/payment/payment.route");
const privacy_Policy_route_1 = require("../app/modules/privacy&Policy/privacy&Policy.route");
const recruiters_route_1 = require("../app/modules/recruiters/recruiters.route");
const terms_Condition_route_1 = require("../app/modules/terms&Condition/terms&Condition.route");
const router = express_1.default.Router();
const apiRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/fcm',
        route: fcmToken_routes_1.fcmTokenRouter,
    },
    {
        path: '/user',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/job',
        route: job_route_1.JobRouter,
    },
    {
        path: '/library',
        route: library_route_1.LibraryRoute,
    },
    {
        path: '/faq',
        route: FAQ_route_1.faqRouter,
    },
    {
        path: '/notifications',
        route: notification_route_1.notificationRouter,
    },
    {
        path: '/payment',
        route: payment_route_1.paymentRoute,
    },
    {
        path: '/privacy-policy',
        route: privacy_Policy_route_1.privacyPolicyRouter,
    },
    {
        path: '/recruiter',
        route: recruiters_route_1.recruiterRouter,
    },
    {
        path: '/terms-condition',
        route: terms_Condition_route_1.termsConditionRouter,
    },
];
apiRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
