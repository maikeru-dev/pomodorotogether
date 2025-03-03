import { app } from "./lib/app";
import express from "express";
import api from "./api/";

const properRoot = __dirname.split("/").slice(0, -1).join("/");
console.log("properRoot: ", properRoot);

app.use("/", express.static(properRoot + "/src/public/"));

app.use("/api/v1", api);

export default app;
