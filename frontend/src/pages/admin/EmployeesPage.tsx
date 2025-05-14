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

    const token = localStorage.getItem('access_token') || ''

    const fetchData = async () => {
        try {
            const data = await getEmployees(token, search, page, limit)
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
                await updateEmployee(token, editingEmployeeId, formData)
            } else {
                await createEmployee(token, formData)
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
            await deleteEmployee(token, id)
            fetchData()
        } catch {
            alert('Ошибка при удалении сотрудника')
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Сотрудники</h2>
                <button
                    onClick={openCreateModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Добавить сотрудника
                </button>
            </div>

            <input
                type="text"
                value={search}
                onChange={e => {
                    setSearch(e.target.value)
                    setPage(1)
                }}
                placeholder="Поиск по имени, должности, email..."
                className="border px-3 py-2 rounded w-full max-w-md mb-4"
            />

            <table className="w-full border text-sm mb-4">
                <thead className="bg-blue-100">
                <tr>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Имя</th>
                    <th className="border p-2">Фамилия</th>
                    <th className="border p-2">Должность</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Телефон</th>
                    <th className="border p-2">Действия</th>
                </tr>
                </thead>
                <tbody>
                {employees.map(emp => (
                    <tr key={emp.employee_id} className="hover:bg-blue-50">
                        <td className="border p-2">{emp.employee_id}</td>
                        <td className="border p-2">{emp.first_name}</td>
                        <td className="border p-2">{emp.last_name}</td>
                        <td className="border p-2">{emp.position}</td>
                        <td className="border p-2">{emp.email}</td>
                        <td className="border p-2">{emp.phone}</td>
                        <td className="border p-2">
                            <button onClick={() => openEditModal(emp)}
                                    className="text-blue-600 hover:underline mr-2">Редактировать
                            </button>
                            <button onClick={() => handleDelete(emp.employee_id)}
                                    className="text-red-600 hover:underline">Удалить
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="flex justify-between">
                <button onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" disabled={page === 1}>
                    ← Назад
                </button>
                <span className="text-sm text-gray-600">Страница {page}</span>
                <button onClick={() => setPage(p => p + 1)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={employees.length < limit}>
                    Вперёд →
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">{editingEmployeeId ? 'Редактирование' : 'Новый сотрудник'}</h3>
                        {(['first_name', 'last_name', 'position', 'email', 'phone'] as const).map(field => (
                            <input
                                key={field}
                                type="text"
                                value={formData[field]}
                                onChange={e => setFormData({...formData, [field]: e.target.value})}
                                placeholder={field === 'first_name' ? 'Имя' :
                                    field === 'last_name' ? 'Фамилия' :
                                        field === 'position' ? 'Должность' :
                                            field === 'email' ? 'Email' : 'Телефон'}
                                className="border p-2 rounded w-full mb-3"
                            />
                        ))}
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Отмена
                            </button>
                            <button onClick={handleSubmit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EmployeesPage
