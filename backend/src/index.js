import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors(), express.json());

app.get('/', (req, res) => res.send('API rodando!'));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Servidor na porta ${port}`));
