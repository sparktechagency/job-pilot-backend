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
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const config_1 = __importDefault(require("../../config"));
const user_model_1 = require("../modules/user/user.model");
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const rawToken = req.headers.authorization;
        const token = rawToken === null || rawToken === void 0 ? void 0 : rawToken.split(' ')[1];
        if (!token) {
            console.log("Token missing");
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized!');
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.accessSecret);
        }
        catch (error) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid token!');
        }
        const { role, id } = decoded;
        console.log("User Id", id);
        if (!id || !role) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid token payload!');
        }
        const user = yield user_model_1.User.findById(id);
        if (!user) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized!');
        }
        // Convert to plain object to safely access properties
        const userObject = user.toObject();
        if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(role)) {
            res.status(401).send({
                "success": false,
                "statusCode": 401,
                "message": "You have no access to this route",
            });
            return;
        }
        // Use type assertion
        req.user = {
            _id: user._id.toString(),
            id: user._id.toString(),
            role: userObject.role || role,
            email: userObject.email,
            name: userObject.name,
        };
        next();
    }));
};
exports.default = auth;
