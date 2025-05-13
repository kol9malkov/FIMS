// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/auth/Login';
import Logout from '../components/auth/Logout';
import AdminPage from '../pages/AdminPage';
// import StockPage from '../pages/StockPage';
import CashierPage from '../pages/CashierPage';
import NotFound from '../pages/NotFound';
import { useAuth } from '../context/AuthContext';
import type { JSX } from 'react';

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles: string[];
}) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />

      {/* Панель администратора */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['Администратор']}>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/employees"
        element={
          <ProtectedRoute allowedRoles={['Администратор']}>
            {/* Компонент для работы с сотрудниками */}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/roles"
        element={
          <ProtectedRoute allowedRoles={['Администратор']}>
            {/* Компонент для работы с ролями */}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['Администратор']}>
            {/* Компонент для работы с пользователями */}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stores"
        element={
          <ProtectedRoute allowedRoles={['Администратор']}>
            {/* Компонент для настройки магазина */}
          </ProtectedRoute>
        }
      />

      {/* Панель магазина (для складского работника и администратора) */}
      <Route
        path="/store/categories"
        element={
          <ProtectedRoute allowedRoles={['Администратор', 'Складской работник']}>
            {/* Компонент для категорий товаров */}
          </ProtectedRoute>
        }
      />
      <Route
        path="/store/products"
        element={
          <ProtectedRoute allowedRoles={['Администратор', 'Складской работник', 'Кассир']}>
            {/* Компонент для работы с товарами */}
          </ProtectedRoute>
        }
      />
      <Route
        path="/store/stocks"
        element={
          <ProtectedRoute allowedRoles={['Администратор', 'Складской работник']}>
            {/* Компонент для остатков на складе */}
          </ProtectedRoute>
        }
      />
      <Route
        path="/store/supplies"
        element={
          <ProtectedRoute allowedRoles={['Администратор', 'Складской работник']}>
            {/* Компонент для поставок */}
          </ProtectedRoute>
        }
      />
      <Route
        path="/store/sales"
        element={
          <ProtectedRoute allowedRoles={['Кассир']}>
            <CashierPage/>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
