import { Router } from 'express';
import Class from '../models/Class.js';
import { authMiddleware } from '../middleware/auth.js';
import { roleMiddleware } from '../middleware/role.js';

const router = Router();

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  async (req, res) => {
    try {
      const { course, professor } = req.body;
      const newClass = await Class.create({ course, professor, students: [] });
      res.status(201).json(newClass);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao criar turma.' });
    }
  }
);

router.get(
  '/',
  authMiddleware,
  async (req, res) => {
    try {
      const classes = await Class.find()
        .populate('course professor', 'name')
        .lean();
      res.json(classes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao listar turmas.' });
    }
  }
);

router.get(
  '/:id/students',
  authMiddleware,
  roleMiddleware(['admin', 'professor', 'aluno']),
  async (req, res) => {
    try {
      const turma = await Class.findById(req.params.id)
        .populate('students', 'name email');
      if (!turma) {
        return res.status(404).json({ message: 'Turma não encontrada.' });
      }

      res.json(turma.students);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao listar alunos.' });
    }
  }
);

export default router;
