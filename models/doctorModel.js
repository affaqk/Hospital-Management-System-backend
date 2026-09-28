import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const doctorSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        min : 3,
        max : 20
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true,
        max : 11
    },
    specialisation : {
        type : String,
        required : true,
        enum : ["General Physician", "Dermatologist", "Cardialogist", "ENT", "Psychologist", "Dentist"]
    },
    license : {
        type : String,
        required : true,
        unique : true
    },
    age : {
        type : Number,
        required : true
    },
    experience : {
        type : Number,
        required : true
    },
    gender : {
        type : String,
        required : true,
        enum : ["Male", "Female", "Prefer not to say"]
    },
    status : {
        type : String,
        enum : ["Pending", "Approved"],
        default : "Pending"
    },
    role : {
        type : String,
        default : "doctor"
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date
},{
    timestamps : true
});

doctorSchema.pre("save", async function(){
    if(!this.isModified("password")){
        return
    }
    this.password = await bcrypt.hash(this.password, 10)
})

doctorSchema.methods.comparePassword = function(enteredPassword){
    return bcrypt.compare(enteredPassword, this.password)
}

doctorSchema.methods.getJWT = function(){
    return jwt.sign({
        id : this._id,
        role : this.role
    }, process.env.SECRET_KEY, {expiresIn : "7d"})
}

doctorSchema.methods.resetPassword = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    return resetToken
}

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor 