import express from "express";
import { deletePatient, getAllPatients, loginPatient, patientLogout, patientProfile, registerPatient, updatePatient, resetPasswordRequest, resetPasswordPatient } from "../controllers/patientController.js";
import { authoriseRoles, isAuthenticatedUser } from "../util/userAuth.js";

const patientRouter = express.Router();

patientRouter.post("/register", registerPatient);
patientRouter.post("/login", loginPatient)
patientRouter.get("/profile/:id", isAuthenticatedUser, patientProfile)
patientRouter.put("/update/:id", isAuthenticatedUser, updatePatient)
patientRouter.delete("/delete/:id", isAuthenticatedUser, deletePatient)
patientRouter.get("/get-all", isAuthenticatedUser, authoriseRoles("admin"),  getAllPatients)
patientRouter.get("/logout", isAuthenticatedUser, patientLogout)
patientRouter.post("/reset-password-request", resetPasswordRequest);
patientRouter.put("/reset-password/:token", resetPasswordPatient)


export default patientRouter