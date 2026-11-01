import express from "express";
import { deleteDoctorProfile, doctorLogout, doctorProfile, getAllDoctors, loginDoctor, registerDoctor, resetPasswordDoctor, resetPasswordRequest, updateDoctorProfile, updatePasswordDoctor } from "../controllers/doctorController.js";
import { authoriseRoles, isAuthenticatedUser } from "../util/userAuth.js";
const doctorRouter = express.Router();

doctorRouter.post("/register", registerDoctor)
doctorRouter.post("/login", loginDoctor)
doctorRouter.get("/profile", isAuthenticatedUser, doctorProfile)
doctorRouter.put("/update", isAuthenticatedUser, updateDoctorProfile)
doctorRouter.delete("/delete", isAuthenticatedUser, deleteDoctorProfile)
doctorRouter.get("/get-all", isAuthenticatedUser, getAllDoctors)
doctorRouter.get("/logout", isAuthenticatedUser, doctorLogout)
doctorRouter.post("/reset-password-request", resetPasswordRequest)
doctorRouter.put("/reset-password/:token", resetPasswordDoctor)
doctorRouter.put("/update-password", isAuthenticatedUser, updatePasswordDoctor)

export default doctorRouter