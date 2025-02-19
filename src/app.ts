import { app } from "./lib/app";
import api from "./api/";

app.use("/api/v1", api);

export default app;
