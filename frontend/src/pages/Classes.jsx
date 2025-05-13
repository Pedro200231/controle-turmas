import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import styles from './Classes.module.css';

export default function Classes() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [studentIds, setStudentIds] = useState({});
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [courses, setCourses] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [courseId, setCourseId] = useState('');
    const [professorId, setProfessorId] = useState('');
    const [globalError, setGlobalError] = useState('');
    const [errors, setErrors] = useState({});
    const [expandedClasses, setExpandedClasses] = useState({});

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
            } catch {
                setGlobalError('Erro ao carregar dados.');
            }
        }

        loadData();
    }, [user]);

    const handleCreateClass = async e => {
        e.preventDefault();

        if (!courseId || !professorId) {
            setGlobalError('Selecione curso e professor');
            return;
        }

        const exists = classes.some(
            c => c.course._id === courseId && c.professor._id === professorId
        );

        if (exists) {
            setGlobalError('Essa combinação de curso e professor já possui uma turma.');
            return;
        }

        try {
            const { data: newClass } = await api.post('/classes', { course: courseId, professor: professorId });
            const enriched = {
                ...newClass,
                course: courses.find(c => c._id === newClass.course),
                professor: professors.find(p => p._id === newClass.professor)
            };
            setClasses(prev => [...prev, enriched]);
            setCourseId('');
            setProfessorId('');
            setGlobalError('');
        } catch (err) {
            setGlobalError(err.response?.data?.message || 'Erro ao criar turma.');
        }
    };

    const handleAddStudent = async classId => {
        const studentId = studentIds[classId];
        if (!studentId) {
            setErrors(prev => ({ ...prev, [classId]: 'Informe o aluno' }));
            return;
        }

        try {
            const { data: updated } = await api.post(`/classes/${classId}/students`, { studentId });

            setClasses(prev =>
                prev.map(c =>
                    c._id === classId
                        ? {
                            ...updated,
                            course: c.course,
                            professor: c.professor
                        }
                        : c
                )
            );

            if (expandedClasses[classId]) {
                const res = await api.get(`/classes/${classId}/students`);
                setExpandedClasses(prev => ({ ...prev, [classId]: res.data }));
            }

            setStudentIds(prev => ({ ...prev, [classId]: '' }));
            setErrors(prev => ({ ...prev, [classId]: '' }));
        } catch (err) {
            setErrors(prev => ({
                ...prev,
                [classId]: err.response?.data?.message || 'Erro ao adicionar aluno.'
            }));
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Turmas</h1>
                <button onClick={() => navigate(-1)} className={styles.backButton}>
                    ← Voltar
                </button>
            </header>

            {globalError && <div className={styles.errorMessage}>{globalError}</div>}

            {user.role === 'admin' && (
                <form onSubmit={handleCreateClass} className={styles.form}>
                    <h3 className={styles.subTitle}>Criar Turma</h3>
                    <select
                        value={courseId}
                        onChange={e => setCourseId(e.target.value)}
                        className={styles.select}
                    >
                        <option value="">Curso...</option>
                        {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                    <select
                        value={professorId}
                        onChange={e => setProfessorId(e.target.value)}
                        className={styles.select}
                    >
                        <option value="">Professor...</option>
                        {professors.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                    <button type="submit" className={styles.button}>Criar Turma</button>
                </form>
            )}

            <ul className={styles.classList}>
                {classes.map(c => (
                    <li key={c._id} className={styles.classItem}>
                        <div className={styles.classHeader}>
                            <div>
                                <p><strong>Curso:</strong> {c.course.name}</p>
                                <p><strong>Prof:</strong> {c.professor.name}</p>
                            </div>
                            <p><strong>Alunos:</strong> {c.students.length}</p>
                        </div>

                        {user.role === 'professor' && c.professor._id === user._id && (
                            <div className={styles.studentForm}>
                                <select
                                    value={studentIds[c._id] || ''}
                                    onChange={e => {
                                        setStudentIds(prev => ({ ...prev, [c._id]: e.target.value }));
                                        setErrors(prev => ({ ...prev, [c._id]: '' }));
                                    }}
                                    className={styles.studentSelect}
                                >
                                    <option value="">Aluno...</option>
                                    {students.map(s => (
                                        <option key={s._id} value={s._id}>{s.name}</option>
                                    ))}
                                </select>
                                <button onClick={() => handleAddStudent(c._id)} className={styles.button}>
                                    Adicionar
                                </button>
                            </div>
                        )}
                         {errors[c._id] && (
                                    <div className={styles.errorMessage}>
                                        {errors[c._id]}
                                    </div>
                                )}
                        <button
                            onClick={async () => {
                                const expanded = expandedClasses[c._id];
                                if (!expanded) {
                                    const res = await api.get(`/classes/${c._id}/students`);
                                    setExpandedClasses(prev => ({ ...prev, [c._id]: res.data }));
                                } else {
                                    setExpandedClasses(prev => {
                                        const copy = { ...prev };
                                        delete copy[c._id];
                                        return copy;
                                    });
                                }
                            }}
                            className={styles.detailsButton}
                        >
                            {expandedClasses[c._id] ? 'Ocultar Alunos' : 'Ver Alunos'}
                        </button>

                        {expandedClasses[c._id] && (
                            <ul className={styles.studentList}>
                                {expandedClasses[c._id].length ? (
                                    expandedClasses[c._id].map(s => (
                                        <li key={s._id}>{s.name} ({s.email})</li>
                                    ))
                                ) : (
                                    <li>Nenhum aluno ainda.</li>
                                )}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
