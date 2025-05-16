import {Link} from 'react-router-dom'
import {useAuth} from '@/contexts/AuthContext'

const Navbar = () => {
    const {username, role, logout} = useAuth()
    const storeName = localStorage.getItem('store_name')

    return (
        <nav className="navbar navbar-light bg-white border-bottom shadow-sm px-4 py-3">
            <div className="container-fluid d-flex align-items-center justify-content-between">

                {/* Левая часть: FIMS + название магазина */}
                <Link to={
                        role === 'Администратор' ? '/admin':
                        role === 'Склад' ? '/store':
                        role === 'Кассир' ? '/cashier': '/'
                    }
                    className="navbar-brand fw-bold text-primary text-decoration-none">
                    FIMS {storeName && <span className="text-muted fs-6 ms-2">/ {storeName}</span>}
                </Link>

                {/* Центр: ссылки по ролям */}
                <ul className="navbar-nav flex-row flex-wrap gap-3 mx-auto">
                    {role === 'Администратор' && (
                        <>
                            <li className="nav-item">
                                <Link to="/admin/employees" className="nav-link px-2">Сотрудники</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/admin/roles" className="nav-link px-2">Роли</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/admin/users" className="nav-link px-2">Пользователи</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/admin/stores" className="nav-link px-2">Магазины</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/admin/categories" className="nav-link px-2">Категории</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/admin/products" className="nav-link px-2">Товары</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/admin/payments" className="nav-link px-2">Способы оплаты</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/admin/supplies" className="nav-link px-2">Аналитика поставок</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/admin/sales" className="nav-link px-2">Аналитика продаж</Link>
                            </li>
                        </>
                    )}

                    {role === 'Склад' && (
                        <>
                            <li className="nav-item">
                                <Link to="/store/stocks" className="nav-link px-2">Склад</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/store/supplies" className="nav-link px-2">Поставки</Link>
                            </li>
                        </>
                    )}

                    {role === 'Кассир' && (
                        <>
                            <li className="nav-item">
                                <Link to="/cashier" className="nav-link px-2">Касса</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/cashier/sales" className="nav-link px-2">Все продажи</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/cashier/summary" className="nav-link px-2">Сверка</Link>
                            </li>
                        </>
                    )}
                </ul>

                {/* Правая часть: имя пользователя и кнопка выхода */}
                <div className="d-flex align-items-center gap-3">
                    <span className="fw-semibold">{username}</span>
                    <button className="btn btn-outline-secondary btn-sm" onClick={logout}>
                        Выход
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
