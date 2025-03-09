// import bodyParser from "body-parser";
import { app } from "../lib/app/index.cjs";
import express from "express";
import expressWs from "express-ws";
import {
  MessageBlock,
  PomoEvent,
  SocketWrapper,
} from "../common/interfaces.js";
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
const passwordedClients: Map<string, Set<SocketWrapper>> = new Map();
const router = express.Router();
const mutex = new Mutex();

router.ws("/", (ws, req) => {
  let upWS = new SocketWrapper(ws);

  ws.on("open", () => {
    console.log("New client connected");
  });

  ws.on("message", (msg) => {
    let msgBlock = JSON.parse(msg.toString()) as MessageBlock;
    let clients: Set<SocketWrapper> | undefined;

    // Preprocess the message, auth only
    if (upWS.code == "") {
      upWS.code = msgBlock.code;
      clients = passwordedClients.get(upWS.code);

      if (clients !== undefined) {
        let firstClient = clients.values().next()?.value;
        upWS.admin = false;
        upWS.lastAdminConfig = firstClient?.lastAdminConfig;
        clients.add(upWS);
      } else {
        upWS.admin = true;
        upWS.lastAdminConfig = {
          event: PomoEvent.SYNC_CONFIG,
          code: upWS.code,
          clockInfo: msgBlock.clockInfo,
        };
        clients = new Set([upWS]);
        passwordedClients.set(upWS.code, clients);
      }
    }

    clients = passwordedClients.get(upWS.code)!;
    let firstClient = clients.values().next()?.value;

    // Ensure the code is correct
    if (upWS.code !== msgBlock.code) {
      console.error("Code mismatch: Have ", upWS.code, ", Got", msgBlock.code);
      ws.close();
    }

    // Upgrading the first client to admin
    if (!upWS.admin) {
      if (firstClient === upWS) {
        upWS.admin = true;
      }
    }

    if (upWS.admin) {
      // If the clock info has changed, update the last admin config
      if (upWS.lastAdminConfig!.clockInfo != msgBlock?.clockInfo) {
        upWS.lastAdminConfig!.clockInfo = msgBlock.clockInfo;

        // Then send the new config to all clients
        clients?.forEach((client) => {
          if (client != upWS) {
            client.socket.send(JSON.stringify(upWS.lastAdminConfig));
          }
        });
      }
    } else {
      // If non-admin client has a different clock info, send a rewrite
      if (firstClient?.lastAdminConfig?.clockInfo != msgBlock?.clockInfo) {
        msgBlock.clockInfo = undefined;
        console.log("Sending rewrite", upWS.lastAdminConfig);
        ws.send(JSON.stringify(upWS.lastAdminConfig));
      }
    }

    // Send the message to all clients, except this one.
    clients?.forEach((client) => {
      if (client != upWS) {
        client.socket.send(msg);
      }
    });
  });
  ws.on("close", () => {
    if (upWS.code != "") {
      let clients = passwordedClients.get(upWS.code);
      if (clients != undefined) {
        clients.delete(upWS);
        if (clients.size == 0) {
          passwordedClients.delete(upWS.code);
        }
      }
    }
  });
});

export default router;
