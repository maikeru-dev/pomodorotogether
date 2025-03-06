import { app } from "./lib/app/index.cjs";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import api from "./api/index.js";
import { validCodes } from "./api/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const properRoot = __dirname.split("/").slice(0, -1).join("/");
console.log("properRoot: ", properRoot);

app.use("/assets/", express.static(properRoot + "/public/assets/"));

app.use("/api/v1", api);

app.use("/", (req, res) => {
  // TODO: Add a regex check for the code
  console.log("Serving", req.url);
  validCodes.add(req.url);
  console.log("validCodes: ", validCodes);
  res.sendFile("./public/index.html", { root: properRoot });
});

export default app;
