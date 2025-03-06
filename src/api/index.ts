// import bodyParser from "body-parser";
import { app } from "../lib/app/index.cjs";
import express from "express";
import expressWs from "express-ws";
import { MessageBlock } from "../common/interfaces.js";
import { WebSocket } from "ws";
import {
  Mutex,
  MutexInterface,
  Semaphore,
  SemaphoreInterface,
  withTimeout,
} from "async-mutex";

expressWs(app);

const router = express.Router();
const clients = new Set<WebSocket>();
const mutex = new Mutex();

router.ws("/", (ws, req) => {
  clients.add(ws);
  ws.on("open", () => {
    console.log("New client connected");
  });
  ws.on("message", (msg) => {
    let msgBlock = JSON.parse(msg.toString()) as MessageBlock;
    console.log(msgBlock.event);
  });
  ws.on("close", () => {
    clients.delete(ws);
  });
});

export default router;
