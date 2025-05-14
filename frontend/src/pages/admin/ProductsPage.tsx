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
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Товары</h2>
                <button
                    onClick={openCreateModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Добавить товар
                </button>
            </div>

            <input
                type="text"
                value={search}
                onChange={e => {
                    setSearch(e.target.value)
                    setPage(1)
                }}
                placeholder="Поиск по названию, штрихкоду..."
                className="border px-3 py-2 rounded w-full max-w-md mb-4"
            />

            <table className="w-full border text-sm mb-4">
                <thead className="bg-blue-100">
                <tr>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Название</th>
                    <th className="border p-2">Описание</th>
                    <th className="border p-2">Цена</th>
                    <th className="border p-2">Штрихкод</th>
                    <th className="border p-2">Категория</th>
                    <th className="border p-2">Действия</th>
                </tr>
                </thead>
                <tbody>
                {products.map(product => (
                    <tr key={product.product_id} className="hover:bg-blue-50">
                        <td className="border p-2">{product.product_id}</td>
                        <td className="border p-2">{product.name}</td>
                        <td className="border p-2">{product.description}</td>
                        <td className="border p-2">{product.price}</td>
                        <td className="border p-2">{product.barcode}</td>
                        <td className="border p-2">{product.category_name}</td>
                        <td className="border p-2">
                            <button
                                onClick={() => openEditModal(product)}
                                className="text-blue-600 hover:underline mr-2"
                            >
                                Редактировать
                            </button>
                            <button
                                onClick={() => handleDelete(product.product_id)}
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
                    disabled={products.length < limit}
                >
                    Вперёд →
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingProductId ? 'Редактирование товара' : 'Новый товар'}
                        </h3>

                        {(['name', 'description', 'price', 'barcode'] as const).map(field => (
                            <input
                                key={field}
                                type={field === 'price' ? 'number' : 'text'}
                                value={formData[field]?.toString() || ''}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        [field]: field === 'price' ? Number(e.target.value) : e.target.value
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
                                className="border p-2 rounded w-full mb-3"
                            />
                        ))}

                        <select
                            value={formData.category_id}
                            onChange={e => setFormData({...formData, category_id: Number(e.target.value)})}
                            className="border p-2 rounded w-full mb-4"
                        >
                            <option value={0}>Выберите категорию</option>
                            {categories.map(c => (
                                <option key={c.category_id} value={c.category_id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>

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

export default ProductsPage
