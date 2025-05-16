import {Routes, Route, Navigate} from 'react-router-dom'
import {useAuth} from './contexts/AuthContext'

// Страницы
import LoginPage from './pages/login/LoginPage'
import AdminPage from './pages/admin/AdminPage'
import StorePage from './pages/store/StorePage'
import CashierPage from './pages/cashier/CashierPage'
import SelectStorePage from './pages/store/SelectStorePage'
import SelectCashierStorePage from './pages/cashier/SelectCashierStorePage'

// Админ
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import EmployeesPage from './pages/admin/EmployeesPage'
import RolesPage from './pages/admin/RolesPage'
import UsersPage from './pages/admin/UsersPage'
import StoresPage from './pages/admin/StoresPage'
import CategoriesPage from './pages/admin/CategoriesPage'
import ProductsPage from './pages/admin/ProductsPage'
import PaymentMethodsPage from './pages/admin/PaymentMethodsPage'
import SupplyAnalyticsPage from './pages/admin/SupplyAnalyticsPage'
import SalesAnalyticsPage from './pages/admin/SalesAnalyticsPage'

// Склад
import StoreDashboardPage from './pages/store/StoreDashboardPage'
import SupplyPage from './pages/store/SupplyPage'
import CreateSupplyPage from './pages/store/CreateSupplyPage'
import SupplyDetailPage from './pages/store/SupplyDetailPage'
import StockPage from './pages/store/StockPage'

// Кассир
import CashierPanel from './components/cashier/CashierPanel'
import {CashierSalesPage} from './pages/cashier/CashierSalesPage'
import CashierSaleDetailPage from './pages/cashier/CashierSaleDetailPage'
import {CashierSummaryPage} from './pages/cashier/CashierSummaryPage'

// Защита
import RequireAuth from './components/RequireAuth'
import RequireStore from './components/RequireStore'

function App() {
    const {isAuthenticated, role, loading} = useAuth()

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-blue-600 text-lg font-semibold animate-pulse">Загрузка...</div>
            </div>
        )
    }

    const getDefaultRoute = () => {
        if (!isAuthenticated) return <Navigate to="/login" replace/>
        if (role === 'Администратор') return <Navigate to="/admin" replace/>
        if (role === 'Склад') return <Navigate to="/store" replace/>
        if (role === 'Кассир') return <Navigate to="/cashier" replace/>
        return <Navigate to="/login" replace/>
    }

    return (
        <Routes>
            {/* Вход */}
            <Route path="/login" element={<LoginPage/>}/>

            {/* Админ */}
            <Route path="/admin" element={isAuthenticated ? <AdminPage/> : <Navigate to="/login" replace/>}>
                <Route index element={<AdminDashboardPage/>}/>
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

            <Route element={<RequireAuth/>}>
                {/* Склад */}
                <Route path="/store/select" element={<SelectStorePage/>}/>
                <Route path="/store" element={<StorePage/>}>
                    <Route index element={<StoreDashboardPage/>}/>
                    <Route path="supplies" element={<SupplyPage/>}/>
                    <Route path="supplies/create" element={<CreateSupplyPage/>}/>
                    <Route path="supplies/id/:supplyId" element={<SupplyDetailPage />} />
                    <Route path="stocks" element={<StockPage/>}/>
                </Route>

                {/* Касса */}
                <Route path="/cashier/select" element={<SelectCashierStorePage/>}/>
                <Route path="/cashier" element={<CashierPage/>}>
                    <Route element={<RequireStore/>}>
                        <Route index element={<CashierPanel/>}/>
                        <Route path="summary" element={<CashierSummaryPage/>}/>
                        <Route path="sales" element={<CashierSalesPage/>}/>
                        <Route path="sales/:saleId" element={<CashierSaleDetailPage/>}/>
                    </Route>
                </Route>
            </Route>

            {/* Редирект */}
            <Route path="*" element={getDefaultRoute()}/>
        </Routes>

    )
}

export default App
