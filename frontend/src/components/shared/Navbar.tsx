// src/components/shared/Navbar.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav style={{ padding: '1rem', background: '#f0f0f0' }}>
      <span style={{ marginRight: '1rem', color: '#000' }}>Вы вошли как: {user?.username} ({user?.role})</span>

      {/* Динамически меняем ссылки в зависимости от роли */}
      {user && (
        <div>
          {user.role === 'Администратор' && (
            <>
              <Link to="/admin" style={{ marginRight: '1rem' }}>Панель администратора</Link>
              <Link to="/admin/employees" style={{ marginRight: '1rem' }}>Сотрудники</Link>
              <Link to="/admin/roles" style={{ marginRight: '1rem' }}>Роли</Link>
              <Link to="/admin/users" style={{ marginRight: '1rem' }}>Пользователи</Link>
              <Link to="/admin/stores" style={{ marginRight: '1rem' }}>Настройки магазина</Link>
            </>
          )}
          {user.role === 'Складской работник' && (
            <>
              <Link to="/store/categories" style={{ marginRight: '1rem' }}>Категории товаров</Link>
              <Link to="/store/products" style={{ marginRight: '1rem' }}>Товары</Link>
              <Link to="/store/stocks" style={{ marginRight: '1rem' }}>Остатки на складе</Link>
              <Link to="/store/supplies" style={{ marginRight: '1rem' }}>Поставки</Link>
            </>
          )}
          {user.role === 'Кассир' && (
            <Link to="/store/sales" style={{ marginRight: '1rem' }}>Продажи</Link>
          )}
        </div>
      )}

      <button onClick={handleLogout}>Выйти</button>
    </nav>
  );
};

export default Navbar;
