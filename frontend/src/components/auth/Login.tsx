import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = await login(username, password);

      // Сохраняем токен и данные пользователя в localStorage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('token_type', data.token_type);
      localStorage.setItem('username', data.username);
      localStorage.setItem('userRole', data.role);

      // Устанавливаем пользователя в контекст
      setUser({
        username: data.username,
        role: data.role,
        token: data.access_token,
        token_type: data.token_type,
      });

      // Редирект по роли
      if (data.role === 'Администратор') navigate('/admin');
      else if (data.role === 'Складской работник') navigate('/store/stocks');
      else if (data.role === 'Кассир') navigate('/store/sales');
      else navigate('/'); // на случай, если роль не определена
    } catch (err) {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto', padding: '1rem' }}>
      <h2>Вход</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
        />
      </div>
      <button
        type="submit"
        style={{
          width: '100%',
          padding: '0.5rem',
          fontSize: '1rem',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Войти
      </button>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </form>
  );
};

export default Login;
