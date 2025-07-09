import jwt from 'jsonwebtoken';

const jwt_secret = process.env.JWT_SECRET;
export const generateTokenAndSetCookie = (res, userId)=>{

    const token = jwt.sign({userId}, 
        jwt_secret,
        {expiresIn: "7d"},
    );
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000

    });

   return token;
}