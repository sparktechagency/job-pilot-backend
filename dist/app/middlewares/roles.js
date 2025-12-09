"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRights = exports.roles = void 0;
const allRoles = {
    admin: ['admin'],
    user: ['user'],
    // technician: ['technician', 'common'],
    // company: ['company', 'common'],
};
const roles = Object.keys(allRoles);
exports.roles = roles;
// Map the roles to their corresponding rights
const roleRights = new Map(Object.entries(allRoles));
exports.roleRights = roleRights;
