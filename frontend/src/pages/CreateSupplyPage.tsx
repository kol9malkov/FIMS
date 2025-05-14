import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {getProducts} from '@/api/products'
import {getStores} from '@/api/stores'
import {createSupply, type SupplyItemInput} from '@/api/supplies'
import type {Product} from '@/api/products'
import type {Store} from '@/api/stores'

const CreateSupplyPage = () => {
    const navigate = useNavigate()

    const [supplierName, setSupplierName] = useState('')
    const [supplyDate, setSupplyDate] = useState(() =>
        new Date().toISOString().split('T')[0]
    )
    const [storeId, setStoreId] = useState('')
    const [products, setProducts] = useState<Product[]>([])
    const [stores, setStores] = useState<Store[]>([])
    const [items, setItems] = useState<SupplyItemInput[]>([
        {product_id: 0, quantity: 1}
    ])
    const [isAdmin, setIsAdmin] = useState(false)

    const savedStoreId = localStorage.getItem('store_id') || ''

    useEffect(() => {
        const role = localStorage.getItem('role')
        setIsAdmin(role === 'Администратор')

        if (role !== 'Администратор') {
            setStoreId(savedStoreId)
        }

        fetchProducts()
        if (role === 'Администратор') {
            fetchStores()
        }
    }, [])

    const fetchProducts = async () => {
        const data = await getProducts('', 1, 1000) // получаем всех
        setProducts(data)
    }

    const fetchStores = async () => {
        const data = await getStores('', 1, 1000)
        setStores(data)
    }

    const handleItemChange = (
        index: number,
        field: keyof SupplyItemInput,
        value: string
    ) => {
        const newItems = [...items]
        if (field === 'quantity') {
            newItems[index].quantity = Number(value)
        } else if (field === 'product_id') {
            newItems[index].product_id = Number(value)
        }
        setItems(newItems)
    }

    const addItem = () => {
        setItems([...items, {product_id: 0, quantity: 1}])
    }

    const removeItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index)
        setItems(newItems)
    }

    const handleSubmit = async () => {
        if (
            !supplierName ||
            !storeId ||
            items.length === 0 ||
            items.some(i => !i.product_id || i.quantity <= 0)
        ) {
            alert('Заполните все поля корректно')
            return
        }

        try {
            await createSupply(
                {
                    store_id: Number(storeId),
                    supplier_name: supplierName,
                    supply_date: supplyDate,
                    supply_items: items
                },
                isAdmin ? undefined : savedStoreId
            )

            navigate('/store/supplies')
        } catch {
            alert('Ошибка при создании поставки')
        }
    }

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Создание поставки</h1>

            <div className="flex flex-col gap-2">
                {isAdmin && (
                    <select
                        className="border p-2"
                        value={storeId}
                        onChange={e => setStoreId(e.target.value)}
                    >
                        <option value="">Выберите магазин</option>
                        {stores.map(s => (
                            <option key={s.store_id} value={s.store_id}>
                                {s.address}
                            </option>
                        ))}
                    </select>
                )}

                <input
                    className="border p-2"
                    type="text"
                    placeholder="Поставщик"
                    value={supplierName}
                    onChange={e => setSupplierName(e.target.value)}
                />

                <input
                    className="border p-2"
                    type="date"
                    value={supplyDate}
                    onChange={e => setSupplyDate(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <h2 className="text-lg font-semibold">Товары</h2>
                {items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-center">
                        <select
                            className="border p-2"
                            value={item.product_id}
                            onChange={e => handleItemChange(index, 'product_id', e.target.value)}
                        >
                            <option value={0}>Выберите товар</option>
                            {products.map(p => (
                                <option key={p.product_id} value={p.product_id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>

                        <input
                            className="border p-2 w-24"
                            type="number"
                            value={item.quantity}
                            onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                            min={1}
                        />

                        <button className="text-red-600" onClick={() => removeItem(index)}>
                            ✕
                        </button>
                    </div>
                ))}

                <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={addItem}>
                    Добавить товар
                </button>
            </div>

            <button
                className="bg-green-600 text-white px-6 py-2 rounded"
                onClick={handleSubmit}
            >
                Создать поставку
            </button>
        </div>
    )
}

export default CreateSupplyPage
