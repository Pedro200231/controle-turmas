import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';
import { roleMiddleware } from '../middleware/role.js';

const router = Router();

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

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Credenciais inválidas.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Credenciais inválidas.' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ message: 'Login bem-sucedido!', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

router.get(
  '/profile',
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro no servidor.' });
    }
  }
);

router.get(
  '/admin',
  authMiddleware,
  roleMiddleware(['admin']),
  (req, res) => {
    res.json({ message: 'Acesso de administrador confirmado.' });
  }
);

router.get(
  '/',
  authMiddleware,
  async (req, res) => {
    try {
      const { role } = req.query;

      if (role === 'professor' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado.' });
      }

      if (role === 'aluno' && !['admin', 'professor'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Acesso negado.' });
      }

      const filter = role ? { role } : {};
      const users = await User.find(filter).select('name role');
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao listar usuários.' });
    }
  }
);


export default router;
