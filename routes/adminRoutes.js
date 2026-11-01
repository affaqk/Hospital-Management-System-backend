import express from "express";
import { adminLogin, adminLogout, adminProfile, deleteAdminProfile, registerAdmin, resetPasswordRequest, updateAdminProfile, resetPasswordAdmin, updatePasswordAdmin, approveDoctor, rejectDoctor, pendingDoctors } from "../controllers/adminController.js";
import { authoriseRoles, isAuthenticatedUser } from "../util/userAuth.js";
const adminRouter = express.Router();

adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", adminLogin);
adminRouter.get("/profile", isAuthenticatedUser, adminProfile);
adminRouter.put("/update", isAuthenticatedUser, updateAdminProfile);
adminRouter.delete("/delete", isAuthenticatedUser, deleteAdminProfile)
adminRouter.get("/logout", isAuthenticatedUser, adminLogout)
adminRouter.post("/reset-password-request", resetPasswordRequest)
adminRouter.put("/reset-password/:token", resetPasswordAdmin)
adminRouter.put("/update-password", isAuthenticatedUser, updatePasswordAdmin);
adminRouter.post("/approve-doctor/:id", isAuthenticatedUser, authoriseRoles("admin"), approveDoctor)
adminRouter.post("/reject-doctor/:id", isAuthenticatedUser, authoriseRoles("admin"), rejectDoctor)
adminRouter.get("/pending-doctors", isAuthenticatedUser, authoriseRoles("admin"), pendingDoctors)

export default adminRouter