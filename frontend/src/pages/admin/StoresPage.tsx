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
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Магазины</h2>
                <button
                    onClick={openCreateModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Добавить магазин
                </button>
            </div>

            <input
                type="text"
                value={search}
                onChange={e => {
                    setSearch(e.target.value)
                    setPage(1)
                }}
                placeholder="Поиск по адресу..."
                className="border px-3 py-2 rounded w-full max-w-md mb-4"
            />

            <table className="w-full border text-sm mb-4">
                <thead className="bg-blue-100">
                <tr>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Адрес</th>
                    <th className="border p-2">Действия</th>
                </tr>
                </thead>
                <tbody>
                {stores.map(store => (
                    <tr key={store.store_id} className="hover:bg-blue-50">
                        <td className="border p-2">{store.store_id}</td>
                        <td className="border p-2">{store.address}</td>
                        <td className="border p-2">
                            <button
                                onClick={() => openEditModal(store)}
                                className="text-blue-600 hover:underline mr-2"
                            >
                                Редактировать
                            </button>
                            <button
                                onClick={() => handleDelete(store.store_id)}
                                className="text-red-600 hover:underline"
                            >
                                Удалить
                            </button>
                        </td>
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
                    disabled={stores.length < limit}
                >
                    Вперёд →
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingStoreId ? 'Редактирование магазина' : 'Новый магазин'}
                        </h3>
                        <input
                            type="text"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            placeholder="Адрес"
                            className="border p-2 rounded w-full mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default StoresPage
