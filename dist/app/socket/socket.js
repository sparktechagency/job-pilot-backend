"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketHelper = void 0;
const colors_1 = __importDefault(require("colors"));
const logger_1 = require("../../shared/logger");
const socket = (io) => {
    io.on('connection', (socket) => {
        logger_1.logger.info(colors_1.default.blue('🔌🟢 A user connected'));
        socket.on('user-connected', (userId) => {
            socket.userId = userId;
            socket.join(userId); // Join the room for the specific user
            logger_1.logger.info(colors_1.default.green(`User ${userId} joined their notification room`));
        });
        socket.on('disconnect', () => {
            logger_1.logger.info(colors_1.default.red('🔌🔴 A user disconnected'));
        });
    });
};
exports.socketHelper = { socket };
