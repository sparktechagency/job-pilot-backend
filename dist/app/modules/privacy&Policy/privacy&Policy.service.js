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
exports.privacyPolicyService = void 0;
const privacy_Policy_model_1 = require("./privacy&Policy.model");
const createPrivacyPolicyInDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate payload
    if (!payload.text || payload.text.trim() === '') {
        throw new Error('Privacy policy text is required');
    }
    // Delete any existing privacy policy first to ensure only one exists
    yield privacy_Policy_model_1.PrivacyPolicyModel.deleteMany({});
    const result = yield privacy_Policy_model_1.PrivacyPolicyModel.create(payload);
    return result;
});
const updatePrivacyPolicyFromDB = (payload, id) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate payload
    if (!payload.text || payload.text.trim() === '') {
        throw new Error('Privacy policy text is required for update');
    }
    if (!id) {
        throw new Error('Privacy policy ID is required');
    }
    const result = yield privacy_Policy_model_1.PrivacyPolicyModel.findByIdAndUpdate(id, { text: payload.text }, { new: true, runValidators: true });
    if (!result) {
        throw new Error('Privacy policy not found with ID: ' + id);
    }
    return result;
});
const readPrivacyPolicyFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield privacy_Policy_model_1.PrivacyPolicyModel.findOne({}); // Use findOne instead of find
    return result;
});
exports.privacyPolicyService = {
    createPrivacyPolicyInDB,
    updatePrivacyPolicyFromDB,
    readPrivacyPolicyFromDB
};
