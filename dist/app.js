"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const routes_1 = __importDefault(require("./routes"));
const morgen_1 = require("./shared/morgen");
const notFount_1 = __importDefault(require("./app/middlewares/notFount"));
const auth_route_1 = require("./app/modules/Auth/auth.route");
const path_1 = __importDefault(require("path"));
const social_auth_routes_1 = require("./app/modules/Auth/social.auth.routes");
// import passport from 'passport';
// import session from 'express-session';
const app = (0, express_1.default)();
// morgan
app.use(morgen_1.Morgan.successHandler);
app.use(morgen_1.Morgan.errorHandler);
// body parser
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true
}));
app.use((req, res, next) => {
    const contentType = req.headers['content-type'] || '';
    // Skip all body parsing for multipart/form-data (let multer handle it in routes)
    if (contentType.includes('multipart/form-data')) {
        return next();
    }
    // For other content types, apply appropriate parser
    next();
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Use cookie-parser to parse cookies
app.use((0, cookie_parser_1.default)());
// Setup session and passport
// app.use(session({
//   secret: 'your-session-secret',
//   resave: false,
//   saveUninitialized: true,
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// file retrieve
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Auth routes
app.use('/api/v1/auth', auth_route_1.AuthRoutes);
// Social auth routes - ADD THIS LINE
app.use('/api/v1/social', social_auth_routes_1.SocialAuthRoutes);
// Test route (optional - you can remove this if you want)
app.get('/api/v1/social/test', (req, res) => {
    console.log("✅ Social test route is working!");
    res.status(200).json({ message: 'Social routes are working!' });
});
// router
app.use('/api/v1', routes_1.default);
// live response
app.get('/test', (req, res) => {
    res.status(201).json({ message: 'Welcome to Backend Template Server123' });
});
// app.get('/test', (req: Request, res: Response) => {
//   res.status(201).json({ message: 'Welcome to Backend Template Server' });
// });
// global error handle
app.use(globalErrorHandler_1.default);
// handle not found route
app.use(notFount_1.default);
exports.default = app;
