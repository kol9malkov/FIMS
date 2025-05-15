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
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Аналитика по поставкам</h1>

            <div className="flex flex-wrap gap-4 items-end">
                <div>
                    <label className="block text-sm mb-1">Магазин</label>
                    <select
                        value={storeId}
                        onChange={(e) => setStoreId(e.target.value)}
                        className="border px-2 py-1 rounded"
                    >
                        <option value="">Все магазины</option>
                        {stores.map((s) => (
                            <option key={s.store_id} value={s.store_id}>{s.address}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm mb-1">Дата от</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Дата до</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                </div>

                <button
                    onClick={fetchData}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Обновить
                </button>
            </div>

            {loading && <p className="text-gray-500">Загрузка...</p>}
            {!loading && data && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-100 rounded shadow">
                            <p className="text-gray-700">Всего поставок</p>
                            <p className="text-2xl font-bold">{data.total_supplies}</p>
                        </div>
                        <div className="p-4 bg-green-100 rounded shadow">
                            <p className="text-gray-700">Всего позиций</p>
                            <p className="text-2xl font-bold">{data.total_items}</p>
                        </div>
                        <div className="p-4 bg-yellow-100 rounded shadow">
                            <p className="text-gray-700">Общая стоимость</p>
                            <p className="text-2xl font-bold">{data.total_cost.toLocaleString()} ₽</p>
                        </div>
                    </div>

                    <div className="p-4 border rounded shadow">
                        <h2 className="text-xl font-semibold mb-2">Статистика по магазинам</h2>
                        <table className="w-full border border-gray-300 text-sm">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2 text-left">ID</th>
                                <th className="border p-2 text-left">Адрес</th>
                                <th className="border p-2 text-right">Поставок</th>
                                <th className="border p-2 text-right">Позиций</th>
                                <th className="border p-2 text-right">Стоимость</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.supplies_per_store.map((store: any) => (
                                <tr key={store.store_id} className="hover:bg-gray-50">
                                    <td className="border p-2">{store.store_id}</td>
                                    <td className="border p-2">{store.store_address}</td>
                                    <td className="border p-2 text-right">{store.count}</td>
                                    <td className="border p-2 text-right">{store.total_items}</td>
                                    <td className="border p-2 text-right">{store.total_cost.toLocaleString()} ₽</td>
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

export default SupplyAnalyticsPage
