import {useEffect, useState} from 'react'
import {getStocks, type Stock} from '@/api/stock'
import {useAuth} from "@/contexts/AuthContext";

const StockPage = () => {
    const [stocks, setStocks] = useState<Stock[]>([])
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [limit] = useState(10)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const {storeId} = useAuth()

    const fetchStocks = async () => {
        setLoading(true)
        try {
            const data = await getStocks(search, page, limit, storeId ?? undefined) // 👈 передаём storeId
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
        <div className="container py-4">
            {/* Заголовок и поиск */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <h2 className="fw-bold mb-0">📦 Остатки товаров</h2>
                <input
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Поиск по товару или адресу..."
                    className="form-control"
                    style={{maxWidth: '300px'}}
                />
            </div>

            {/* Состояние загрузки / ошибки */}
            {loading && (
                <div className="text-center py-4 text-muted">
                    <div className="spinner-border text-primary me-2" role="status"/>
                    Загрузка...
                </div>
            )}

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {/* Таблица остатков */}
            {!loading && !error && (
                <>
                    <div className="table-responsive mb-4">
                        <table className="table table-striped table-hover align-middle">
                            <thead className="table-primary">
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Товар</th>
                                <th scope="col">Магазин</th>
                                <th scope="col">Кол-во</th>
                                <th scope="col">Обновлено</th>
                            </tr>
                            </thead>
                            <tbody>
                            {stocks.map((stock) => (
                                <tr key={stock.stock_id}>
                                    <td>{stock.stock_id}</td>
                                    <td>{stock.product_name}</td>
                                    <td>{stock.stock_address}</td>
                                    <td>
                  <span
                      className={`badge rounded-pill bg-${stock.quantity <= 3 ? 'danger' : 'secondary'}`}
                  >
                    {stock.quantity}
                  </span>
                                    </td>
                                    <td>{formatDate(stock.updated_datetime)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Пагинация */}
                    <div className="d-flex justify-content-between align-items-center">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="btn btn-outline-primary"
                            disabled={page === 1}
                        >
                            ← Назад
                        </button>
                        <span className="text-muted small">Страница {page}</span>
                        <button
                            onClick={() => setPage((p) => p + 1)}
                            className="btn btn-outline-primary"
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
