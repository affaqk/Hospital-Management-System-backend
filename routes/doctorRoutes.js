import express from "express";
import { deleteDoctorProfile, doctorLogout, doctorProfile, getAllDoctors, loginDoctor, registerDoctor, resetPasswordDoctor, resetPasswordRequest, updateDoctorProfile } from "../controllers/doctorController.js";
import { isAuthenticatedUser } from "../util/userAuth.js";
const doctorRouter = express.Router();

doctorRouter.post("/register", registerDoctor)
doctorRouter.post("/login", loginDoctor)
doctorRouter.get("/profile/:id", isAuthenticatedUser, doctorProfile)
doctorRouter.put("/update/:id", isAuthenticatedUser, updateDoctorProfile)
doctorRouter.delete("/delete/:id", isAuthenticatedUser, deleteDoctorProfile)
doctorRouter.get("/get-all", isAuthenticatedUser, getAllDoctors)
doctorRouter.get("/logout", isAuthenticatedUser, doctorLogout)
doctorRouter.post("/reset-password-request", resetPasswordRequest)
doctorRouter.put("/reset-password/:token", resetPasswordDoctor)

export default doctorRouter