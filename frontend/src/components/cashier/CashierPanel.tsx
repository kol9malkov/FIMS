import {useState, useEffect} from 'react'
import {getProductByBarcode} from '@/api/products'
import {getPaymentMethods, type PaymentMethod} from '@/api/paymentMethods'
import {createSale, type ScannedItem} from '@/api/sales'
import {useAuth} from '@/contexts/AuthContext'

const CashierPanel = () => {
    const {storeId, username, logout} = useAuth()
    const [barcode, setBarcode] = useState('')
    const [items, setItems] = useState<ScannedItem[]>([])
    const [payments, setPayments] = useState<PaymentMethod[]>([])
    const [payment, setPayment] = useState<{ method: string, amount: string }>({method: '', amount: ''})
    const [total, setTotal] = useState(0)

    useEffect(() => {
        getPaymentMethods().then(setPayments)
    }, [])

    useEffect(() => {
        const sum = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
        setTotal(sum)
        setPayment(prev => ({...prev, amount: sum.toFixed(2)}))
    }, [items])

    const handleScan = async () => {
        try {
            const product = await getProductByBarcode(barcode)
            setItems(prev => {
                const existing = prev.find(i => i.product_id === product.product_id)
                if (existing) {
                    return prev.map(i =>
                        i.product_id === product.product_id ? {...i, quantity: i.quantity + 1} : i
                    )
                } else {
                    return [...prev, {
                        product_id: product.product_id,
                        product_name: product.name,
                        quantity: 1,
                        price: product.price
                    }]
                }
            })
            setBarcode('')
        } catch (e: any) {
            alert(e?.response?.data?.detail || 'Товар не найден')
        }
    }

    const handleRemove = (productId: number) => {
        setItems(prev => prev.flatMap(item => {
            if (item.product_id === productId) {
                if (item.quantity > 1) {
                    return {...item, quantity: item.quantity - 1}
                } else {
                    return []
                }
            }
            return item
        }))
    }

    const handleConfirm = async () => {
        if (!storeId || !payment.method || items.length === 0) return

        const amount = parseFloat(payment.amount)
        if (Math.abs(amount - total) > 0.01) {
            alert(`Сумма оплаты ${amount.toFixed(2)} не совпадает с итогом ${total.toFixed(2)}`)
            return
        }

        try {
            await createSale({
                sale_items: items.map(({product_id, quantity, price}) => ({product_id, quantity, price})),
                payments: [{payment_method_id: Number(payment.method), amount}]
            }, storeId)
            alert('Продажа оформлена')
            setItems([])
            setPayment({method: '', amount: ''})
        } catch (e: any) {
            alert(e?.response?.data?.detail || 'Ошибка при оформлении продажи')
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-4">
            <div className="flex justify-between mb-4">
                <h1 className="text-xl font-semibold">Кассовая панель</h1>
            </div>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={barcode}
                    onChange={e => setBarcode(e.target.value)}
                    placeholder="Введите штрихкод"
                    className="border p-2 rounded w-full"
                    onKeyDown={e => e.key === 'Enter' && handleScan()}
                />
                <button
                    onClick={handleScan}
                    className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
                >
                    ➕
                </button>
            </div>

            <table className="w-full border text-sm mb-4">
                <thead className="bg-blue-100">
                <tr>
                    <th className="border p-2">Товар</th>
                    <th className="border p-2">Цена</th>
                    <th className="border p-2">Кол-во</th>
                    <th className="border p-2">Сумма</th>
                    <th className="border p-2">Действие</th>
                </tr>
                </thead>
                <tbody>
                {items.map(item => (
                    <tr key={item.product_id}>
                        <td className="border p-2">{item.product_name}</td>
                        <td className="border p-2">{item.price.toFixed(2)}</td>
                        <td className="border p-2">{item.quantity}</td>
                        <td className="border p-2">{(item.quantity * item.price).toFixed(2)}</td>
                        <td className="border p-2 text-center">
                            <button
                                className="text-red-600 hover:underline"
                                onClick={() => handleRemove(item.product_id)}
                            >
                                Удалить
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="mb-4">Итого: <strong>{total.toFixed(2)} ₽</strong></div>

            <h3 className="font-semibold mt-4 mb-2">Оплата</h3>
            <div className="flex gap-2 mb-4 items-center">
                <select
                    className="border p-2 rounded w-1/3"
                    value={payment.method}
                    onChange={e => setPayment(prev => ({...prev, method: e.target.value}))}
                >
                    <option value="">-- Способ оплаты --</option>
                    {payments.map(pm => (
                        <option key={pm.payment_method_id} value={pm.payment_method_id.toString()}>
                            {pm.method_name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    className="border p-2 rounded w-1/3 bg-gray-100 cursor-not-allowed"
                    placeholder="Сумма"
                    value={payment.amount}
                    readOnly
                />
            </div>

            <button
                onClick={handleConfirm}
                disabled={!payment.method || items.length === 0}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
                Подтвердить продажу
            </button>
        </div>
    )
}

export default CashierPanel
