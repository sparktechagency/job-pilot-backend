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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_facebook_1 = require("passport-facebook");
const passport_apple_1 = require("passport-apple");
const user_model_1 = require("../user/user.model");
// Serialize user
passport_1.default.serializeUser((user, done) => {
    done(null, user._id.toString());
});
// Fix deserializeUser with type assertion
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(id);
        done(null, user); // Type assertion to bypass the error
    }
    catch (error) {
        done(error, null);
    }
}));
// Your strategies remain the same...
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email']
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    try {
        const email = (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
        if (!email) {
            return done(new Error('Google login requires email access'), undefined);
        }
        let user = yield user_model_1.User.findOne({
            $or: [
                { email },
                { socialId: profile.id, authType: 'google' }
            ]
        });
        if (user) {
            user.socialId = profile.id;
            user.authType = 'google';
            user.profileImage = (_d = (_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value;
            user.isEmailVerified = true;
            if (!user.lastName)
                user.lastName = ((_e = profile.name) === null || _e === void 0 ? void 0 : _e.familyName) || '';
            yield user.save();
            return done(null, user);
        }
        else {
            user = yield user_model_1.User.create({
                firstName: ((_f = profile.name) === null || _f === void 0 ? void 0 : _f.givenName) || 'Google',
                lastName: ((_g = profile.name) === null || _g === void 0 ? void 0 : _g.familyName) || 'User',
                email: email,
                socialId: profile.id,
                authType: 'google',
                profileImage: (_j = (_h = profile.photos) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.value,
                Designation: 'Social User',
                password: 'social-auth-no-password',
                ConfirmPassword: 'social-auth-no-password',
                isEmailVerified: true
            });
            return done(null, user);
        }
    }
    catch (error) {
        return done(error, undefined);
    }
})));
// Facebook Strategy (similar fix)
passport_1.default.use(new passport_facebook_1.Strategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'emails', 'name', 'photos']
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    try {
        const email = (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
        if (!email) {
            return done(new Error('Facebook login requires email access'), undefined);
        }
        let user = yield user_model_1.User.findOne({
            $or: [
                { email },
                { socialId: profile.id, authType: 'facebook' }
            ]
        });
        if (user) {
            user.socialId = profile.id;
            user.authType = 'facebook';
            user.profileImage = (_d = (_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value;
            user.isEmailVerified = true;
            if (!user.lastName)
                user.lastName = ((_e = profile.name) === null || _e === void 0 ? void 0 : _e.familyName) || '';
            yield user.save();
            return done(null, user);
        }
        else {
            user = yield user_model_1.User.create({
                firstName: ((_f = profile.name) === null || _f === void 0 ? void 0 : _f.givenName) || 'Facebook',
                lastName: ((_g = profile.name) === null || _g === void 0 ? void 0 : _g.familyName) || 'User',
                email: email,
                socialId: profile.id,
                authType: 'facebook',
                profileImage: (_j = (_h = profile.photos) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.value,
                Designation: 'Social User',
                password: 'social-auth-no-password',
                ConfirmPassword: 'social-auth-no-password',
                isEmailVerified: true
            });
            return done(null, user);
        }
    }
    catch (error) {
        return done(error, undefined);
    }
})));
// Apple Strategy (similar fix)
passport_1.default.use(new passport_apple_1.Strategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    key: process.env.APPLE_PRIVATE_KEY,
    callbackURL: process.env.APPLE_CALLBACK_URL,
    scope: ['name', 'email'],
    passReqToCallback: false
}, (accessToken, refreshToken, idToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let email;
        let sub;
        try {
            const decodedToken = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
            email = decodedToken.email;
            sub = decodedToken.sub;
        }
        catch (parseError) {
            console.error('Error parsing Apple idToken:', parseError);
            return done(new Error('Invalid Apple token'), undefined);
        }
        if (!email || !sub) {
            return done(new Error('Apple login requires email access'), undefined);
        }
        let user = yield user_model_1.User.findOne({
            $or: [
                { email },
                { socialId: sub, authType: 'apple' }
            ]
        });
        if (user) {
            user.socialId = sub;
            user.authType = 'apple';
            user.isEmailVerified = true;
            yield user.save();
            return done(null, user);
        }
        else {
            const firstName = ((_a = profile === null || profile === void 0 ? void 0 : profile.name) === null || _a === void 0 ? void 0 : _a.firstName) || 'Apple';
            const lastName = ((_b = profile === null || profile === void 0 ? void 0 : profile.name) === null || _b === void 0 ? void 0 : _b.lastName) || 'User';
            user = yield user_model_1.User.create({
                firstName: firstName,
                lastName: lastName,
                email: email,
                socialId: sub,
                authType: 'apple',
                Designation: 'Social User',
                password: 'social-auth-no-password',
                ConfirmPassword: 'social-auth-no-password',
                isEmailVerified: true
            });
            return done(null, user);
        }
    }
    catch (error) {
        console.error('Apple Strategy Error:', error);
        return done(error, undefined);
    }
})));
exports.default = passport_1.default;
