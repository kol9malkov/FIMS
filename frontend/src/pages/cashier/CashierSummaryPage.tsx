import {useEffect, useState} from 'react'
import {useAuth} from '@/contexts/AuthContext'
import {getSaleSummary, SummaryResponse} from '@/api/sales'

export const CashierSummaryPage = () => {
    const {storeId} = useAuth()
    const [summary, setSummary] = useState<SummaryResponse | null>(null)
    const [error, setError] = useState<string | null>(null)
    const today = new Date().toISOString().split('T')[0]

    useEffect(() => {
        if (!storeId) return
        getSaleSummary(storeId, today)
            .then(setSummary)
            .catch(e => setError(e?.response?.data?.detail || 'Ошибка при загрузке сверки'))
    }, [storeId])

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4">Сверка кассы на {summary?.date}</h2>
            {error && <p className="text-red-600">{error}</p>}

            {summary && (
                <>
                    <div className="mb-4 space-y-1">
                        <p><strong>Итого наличными:</strong> {summary.total_cash.toFixed(2)} ₽</p>
                        <p><strong>Итого по карте:</strong> {summary.total_card.toFixed(2)} ₽</p>
                    </div>

                    <table className="w-full border text-sm mb-4">
                        <thead className="bg-blue-100">
                        <tr>
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Дата и время</th>
                            <th className="border p-2">Сумма</th>
                            <th className="border p-2">Оплата</th>
                        </tr>
                        </thead>
                        <tbody>
                        {summary.sales.map(s => (
                            <tr key={s.sale_id}>
                                <td className="border p-2">{s.sale_id}</td>
                                <td className="border p-2">{new Date(s.datetime).toLocaleString('ru-RU')}</td>
                                <td className="border p-2">{s.amount.toFixed(2)} ₽</td>
                                <td className="border p-2">{s.payment_method}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    )
}