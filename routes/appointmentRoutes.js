import express from "express";
import {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  approveAppointment,
  rejectAppointment,
  cancelAppointment,
  getAllAppointments,
  getAppointmentDetail,
  getAppointmentByStatus,
  updateAppointmentStatus,
  deleteAppointment,
} from "../controllers/appointmentController.js";
import { isAuthenticatedUser, authoriseRoles } from "../util/userAuth.js";

const appointmentRouter = express.Router();

appointmentRouter.post("/book", isAuthenticatedUser, authoriseRoles("patient"), bookAppointment);
appointmentRouter.get("/patient", isAuthenticatedUser, authoriseRoles("patient"), getPatientAppointments);
appointmentRouter.get("/doctor", isAuthenticatedUser, authoriseRoles("doctor"), getDoctorAppointments);
appointmentRouter.put("/approve/:id", isAuthenticatedUser, authoriseRoles("doctor"), approveAppointment);
appointmentRouter.put("/reject/:id", isAuthenticatedUser, authoriseRoles("doctor"), rejectAppointment);
appointmentRouter.put("/cancel/:id", isAuthenticatedUser, authoriseRoles("patient"), cancelAppointment);
appointmentRouter.get("/get-all", isAuthenticatedUser, authoriseRoles("admin"), getAllAppointments)
appointmentRouter.get("/:id", isAuthenticatedUser, authoriseRoles("admin"), getAppointmentDetail)
appointmentRouter.get("/status/:status", isAuthenticatedUser, authoriseRoles("admin"), getAppointmentByStatus)
appointmentRouter.put("/update/:id", isAuthenticatedUser, authoriseRoles("admin"), updateAppointmentStatus)
appointmentRouter.delete("/delete/:id", isAuthenticatedUser, authoriseRoles("admin"), deleteAppointment)

export default appointmentRouter;


