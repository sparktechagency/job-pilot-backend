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
const node_cron_1 = __importDefault(require("node-cron"));
const user_model_1 = require("../user/user.model");
// Create a cron job that runs every day at midnight
node_cron_1.default.schedule('0 0 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    // Get the current date
    const currentDate = Date.now();
    // Find users whose subscription has expired
    const expiredSubscriptions = yield user_model_1.User.find({
        isSubscription: true,
        subEndDate: { $lt: currentDate } // Subscription expired
    });
    // Loop through each expired subscription and update the user
    for (const user of expiredSubscriptions) {
        user.isSubscription = false;
        user.subEndDate = null; // Clear the subscription end date
        yield user.save(); // Save the changes to the user
        console.log(`User ${user._id} subscription has expired.`);
    }
    console.log('Cron job completed. Checked for expired subscriptions.');
}));
