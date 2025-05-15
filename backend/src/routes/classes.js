import { Router } from 'express';
import mongoose from 'mongoose';
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
      if (
        !mongoose.Types.ObjectId.isValid(course) ||
        !mongoose.Types.ObjectId.isValid(professor)
      ) {
        return res.status(400).json({ message: 'Course ou Professor ID inválido.' });
      }
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
      const { id, role } = req.user;
      let classes;
      if (role === 'admin') {
        classes = await Class.find().populate('course professor', 'name');
      } else if (role === 'professor') {
        classes = await Class.find({ professor: id }).populate('course professor', 'name');
      } else {
        classes = await Class.find({ students: id }).populate('course professor', 'name');
      }
      res.json(classes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao listar turmas.' });
    }
  }
);

router.post(
  '/:id/students',
  authMiddleware,
  roleMiddleware(['professor']),
  async (req, res) => {
    try {
      const classId = req.params.id;
      const { studentId } = req.body;
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return res.status(400).json({ message: 'Student ID inválido.' });
      }
      const turma = await Class.findById(classId);
      if (!turma) return res.status(404).json({ message: 'Turma não encontrada.' });
      if (turma.professor.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Não autorizado.' });
      }
      if (turma.students.includes(studentId)) {
        return res.status(400).json({ message: 'Aluno já está na turma.' });
      }
      turma.students.push(studentId);
      await turma.save();
      res.json(turma);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao adicionar aluno.' });
    }
  }
);

router.get(
  '/:id/students',
  authMiddleware,
  roleMiddleware(['admin','professor','aluno']),
  async (req, res) => {
    try {
      const turma = await Class.findById(req.params.id).populate('students', 'name email');
      if (!turma) return res.status(404).json({ message: 'Turma não encontrada.' });
      res.json(turma.students);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao listar alunos.' });
    }
  }
);

export default router;
