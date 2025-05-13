import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Bem-vindo, <span className={styles.userName}>{user.name}</span>
        </h1>
        <button onClick={logout} className={styles.logoutButton}>
          Sair
        </button>
      </header>

      <h2 className={styles.sectionTitle}>Navegação</h2>
      <nav className={styles.nav}>
        <Link to="/courses" className={styles.navLink}>
          Cursos
        </Link>
        <Link to="/classes" className={styles.navLink}>
          Turmas
        </Link>
      </nav>
    </div>
  );
}