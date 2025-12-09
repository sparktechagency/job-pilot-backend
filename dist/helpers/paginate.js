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
// Plugin function for pagination
const paginate = (schema) => {
    schema.statics.paginate = function (filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const limit = (_a = options.limit) !== null && _a !== void 0 ? _a : 10;
            const page = (_b = options.page) !== null && _b !== void 0 ? _b : 1;
            const skip = (page - 1) * limit;
            const sort = (_c = options.sortBy) !== null && _c !== void 0 ? _c : 'createdAt';
            const countPromise = this.countDocuments(filter).exec();
            let query = this.find(filter).sort(sort).skip(skip).limit(limit);
            if (options.populate) {
                query = query.populate(options.populate);
            }
            const [totalResults, results] = yield Promise.all([
                countPromise,
                query.exec(),
            ]);
            return {
                results,
                page,
                limit,
                totalPages: Math.ceil(totalResults / limit),
                totalResults,
            };
        });
    };
};
exports.default = paginate;
