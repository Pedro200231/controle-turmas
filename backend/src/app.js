import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';

import userRoutes from './routes/users.js';
import courseRoutes from './routes/courses.js';
import classRoutes  from './routes/classes.js';

dotenv.config();
const app = express();
app.use(cors(), express.json());

app.use('/users', userRoutes);
app.use('/courses', courseRoutes);
app.use('/classes', classRoutes);


export default app;
