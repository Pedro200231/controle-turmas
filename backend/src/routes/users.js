import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

// POST /users/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email já cadastrado.' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hash, role });

    const token = jwt.sign({
      id: user._id,
      role: user.role
    }, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

export default router;
