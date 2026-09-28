import jwt from "jsonwebtoken";
import Doctor from "../models/doctorModel.js";
import Patient from "../models/patientModel.js";
import Admin from "../models/adminModel.js";

export const isAuthenticatedUser = async (req, res, next) => {
    try {
        const { token } = req.cookies
        if(!token){
            return res.status(400).json({
                success : false,
                message : "Please Login First"
            })
        }

        const decodedData = jwt.verify(token, process.env.SECRET_KEY)

        let user;

        if(decodedData.role === "doctor"){
            user = await Doctor.findById(decodedData.id)
        } else if(decodedData.role === "patient"){
            user = await Patient.findById(decodedData.id)
        } else if (decodedData.role === "admin"){
            user = await Admin.findById(decodedData.id)
        };

        if(!user){
            return res.status(400).json({
                success : false,
                message : "User not found"
            })
        }

        req.user = user
        req.userRole = decodedData.role;

        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success : false,
            error
        })
    }
}
export const authoriseRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(400).json({
                success : false,
                message : "You are not authorised to access this route"
            })
        }
        next()
    }
}