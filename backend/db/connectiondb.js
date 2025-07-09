import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async ()=>{
    try {
        // console.log(process.env.MONGODB_URI);
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`database connected`)
    } catch (error) {
        console.log("error connecting wiht db:", error);
        process.exit(1); // 1 = failure, 0 = success
    }
}