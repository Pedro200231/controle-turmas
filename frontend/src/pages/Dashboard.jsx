import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Bem-vindo,
            <span className={styles.userName}> {user.name}</span>
          </h1>
          <p className={styles.subtitle}>Escolha uma opção abaixo para começar</p>
        </div>
        <button onClick={logout} className={styles.logoutButton}>
          Sair
        </button>
      </header>

      <nav className={styles.nav}>
        <Link to="/courses" className={styles.navCard}>
          <h2 className={styles.navTitle}>Cursos</h2>
          <p className={styles.navDesc}>Gerencie os cursos disponíveis</p>
        </Link>
        <Link to="/classes" className={styles.navCard}>
          <h2 className={styles.navTitle}>Turmas</h2>
          <p className={styles.navDesc}>Visualize e edite as turmas</p>
        </Link>
        <Link to="/teachers" className={styles.navCard}>
          <h2 className={styles.navTitle}>Professores</h2>
          <p className={styles.navDesc}>Cadastre e gerencie professores</p>
        </Link>
      </nav>

    </div>
  );
}
