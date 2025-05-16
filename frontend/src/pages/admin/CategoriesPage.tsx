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


    const fetchData = async () => {
        try {
            const data = await getCategories(search, page, limit)
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
                await updateCategory(editingCategoryId, categoryName)
            } else {
                await createCategory(categoryName)
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
            await deleteCategory(id)
            fetchData()
        } catch {
            alert('Ошибка при удалении категории')
        }
    }

    return (
        <div className="container py-4">
            {/* Заголовок + кнопка */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Категории</h2>
                <button className="btn btn-primary" onClick={openCreateModal}>
                    Добавить категорию
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
                    placeholder="Поиск по названию..."
                    className="form-control"
                />
            </div>

            {/* Таблица */}
            <div className="table-responsive">
                <table className="table table-bordered table-hover text-sm">
                    <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map((category) => (
                        <tr key={category.category_id}>
                            <td>{category.category_id}</td>
                            <td>{category.name}</td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => openEditModal(category)}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(category.category_id)}
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
                    disabled={categories.length < limit}
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
                                    {editingCategoryId ? 'Редактирование' : 'Новая категория'}
                                </h5>
                                <button type="button" className="btn-close"
                                        onClick={() => setIsModalOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    placeholder="Название категории"
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

export default CategoriesPage
