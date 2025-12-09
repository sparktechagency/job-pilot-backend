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
exports.SocialAuthRoutes = void 0;
// routes/social.auth.routes.ts
const express_1 = __importDefault(require("express"));
const auth_passport_config_1 = __importDefault(require("./auth.passport.config"));
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const sendResponse_1 = __importDefault(require("../user/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const user_model_1 = require("../user/user.model");
const router = express_1.default.Router();
// Social authentication routes
router.get('/google', auth_passport_config_1.default.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
}));
// Google callback route
router.get('/google/callback', auth_passport_config_1.default.authenticate('google', {
    failureRedirect: '/api/v1/auth/failure',
    session: false
}), auth_controller_1.AuthController.socialLoginSuccess);
// Facebook route
router.get('/facebook', auth_passport_config_1.default.authenticate('facebook', {
    scope: ['email'],
    session: false
}));
router.get('/facebook/callback', auth_passport_config_1.default.authenticate('facebook', {
    failureRedirect: '/api/v1/auth/failure',
    session: false
}), auth_controller_1.AuthController.socialLoginSuccess);
router.post('/direct-login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log('📱 Direct login request:', {
            provider: req.body.provider,
            accessTokenLength: (_a = req.body.accessToken) === null || _a === void 0 ? void 0 : _a.length
        });
        const { provider, accessToken } = req.body;
        if (!provider || !accessToken) {
            return (0, sendResponse_1.default)(res, {
                code: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: 'Provider and access token are required',
                data: null,
                success: false
            });
        }
        let userProfile;
        if (provider === 'google') {
            userProfile = yield verifyGoogleToken(accessToken);
            console.log('✅ Google token verified successfully');
        }
        else if (provider === 'facebook') {
            userProfile = yield verifyFacebookToken(accessToken);
            console.log('✅ Facebook token verified successfully');
        }
        else {
            return (0, sendResponse_1.default)(res, {
                code: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: 'Unsupported provider',
                data: null,
                success: false
            });
        }
        console.log('🔐 User profile verified:', {
            id: userProfile.id,
            email: userProfile.email,
            name: `${userProfile.firstName || userProfile.given_name} ${userProfile.lastName || userProfile.family_name}`.trim()
        });
        if (!userProfile.email) {
            return (0, sendResponse_1.default)(res, {
                code: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: 'Email is required but not provided by the social provider',
                data: null,
                success: false
            });
        }
        // Find or create user
        let user = yield user_model_1.User.findOne({
            $or: [
                { email: userProfile.email },
                { socialId: userProfile.id, authType: provider }
            ]
        });
        console.log('👤 User found in database:', user ? 'Yes' : 'No');
        if (!user) {
            console.log('🆕 Creating new user...');
            user = yield user_model_1.User.create({
                firstName: userProfile.firstName || userProfile.given_name || extractFirstName(userProfile.name) || 'User',
                lastName: userProfile.lastName || userProfile.family_name || extractLastName(userProfile.name) || '',
                email: userProfile.email,
                socialId: userProfile.id,
                authType: provider,
                profileImage: userProfile.picture,
                Designation: 'Social User',
                password: 'social-auth-no-password',
                ConfirmPassword: 'social-auth-no-password',
                isEmailVerified: userProfile.email_verified || true,
            });
            console.log('✅ New user created successfully:', user.email);
        }
        else {
            console.log('📝 Updating existing user...');
            // Update existing user
            user.socialId = userProfile.id;
            user.authType = provider;
            user.profileImage = userProfile.picture;
            user.isEmailVerified = userProfile.email_verified || true;
            // Update name if not already set or if we have better data
            if ((!user.firstName || user.firstName === 'User') && (userProfile.firstName || userProfile.given_name)) {
                user.firstName = userProfile.firstName || userProfile.given_name;
            }
            if ((!user.lastName || user.lastName === '') && (userProfile.lastName || userProfile.family_name)) {
                user.lastName = userProfile.lastName || userProfile.family_name;
            }
            yield user.save();
            console.log('✅ User updated successfully:', user.email);
        }
        const result = yield auth_service_1.AuthService.socialLogin(user);
        console.log('🎉 Social login successful for:', user.email);
        (0, sendResponse_1.default)(res, {
            code: http_status_codes_1.StatusCodes.OK,
            message: 'Social login successful',
            data: result,
            success: true
        });
    }
    catch (error) {
        console.error('❌ Direct login error:', error);
        (0, sendResponse_1.default)(res, {
            code: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            message: 'Social authentication failed: ' + error.message,
            data: null,
            success: false
        });
    }
}));
// Helper function to extract first name from full name
function extractFirstName(fullName) {
    if (!fullName)
        return 'User';
    return fullName.split(' ')[0] || 'User';
}
// Helper function to extract last name from full name  
function extractLastName(fullName) {
    if (!fullName)
        return '';
    const parts = fullName.split(' ');
    return parts.length > 1 ? parts.slice(1).join(' ') : '';
}
// Unified Google token verification function
function verifyGoogleToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('🔐 Verifying Google token...');
            // First, try to verify as ID token
            try {
                const userProfile = yield verifyGoogleIdToken(token);
                console.log('✅ Token verified as Google ID token');
                return userProfile;
            }
            catch (idTokenError) {
                console.log('🔄 Not an ID token, trying as access token...');
                // If ID token verification fails, try as access token
                const userProfile = yield verifyGoogleAccessToken(token);
                console.log('✅ Token verified as Google access token');
                return userProfile;
            }
        }
        catch (error) {
            console.error('❌ Google token verification failed:', error);
            throw new Error(`Google authentication failed: ${error.message}`);
        }
    });
}
// Verify Google ID Token (JWT)
function verifyGoogleIdToken(idToken) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { OAuth2Client } = require('google-auth-library');
            if (!process.env.GOOGLE_CLIENT_ID) {
                throw new Error('GOOGLE_CLIENT_ID environment variable is not set');
            }
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
            const ticket = yield client.verifyIdToken({
                idToken: idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload) {
                throw new Error('No payload received from Google token verification');
            }
            console.log('📄 Google ID token payload:', {
                sub: payload.sub,
                email: payload.email,
                name: payload.name,
                given_name: payload.given_name,
                family_name: payload.family_name
            });
            return {
                id: payload.sub,
                email: payload.email,
                given_name: payload.given_name,
                family_name: payload.family_name,
                firstName: payload.given_name,
                lastName: payload.family_name,
                picture: payload.picture,
                name: payload.name,
                email_verified: payload.email_verified,
            };
        }
        catch (error) {
            console.error('❌ Google ID token verification error:', error);
            throw new Error(`Invalid Google ID token: ${error.message}`);
        }
    });
}
// Verify Google Access Token (OAuth)
function verifyGoogleAccessToken(accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const axios = require('axios');
            // Use OAuth2 API to get user info
            const response = yield axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                timeout: 10000
            });
            const userInfo = response.data;
            console.log('📄 Google OAuth2 API response:', {
                id: userInfo.sub,
                email: userInfo.email,
                name: userInfo.name,
                given_name: userInfo.given_name,
                family_name: userInfo.family_name
            });
            if (!userInfo.sub && !userInfo.email) {
                throw new Error('Invalid user info response from Google');
            }
            return {
                id: userInfo.sub || userInfo.id,
                email: userInfo.email,
                given_name: userInfo.given_name,
                family_name: userInfo.family_name,
                firstName: userInfo.given_name,
                lastName: userInfo.family_name,
                picture: userInfo.picture,
                name: userInfo.name,
                email_verified: userInfo.email_verified || true,
            };
        }
        catch (error) {
            console.error('❌ Google OAuth2 API error:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw new Error(`Google access token verification failed: ${((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.error) || error.message}`);
        }
    });
}
// Facebook token verification function
function verifyFacebookToken(accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        try {
            console.log('🔐 Verifying Facebook token...');
            const axios = require('axios');
            const response = yield axios.get(`https://graph.facebook.com/v18.0/me?fields=id,name,email,first_name,last_name,picture&access_token=${accessToken}`, {
                timeout: 10000
            });
            const profile = response.data;
            if (!profile.id) {
                throw new Error('Invalid Facebook token response');
            }
            console.log('📄 Facebook profile:', {
                id: profile.id,
                email: profile.email,
                name: profile.name,
                first_name: profile.first_name,
                last_name: profile.last_name
            });
            return {
                id: profile.id,
                email: profile.email,
                first_name: profile.first_name,
                last_name: profile.last_name,
                firstName: profile.first_name,
                lastName: profile.last_name,
                picture: (_b = (_a = profile.picture) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.url,
                name: profile.name,
            };
        }
        catch (error) {
            console.error('❌ Facebook token verification error:', ((_c = error.response) === null || _c === void 0 ? void 0 : _c.data) || error.message);
            if ((_e = (_d = error.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.error) {
                const fbError = error.response.data.error;
                if (fbError.code === 190) {
                    throw new Error('Facebook token has expired or is invalid');
                }
                throw new Error(`Facebook API error: ${fbError.message}`);
            }
            throw new Error(`Invalid Facebook token: ${error.message}`);
        }
    });
}
// Social auth failure route
router.get('/failure', auth_controller_1.AuthController.socialLoginFailure);
exports.SocialAuthRoutes = router;
