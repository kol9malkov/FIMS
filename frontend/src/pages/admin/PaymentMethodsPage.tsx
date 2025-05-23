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
    const [search, setSearch] = useState('')
    const [newName, setNewName] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [editId, setEditId] = useState<number | null>(null)
    const [editName, setEditName] = useState('')
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const fetchData = async () => {
        const data = await getPaymentMethods()
        setMethods(data)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const openCreateModal = () => {
        setNewName('')
        setIsModalOpen(true)
    }

    const handleCreate = async () => {
        if (!newName.trim()) return
        try {
            await createPaymentMethod(newName)
            await fetchData()
            setIsModalOpen(false)
        } catch {
            alert('Ошибка при добавлении метода оплаты')
        }
    }

    const openEditModal = (id: number, currentName: string) => {
        setEditId(id)
        setEditName(currentName)
        setIsEditModalOpen(true)
    }

    const handleEditSubmit = async () => {
        if (!editName.trim() || editId === null) return
        try {
            await updatePaymentMethod(editId, editName)
            await fetchData()
            setIsEditModalOpen(false)
        } catch {
            alert('Ошибка при редактировании')
        }
    }

    const handleDelete = async (id: number) => {
        if (confirm('Удалить метод оплаты?')) {
            await deletePaymentMethod(id)
            await fetchData()
        }
    }

    const filteredMethods = methods.filter(m =>
        m.method_name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="container py-4">
            {/* Заголовок и панель управления */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0 fw-bold">Методы оплаты</h2>
                <button className="btn btn-primary" onClick={openCreateModal}>
                    Добавить
                </button>
            </div>

            {/* Поиск */}
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Поиск по названию метода..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
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
                    {filteredMethods.map((m) => (
                        <tr key={m.payment_method_id}>
                            <td>{m.payment_method_id}</td>
                            <td>{m.method_name}</td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => openEditModal(m.payment_method_id, m.method_name)}
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

            {/* Модалка создания */}
            {isModalOpen && (
                <div className="modal d-block" tabIndex={-1} role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Добавить метод оплаты</h5>
                                <button type="button" className="btn-close"
                                        onClick={() => setIsModalOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Введите название"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                                    Отмена
                                </button>
                                <button className="btn btn-primary" onClick={handleCreate}>
                                    Сохранить
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Модалка редактирования */}
            {isEditModalOpen && (
                <div className="modal d-block" tabIndex={-1} role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Редактирование метода оплаты</h5>
                                <button type="button" className="btn-close"
                                        onClick={() => setIsEditModalOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
                                    Отмена
                                </button>
                                <button className="btn btn-primary" onClick={handleEditSubmit}>
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

export default PaymentMethodsPage
