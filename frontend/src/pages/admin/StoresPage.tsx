import {useEffect, useState} from 'react'
import {
    getStores,
    createStore,
    updateStore,
    deleteStore,
    type Store,
} from '@/api/stores'

const StoresPage = () => {
    const [stores, setStores] = useState<Store[]>([])
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [limit] = useState(10)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingStoreId, setEditingStoreId] = useState<number | null>(null)
    const [address, setAddress] = useState('')


    const fetchData = async () => {
        try {
            const data = await getStores(search, page, limit)
            setStores(data)
        } catch {
            alert('Ошибка при загрузке магазинов')
        }
    }

    useEffect(() => {
        fetchData()
    }, [search, page])

    const openCreateModal = () => {
        setEditingStoreId(null)
        setAddress('')
        setIsModalOpen(true)
    }

    const openEditModal = (store: Store) => {
        setEditingStoreId(store.store_id)
        setAddress(store.address)
        setIsModalOpen(true)
    }

    const handleSubmit = async () => {
        try {
            if (editingStoreId) {
                await updateStore(editingStoreId, address)
            } else {
                await createStore(address)
            }
            setIsModalOpen(false)
            fetchData()
        } catch {
            alert('Ошибка при сохранении магазина')
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Удалить магазин?')) return
        try {
            await deleteStore(id)
            fetchData()
        } catch {
            alert('Ошибка при удалении магазина')
        }
    }

    return (
        <div className="container py-4">
            {/* Заголовок и кнопка */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Магазины</h2>
                <button className="btn btn-primary" onClick={openCreateModal}>
                    Добавить магазин
                </button>
            </div>

            {/* Поиск */}
            <div className="mb-3">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    placeholder="Поиск по адресу..."
                    className="form-control"
                />
            </div>

            {/* Таблица */}
            <div className="table-responsive">
                <table className="table table-bordered table-hover text-sm">
                    <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Адрес</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {stores.map((store) => (
                        <tr key={store.store_id}>
                            <td>{store.store_id}</td>
                            <td>{store.address}</td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => openEditModal(store)}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(store.store_id)}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Пагинация */}
            <div className="d-flex justify-content-between align-items-center mt-3">
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    ← Назад
                </button>
                <span className="text-muted">Страница {page}</span>
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={stores.length < limit}
                >
                    Вперёд →
                </button>
            </div>

            {/* Модальное окно */}
            {isModalOpen && (
                <div className="modal d-block" tabIndex={-1}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingStoreId ? 'Редактирование магазина' : 'Новый магазин'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setIsModalOpen(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Адрес"
                                    className="form-control"
                                />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                                    Отмена
                                </button>
                                <button className="btn btn-primary" onClick={handleSubmit}>
                                    Сохранить
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

    )
}

export default StoresPage
