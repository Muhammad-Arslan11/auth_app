import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/connectiondb.js';
import router from './routes/auth.route.js';

dotenv.config();
const app = express();
app.use(express.json());

app.use("/", router);

const port  = 3000;

app.listen(port, ()=>{
    connectDB();
    console.log(`server is running on port:${port}`);
})