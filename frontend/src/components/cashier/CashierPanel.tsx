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
        <div className="container py-4" style={{maxWidth: '720px'}}>
            {/* Заголовок */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h4 mb-0 fw-bold">Кассовая панель</h1>
            </div>

            {/* Поле сканера */}
            <div className="input-group mb-4">
                <input
                    type="text"
                    className="form-control"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="Введите штрихкод"
                    onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                />
                <button onClick={handleScan} className="btn btn-primary">
                    ➕
                </button>
            </div>

            {/* Таблица товаров */}
            <div className="table-responsive mb-4">
                <table className="table table-bordered table-hover align-middle text-sm">
                    <thead className="table-light">
                    <tr>
                        <th>Товар</th>
                        <th>Цена</th>
                        <th>Кол-во</th>
                        <th>Сумма</th>
                        <th>Действие</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((item) => (
                        <tr key={item.product_id}>
                            <td>{item.product_name}</td>
                            <td>{item.price.toFixed(2)}</td>
                            <td>{item.quantity}</td>
                            <td>{(item.quantity * item.price).toFixed(2)}</td>
                            <td className="text-center">
                                <button
                                    className="btn btn-sm btn-link text-danger"
                                    onClick={() => handleRemove(item.product_id)}
                                >
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Итого */}
            <div className="mb-4">
                <strong>Итого:</strong> {total.toFixed(2)} ₽
            </div>

            {/* Оплата */}
            <h5 className="fw-semibold mb-2">Оплата</h5>
            <div className="row g-2 align-items-center mb-4">
                <div className="col-md-6">
                    <select
                        className="form-select"
                        value={payment.method}
                        onChange={(e) =>
                            setPayment((prev) => ({...prev, method: e.target.value}))
                        }
                    >
                        <option value="">-- Способ оплаты --</option>
                        {payments.map((pm) => (
                            <option key={pm.payment_method_id} value={pm.payment_method_id.toString()}>
                                {pm.method_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control bg-light"
                        placeholder="Сумма"
                        value={payment.amount}
                        readOnly
                    />
                </div>
            </div>

            {/* Подтверждение */}
            <button
                onClick={handleConfirm}
                disabled={!payment.method || items.length === 0}
                className="btn btn-success"
            >
                Подтвердить продажу
            </button>
        </div>

    )
}

export default CashierPanel
