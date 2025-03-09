// import bodyParser from "body-parser";
import { app } from "../lib/app/index.cjs";
import express from "express";
import expressWs from "express-ws";
import { MessageBlock, PomoEvent } from "../common/interfaces.js";
import { WebSocket } from "ws";
import {
  Mutex,
  MutexInterface,
  Semaphore,
  SemaphoreInterface,
  withTimeout,
} from "async-mutex";

expressWs(app);

export const validCodes = new Set<string>();
const passwordedClients: Map<string, Set<WebSocket>> = new Map();
const router = express.Router();
const mutex = new Mutex();

router.ws("/", (ws, req) => {
  let code: string = "";
  let admin = false;

  ws.on("open", () => {
    console.log("New client connected");
  });

  ws.on("message", (msg) => {
    let msgBlock = JSON.parse(msg.toString()) as MessageBlock;
    let clients: Set<WebSocket> | undefined;

    // Preprocess the message, auth only
    if (code == "") {
      code = msgBlock.code;
      clients = passwordedClients.get(code);
      if (clients !== undefined) {
        clients.add(ws);
      } else {
        // No clients yet, this is the admin ws connection.
        admin = true;
        clients = new Set([ws]);
        passwordedClients.set(code, clients);
      }
    }

    clients = passwordedClients.get(code)!;
    let firstClient = clients.values().next()?.value;
    if (!admin) {
      if (firstClient === ws) {
        admin = true;
      }
    }

    if (!admin) {
      msgBlock.clockInfo = undefined;
    }

    if (code !== msgBlock.code) {
      console.error("Code mismatch: Have ", code, ", Got", msgBlock.code);
      ws.close();
    }

    // Send the message to all clients, except this one.
    clients?.forEach((client) => {
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
