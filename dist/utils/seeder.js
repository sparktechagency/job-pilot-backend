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
const user_model_1 = require("../app/modules/user/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Sample data
const usersData = [
    {
        firstName: 'Testing Admin',
        email: 'admin@gmail.com',
        password: '$2a$08$cUQ3uMdbQjlyDF/dgn5mNuEt9fLJZqq8TaT9aKabrFuG5wND3/mPO',
        ConfirmPassword: "$2a$08$cUQ3uMdbQjlyDF/dgn5mNuEt9fLJZqq8TaT9aKabrFuG5wND3/mPO",
        role: 'admin',
        isEmailVerified: true,
    },
    {
        firstName: 'Testing Business',
        email: 'business@gmail.com',
        password: '$2a$08$cUQ3uMdbQjlyDF/dgn5mNuEt9fLJZqq8TaT9aKabrFuG5wND3/mPO',
        ConfirmPassword: '$2a$08$cUQ3uMdbQjlyDF/dgn5mNuEt9fLJZqq8TaT9aKabrFuG5wND3/mPO',
        role: 'technician',
        isEmailVerified: true,
    },
    {
        firstName: 'Testing User',
        email: 'user@gmail.com',
        password: '$2a$08$cUQ3uMdbQjlyDF/dgn5mNuEt9fLJZqq8TaT9aKabrFuG5wND3/mPO',
        ConfirmPassword: '$2a$08$cUQ3uMdbQjlyDF/dgn5mNuEt9fLJZqq8TaT9aKabrFuG5wND3/mPO',
        role: 'user',
        isEmailVerified: true,
    },
];
// Function to drop the entire database
const dropDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connection.dropDatabase();
        console.log('------------> Database dropped successfully! <------------');
    }
    catch (err) {
        console.error('Error dropping database:', err);
    }
});
// Function to seed users
const seedUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_model_1.User.deleteMany();
        yield user_model_1.User.insertMany(usersData);
        console.log('Users seeded successfully!');
    }
    catch (err) {
        console.error('Error seeding users:', err);
    }
});
// Connect to MongoDB
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dbUrl = process.env.MONGODB_URL;
        if (!dbUrl)
            throw new Error('MONGODB_URL not set in environment variables');
        yield mongoose_1.default.connect(dbUrl);
        console.log('Connected to MongoDB');
    }
    catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Exit process with failure
    }
});
// Main function to seed the database
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectToDatabase();
        yield dropDatabase();
        yield seedUsers();
        console.log('--------------> Database seeding completed <--------------');
    }
    catch (err) {
        console.error('Error seeding database:', err);
    }
    finally {
        mongoose_1.default.disconnect().then(() => console.log('Disconnected from MongoDB'));
    }
});
// Execute seeding
seedDatabase();
