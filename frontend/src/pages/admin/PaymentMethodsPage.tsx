import {useEffect, useState} from 'react'
import {
    getPaymentMethods,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    type PaymentMethod
} from '@/api/paymentMethods'

const PaymentMethodsPage = () => {
    const [methods, setMethods] = useState<PaymentMethod[]>([])
    const [newName, setNewName] = useState('')

    const fetchData = async () => {
        const data = await getPaymentMethods()
        setMethods(data)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleCreate = async () => {
        if (!newName.trim()) return
        await createPaymentMethod(newName)
        setNewName('')
        await fetchData()
    }

    const handleUpdate = async (id: number, name: string) => {
        const newLabel = prompt('Новое имя метода оплаты:', name)
        if (newLabel && newLabel !== name) {
            await updatePaymentMethod(id, newLabel)
            await fetchData()
        }
    }

    const handleDelete = async (id: number) => {
        if (confirm('Удалить метод оплаты?')) {
            await deletePaymentMethod(id)
            await fetchData()
        }
    }

    return (
        <div className="container py-4">
            <h2 className="mb-4 fw-bold">Методы оплаты</h2>

            {/* Форма добавления */}
            <div className="d-flex gap-2 mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Новый метод оплаты"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleCreate}>
                    Добавить
                </button>
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
                    {methods.map((m) => (
                        <tr key={m.payment_method_id}>
                            <td>{m.payment_method_id}</td>
                            <td>{m.method_name}</td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => handleUpdate(m.payment_method_id, m.method_name)}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(m.payment_method_id)}
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
        </div>

    )
}

export default PaymentMethodsPage
