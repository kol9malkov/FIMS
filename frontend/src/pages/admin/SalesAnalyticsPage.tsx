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
        <div className="container py-4">
            <h2 className="fw-bold fs-3 mb-4">Аналитика по продажам</h2>

            {/* Фильтры */}
            <form className="row gy-3 align-items-end mb-4">
                <div className="col-md-3">
                    <label className="form-label">Магазин</label>
                    <select
                        value={storeId}
                        onChange={(e) => setStoreId(e.target.value)}
                        className="form-select"
                    >
                        <option value="">Все магазины</option>
                        {stores.map((s) => (
                            <option key={s.store_id} value={s.store_id}>
                                {s.address}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-3">
                    <label className="form-label">Дата от</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="form-control"
                    />
                </div>

                <div className="col-md-3">
                    <label className="form-label">Дата до</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="form-control"
                    />
                </div>

                <div className="col-md-3">
                    <button
                        type="button"
                        onClick={fetchData}
                        className="btn btn-primary w-100"
                    >
                        Обновить
                    </button>
                </div>
            </form>

            {/* Аналитика */}
            {data && (
                <>
                    {/* Карточки */}
                    <div className="row g-3 mb-4">
                        <div className="col-md-4">
                            <div className="card shadow-sm border-0 bg-light">
                                <div className="card-body">
                                    <p className="text-muted mb-1">Количество продаж</p>
                                    <h4 className="fw-bold">{data.total_sales}</h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card shadow-sm border-0 bg-light">
                                <div className="card-body">
                                    <p className="text-muted mb-1">Сумма продаж</p>
                                    <h4 className="fw-bold">{data.total_amount.toFixed(2)} ₽</h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card shadow-sm border-0 bg-light">
                                <div className="card-body">
                                    <p className="text-muted mb-1">Средний чек</p>
                                    <h4 className="fw-bold">{data.average_check.toFixed(2)} ₽</h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Продажи по магазинам */}
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-body">
                            <h5 className="fw-semibold mb-3">Продажи по магазинам</h5>
                            <ul className="list-group list-group-flush">
                                {data.sales_per_store.map((s) => (
                                    <li key={s.store_id} className="list-group-item">
                                        <strong>{s.store_address}</strong> — {s.count} продаж на сумму{' '}
                                        {s.total_amount.toFixed(2)} ₽
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Топ товар */}
                    {data.top_product && (
                        <div className="card shadow-sm border-0 mb-4">
                            <div className="card-body">
                                <h5 className="fw-semibold mb-2">Самый ходовой товар</h5>
                                <p className="mb-0">
                                    <strong>{data.top_product.name}</strong> — {data.top_product.total_sold} шт.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Способы оплаты */}
                    {data.payments_stats && (
                        <div className="card shadow-sm border-0 mb-4">
                            <div className="card-body">
                                <h5 className="fw-semibold mb-2">Структура оплат</h5>
                                <ul className="list-group list-group-flush">
                                    {data.payments_stats.map((p, i) => (
                                        <li key={i} className="list-group-item">
                                            {p.method_name}: {p.total_amount.toFixed(2)} ₽
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>

    )
}

export default SalesAnalyticsPage
