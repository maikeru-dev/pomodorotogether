import { app } from "../lib/app";
import express from "express";
import expressWs from "express-ws";

expressWs(app);

const router = express.Router();

router.ws("/", (ws, req) => {
  ws.on("message", (msg) => {});
});

export default router;
