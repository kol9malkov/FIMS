import {useEffect, useState} from 'react'
import {useParams, Link} from 'react-router-dom'
import {useAuth} from '@/contexts/AuthContext'
import {getSaleById, type SaleResponse} from '@/api/sales'

const CashierSaleDetailPage = () => {
    const {storeId} = useAuth()
    const {saleId} = useParams()
    const [sale, setSale] = useState<SaleResponse | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!storeId || !saleId) return
        getSaleById(Number(saleId), storeId)
            .then(setSale)
            .catch(err => {
                setError(err?.response?.data?.detail || 'Ошибка загрузки продажи')
            })
    }, [saleId, storeId])

    if (error) return <p className="text-red-600 p-4">{error}</p>
    if (!sale) return <p className="p-4">Загрузка...</p>

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Продажа #{sale.sale_id}</h2>

            <div className="text-sm mb-4 space-y-1">
                <p><strong>Дата:</strong> {new Date(sale.sale_datetime).toLocaleString('ru-RU')}</p>
                <p><strong>Статус:</strong> {sale.status}</p>
                <p><strong>Итого:</strong> {sale.total_amount.toFixed(2)} ₽</p>
            </div>

            <h3 className="font-semibold mb-2">Товары:</h3>
            <table className="w-full border text-sm mb-4">
                <thead className="bg-blue-100">
                <tr>
                    <th className="border p-2">Наименование</th>
                    <th className="border p-2">Кол-во</th>
                    <th className="border p-2">Цена</th>
                </tr>
                </thead>
                <tbody>
                {sale.sale_items.map(item => (
                    <tr key={item.product_id}>
                        <td className="border p-2">{item.product_name}</td>
                        <td className="border p-2">{item.quantity}</td>
                        <td className="border p-2">{item.price.toFixed(2)} ₽</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h3 className="font-semibold mb-2">Оплата:</h3>
            <ul className="list-disc pl-6 text-sm">
                {sale.payments.map(p => (
                    <li key={p.payment_id}>
                        {p.payment_method}: {p.amount.toFixed(2)} ₽
                    </li>
                ))}
            </ul>

            <div className="mt-6">
                <Link to="/cashier/sales" className="text-blue-600 hover:underline">← Назад к списку</Link>
            </div>
        </div>
    )
}

export default CashierSaleDetailPage
