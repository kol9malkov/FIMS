import {useEffect, useState} from 'react'
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    type Product,
    type ProductPayload,
} from '@/api/products'
import {getCategories, type Category} from '@/api/categories'

const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])

    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [limit] = useState(10)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProductId, setEditingProductId] = useState<number | null>(null)

    const [formData, setFormData] = useState<ProductPayload>({
        name: '',
        description: '',
        price: 0,
        barcode: '',
        category_id: 0,
    })


    const fetchData = async () => {
        try {
            const [productData, categoryData] = await Promise.all([
                getProducts(search, page, limit),
                getCategories('', 1, 100),
            ])
            setProducts(productData)
            setCategories(categoryData)
        } catch {
            alert('Ошибка при загрузке данных')
        }
    }

    useEffect(() => {
        fetchData()
    }, [search, page])

    const openCreateModal = () => {
        setEditingProductId(null)
        setFormData({name: '', description: '', price: 0, barcode: '', category_id: 0})
        setIsModalOpen(true)
    }

    const openEditModal = (product: Product) => {
        setEditingProductId(product.product_id)
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            barcode: product.barcode,
            category_id: product.category_id,
        })
        setIsModalOpen(true)
    }

    const handleSubmit = async () => {
        try {
            if (editingProductId) {
                await updateProduct(editingProductId, formData)
            } else {
                await createProduct(formData)
            }
            setIsModalOpen(false)
            fetchData()
        } catch {
            alert('Ошибка при сохранении товара')
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Удалить товар?')) return
        try {
            await deleteProduct(id)
            fetchData()
        } catch {
            alert('Ошибка при удалении товара')
        }
    }

    return (
        <div className="container py-4">
            {/* Заголовок и кнопка */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Товары</h2>
                <button className="btn btn-primary" onClick={openCreateModal}>
                    Добавить товар
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
                    placeholder="Поиск по названию, штрихкоду..."
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
                        <th>Описание</th>
                        <th>Цена</th>
                        <th>Штрихкод</th>
                        <th>Категория</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((product) => (
                        <tr key={product.product_id}>
                            <td>{product.product_id}</td>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{product.price}</td>
                            <td>{product.barcode}</td>
                            <td>{product.category_name}</td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => openEditModal(product)}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(product.product_id)}
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
                    disabled={products.length < limit}
                >
                    Вперёд →
                </button>
            </div>

            {/* Модалка */}
            {isModalOpen && (
                <div className="modal d-block" tabIndex={-1}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingProductId ? 'Редактирование товара' : 'Новый товар'}
                                </h5>
                                <button type="button" className="btn-close"
                                        onClick={() => setIsModalOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                {(['name', 'description', 'price', 'barcode'] as const).map((field) => (
                                    <input
                                        key={field}
                                        type={field === 'price' ? 'number' : 'text'}
                                        value={formData[field]?.toString() || ''}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                [field]:
                                                    field === 'price' ? Number(e.target.value) : e.target.value,
                                            })
                                        }
                                        placeholder={
                                            field === 'name'
                                                ? 'Название'
                                                : field === 'description'
                                                    ? 'Описание'
                                                    : field === 'price'
                                                        ? 'Цена'
                                                        : 'Штрихкод'
                                        }
                                        className="form-control mb-3"
                                    />
                                ))}

                                <select
                                    value={formData.category_id}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            category_id: Number(e.target.value),
                                        })
                                    }
                                    className="form-select mb-3"
                                >
                                    <option value={0}>Выберите категорию</option>
                                    {categories.map((c) => (
                                        <option key={c.category_id} value={c.category_id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
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

export default ProductsPage
