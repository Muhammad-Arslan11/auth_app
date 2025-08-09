import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/connectiondb.js';
import router from './routes/auth.route.js';
import bodyParser from 'body-parser';
import cors from 'cors';

const corsOptions = {
    origin: 'https://auth-app-eta-beige.vercel.app',
    credentials: true, // <-- important
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors(corsOptions));

// app.use("", router);
app.get('/',(req, res)=>{
    console.log('api is responding. might be any other error');
    res.send("hello from Railway!");
})

const port  = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
