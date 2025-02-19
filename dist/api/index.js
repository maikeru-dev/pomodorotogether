"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../lib/app");
const express_1 = __importDefault(require("express"));
const express_ws_1 = __importDefault(require("express-ws"));
(0, express_ws_1.default)(app_1.app);
const router = express_1.default.Router();
router.ws("/", (ws, req) => {
    ws.on("message", (msg) => { });
});
exports.default = router;
//# sourceMappingURL=index.js.map