import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-xl">Bem-vindo, {user.name}</h1>
        <button onClick={logout} className="text-red-500">Sair</button>
      </header>

      <nav className="space-x-4">
        <Link to="/courses" className="text-blue-600">Cursos</Link>
        <Link to="/classes" className="text-blue-600">Turmas</Link>
      </nav>
    </div>
  );
}
