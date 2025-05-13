import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function Classes() {
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
            setError('Escolha curso e professor (IDs).');
            return;
        }
        try {
            const { data: newClass } = await api.post('/classes', {
                course: courseId,
                professor: professorId
            });
            setClasses(prev => [...prev, newClass]);
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
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            <h2 className="text-xl">Turmas</h2>
            {error && <p className="text-red-500">{error}</p>}

            {/* Formulário de criação: só aparece para admin */}
            {user.role === 'admin' && (
                <form onSubmit={handleCreateClass} className="space-y-2 border p-3 rounded">
                    <h3 className="font-semibold">Criar Turma</h3>
                    <select
                        value={courseId}
                        onChange={e => setCourseId(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Selecione o curso</option>
                        {courses.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                    <select
                        value={professorId}
                        onChange={e => setProfessorId(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Selecione o professor</option>
                        {professors.map(p => (
                            <option key={p._id} value={p._id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
                        Criar Turma
                    </button>
                </form>
            )}

            {/* Listagem de turmas */}
            <ul className="space-y-4">
                {classes.map(c => (
                    <li key={c._id} className="border p-3 rounded space-y-2">
                        <div className="flex justify-between items-center">
                            <div>
                                <p><strong>Curso:</strong> {c.course.name}</p>
                                <p><strong>Professor:</strong> {c.professor.name}</p>
                            </div>
                            <p><strong>Alunos:</strong> {c.students.length}</p>
                        </div>

                        {/* Para professor: form de adicionar aluno */}
                        {user.role === 'professor' && c.professor._id === user._id && (
                            <div className="flex space-x-2">
                                <select
                                    value={studentId}
                                    onChange={e => setStudentId(e.target.value)}
                                    className="flex-1 p-2 border rounded"
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
                                    className="px-3 py-1 bg-blue-600 text-white rounded"
                                >
                                    Adicionar
                                </button>
                            </div>
                        )}

                        {/* Botão para listar detalhes de alunos */}
                        <button
                            onClick={async () => {
                                const res = await api.get(`/classes/${c._id}/students`);
                                alert(
                                    res.data.length
                                        ? res.data.map(s => `${s.name} (${s.email})`).join('\n')
                                        : 'Sem alunos ainda.'
                                );
                            }}
                            className="text-sm text-blue-600 underline"
                        >
                            Ver Lista de Alunos
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
