import {useEffect, useState} from 'react'
import {getStores} from '@/api/stores'
import {getSalesAnalytics} from '@/api/analytics'

const SalesAnalyticsPage = () => {
    const [data, setData] = useState<Awaited<ReturnType<typeof getSalesAnalytics>> | null>(null)
    const [stores, setStores] = useState<{ store_id: number; address: string }[]>([])
    const [storeId, setStoreId] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const fetchData = async () => {
        try {
            const res = await getSalesAnalytics({
                store_id: storeId ? Number(storeId) : undefined,
                start_date: startDate || undefined,
                end_date: endDate || undefined,
            })
            setData(res)
        } catch {
            alert('Ошибка загрузки аналитики')
        }
    }

    useEffect(() => {
        getStores('', 1, 100).then(setStores)
        fetchData()
    }, [])

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Аналитика по продажам</h1>

            <div className="flex flex-wrap gap-4">
                <select
                    value={storeId}
                    onChange={(e) => setStoreId(e.target.value)}
                    className="border px-3 py-2 rounded"
                >
                    <option value="">Все магазины</option>
                    {stores.map((s) => (
                        <option key={s.store_id} value={s.store_id}>
                            {s.address}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border px-3 py-2 rounded"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border px-3 py-2 rounded"
                />

                <button
                    onClick={fetchData}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Обновить
                </button>
            </div>

            {data && (
                <>
                    <div className="p-4 border rounded shadow space-y-2">
                        <p>Количество продаж: <strong>{data.total_sales}</strong></p>
                        <p>Сумма продаж: <strong>{data.total_amount.toFixed(2)} ₽</strong></p>
                        <p>Средний чек: <strong>{data.average_check.toFixed(2)} ₽</strong></p>
                    </div>

                    <div className="p-4 border rounded shadow space-y-2">
                        <h2 className="font-semibold text-lg">Продажи по магазинам</h2>
                        <ul className="list-disc ml-6 space-y-1">
                            {data.sales_per_store.map((s) => (
                                <li key={s.store_id}>
                                    <strong>{s.store_address}</strong> — {s.count} продаж на
                                    сумму {s.total_amount.toFixed(2)} ₽
                                </li>
                            ))}
                        </ul>
                    </div>

                    {data.top_product && (
                        <div className="p-4 border rounded shadow">
                            <h2 className="font-semibold text-lg">Самый ходовой товар</h2>
                            <p>
                                <strong>{data.top_product.name}</strong> — {data.top_product.total_sold} шт.
                            </p>
                        </div>
                    )}

                    {data.payments_stats && (
                        <div className="p-4 border rounded shadow">
                            <h2 className="font-semibold text-lg">Способы оплаты</h2>
                            <ul className="list-disc ml-6 space-y-1">
                                {data.payments_stats.map((p, i) => (
                                    <li key={i}>
                                        {p.method_name}: {p.total_amount.toFixed(2)} ₽
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default SalesAnalyticsPage
