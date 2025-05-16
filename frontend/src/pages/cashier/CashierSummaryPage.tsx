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
        <div className="container py-4">
            <h2 className="fw-bold mb-4">
                Сверка кассы на {summary?.date}
            </h2>

            {error && <p className="text-danger">{error}</p>}

            {summary && (
                <>
                    <div className="mb-4">
                        <p className="mb-1">
                            <strong>Итого наличными:</strong> {summary.total_cash.toFixed(2)} ₽
                        </p>
                        <p className="mb-1">
                            <strong>Итого по карте:</strong> {summary.total_card.toFixed(2)} ₽
                        </p>
                    </div>

                    <div className="table-responsive mb-4">
                        <table className="table table-bordered table-hover align-middle text-sm">
                            <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Дата и время</th>
                                <th>Сумма</th>
                                <th>Оплата</th>
                            </tr>
                            </thead>
                            <tbody>
                            {summary.sales.map((s) => (
                                <tr key={s.sale_id}>
                                    <td>{s.sale_id}</td>
                                    <td>{new Date(s.datetime).toLocaleString('ru-RU')}</td>
                                    <td>{s.amount.toFixed(2)} ₽</td>
                                    <td>{s.payment_method}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>

    )
}