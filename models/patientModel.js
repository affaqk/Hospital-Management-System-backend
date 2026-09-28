import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const patientSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        min : 3,
        max : 20,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true
    },
    phone : {
        type : String,
        required : true,
        max : 11
    },
    password : {
        type : String,
        required : true,
        min : 8
    },
    age : {
        type : Number,
        required : true
    },
    disease : {
        type : String,
        trim : true,
        required : true
    },
    gender : {
        type : String,
        required : true,
        enum : ["Male", "Female", "Prefer not to say"]
    },
    bloodGroup : {
        type : String,
        required : true,
        enum : ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    },
    role : {
        type : String,
        default : "patient"
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date
},{
    timestamps : true
})

patientSchema.pre("save", async function(){
    if(!this.isModified("password")){
        return
    }
    this.password = await bcrypt.hash(this.password, 10)
})

patientSchema.methods.comparePassword = function(password){
    return bcrypt.compare(password, this.password)
}

patientSchema.methods.getJWT = function(){
    return jwt.sign({
        id : this._id,
        role : this.role
    }, process.env.SECRET_KEY, {expiresIn : "7d"})
}

patientSchema.methods.resetPassword = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    return resetToken
}

const Patient = mongoose.model("Patient", patientSchema);
export default Patient
