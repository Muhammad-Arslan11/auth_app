import mongoose from "mongoose";

const UserSchema  = mongoose.Schema({
email: {
    type: String,
    required: true,
    unique: true,
},
password: {
    type: String,
    required: true,
},
name: {
    type: String,
    required: true,
},
lastLogin: {
    type: Date,
    default: Date.now(),
},
isVerified: {
    type: Boolean,
    default: false,
},
resetpasswordToken : String,
verificationToken: String,
resetPasswordExpiresAt: Date,
verificationTokenExpiresAt: Date,

}, {timestamps: true})

export const UserModel = mongoose.model("User", UserSchema);