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
        <div className="container py-4">
            {/* Заголовок и кнопка */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h2 className="fw-bold mb-0">🚚 Поставки</h2>
                <Link to="/store/supplies/create" className="btn btn-primary">
                    + Новая поставка
                </Link>
            </div>

            {/* Фильтрация по статусу */}
            <div className="d-flex flex-wrap gap-2 mb-3">
                <button
                    onClick={() => setStatus('')}
                    className={`btn btn-sm ${status === '' ? 'btn-primary' : 'btn-outline-secondary'}`}
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
                        className={`btn btn-sm ${status === s ? 'btn-primary' : 'btn-outline-secondary'}`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* Поиск */}
            <div className="mb-3">
                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Поиск по магазину, поставщику или статусу"
                    className="form-control"
                    style={{maxWidth: '400px'}}
                />
            </div>

            {/* Загрузка / ошибка */}
            {loading && (
                <div className="text-center text-muted py-4">
                    <div className="spinner-border text-primary me-2" role="status"/>
                    Загрузка...
                </div>
            )}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {/* Таблица */}
            {!loading && !error && (
                <>
                    <div className="table-responsive mb-4">
                        <table className="table table-hover table-striped align-middle text-sm">
                            <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Магазин</th>
                                <th>Поставщик</th>
                                <th>Дата</th>
                                <th>Статус</th>
                                <th>Позиций</th>
                                <th>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {supplies.map((supply) => (
                                <tr key={supply.supply_id}>
                                    <td>#{supply.supply_id}</td>
                                    <td>{supply.store_name}</td>
                                    <td>{supply.supplier_name}</td>
                                    <td>{formatDate(supply.supply_date)}</td>
                                    <td>
                  <span
                      className={`badge rounded-pill ${
                          supply.status === 'Ожидается'
                              ? 'bg-warning text-dark'
                              : supply.status === 'Доставлено'
                                  ? 'bg-info'
                                  : supply.status === 'Принято'
                                      ? 'bg-success'
                                      : 'bg-secondary'
                      }`}
                  >
                    {supply.status}
                  </span>
                                    </td>
                                    <td>{supply.supply_items.length}</td>
                                    <td>
                                        <div className="d-flex gap-2 flex-wrap align-items-center">
                                            <Link
                                                to={`/store/supplies/id/${supply.supply_id}`}
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                Детали
                                            </Link>
                                            {supply.status === 'Ожидается' ? (
                                                <button
                                                    className="btn btn-sm btn-outline-success"
                                                    onClick={async () => {
                                                        try {
                                                            await deliverSupply(supply.supply_id, storeId ?? undefined)
                                                            await fetchData()
                                                        } catch (e: any) {
                                                            alert(e?.response?.data?.detail || 'Ошибка при принятии поставки')
                                                        }
                                                    }}
                                                >
                                                    Принять
                                                </button>
                                            ) : (
                                                <span className="text-muted small">✓</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Пагинация */}
                    <div className="d-flex justify-content-between align-items-center">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="btn btn-outline-secondary"
                            disabled={page === 1}
                        >
                            ← Назад
                        </button>
                        <span className="text-muted">Страница {page}</span>
                        <button
                            onClick={() => setPage((p) => p + 1)}
                            className="btn btn-outline-secondary"
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
