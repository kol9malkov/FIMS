import {useEffect, useState} from 'react'
import {getSupplyAnalytics} from '@/api/analytics'
import {getStores} from '@/api/stores'

const SupplyAnalyticsPage = () => {
    const [data, setData] = useState<any>(null)
    const [stores, setStores] = useState<any[]>([])
    const [storeId, setStoreId] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [loading, setLoading] = useState(false)

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await getSupplyAnalytics({
                store_id: storeId ? Number(storeId) : undefined,
                start_date: startDate || undefined,
                end_date: endDate || undefined,
            })

            setData(res)
        } catch (e) {
            console.error('Ошибка загрузки аналитики')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
        getStores('', 1, 100).then(setStores)
    }, [])

    return (
        <div className="container py-4">
            <h2 className="fw-bold mb-4 fs-3">Аналитика по поставкам</h2>

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

            {/* Загрузка */}
            {loading && <p className="text-muted">Загрузка...</p>}

            {/* Данные */}
            {!loading && data && (
                <>
                    {/* Карточки */}
                    <div className="row g-3 mb-4">
                        <div className="col-md-4">
                            <div className="card shadow-sm border-0 bg-light">
                                <div className="card-body">
                                    <p className="text-muted mb-1">Всего поставок</p>
                                    <h4 className="fw-bold">{data.total_supplies}</h4>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card shadow-sm border-0 bg-light">
                                <div className="card-body">
                                    <p className="text-muted mb-1">Всего позиций</p>
                                    <h4 className="fw-bold">{data.total_items}</h4>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card shadow-sm border-0 bg-light">
                                <div className="card-body">
                                    <p className="text-muted mb-1">Общая стоимость</p>
                                    <h4 className="fw-bold">{data.total_cost.toLocaleString()} ₽</h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Таблица */}
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="fw-semibold mb-3">Статистика по магазинам</h5>
                            <div className="table-responsive">
                                <table className="table table-bordered table-hover align-middle text-sm">
                                    <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Адрес</th>
                                        <th className="text-end">Поставок</th>
                                        <th className="text-end">Позиций</th>
                                        <th className="text-end">Стоимость</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {data.supplies_per_store.map((store: any) => (
                                        <tr key={store.store_id}>
                                            <td>{store.store_id}</td>
                                            <td>{store.store_address}</td>
                                            <td className="text-end">{store.count}</td>
                                            <td className="text-end">{store.total_items}</td>
                                            <td className="text-end">{store.total_cost.toLocaleString()} ₽</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>

    )
}

export default SupplyAnalyticsPage
