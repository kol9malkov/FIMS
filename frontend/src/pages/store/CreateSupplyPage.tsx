import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '@/contexts/AuthContext'
import {getProducts, type Product} from '@/api/products'
import {createSupply} from '@/api/supplies'

interface SupplyItemInput {
    product_id: number
    quantity: number
    price: number
}

const CreateSupplyPage = () => {
    const {storeId} = useAuth()
    const navigate = useNavigate()

    const [supplierName, setSupplierName] = useState('')
    const [supplyDate, setSupplyDate] = useState(() => new Date().toISOString().split('T')[0])
    const [search, setSearch] = useState('')
    const [suggestions, setSuggestions] = useState<Product[]>([])
    const [productMap, setProductMap] = useState<Record<number, string>>({})
    const [items, setItems] = useState<SupplyItemInput[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (search.trim().length < 2) {
                setSuggestions([])
                return
            }

            const data = await getProducts(search, 1, 10)
            setSuggestions(data)
        }

        fetchSuggestions()
    }, [search])

    const handleAddProduct = (product: Product) => {
        if (items.some(i => i.product_id === product.product_id)) return

        setItems([
            ...items,
            {
                product_id: product.product_id,
                quantity: 1,
                price: 1,
            },
        ])
        setProductMap(prev => ({...prev, [product.product_id]: product.name}))
        setSearch('')
        setSuggestions([])
    }

    const handleItemChange = (index: number, field: keyof SupplyItemInput, value: number) => {
        const updated = [...items]
        updated[index][field] = value
        setItems(updated)
    }

    const handleRemoveItem = (index: number) => {
        const updated = [...items]
        updated.splice(index, 1)
        setItems(updated)
    }

    const handleSubmit = async () => {
        if (!storeId || !supplierName || items.length === 0) {
            setError('Заполните все поля и добавьте хотя бы один товар')
            return
        }

        try {
            setLoading(true)
            await createSupply(
                {
                    store_id: parseInt(storeId),
                    supplier_name: supplierName,
                    supply_date: supplyDate,
                    supply_items: items,
                },
                storeId
            )
            navigate('/store/supplies')
        } catch (e: any) {
            setError(e?.response?.data?.detail || 'Ошибка создания поставки')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container py-4" style={{maxWidth: '720px'}}>
            <h2 className="fw-bold fs-4 mb-4">Создание поставки</h2>

            {/* Поставщик */}
            <div className="mb-3">
                <label className="form-label">Поставщик</label>
                <input
                    type="text"
                    className="form-control"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                />
            </div>

            {/* Дата поставки */}
            <div className="mb-3">
                <label className="form-label">Дата поставки</label>
                <input
                    type="date"
                    className="form-control"
                    value={supplyDate}
                    onChange={(e) => setSupplyDate(e.target.value)}
                />
            </div>

            {/* Поиск товара */}
            <div className="mb-3 position-relative">
                <label className="form-label">Поиск товара</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Введите наименование товара..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {search.length > 0 && suggestions.length > 0 && (
                    <ul className="list-group position-absolute z-3 w-100 mt-1 shadow-sm"
                        style={{maxHeight: '160px', overflowY: 'auto'}}>
                        {suggestions.map((product) => (
                            <li
                                key={product.product_id}
                                className="list-group-item list-group-item-action"
                                onClick={() => handleAddProduct(product)}
                                style={{cursor: 'pointer'}}
                            >
                                {product.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Список товаров */}
            {items.length > 0 && (
                <div className="mb-4 mt-3">
                    {items.map((item, index) => (
                        <div className="row align-items-center g-2 mb-2" key={index}>
                            <div className="col-md-5">
            <span className="form-text small">
              {productMap[item.product_id] || `ID ${item.product_id}`}
            </span>
                            </div>
                            <div className="col-md-2">
                                <input
                                    type="number"
                                    min={1}
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                                    className="form-control"
                                    placeholder="Кол-во"
                                />
                            </div>
                            <div className="col-md-2">
                                <input
                                    type="number"
                                    min={0.01}
                                    step={0.01}
                                    value={item.price}
                                    onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                                    className="form-control"
                                    placeholder="Цена"
                                />
                            </div>
                            <div className="col-md-3">
                                <button
                                    className="btn btn-link text-danger p-0"
                                    onClick={() => handleRemoveItem(index)}
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Ошибка */}
            {error && <p className="text-danger mb-3">{error}</p>}

            {/* Кнопка */}
            <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate(-1)} // <- возвращаем на предыдущую
                >
                    Отмена
                </button>
                <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Создание...' : 'Создать поставку'}
                </button>
            </div>
        </div>

    )
}

export default CreateSupplyPage
