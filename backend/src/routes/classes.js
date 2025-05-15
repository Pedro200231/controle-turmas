// backend/src/routes/classes.js
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
      const newClass = await Class.create({
        course,
        professor,
        students: []
      });
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
        .populate('requests', '_id');
      res.json(classes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao listar turmas.' });
    }
  }
);

const addStudentHandler = async (req, res) => {
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
};

router.post('/:id/students', authMiddleware, roleMiddleware(['professor']), addStudentHandler);
router.post('/:id/student',  authMiddleware, roleMiddleware(['professor']), addStudentHandler);

const listStudentsHandler = async (req, res) => {
  try {
    const turma = await Class.findById(req.params.id)
      .populate('students', 'name email');
    if (!turma) return res.status(404).json({ message: 'Turma não encontrada.' });
    res.json(turma.students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao listar alunos.' });
  }
};

router.get('/:id/students', authMiddleware, roleMiddleware(['admin','professor','aluno']), listStudentsHandler);
router.get('/:id/student',  authMiddleware, roleMiddleware(['admin','professor','aluno']), listStudentsHandler);

export default router;
