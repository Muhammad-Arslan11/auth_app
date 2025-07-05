import { UserModel } from "../models/user.model";
import bcryptjs from "bcryptjs";


export const handleSignup = async (req, res) => {
   const {name, email, password} = req.body;

   try {
       if(!name || !email || !password) throw new Error("All fields are required!");
    
    const userAlreadyExists = await userModel.findOne({email});
    if(userAlreadyExists) res.status(400).json({success: false, message: "user already exists"});

    const hashedPassword = bcryptjs.hash(password, 10);
    // verification code
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = {
        name: name,
        password: hashedPassword,
        email: email,
        verificationToken: verificationToken,
        verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours in miliseconds
    }

    await user.save();

   }catch (error) {
    res.status(400).json({success: false, message: error.message});
   }
  
};

export const handleLogin = async (req, res) => {
    res.status(200).send('login');
};

export const handleLogout = async (req, res) => {
    res.status(200).send('logout');
};
