import express from "express";
const app = express();
import cors from "cors"
import dotenv from "dotenv";
import Connection from "./db/connections.js";
import patientRouter from "./routes/patientRoutes.js";
import doctorRouter from "./routes/doctorRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import appointmentRouter from "./routes/appointmentRoutes.js";
import cookieParser from "cookie-parser";
dotenv.config()

const port = process.env.PORT || 8000
Connection()

app.use(cookieParser())
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],      // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed custom headers
    credentials: true,                              // Allow cookies/auth headers
    optionsSuccessStatus: 200                       // Legacy browser compatibility (IE11)
};

app.use(cors(corsOptions));
app.use("/api/patients", patientRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/admin", adminRouter);
app.use("/api/appointments", appointmentRouter);

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
})
