import app from './app.js';
import { connectDB } from './db.js';

connectDB().then(() => {
    const port = process.env.PORT || 4000;
    app.listen(port, () => console.log(`🚀 Servidor rodando na porta ${port}`));
});

import userRoutes from './routes/users.js';
app.use('/users', userRoutes);

import courseRoutes from './routes/courses.js';
app.use('/courses', courseRoutes);

import classRoutes from './routes/classes.js';
app.use('/classes', classRoutes);




