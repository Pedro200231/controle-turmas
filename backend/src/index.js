import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';

dotenv.config();
const app = express();
app.use(cors(), express.json());

import userRoutes from './routes/users.js';
app.use('/users', userRoutes);

import courseRoutes from './routes/courses.js';
app.use('/courses', courseRoutes);

app.get('/', (req, res) => res.send('API rodando!'));

connectDB().then(() => {
    const port = process.env.PORT || 4000;
    app.listen(port, () => console.log(`🚀 Servidor rodando na porta ${port}`));
});


