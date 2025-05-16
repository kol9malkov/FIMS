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
import SalesAnalyticsPage from './pages/admin/SalesAnalyticsPage'
import StockPage from './pages/store/StockPage'
import SupplyPage from './pages/store/SupplyPage'
import StorePage from './pages/store/StorePage'
import SelectStorePage from './pages/store/SelectStorePage'
import CreateSupplyPage from './pages/store/CreateSupplyPage'
import SupplyDetailPage from './pages/store/SupplyDetailPage'
import CashierPage from './pages/cashier/CashierPage'
import RequireStore from './components/RequireStore'
import RequireAuth from './components/RequireAuth'
import CashierPanel from "@/components/cashier/CashierPanel";
import {CashierSummaryPage} from "@/pages/cashier/CashierSummaryPage";
import {CashierSalesPage} from "@/pages/cashier/CashierSalesPage";
import CashierSaleDetailPage from "@/pages/cashier/CashierSaleDetailPage";

function App() {
    const {isAuthenticated, role, loading} = useAuth()

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-blue-600 text-lg font-semibold animate-pulse">Загрузка...</div>
        </div>
    )

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
            <Route path="/admin" element={isAuthenticated ? <AdminPage/> : <Navigate to="/login" replace/>}>
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
            <Route element={<RequireAuth/>}>
                <Route path="/store" element={<StorePage/>}>
                    <Route path="select" element={<SelectStorePage/>}/>
                    <Route element={<RequireStore/>}>
                        <Route path="supplies" element={<SupplyPage/>}/>
                        <Route path="stocks" element={<StockPage/>}/>
                        <Route path="supplies/create" element={<CreateSupplyPage/>}/>
                        <Route path="supplies/id/:supplyId" element={<SupplyDetailPage/>}/>
                    </Route>
                </Route>

                {/* Кассовая панель */}
                <Route path="/cashier" element={<CashierPage/>}>
                    <Route element={<RequireStore/>}>
                        <Route index element={<CashierPanel/>}/>
                        <Route path="summary" element={<CashierSummaryPage/>}/>
                        <Route path="sales" element={<CashierSalesPage/>}/>
                        <Route path="/cashier/sales/:saleId" element={<CashierSaleDetailPage />} />
                    </Route>
                </Route>

            </Route>

            {/* Универсальный редирект */}
            <Route path="*" element={getDefaultRoute()}/>
        </Routes>
    )
}

export default App
