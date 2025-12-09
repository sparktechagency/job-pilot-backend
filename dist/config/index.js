"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
// Define the schema for validating environment variables
const envVarsSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(['development', 'test', 'production'])
        .default('development'),
    PORT: zod_1.z
        .string({
        invalid_type_error: 'PORT must be a string',
        required_error: 'PORT is required',
    })
        .default('5673'),
    SOCKET: zod_1.z
        .string({
        invalid_type_error: 'SOCKET must be a string',
        required_error: 'SOCKET is required',
    })
        .default('8082'),
    MONGODB_URL: zod_1.z.string({
        required_error: 'MongoDB URL is required',
        invalid_type_error: 'MongoDB URL must be a string',
    }),
    JWT_SECRET: zod_1.z.string({
        required_error: 'JWT secret is required',
        invalid_type_error: 'JWT secret must be a string',
    }),
    JWT_EXPIRATION_TIME: zod_1.z
        .string({
        invalid_type_error: 'JWT_EXPIRATION_TIME must be a valid string',
        required_error: 'JWT_EXPIRATION_TIME is required',
    })
        .default('1d'),
    JWT_REFRESH_EXPIRATION_TIME: zod_1.z
        .string({
        invalid_type_error: 'JWT_REFRESH_EXPIRATION_TIME must be a valid string',
        required_error: 'JWT_REFRESH_EXPIRATION_TIME is required',
    })
        .default('180d'),
    BCRYPT_SALT_ROUNDS: zod_1.z
        .string({
        invalid_type_error: 'BCRYPT_SALT_ROUNDS must be a string',
        required_error: 'BCRYPT_SALT_ROUNDS is required',
    })
        .default('12'),
    SMTP_HOST: zod_1.z.string().optional(),
    SMTP_PORT: zod_1.z.string().optional(),
    SMTP_USERNAME: zod_1.z.string().optional(),
    SMTP_PASSWORD: zod_1.z.string().optional(),
    EMAIL_FROM: zod_1.z.string().optional(),
    BACKEND_IP: zod_1.z.string().optional(),
    LOCAL_SERVER: zod_1.z.string().optional(),
    STRIPE_SECRET_KEY: zod_1.z.string().optional(),
    STRIPE_WEBHOOK_SECRET: zod_1.z.string().optional(),
});
// Validate the environment variables
const envVars = envVarsSchema.safeParse(process.env);
if (!envVars.success) {
    console.log(envVars.error);
    throw new Error(`Config validation error: ${envVars.error.format()}`);
}
exports.default = {
    env: envVars.data.NODE_ENV,
    port: envVars.data.PORT,
    socket_port: envVars.data.SOCKET,
    mongoose: {
        url: envVars.data.MONGODB_URL,
        options: {
        // Optional Mongoose configurations can go here
        },
    },
    jwt: {
        accessSecret: envVars.data.JWT_SECRET,
        accessExpirationTime: envVars.data.JWT_EXPIRATION_TIME,
        refreshExpirationTime: envVars.data.JWT_REFRESH_EXPIRATION_TIME,
    },
    bcrypt: {
        saltRounds: envVars.data.BCRYPT_SALT_ROUNDS,
    },
    email: {
        smtp: {
            host: envVars.data.SMTP_HOST,
            port: envVars.data.SMTP_PORT,
            auth: {
                user: envVars.data.SMTP_USERNAME,
                pass: envVars.data.SMTP_PASSWORD,
            },
        },
        from: envVars.data.EMAIL_FROM,
    },
    backendIp: envVars.data.BACKEND_IP || 'localhost',
    localServer: envVars.data.LOCAL_SERVER,
    stripe: {
        secretKey: envVars.data.STRIPE_SECRET_KEY,
        webhookSecret: envVars.data.STRIPE_WEBHOOK_SECRET,
    },
};
