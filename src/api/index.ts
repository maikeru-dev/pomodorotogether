import bodyParser from "body-parser";
import { app } from "../lib/app/index.cjs";
import express from "express";
import expressWs from "express-ws";
import { MessageBlock } from "../common/interfaces.js";

expressWs(app);

const router = express.Router();

router.ws("/", (ws, req) => {
  ws.on("message", (msg) => {
    let msgBlock = JSON.parse(msg.toString()) as MessageBlock;
    console.log(msgBlock.event);
  });
});

export default router;
