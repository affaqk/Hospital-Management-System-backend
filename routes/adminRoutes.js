import express from "express";
import { adminLogin, adminLogout, adminProfile, deleteAdminProfile, registerAdmin, resetPasswordRequest, updateAdminProfile, resetPasswordAdmin } from "../controllers/adminController.js";
import { isAuthenticatedUser } from "../util/userAuth.js";
const adminRouter = express.Router();

adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", adminLogin);
adminRouter.get("/profile/:id", isAuthenticatedUser, adminProfile);
adminRouter.put("/update/:id", isAuthenticatedUser, updateAdminProfile);
adminRouter.delete("/delete/:id", isAuthenticatedUser, deleteAdminProfile)
adminRouter.get("/logout", isAuthenticatedUser, adminLogout)
adminRouter.post("/reset-password-request", resetPasswordRequest)
adminRouter.put("/reset-password/:token", resetPasswordAdmin)

export default adminRouter