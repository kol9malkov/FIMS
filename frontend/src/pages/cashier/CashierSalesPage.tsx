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
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4">Список продаж</h2>
            {error && <p className="text-red-600">{error}</p>}

            <table className="w-full border text-sm">
                <thead className="bg-blue-100">
                <tr>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Дата и время</th>
                    <th className="border p-2">Сумма</th>
                    <th className="border p-2">Статус</th>
                    <th className="border p-2">Действия</th>
                </tr>
                </thead>
                <tbody>
                {sales.map(sale => (
                    <tr key={sale.sale_id}>
                        <td className="border p-2">{sale.sale_id}</td>
                        <td className="border p-2">{new Date(sale.sale_datetime).toLocaleString('ru-RU')}</td>
                        <td className="border p-2">{sale.total_amount.toFixed(2)} ₽</td>
                        <td className="border p-2">{sale.status}</td>
                        <td className="border p-2">
                            <Link
                                to={`/cashier/sales/${sale.sale_id}`}
                                className="text-blue-600 hover:underline"
                            >
                                Подробнее
                            </Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}
