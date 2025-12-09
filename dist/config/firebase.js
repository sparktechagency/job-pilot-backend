"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
// Load environment variables from .env file
dotenv_1.default.config();
// Ensure the environment variables are defined
const projectId = process.env.FIREBASE_PROJECT_ID;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
if (!projectId || !privateKey || !clientEmail) {
    throw new Error('Firebase credentials are not set in environment variables.');
}
// Initialize Firebase Admin SDK
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert({
        projectId,
        privateKey: privateKey.replace(/\\n/g, '\n'), // Handle \n correctly
        clientEmail,
    }),
});
exports.default = firebase_admin_1.default;
