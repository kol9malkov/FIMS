import {Routes, Route, Navigate} from 'react-router-dom'
import {useAuth} from './contexts/AuthContext'
import LoginPage from './pages/login/LoginPage'
import AdminPage from './pages/admin/AdminPage'
import EmployeesPage from './pages/admin/EmployeesPage'
import RolesPage from './pages/admin/RolesPage'
import UsersPage from './pages/admin/UsersPage'
import StoresPage from './pages/admin/StoresPage'
import CategoriesPage from './pages/admin/CategoriesPage'
import ProductsPage from './pages/admin/ProductsPage'
import PaymentMethodsPage from './pages/admin/PaymentMethodsPage'
import SupplyAnalyticsPage from './pages/admin/SupplyAnalyticsPage'
import StockPage from './pages/StockPage'
import SupplyPage from './pages/SupplyPage'
import StorePage from './pages/StorePage'
import SalesAnalyticsPage from "@/pages/admin/SalesAnalyticsPage";

function App() {
    const {isAuthenticated, role, loading} = useAuth()

    if (loading) {
        return <div className="p-6 text-center">Загрузка...</div>
    }

    // 🔁 Универсальный редирект при входе по неизвестному пути
    const getDefaultRoute = () => {
        if (!isAuthenticated) return <Navigate to="/login" replace/>
        if (role === 'Администратор') return <Navigate to="/admin" replace/>
        if (role === 'Склад') return <Navigate to="/store" replace/>
        if (role === 'Кассир') return <Navigate to="/cashier" replace/>
        return <Navigate to="/login" replace/>
    }

    return (
        <Routes>
            {/* Страница входа */}
            <Route path="/login" element={<LoginPage/>}/>

            {/* Админ-панель */}
            <Route
                path="/admin"
                element={
                    isAuthenticated ? <AdminPage/> : <Navigate to="/login" replace/>
                }
            >
                <Route path="employees" element={<EmployeesPage/>}/>
                <Route path="roles" element={<RolesPage/>}/>
                <Route path="users" element={<UsersPage/>}/>
                <Route path="stores" element={<StoresPage/>}/>
                <Route path="categories" element={<CategoriesPage/>}/>
                <Route path="products" element={<ProductsPage/>}/>
                <Route path="payments" element={<PaymentMethodsPage/>}/>
                <Route path="supplies" element={<SupplyAnalyticsPage/>}/>
                <Route path="sales" element={<SalesAnalyticsPage/>}/>
            </Route>

            {/* Складская панель */}
            <Route
                path="/store"
                element={
                    isAuthenticated ? <StorePage/> : <Navigate to="/login" replace/>
                }
            >
                <Route path="stocks" element={<StockPage/>}/>
                <Route path="supplies" element={<SupplyPage/>}/>
            </Route>

            {/* Всё остальное → перенаправление по роли или на /login */}
            <Route path="*" element={getDefaultRoute()}/>
        </Routes>
    )
}

export default App
