import {Link} from 'react-router-dom'
import {useAuth} from '@/contexts/AuthContext'

const Navbar = () => {
    const {username, role, logout} = useAuth()

    return (
        <nav className="w-full bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
            <div className="text-xl font-bold">FIMS</div>

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
                        {/* Добавь сюда маршруты кассира, если есть */}
                        <Link to="/cashier/sales" className="hover:underline">Продажи</Link>
                    </>
                )}
            </div>

            <div className="flex items-center gap-4">
                <span className="font-medium">{username}</span>
                <button
                    onClick={logout}
                    className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
                >
                    Выход
                </button>
            </div>
        </nav>
    )
}

export default Navbar
