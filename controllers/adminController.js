import Admin from "../models/adminModel.js";
import Doctor from "../models/doctorModel.js";
import { sendToken } from "../util/jwtToken.js";
import { sendEmail } from "../util/sendMail.js";
import crypto from "crypto"

export const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                success : false,
                message : "All input fields are required"
            })
        }

        const admin = await Admin.create({
            name,
            email,
            password
        });

        if(!admin){
            return res.status(400).json({
                success : false,
                message : "Admin not created"
            })
        }

        const message = "Admin registered successfully"
        sendToken(admin, 200, res, message)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            })
        }
        const admin = await Admin.findOne({email});

        if(!admin){
            return res.status(400).json({
                success : false,
                message : "Admin not found"
            })
        }

        const isPasswordMatched = await admin.comparePassword(password);

        if(!isPasswordMatched){
            return res.status(400).json({
                success : false,
                message : "Invalid credentials"
            })
        }

        const message = "User loggedIn successfully"
        sendToken(admin, 200, res, message)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const adminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id);
        if(!admin){
            return res.status(400).json({
                success : false,
                message : "admin not found"
            })
        }

        return res.status(200).json({
            success : true,
            admin
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const updateAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findByIdAndUpdate(req.user.id, req.body, {
            new : true,
            runValidators : true
        });

        if(!admin){
            return res.status(400).json({
                success : false,
                message : "Admin not found"
            })
        }

        return res.status(200).json({
            success : true,
            message : "Admin profile updated successfully",
            admin
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const deleteAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.user.id);

        if(!admin){
            return res.status(400).json({
                success : false,
                message : "Admin not found"
            })
        }

        return res.status(200).json({
            success : true,
            message : "Admin profile deleted successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const adminLogout = (req, res) => {
    try{
        res.cookie("token", null, {
            expires : new Date(Date.now()),
            httpOnly : true
        });

        return res.status(200).json({
            success : true,
            message : "Admin loggedout successfully"
        })
    } catch(error){
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const resetPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;
        const admin = await Admin.findOne({email});

        if(!admin){
            return res.status(400).json({
                success : false,
                message : "Admin not found"
            })
        }

        let resetToken = admin.resetPassword();
        await admin.save();

        const resetPasswordUrl = `http://localhost:5173/reset-password/${resetToken}`;
        const message = `if you want to reset your password click on above link ${resetPasswordUrl}`;

        await sendEmail({
            email : admin.email,
            subject : "Reset Password Request",
            message
        });

        return res.status(200).json({
            success : true,
            message : `Email sent successfully to ${admin.email}`
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const resetPasswordAdmin = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

        const admin = await Admin.findOne({
            resetPasswordToken,
            resetPasswordExpire : { $gt : Date.now()}
        })

        if(!admin){
            return res.status(400).json({
                success : false,
                message : "Invalid token or time has been expired"
            })
        }

        const { password, confirmPassword } = req.body;
        if(password !== confirmPassword){
            return res.status(400).json({
                success : false,
                message : "Password doesnt match to each other"
            })
        }

        admin.password = password;
        admin.resetPasswordExpire = undefined
        admin.resetPasswordToken = undefined

        await admin.save();
        const message = "Password updated successfully"
        sendToken(admin, 200, res, message)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const updatePasswordAdmin = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmNewPassword } = req.body;
        const admin = await Admin.findById(req.user.id);
        if(!admin){
            return res.status(400).json({
                success : false,
                message : "User not found"
            })
        }

        if(newPassword !== confirmNewPassword){
            return res.status(400).json({
                success : false,
                message : "Password doesnt match to each other"
            })
        }

        admin.password = newPassword;
        await admin.save();
        const message = "Password updated successfully"
        sendToken(admin, 200, res, message)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const approveDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if(!doctor){
            return res.status(400).json({
                success : false,
                message : "Doctor not found"
            })
        }

        if(doctor.status === "Approved"){
            return res.status(200).json({
                success : false,
                message : "Doctor is already approved"
            })
        }

        doctor.status = "Approved";
        await doctor.save();

        return res.status(200).json({
            success : true,
            message : "Doctor approved successfully",
            doctor
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const rejectDoctor = async (req, res) => {
    try {
        const { id } = req.params
        const doctor = await Doctor.findById(id);
        if(!doctor){
            return res.status(400).json({
                success : false,
                message : "Doctor not found"
            })
        }

        await Doctor.findByIdAndDelete(id);
        return res.status(200).json({
            success : true,
            message : "Application rejected successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const pendingDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({
            status : "Pending"
        });
        if(!doctors){
            return res.status(400).json({
                success : false,
                message : "Doctors not found"
            })
        }

        return res.status(200).json({
            success : true,
            doctors
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}