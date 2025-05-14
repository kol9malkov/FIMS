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
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Методы оплаты</h1>

            <div className="flex gap-2 mb-4">
                <input
                    className="border px-2 py-1 rounded"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Новый метод оплаты"
                />
                <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={handleCreate}>
                    Добавить
                </button>
            </div>

            <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 border">ID</th>
                    <th className="p-2 border">Название</th>
                    <th className="p-2 border">Действия</th>
                </tr>
                </thead>
                <tbody>
                {methods.map((m) => (
                    <tr key={m.payment_method_id} className="hover:bg-gray-50">
                        <td className="p-2 border">{m.payment_method_id}</td>
                        <td className="p-2 border">{m.method_name}</td>
                        <td className="p-2 border">
                            <button
                                className="text-blue-600 mr-2"
                                onClick={() => handleUpdate(m.payment_method_id, m.method_name)}
                            >
                                Редактировать
                            </button>
                            <button
                                className="text-red-600"
                                onClick={() => handleDelete(m.payment_method_id)}
                            >
                                Удалить
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default PaymentMethodsPage
