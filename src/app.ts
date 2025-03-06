import { app } from "./lib/app/index.cjs";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import api from "./api/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const properRoot = __dirname.split("/").slice(0, -1).join("/");
console.log("properRoot: ", properRoot);

app.use("/", express.static(properRoot + "/public/"));

app.use("/api/v1", api);

export default app;
