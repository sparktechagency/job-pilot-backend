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
exports.recruitersService = void 0;
const recruiters_model_1 = require("./recruiters.model");
const createRecruitersFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield recruiters_model_1.RecruiterModel.create(payload);
    return result;
});
const getAllRecruiters = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield recruiters_model_1.RecruiterModel.find({});
    return result;
});
const getSingleRecruiters = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield recruiters_model_1.RecruiterModel.find({ _id: id });
    return result;
});
const updateRecruiter = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload);
    const result = yield recruiters_model_1.RecruiterModel.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const deleteRecruiter = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield recruiters_model_1.RecruiterModel.findByIdAndDelete(id);
    return result;
});
exports.recruitersService = {
    createRecruitersFromDB,
    getAllRecruiters,
    getSingleRecruiters,
    updateRecruiter,
    deleteRecruiter
};
