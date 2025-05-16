import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {useAuth} from '@/contexts/AuthContext'
import {STATUSES, getSupplies, type Supply, type SupplyStatus, deliverSupply} from '@/api/supplies'


const SupplyPage = () => {
    const {storeId, role} = useAuth()
    const isAdmin = role === 'Администратор'

    const [supplies, setSupplies] = useState<Supply[]>([])
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState<SupplyStatus | ''>('') // строгая типизация
    const [page, setPage] = useState(1)
    const [limit] = useState(10)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = async () => {
        setLoading(true)
        try {
            const data = await getSupplies(
                search,
                page,
                limit,
                isAdmin ? undefined : storeId || undefined,
                status || undefined
            )
            setSupplies(data)
            setError(null)
        } catch {
            setError('Ошибка загрузки поставок')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [search, page, status, storeId])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        setPage(1)
    }

    const formatDate = (iso: string) => {
        const date = new Date(iso)
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Поставки</h2>
                <Link
                    to="/store/supplies/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Новая поставка
                </Link>
            </div>

            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setStatus('')}
                    className={`px-3 py-1 rounded ${status === '' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                    Все
                </button>
                {STATUSES.map((s) => (
                    <button
                        key={s}
                        onClick={() => {
                            setStatus(s)
                            setPage(1)
                        }}
                        className={`px-3 py-1 rounded ${status === s ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Поиск по магазину, поставщику или статусу"
                className="border px-3 py-2 rounded w-full max-w-md mb-4"
            />

            {loading && <p>Загрузка...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && !error && (
                <>
                    <table className="w-full border text-sm mb-4">
                        <thead className="bg-blue-100">
                        <tr>
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Магазин</th>
                            <th className="border p-2">Поставщик</th>
                            <th className="border p-2">Дата</th>
                            <th className="border p-2">Статус</th>
                            <th className="border p-2">Позиций</th>
                            <th className="border p-2">Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {supplies.map((supply) => (
                            <tr key={supply.supply_id} className="hover:bg-blue-50">
                                <td className="border p-2">{supply.supply_id}</td>
                                <td className="border p-2">{supply.store_name}</td>
                                <td className="border p-2">{supply.supplier_name}</td>
                                <td className="border p-2">{formatDate(supply.supply_date)}</td>
                                <td className="border p-2">{supply.status}</td>
                                <td className="border p-2">{supply.supply_items.length}</td>
                                <td className="border p-2 space-x-2">
                                    <Link
                                        to={`/store/supplies/id/${supply.supply_id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Детали
                                    </Link>
                                    {supply.status === 'Ожидается' ? (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await deliverSupply(supply.supply_id, storeId ?? undefined)
                                                    await fetchData()
                                                } catch (e: any) {
                                                    alert(e?.response?.data?.detail || 'Ошибка при принятии поставки')
                                                }
                                            }}
                                            className="text-green-600 hover:underline"
                                        >
                                            Принять
                                        </button>
                                    ) : (
                                        <span className="text-gray-400 text-sm">✓</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>


                    <div className="flex justify-between">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            disabled={page === 1}
                        >
                            ← Назад
                        </button>
                        <span className="text-sm text-gray-600">Страница {page}</span>
                        <button
                            onClick={() => setPage((p) => p + 1)}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            disabled={supplies.length < limit}
                        >
                            Вперёд →
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default SupplyPage
