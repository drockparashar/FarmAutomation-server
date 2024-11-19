import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import polyhouseRoutes from './routes/polyhouseRoute.js'
import cors from 'cors';
import { mongoConnect } from './config/db.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// Database connection
mongoConnect();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/polyhouses', polyhouseRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
