import { userModel } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { 
    sendVerificationEmail,
     sendWelcomeEmail,
    sendPasswordResetEmail,
    sendResetSuccessEmail
 } from "../mailtrap/email.js";


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

        if (!verificationCode) {
  return res.status(400).json({ success: false, message: "Verification code is required" });
}


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
 const {email} = req.body;

 try {
      const user = await userModel.findOne({email});

    if(!user){
        return res.status(400).json({success: false, message: "user not found"});
    }

    // generate token 
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
    console.log('resetToken from forgotPassword: ', resetToken);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt; 
   
	await user.save();

		// send email
        console.log(process.env.CLIENT_URL);
		await sendPasswordResetEmail(user?.email, `${process.env.CLIENT_URL}/api/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
        return;


	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}

};

export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;


      console.log("Incoming token:", JSON.stringify(token));
      console.log("Incoming password:", JSON.stringify(password));

		const user = await userModel.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});
      

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

		// update password
		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
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
    return;
};

export const checkAuth = async (req, res) => {
	try {
		const user = await userModel.findById(req.userId).select("-password");
	if (!user) {
	return res.status(401).json({ success: false, message: "Not authenticated" });
}


		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};