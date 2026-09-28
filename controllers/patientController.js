import crypto from "crypto";
import Patient from "../models/patientModel.js";
import { sendToken } from "../util/jwtToken.js";
import { sendEmail } from "../util/sendMail.js";

export const registerPatient = async (req, res) => {
    try {
        const { name, email, phone, password, age, disease, gender, bloodGroup } = req.body;

        if(!name || !email || !phone || !password || !age || !disease || !gender || !bloodGroup){
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            })
        }

        const existingPatient = await Patient.findOne({email});

        if(existingPatient){
            return res.status(400).json({
                success : false,
                message : "Email already exist"
            })
        }

        const patient = await Patient.create({
            name,
            email,
            phone,
            password,
            age,
            disease,
            gender,
            bloodGroup
        });

        const message = "Patient registered successfully"
        sendToken(patient, 200, res, message)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const loginPatient = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            })
        }

        const patient = await Patient.findOne({email});
        if(!patient){
            return res.status(400).json({
                success : false,
                message : "Invalid credentials"
            })
        };

        const passwordMatched = await patient.comparePassword(password);

        if(!passwordMatched){
            return res.status(400).json({
                success : false,
                message : "Invalid credentials"
            })
        };

        const message = "Patient loggedin successfully"
        sendToken(patient, 200, res, message)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const patientProfile = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if(!patient){
            return res.status(400).json({
                success : false,
                message : "Patient not found"
            })
        }

        return res.status(200).json({
            success : true,
            patient
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
            runValidators : true,
            new : true
        })

        if(!patient){
            return res.status(400).json({
                success : false,
                message : "Patient not found"
            })
        }

        return res.status(200).json({
            success : true,
            message : "Patient updated successfully",
            patient
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if(!patient){
            return res.status(400).json({
                success : false,
                message : "Patient not found"
            })
        }

        return res.status(200).json({
            success : true,
            message : "Patient deleted successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
        if(!patients){
            return res.status(400).json({
                success : false,
                message : "Patients not found"
            })
        }

        return res.status(200).json({
            success : true,
            patients
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const patientLogout = (req, res) => {
    try{
        res.cookie("token", null, {
            expires : new Date(Date.now()),
            httpOnly : true
        });

        return res.status(200).json({
            success : true,
            message : "Patient loggedout successfully"
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
        const patient = await Patient.findOne({email});

        if(!patient){
            return res.status(400).json({
                success : false,
                message : "Patient not found"
            })
        }

        let resetToken = patient.resetPassword();
        await patient.save();

        const resetPasswordUrl = `http://localhost:5173/reset-password/${resetToken}`;
        const message = `if you want to reset your password click on above link ${resetPasswordUrl}`;

        await sendEmail({
            email : patient.email,
            subject : "Reset Password Request",
            message
        });

        return res.status(200).json({
            success : true,
            message : `Email sent successfully to ${patient.email}`
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}


export const resetPasswordPatient = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

        const patient = await Patient.findOne({
            resetPasswordToken,
            resetPasswordExpire : { $gt : Date.now()}
        })

        if(!patient){
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

        patient.password = password;
        patient.resetPasswordExpire = undefined
        patient.resetPasswordToken = undefined

        await patient.save();
        const message = "Password updated successfully"
        sendToken(patient, 200, res, message)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}