import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import styles from './Courses.module.css';

export default function Courses() {
  const navigate = useNavigate();
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
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Cursos</h1>
        <button 
          onClick={() => navigate(-1)} 
          className={styles.backButton}
        >
          ← Voltar
        </button>
      </header>

      <form onSubmit={handleCreate} className={styles.form}>
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <input
          type="text"
          placeholder="Nome do curso"
          value={name}
          onChange={e => setName(e.target.value)}
          className={styles.input}
          required
        />
        
        <textarea
          placeholder="Descrição (opcional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className={styles.textarea}
          rows={3}
        />
        
        <button
          type="submit"
          className={styles.submitButton}
        >
          Criar Curso
        </button>
      </form>

      {loading ? (
        <p className={styles.loadingText}>Carregando cursos...</p>
      ) : courses.length === 0 ? (
        <p className={styles.emptyMessage}>Nenhum curso cadastrado.</p>
      ) : (
        <ul className={styles.courseList}>
          {courses.map(course => (
            <li key={course._id} className={styles.courseItem}>
              <h3>{course.name}</h3>
              {course.description && (
                <p>{course.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}