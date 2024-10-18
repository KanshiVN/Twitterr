import express from 'express';
import dotenv from 'dotenv';
const app = express();
import authRoutes from './routes/auth.routes.js'
import connectMongDB from './db/connectMongoDB.js';
import cookieParser from 'cookie-parser';

dotenv.config();
app.use(express.json()); // to access the req.body
app.use(express.urlencoded({extended:true})); // to access the
app.use(cookieParser()); // to access the
app.use('/api/auth',authRoutes);
// Only runs after the prefix /api/auth
app.get('/',(req,res)=>[
    res.send('Hello World!')
])

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    connectMongDB();
});

