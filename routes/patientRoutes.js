import express from "express";
import { deletePatient, getAllPatients, loginPatient, patientLogout, patientProfile, registerPatient, updatePatient, resetPasswordRequest, resetPasswordPatient, updatePasswordPatient } from "../controllers/patientController.js";
import { authoriseRoles, isAuthenticatedUser } from "../util/userAuth.js";

const patientRouter = express.Router();

patientRouter.post("/register", registerPatient);
patientRouter.post("/login", loginPatient)
patientRouter.get("/profile", isAuthenticatedUser, patientProfile)
patientRouter.put("/update", isAuthenticatedUser, updatePatient)
patientRouter.delete("/delete", isAuthenticatedUser, deletePatient)
patientRouter.get("/get-all", isAuthenticatedUser, authoriseRoles("admin"),  getAllPatients)
patientRouter.get("/logout", isAuthenticatedUser, patientLogout)
patientRouter.post("/reset-password-request", resetPasswordRequest);
patientRouter.put("/reset-password/:token", resetPasswordPatient)
patientRouter.put("/update-password", isAuthenticatedUser, updatePasswordPatient)

export default patientRouter