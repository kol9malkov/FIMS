import {Link} from 'react-router-dom'
import {useAuth} from '@/contexts/AuthContext'

const Navbar = () => {
    const {username, role, logout} = useAuth()
    const storeName = localStorage.getItem('store_name')

    return (
        <nav className="w-full bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
            {/* Левая часть — FIMS + магазин */}
            <div className="flex items-center space-x-4">
                <div className="text-xl font-bold">FIMS</div>
                {storeName && <span className="text-sm font-medium">📍 {storeName}</span>}
            </div>

            {/* Центр — ссылки по ролям */}
            <div className="flex gap-6">
                {role === 'Администратор' && (
                    <>
                        <Link to="/admin/employees" className="hover:underline">Сотрудники</Link>
                        <Link to="/admin/roles" className="hover:underline">Роли</Link>
                        <Link to="/admin/users" className="hover:underline">Пользователи</Link>
                        <Link to="/admin/stores" className="hover:underline">Магазины</Link>
                        <Link to="/admin/categories" className="hover:underline">Категории</Link>
                        <Link to="/admin/products" className="hover:underline">Товары</Link>
                        <Link to="/admin/payments" className="hover:underline">Способы оплаты</Link>
                        <Link to="/admin/supplies" className="hover:underline">Аналитика поставок</Link>
                        <Link to="/admin/sales" className="hover:underline">Аналитика продаж</Link>
                    </>
                )}

                {role === 'Склад' && (
                    <>
                        <Link to="/store/stocks" className="hover:underline">Склад</Link>
                        <Link to="/store/supplies" className="hover:underline">Поставки</Link>
                    </>
                )}

                {role === 'Кассир' && (
                    <>
                        <Link to="/cashier" className="hover:underline">Касса</Link>
                        <Link to="/cashier/sales" className="hover:underline">Все продажи</Link>
                        <Link to="/cashier/summary" className="hover:underline">Сверка</Link>
                    </>
                )}
            </div>

            {/* Правая часть — имя пользователя + кнопка выхода */}
            <div className="flex items-center space-x-4">
                <span className="mr-2">👤 {username}</span>
                <button onClick={logout} className="underline hover:text-gray-200">Выход</button>
            </div>
        </nav>
    )
}

export default Navbar
