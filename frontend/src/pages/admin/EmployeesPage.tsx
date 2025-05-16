import {useEffect, useState} from 'react'
import {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    type Employee,
    type EmployeeCreateUpdate
} from '@/api/employees'

const EmployeesPage = () => {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [limit] = useState(10)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null)

    const [formData, setFormData] = useState<EmployeeCreateUpdate>({
        first_name: '',
        last_name: '',
        position: '',
        email: '',
        phone: '',
    })


    const fetchData = async () => {
        try {
            const data = await getEmployees(search, page, limit)
            setEmployees(data)
        } catch {
            alert('Ошибка при загрузке сотрудников')
        }
    }

    useEffect(() => {
        fetchData()
    }, [search, page])

    const openCreateModal = () => {
        setEditingEmployeeId(null)
        setFormData({first_name: '', last_name: '', position: '', email: '', phone: ''})
        setIsModalOpen(true)
    }

    const openEditModal = (employee: Employee) => {
        setEditingEmployeeId(employee.employee_id)
        setFormData({
            first_name: employee.first_name,
            last_name: employee.last_name,
            position: employee.position,
            email: employee.email,
            phone: employee.phone,
        })
        setIsModalOpen(true)
    }

    const handleSubmit = async () => {
        try {
            if (editingEmployeeId) {
                await updateEmployee(editingEmployeeId, formData)
            } else {
                await createEmployee(formData)
            }
            setIsModalOpen(false)
            fetchData()
        } catch {
            alert('Ошибка при сохранении сотрудника')
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Удалить сотрудника?')) return
        try {
            await deleteEmployee(id)
            fetchData()
        } catch {
            alert('Ошибка при удалении сотрудника')
        }
    }

    return (
        <div className="container py-4">
            {/* Заголовок + кнопка */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Сотрудники</h2>
                <button className="btn btn-primary" onClick={openCreateModal}>
                    Добавить сотрудника
                </button>
            </div>

            {/* Поиск */}
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    placeholder="Поиск по имени, должности, email..."
                />
            </div>

            {/* Таблица */}
            <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Фамилия</th>
                        <th>Должность</th>
                        <th>Email</th>
                        <th>Телефон</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {employees.map((emp) => (
                        <tr key={emp.employee_id}>
                            <td>{emp.employee_id}</td>
                            <td>{emp.first_name}</td>
                            <td>{emp.last_name}</td>
                            <td>{emp.position}</td>
                            <td>{emp.email}</td>
                            <td>{emp.phone}</td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => openEditModal(emp)}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(emp.employee_id)}
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
                <span className="fw-medium">Страница {page}</span>
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={employees.length < limit}
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
                                    {editingEmployeeId ? 'Редактирование' : 'Новый сотрудник'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setIsModalOpen(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {(['first_name', 'last_name', 'position', 'email', 'phone'] as const).map((field) => (
                                    <div className="mb-3" key={field}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData[field]}
                                            onChange={(e) =>
                                                setFormData({...formData, [field]: e.target.value})
                                            }
                                            placeholder={
                                                field === 'first_name'
                                                    ? 'Имя'
                                                    : field === 'last_name'
                                                        ? 'Фамилия'
                                                        : field === 'position'
                                                            ? 'Должность'
                                                            : field === 'email'
                                                                ? 'Email'
                                                                : 'Телефон'
                                            }
                                        />
                                    </div>
                                ))}
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

export default EmployeesPage
