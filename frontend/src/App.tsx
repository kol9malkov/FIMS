import {Routes, Route, Navigate} from 'react-router-dom'
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
import RequireAuth from './components/RequireAuth' // компонент защиты

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>

            {/* Защищённые маршруты */}
            <Route element={<RequireAuth/>}>
                {/* Админ-панель */}
                <Route path="/admin" element={<AdminPage/>}>
                    <Route path="employees" element={<EmployeesPage/>}/>
                    <Route path="roles" element={<RolesPage/>}/>
                    <Route path="users" element={<UsersPage/>}/>
                    <Route path="stores" element={<StoresPage/>}/>
                    <Route path="categories" element={<CategoriesPage/>}/>
                    <Route path="products" element={<ProductsPage/>}/>
                    <Route path="payments" element={<PaymentMethodsPage/>}/>
                    <Route path="supplies" element={<SupplyAnalyticsPage/>}/>
                </Route>

                {/* Складская панель */}
                <Route path="/store" element={<StorePage/>}>
                    <Route path="stocks" element={<StockPage/>}/>
                    <Route path="supplies" element={<SupplyPage/>}/>
                </Route>
            </Route>

            {/* Редирект по умолчанию */}
            <Route path="*" element={<Navigate to="/login" replace/>}/>
        </Routes>
    )
}

export default App
