import mongoose from "mongoose";

export const connectDB = async ()=>{
    try {
        console.log(process.env.mongodb_URI);
        const conn = await mongoose.connect(process.env.mongodb_URI);
        console.log(`database connected`)
    } catch (error) {
        console.log("error connecting wiht db:", error);
        process.exit(1); // 1 = failure, 0 = success
    }
}