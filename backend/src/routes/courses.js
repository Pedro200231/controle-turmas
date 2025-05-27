import { Router } from 'express';
import Course from '../models/Course.js';
import { authMiddleware } from '../middleware/auth.js';
import { roleMiddleware } from '../middleware/role.js';

const router = Router();

// Cria um novo curso
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  async (req, res) => {
    try {
      const { name, description } = req.body;
      const exists = await Course.findOne({ name });
      if (exists) return res.status(400).json({ message: 'Curso já existe.' });
      const course = await Course.create({ name, description });
      res.status(201).json(course);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao criar curso.' });
    }
  }
);

// Lista todos os cursos
router.get(
  '/',
  authMiddleware,
  async (req, res) => {
    try {
      const courses = await Course.find();
      res.json(courses);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao buscar cursos.' });
    }
  }
);

export default router;
