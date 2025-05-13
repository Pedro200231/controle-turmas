import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const { data } = await api.get('/courses');
        setCourses(data);
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar cursos.');
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  const handleCreate = async e => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nome é obrigatório.');
      return;
    }
    try {
      const { data: newCourse } = await api.post('/courses', { name, description });
      setCourses(prev => [...prev, newCourse]);
      setName('');
      setDescription('');
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Erro ao criar curso.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl mb-4">Cursos</h2>

      {/* Formulário de criação */}
      <form onSubmit={handleCreate} className="mb-6 space-y-3">
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          placeholder="Nome do curso"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Descrição (opcional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Criar Curso
        </button>
      </form>

      {/* Listagem de cursos */}
      {loading ? (
        <p>Carregando cursos...</p>
      ) : courses.length === 0 ? (
        <p>Nenhum curso cadastrado.</p>
      ) : (
        <ul className="space-y-4">
          {courses.map(course => (
            <li key={course._id} className="border p-3 rounded">
              <h3 className="font-semibold">{course.name}</h3>
              {course.description && (
                <p className="text-sm text-gray-700">{course.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
