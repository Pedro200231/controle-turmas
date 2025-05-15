import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import styles from './Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [showRegister, setShowRegister] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setLoginError('Credenciais inválidas');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');
    setRegLoading(true);
    try {
      await api.post('/users/register', {
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
      });
      setRegSuccess('Usuário cadastrado com sucesso!');
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegRole('');
    } catch (err) {
      setRegError(err.response?.data?.message || 'Erro ao cadastrar usuário.');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundEffect}>
        <div className={`${styles.redBlur} ${styles.topLeft}`} />
        <div className={`${styles.redBlur} ${styles.bottomRight}`} />
      </div>

      <div className={styles.loginBox}>
        <div>
          <h1 className={styles.title}>{showRegister ? 'CADASTRO' : 'LOGIN'}</h1>
          <p className={styles.subtitle}>
            {showRegister
              ? 'Preencha os dados para cadastrar um novo usuário'
              : 'Acesse sua conta para continuar'}
          </p>
        </div>

        {!showRegister && (
          <>
            {loginError && <div className={styles.errorMessage}>{loginError}</div>}
            <form onSubmit={handleLogin}>
              <div className={styles.inputContainer}>
                <svg className={styles.inputIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.94 6.904l7.07 4.243 7.07-4.243A2 2 0 0016 4H4a2 2 0 00-1.06 2.904z" />
                  <path d="M18 8.118l-8 4.8-8-4.8V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <input
                  type="email"
                  aria-label="Email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.inputField}
                  required
                />
              </div>
              <div className={styles.inputContainer}>
                <svg className={styles.inputIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 8V6a5 5 0 0110 0v2h1a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6a2 2 0 012-2h1zm2-2a3 3 0 116 0v2H7V6z" clipRule="evenodd" />
                </svg>
                <input
                  type="password"
                  aria-label="Senha"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.inputField}
                  required
                />
              </div>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loginLoading}
              >
                {loginLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
            <button
              className={styles.submitButton}
              style={{ marginTop: '1rem', background: '#222' }}
              onClick={() => setShowRegister(true)}
            >
              Criar nova conta
            </button>
          </>
        )}

        {showRegister && (
          <>
            {regError && <div className={styles.errorMessage}>{regError}</div>}
            {regSuccess && <div className={styles.successMessage}>{regSuccess}</div>}
            <form onSubmit={handleRegister}>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  placeholder="Nome"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  className={styles.inputField}
                  required
                />
              </div>
              <div className={styles.inputContainer}>
                <input
                  type="email"
                  placeholder="Email"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  className={styles.inputField}
                  required
                />
              </div>
              <div className={styles.inputContainer}>
                <input
                  type="password"
                  placeholder="Senha"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  className={styles.inputField}
                  required
                />
              </div>
              <div className={styles.inputContainer}>
                <select
                  value={regRole}
                  onChange={e => setRegRole(e.target.value)}
                  className={styles.inputField}
                  required
                >
                  <option value="">Selecione o tipo de usuário</option>
                  <option value="admin">Administrador</option>
                  <option value="professor">Professor</option>
                  <option value="aluno">Aluno</option>
                </select>
              </div>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={regLoading}
              >
                {regLoading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </form>
            <button
              className={styles.submitButton}
              style={{ marginTop: '1rem', background: '#222' }}
              onClick={() => setShowRegister(false)}
            >
              Voltar para Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}