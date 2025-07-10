import { userModel } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/email.js";


export const handleSignup = async (req, res) => {
   const {name, email, password} = req.body;

   try {
       if(!name || !email || !password){
        throw new Error("All fields are required!");
       }
    
    const userAlreadyExists = await userModel.findOne({email});
    if(userAlreadyExists) return res.status(400).json({success: false, message: "user already exists"});

    const hashedPassword = await bcryptjs.hash(password, 10);
    // verification code
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    // creating user
    const user = new userModel({
        name: name,
        password: hashedPassword,
        email: email,
        verificationToken: verificationToken,
        verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours in miliseconds
    });

    await user.save();
    //jwt 
    generateTokenAndSetCookie(res, user?._id);
    // verification email
   await sendVerificationEmail(user?.email, verificationToken);

    res.status(201).json({
        success: true,
        message: "user is created successfully",
        user: {
            ...user._doc,
            password: undefined,
        },
    });
    return;

   }catch (error) {
    res.status(400).json({success: false, message: error.message});
   }
  
};

export const verifyEmail = async (req, res)=>{
    const {verificationCode} = req.body;

    try {
        // find the user
        const user = await userModel.findOne({
            verificationToken: verificationCode,
            verificationTokenExpiresAt: {$gt : Date.now(),
            }
        })

        if(!user){
           return  res.status(400).json({success: false, message: "invalid verification code or verficaton token exp"});
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user?.email, user?.name);

           res.status(201).json({
        success: true,
        message: "verified successfully",
        user: {
            ...user._doc,
            password: undefined,
        },
    });
    return;

    } catch (error) {
          res.status(400).json({success: false, message: error.message});
    }
};

export const forgotPassword = async (req, res)=>{

};

export const resetPassword = async (req, res)=>{

};

export const handleLogin = async (req, res) => {
   const {email, password} = req.body;

   try {
    const user = await userModel.findOne({email});

    if(!user){
        return res.status(400).json({success: false, message: "user not found"});
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if(!isPasswordCorrect){
       return res.status(400).json({success: false, message: "invalid password"});
    }
    
    generateTokenAndSetCookie(res, user?._id);
    user.lastLogin = Date.now();
    await user.save();

      res.status(200).json({
        success: true,
        message: "logged in successfully",
        user: {
            ...user._doc,
            password: undefined,
        },
    });
    return;

   }catch (error) {
    res.status(400).json({success: false, message: error.message});
   }
};

export const handleLogout = async (req, res) => {
    res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};
