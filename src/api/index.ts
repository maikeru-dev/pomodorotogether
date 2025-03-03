import bodyParser from "body-parser";
import { app } from "../lib/app";
import express from "express";
import expressWs from "express-ws";
import {
  PomodoroEvent,
  PomodoroConfig,
  PomodoroState,
  MessageBlock,
} from "../common";

expressWs(app);

const router = express.Router();

router.ws("/", (ws, req) => {
  ws.on("message", (msg) => {
    let msgBlock = JSON.parse(msg.toString()) as MessageBlock;
    console.log(msgBlock.config.secret);
  });
});

export default router;
