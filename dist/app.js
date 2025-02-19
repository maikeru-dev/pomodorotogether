"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./lib/app");
const api_1 = __importDefault(require("./api/"));
app_1.app.use("/api/v1", api_1.default);
exports.default = app_1.app;
//# sourceMappingURL=app.js.map