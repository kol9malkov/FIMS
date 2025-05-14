import {useEffect, useState} from 'react'
import {getStocks, type Stock} from '@/api/stock'

const StockPage = () => {
    const [stocks, setStocks] = useState<Stock[]>([])
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [limit] = useState(10)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchStocks = async () => {
        setLoading(true)
        try {
            const data = await getStocks(search, page, limit)
            setStocks(data)
        } catch {
            setError('Ошибка загрузки остатков')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStocks()
    }, [search, page])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        setPage(1)
    }

    const formatDate = (isoString: string) => {
        const date = new Date(isoString)
        return date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Остатки товаров</h2>
                <input
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Поиск по товару или адресу..."
                    className="border px-3 py-2 rounded w-64"
                />
            </div>

            {loading && <p>Загрузка...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && !error && (
                <>
                    <table className="w-full border border-gray-300 mb-4 text-sm">
                        <thead className="bg-blue-100">
                        <tr>
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Товар</th>
                            <th className="border p-2">Магазин</th>
                            <th className="border p-2">Кол-во</th>
                            <th className="border p-2">Обновлено</th>
                        </tr>
                        </thead>
                        <tbody>
                        {stocks.map(stock => (
                            <tr key={stock.stock_id} className="hover:bg-blue-50">
                                <td className="border p-2">{stock.stock_id}</td>
                                <td className="border p-2">{stock.product_name}</td>
                                <td className="border p-2">{stock.stock_address}</td>
                                <td className="border p-2">{stock.quantity}</td>
                                <td className="border p-2">{formatDate(stock.updated_datetime)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className="flex justify-between">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            disabled={page === 1}
                        >
                            ← Назад
                        </button>
                        <span className="text-sm text-gray-600">Страница {page}</span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            disabled={stocks.length < limit}
                        >
                            Вперёд →
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default StockPage
