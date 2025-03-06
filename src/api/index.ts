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

export const validCodes = new Set<String>();
const passwordedClients: Map<String, Set<WebSocket>> = new Map();
const router = express.Router();
const mutex = new Mutex();

router.ws("/", (ws, req) => {
  let code: String = "";
  ws.on("open", () => {
    console.log("New client connected");
  });
  ws.on("message", (msg) => {
    let msgBlock = JSON.parse(msg.toString()) as MessageBlock;
    let clients;
    if (code == "") {
      code = msgBlock.code;
      clients = passwordedClients.get(code);
      if (clients != undefined) {
        clients.add(ws);
      } else {
        clients = new Set([ws]);
        passwordedClients.set(code, clients);
      }
    } else {
      clients = passwordedClients.get(code);
    }

    if (code != msgBlock.code) {
      console.error("Code mismatch: Have ", code, ", Got", msgBlock.code);
      ws.close();
    }

    clients!.forEach((client) => {
      if (client != ws) {
        client.send(msg);
      }
    });
  });
  ws.on("close", () => {
    if (code != "") {
      let clients = passwordedClients.get(code);
      if (clients != undefined) {
        clients.delete(ws);
        if (clients.size == 0) {
          passwordedClients.delete(code);
        }
      }
    }
  });
});

export default router;
