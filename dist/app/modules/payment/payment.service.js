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
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = void 0;
const user_model_1 = require("../user/user.model");
const payment_model_1 = require("./payment.model");
const createPaymentToDB = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the userId exists and is a valid user
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    // Set userId in the payload before creating the payment
    const paymentPayload = Object.assign(Object.assign({}, payload), { userId });
    // Create the payment record
    const payment = yield payment_model_1.PaymentModel.create(paymentPayload);
    // Calculate the subscription end date (30 days from now)
    const subStartDate = Date.now(); // Current time in milliseconds
    const subEndDate = subStartDate + (30 * 24 * 60 * 60 * 1000); // Adding 30 days
    // Update user subscription status and end date
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, { isSubscription: true, subEndDate }, // Update subscription status and end date
    { new: true } // Return the updated user document
    );
    // Return the created payment 
    return payment;
});
const getAllPaymentFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_model_1.PaymentModel.find({}).populate('userId');
    return result;
});
const getSinglePaymentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_model_1.PaymentModel.findById(id).populate('userId');
    return result;
});
const getAllPaymentUnderUserFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_model_1.PaymentModel.find({ userId: userId }).populate('userId');
    return result;
});
exports.paymentService = {
    createPaymentToDB,
    getAllPaymentFromDB,
    getSinglePaymentFromDB,
    getAllPaymentUnderUserFromDB
};
