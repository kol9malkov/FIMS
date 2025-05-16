import {useEffect, useState} from 'react'
import {useAuth} from '@/contexts/AuthContext'
import {getSales, SaleItem} from '@/api/sales'
import {Link} from 'react-router-dom'

export const CashierSalesPage = () => {
    const {storeId} = useAuth()
    const [sales, setSales] = useState<SaleItem[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!storeId) return
        getSales(storeId)
            .then(setSales)
            .catch(e => setError(e?.response?.data?.detail || 'Ошибка при загрузке продаж'))
    }, [storeId])

    return (
        <div className="container py-4">
            <h2 className="fw-bold mb-4">Список продаж</h2>

            {error && <p className="text-danger">{error}</p>}

            <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle text-sm">
                    <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Дата и время</th>
                        <th>Сумма</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sales.map(sale => (
                        <tr key={sale.sale_id}>
                            <td>{sale.sale_id}</td>
                            <td>{new Date(sale.sale_datetime).toLocaleString('ru-RU')}</td>
                            <td>{sale.total_amount.toFixed(2)} ₽</td>
                            <td>{sale.status}</td>
                            <td>
                                <Link
                                    to={`/cashier/sales/${sale.sale_id}`}
                                    className="text-primary text-decoration-underline small"
                                >
                                    Подробнее
                                </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
