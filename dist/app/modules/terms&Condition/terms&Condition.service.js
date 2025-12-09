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
exports.termsConditionService = void 0;
const terms_Condition_model_1 = require("./terms&Condition.model");
const createTermsConditionInDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield terms_Condition_model_1.TermsConditionModel.create(payload);
    return result;
});
const updateTermsConditionFromDB = (payload, id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield terms_Condition_model_1.TermsConditionModel.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const readTermsConditionFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield terms_Condition_model_1.TermsConditionModel.find({});
    return result;
});
exports.termsConditionService = {
    createTermsConditionInDB,
    updateTermsConditionFromDB,
    readTermsConditionFromDB
};
