import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/connectiondb.js';
import router from './routes/auth.route.js';
import bodyParser from 'body-parser';
import cors from 'cors';

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true, // <-- important
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors(corsOptions));

app.use("/api/", router);

const port  = 3000;

app.listen(port, ()=>{
    connectDB();
    console.log(`server is running on port:${port}`);
})