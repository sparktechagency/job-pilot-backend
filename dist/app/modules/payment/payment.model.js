"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModel = void 0;
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true, unique: true },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});
exports.PaymentModel = (0, mongoose_1.model)('Payment', paymentSchema);
