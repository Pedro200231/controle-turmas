import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import styles from './Classes.module.css';

export default function Classes() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [courses, setCourses] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [courseId, setCourseId] = useState('');
    const [professorId, setProfessorId] = useState('');
    const [studentId, setStudentId] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) return;

        async function loadData() {
            try {
                const [clsRes, crsRes] = await Promise.all([
                    api.get('/classes'),
                    api.get('/courses')
                ]);

                setClasses(clsRes.data);
                setCourses(crsRes.data);

                if (user.role === 'admin') {
                    const profRes = await api.get('/users?role=professor');
                    setProfessors(profRes.data);
                }

                if (user.role === 'professor') {
                    const stuRes = await api.get('/users?role=aluno');
                    setStudents(stuRes.data);
                }

            } catch (err) {
                console.error(err);
                setError('Erro ao carregar dados.');
            }
        }

        loadData();
    }, [user]);

    const handleCreateClass = async e => {
        e.preventDefault();
        if (!courseId || !professorId) {
            setError('Selecione curso e professor');
            return;
        }
        try {
            const { data: newClass } = await api.post('/classes', {
                course: courseId,
                professor: professorId
            });

            const fullCourse = courses.find(c => c._id === newClass.course);
            const fullProfessor = professors.find(p => p._id === newClass.professor);

            const enrichedClass = {
                ...newClass,
                course: fullCourse,
                professor: fullProfessor
            };

            setClasses(prev => [...prev, enrichedClass]);
            setCourseId('');
            setProfessorId('');
            setError('');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Erro ao criar turma.');
        }
    };


    const handleAddStudent = async (classId) => {
        if (!studentId) {
            setError('Informe o ID do aluno.');
            return;
        }
        try {
            const { data: updatedClass } = await api.post(
                `/classes/${classId}/students`,
                { studentId }
            );

            setClasses(prev =>
                prev.map(c => (c._id === classId ? updatedClass : c))
            );
            setStudentId('');
            setError('');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Erro ao adicionar aluno.');
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Turmas</h1>
                <button
                    onClick={() => navigate(-1)}
                    className={styles.backButton}
                >
                    ← Voltar
                </button>
            </header>

            {error && <div className={styles.errorMessage}>{error}</div>}

            {/* Formulário de criação para admin */}
            {user.role === 'admin' && (
                <form onSubmit={handleCreateClass} className={styles.form}>
                    <h3 className={styles.title}>Criar Turma</h3>
                    <select
                        value={courseId}
                        onChange={e => setCourseId(e.target.value)}
                        className={styles.select}
                    >
                        <option value="">Selecione o curso</option>
                        {courses.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                    <select
                        value={professorId}
                        onChange={e => setProfessorId(e.target.value)}
                        className={styles.select}
                    >
                        <option value="">Selecione o professor</option>
                        {professors.map(p => (
                            <option key={p._id} value={p._id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                    <button type="submit" className={styles.button}>
                        Criar Turma
                    </button>
                </form>
            )}

            {/* Listagem de turmas */}
            <ul className={styles.classList}>
                {classes.map(c => (
                    <li key={c._id} className={styles.classItem}>
                        <div className={styles.classHeader}>
                            <div>
                                <p><strong>Curso:</strong> {c.course.name}</p>
                                <p><strong>Professor:</strong> {c.professor.name}</p>
                            </div>
                            <p><strong>Alunos:</strong> {c.students.length}</p>
                        </div>

                        {/* Formulário para adicionar aluno */}
                        {user.role === 'professor' && c.professor._id === user._id && (
                            <div className={styles.studentForm}>
                                <select
                                    value={studentId}
                                    onChange={e => setStudentId(e.target.value)}
                                    className={styles.studentSelect}
                                >
                                    <option value="">Selecione o aluno</option>
                                    {students.map(s => (
                                        <option key={s._id} value={s._id}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => handleAddStudent(c._id)}
                                    className={styles.button}
                                >
                                    Adicionar
                                </button>
                            </div>
                        )}

                        <button
                            onClick={async () => {
                                const res = await api.get(`/classes/${c._id}/students`);
                                alert(
                                    res.data.length
                                        ? res.data.map(s => `${s.name} (${s.email})`).join('\n')
                                        : 'Sem alunos ainda.'
                                );
                            }}
                            className={styles.detailsButton}
                        >
                            Ver Lista de Alunos
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}