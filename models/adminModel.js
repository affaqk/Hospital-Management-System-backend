import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const adminSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
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
    role : {
        type : String,
        default : "admin"
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date

},{
    timestamps : true
})

adminSchema.pre("save", async function(){
    if(!this.isModified("password")){
        return
    }
    this.password = await bcrypt.hash(this.password, 10)
})

adminSchema.methods.comparePassword = function(password){
    return bcrypt.compare(password, this.password)
}

adminSchema.methods.getJWT = function(){
    return jwt.sign({
        id : this._id,
        role : this.role
    }, process.env.SECRET_KEY, {expiresIn : "7d"})
}

adminSchema.methods.resetPassword = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    return resetToken
}

const Admin = mongoose.model("Admin", adminSchema);
export default Admin