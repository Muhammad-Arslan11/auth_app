import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/connectiondb.js';
import router from './routes/auth.route.js';
import bodyParser from 'body-parser';
import cors from 'cors';

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true, // <-- important
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors(corsOptions));

app.use("", router);
// general route for testing
app.get('/',(req, res)=>{
    console.log('api is responding. might be any other error');
    res.send("App is hitting test route");
})
   
const PORT  = process.env.PORT || 3000;

const startServer = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('✅ Database connected successfully');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to connect to database:');
    console.error(error.message);
    process.exit(1); // Exit so Railway marks the deployment as failed
  }
};

startServer();

