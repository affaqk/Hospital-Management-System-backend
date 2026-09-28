import express from "express";
const app = express();

import dotenv from "dotenv";
import Connection from "./db/connections.js";
import patientRouter from "./routes/patientRoutes.js";
import doctorRouter from "./routes/doctorRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import cookieParser from "cookie-parser";
dotenv.config()


Connection()

app.use(cookieParser())
app.use(express.json());
app.use("/api/patients", patientRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/admin", adminRouter)

export default app