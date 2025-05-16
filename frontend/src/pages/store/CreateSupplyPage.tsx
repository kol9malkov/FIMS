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
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4">Создание поставки</h2>

            <div className="mb-3">
                <label className="block mb-1">Поставщик</label>
                <input
                    type="text"
                    className="border rounded px-3 py-2 w-full"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label className="block mb-1">Дата поставки</label>
                <input
                    type="date"
                    className="border rounded px-3 py-2"
                    value={supplyDate}
                    onChange={(e) => setSupplyDate(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label className="block mb-1">Поиск товара</label>
                <input
                    type="text"
                    className="border rounded px-3 py-2 w-full"
                    placeholder="Введите наименование товара..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {search.length > 0 && suggestions.length > 0 && (
                    <ul className="bg-white border w-full mt-1 max-h-40 overflow-y-auto shadow-md rounded mb-4">
                        {suggestions.map(product => (
                            <li
                                key={product.product_id}
                                className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                                onClick={() => handleAddProduct(product)}
                            >
                                {product.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="mb-6 mt-4">
                {items.map((item, index) => (
                    <div key={index} className="flex flex-wrap gap-3 items-center mb-2">
            <span className="text-sm w-2/5">
              {productMap[item.product_id] || `ID ${item.product_id}`}
            </span>
                        <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                                handleItemChange(index, 'quantity', parseInt(e.target.value))
                            }
                            className="border px-2 py-1 rounded w-1/5"
                            placeholder="Количество"
                        />
                        <input
                            type="number"
                            min={0.01}
                            step={0.01}
                            value={item.price}
                            onChange={(e) =>
                                handleItemChange(index, 'price', parseFloat(e.target.value))
                            }
                            className="border px-2 py-1 rounded w-1/5"
                            placeholder="Цена"
                        />
                        <button
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-600 text-sm hover:underline"
                        >
                            Удалить
                        </button>
                    </div>
                ))}
            </div>

            {error && <p className="text-red-600 mb-2">{error}</p>}

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
                {loading ? 'Создание...' : 'Создать поставку'}
            </button>
        </div>
    )
}

export default CreateSupplyPage
