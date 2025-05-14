import {useEffect, useState} from 'react'
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    type Category,
} from '@/api/categories'

const CategoriesPage = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [limit] = useState(10)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null)
    const [categoryName, setCategoryName] = useState('')

    const token = localStorage.getItem('access_token') || ''

    const fetchData = async () => {
        try {
            const data = await getCategories(token, search, page, limit)
            setCategories(data)
        } catch {
            alert('Ошибка при загрузке категорий')
        }
    }

    useEffect(() => {
        fetchData()
    }, [search, page])

    const openCreateModal = () => {
        setEditingCategoryId(null)
        setCategoryName('')
        setIsModalOpen(true)
    }

    const openEditModal = (category: Category) => {
        setEditingCategoryId(category.category_id)
        setCategoryName(category.name)
        setIsModalOpen(true)
    }

    const handleSubmit = async () => {
        try {
            if (editingCategoryId) {
                await updateCategory(token, editingCategoryId, categoryName)
            } else {
                await createCategory(token, categoryName)
            }
            setIsModalOpen(false)
            fetchData()
        } catch {
            alert('Ошибка при сохранении категории')
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Удалить категорию?')) return
        try {
            await deleteCategory(token, id)
            fetchData()
        } catch {
            alert('Ошибка при удалении категории')
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Категории</h2>
                <button
                    onClick={openCreateModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Добавить категорию
                </button>
            </div>

            <input
                type="text"
                value={search}
                onChange={e => {
                    setSearch(e.target.value)
                    setPage(1)
                }}
                placeholder="Поиск по названию..."
                className="border px-3 py-2 rounded w-full max-w-md mb-4"
            />

            <table className="w-full border text-sm mb-4">
                <thead className="bg-blue-100">
                <tr>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Название</th>
                    <th className="border p-2">Действия</th>
                </tr>
                </thead>
                <tbody>
                {categories.map(category => (
                    <tr key={category.category_id} className="hover:bg-blue-50">
                        <td className="border p-2">{category.category_id}</td>
                        <td className="border p-2">{category.name}</td>
                        <td className="border p-2">
                            <button
                                onClick={() => openEditModal(category)}
                                className="text-blue-600 hover:underline mr-2"
                            >
                                Редактировать
                            </button>
                            <button
                                onClick={() => handleDelete(category.category_id)}
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
                    disabled={categories.length < limit}
                >
                    Вперёд →
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingCategoryId ? 'Редактирование' : 'Новая категория'}
                        </h3>
                        <input
                            type="text"
                            value={categoryName}
                            onChange={e => setCategoryName(e.target.value)}
                            placeholder="Название категории"
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

export default CategoriesPage
