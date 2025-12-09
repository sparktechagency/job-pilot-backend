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
exports.User = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../../config"));
const paginate_1 = __importDefault(require("../../../helpers/paginate"));
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        lowercase: true,
    },
    phoneNumber: {
        type: String,
        required: false,
    },
    profileImage: {
        type: String,
        default: '',
    },
    CV: {
        type: String,
        default: '',
    },
    address: {
        type: String,
        default: '',
    },
    postCode: {
        type: String,
        default: '',
    },
    country: {
        type: String,
        default: '',
    },
    userId: {
        type: String,
    },
    password: {
        type: String,
        required: function () {
            return this.authType === 'local';
        },
        select: false,
        minlength: [8, 'Password must be at least 8 characters long'],
    },
    ConfirmPassword: {
        type: String,
        required: function () {
            return this.authType === 'local';
        },
        select: false,
        minlength: [8, 'Password must be at least 8 characters long'],
    },
    Designation: {
        type: String,
        required: [true, "Designation Is Required"]
    },
    role: {
        type: String,
        enum: ["admin", "superAdmin", "analyst", "user", "recruiter"],
        default: "user"
    },
    authType: {
        type: String,
        enum: ['local', 'google', 'facebook', 'apple'],
        default: 'local'
    },
    socialId: {
        type: String,
        sparse: true
    },
    isHumanTrue: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        required: [true, 'Deleted status is required'],
    },
    subscriptionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Subscription',
    },
    isBlocked: {
        type: Boolean,
        default: false,
        required: [true, 'Blocked status is required'],
    },
    isSubscription: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
        required: [true, 'Email verification status is required'],
    },
    isResetPassword: {
        type: Boolean,
        default: false,
        required: [true, 'Reset password status is required'],
    },
    oneTimeCode: {
        type: String,
        default: null,
    },
    oneTimeCodeExpire: {
        type: Date,
        default: null,
    },
    subEndDate: {
        type: Date,
        default: null,
    },
    serviceCount: {
        type: Number,
        default: 0
    },
    otpCountDown: {
        type: Number,
        default: null,
    },
    status: {
        type: String,
        enum: ['Active', 'Blocked', 'Delete'],
        default: 'Active',
    },
    fcmToken: {
        type: String,
        default: null,
    },
    fcmTokens: [{
            type: String,
        }],
    notificationPreferences: {
        applied: { type: Boolean, default: true },
        shortlisted: { type: Boolean, default: true },
        interview: { type: Boolean, default: true },
        offer: { type: Boolean, default: true },
        info: { type: Boolean, default: true },
        system: { type: Boolean, default: true },
    },
    Applied: {
        type: Boolean,
        default: true
    },
    Shortlisted: {
        type: Boolean,
        default: true
    },
    Rejected: {
        type: Boolean,
        default: true
    },
    Interview: {
        type: Boolean,
        default: true
    },
    Offer: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName || ''}`.trim();
});
userSchema.plugin(paginate_1.default);
// Static methods
userSchema.statics.isExistUserById = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.findById(id).select('-password -ConfirmPassword');
    });
};
userSchema.statics.isExistUserByEmail = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.findOne({ email }).select('-password -ConfirmPassword');
    });
};
userSchema.statics.isMatchPassword = function (password, hashPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, hashPassword);
    });
};
// Middleware to hash password before saving (only for local auth)
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified('password') && this.authType === 'local' && this.password) {
            this.password = yield bcrypt_1.default.hash(this.password, Number(config_1.default.bcrypt.saltRounds));
        }
        // Also hash ConfirmPassword if it's modified and exists
        if (this.isModified('ConfirmPassword') && this.authType === 'local' && this.ConfirmPassword) {
            this.ConfirmPassword = yield bcrypt_1.default.hash(this.ConfirmPassword, Number(config_1.default.bcrypt.saltRounds));
        }
        next();
    });
});
exports.User = (0, mongoose_1.model)('User', userSchema);
