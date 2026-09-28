import crypto from "crypto";
import Doctor from "../models/doctorModel.js";
import { sendToken } from "../util/jwtToken.js";
import { sendEmail } from "../util/sendMail.js";

export const registerDoctor = async (req, res) => {
    try {
        const { name, email, password, phone, specialisation, gender, license, age, experience } = req.body;

        if(!name || !email || !password || !phone || !specialisation || !gender || !license || !age || !experience){
            return res.status(400).json({
                success : false, 
                message : "All input fields are required"
            })
        }

        const existingDoctor = await Doctor.findOne({
            $or : [{email}, {license}]
        });

        if(existingDoctor){
            return res.status(400).json({
                success : false,
                message : "Email or license already exist"
            })
        }

        const doctor = await Doctor.create({ name, email, password, phone, specialisation, gender, license, age, experience })


        const message = "Your profile is in pending state, Lets wait for approval"

        sendToken(doctor, 200, res, message)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password ){
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            })
        }

        const doctor = await Doctor.findOne({email});
        if(!doctor){
            return res.status(400).json({
                success : false,
                message : "Invalid credentials"
            })
        }

        const isPasswordMatched = await doctor.comparePassword(password);
        if(!isPasswordMatched){
            return res.status(400).json({
                success : false,
                message : "Invalid credentials"
            })
        }

        const message = "Doctor loggedin successfully"

        sendToken(doctor, 200, res, message)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const doctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if(!doctor){
            return res.status(400).json({
                success : false,
                message : "Doctor not found"
            })
        };

        return res.status(200).json({
            success : true,
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

export const updateDoctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body,{
            runValidators : true,
            new : true
        });

        if(!doctor){
            return res.status(400).json({
                success : false,
                message : "Doctor not found"
            })
        }

        return res.status(200).json({
            success : true,
            message : "Doctor profile updated successfully",
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

export const deleteDoctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if(!doctor){
            return res.status(400).json({
                success : false,
                message : "Doctor not found"
            })
        }

        return res.status(200).json({
            success : true,
            message : "Profile deleted successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        if(!doctors){
            return res.status(400).json({
                success : false,
                message : "Doctors Not found"
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

export const doctorLogout = (req, res) => {
    try{
        res.cookie("token", null, {
            expires : new Date(Date.now()),
            httpOnly : true
        });

        return res.status(200).json({
            success : true,
            message : "Doctor loggedout successfully"
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
        const doctor = await Doctor.findOne({email});

        if(!doctor){
            return res.status(400).json({
                success : false,
                message : "Doctor not found"
            })
        }

        let resetToken = doctor.resetPassword();
        await doctor.save();

        const resetPasswordUrl = `http://localhost:5173/reset-password/${resetToken}`;
        const message = `if you want to reset your password click on above link ${resetPasswordUrl}`;

        await sendEmail({
            email : doctor.email,
            subject : "Reset Password Request",
            message
        });

        return res.status(200).json({
            success : true,
            message : `Email sent successfully to ${doctor.email}`
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const resetPasswordDoctor = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

        const doctor = await Doctor.findOne({
            resetPasswordToken,
            resetPasswordExpire : { $gt : Date.now()}
        })

        if(!doctor){
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

        doctor.password = password;
        doctor.resetPasswordExpire = undefined
        doctor.resetPasswordToken = undefined

        await doctor.save();
        const message = "Password updated successfully"
        sendToken(doctor, 200, res, message)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}


// ali = ali khan
