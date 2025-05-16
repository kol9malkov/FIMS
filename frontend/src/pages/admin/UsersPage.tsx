import {useEffect, useState} from 'react'
import {
    getUsers,
    getRoles,
    createUser,
    updateUser,
    deleteUser,
    type User,
    type RoleOption,
} from '@/api/users'
import {getEmployees, type Employee} from '@/api/employees'

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([])
    const [roles, setRoles] = useState<RoleOption[]>([])
    const [employees, setEmployees] = useState<Employee[]>([])

    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [limit] = useState(10)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingUserId, setEditingUserId] = useState<number | null>(null)

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role_id: '',
        employee_id: '',
    })

    const fetchData = async () => {
        try {
            const [users, roles, allEmployees] = await Promise.all([
                getUsers(search, page, limit),
                getRoles(),
                getEmployees('', 1, 1000),
            ])
            setUsers(users)
            setRoles(roles)

            const usedEmployeeIds = new Set(users.map(u => u.user_id))
            const available = allEmployees.filter(e => !usedEmployeeIds.has(e.employee_id))
            setEmployees(available)
        } catch {
            alert('Ошибка при загрузке данных')
        }
    }

    useEffect(() => {
        fetchData()
    }, [search, page])

    const openCreateModal = () => {
        setEditingUserId(null)
        setFormData({username: '', password: '', role_id: '', employee_id: ''})
        setIsModalOpen(true)
    }

    const openEditModal = (user: User) => {
        const role = roles.find(r => r.role_name === user.role_name)
        setEditingUserId(user.user_id)
        setFormData({
            username: user.username,
            password: '',
            role_id: role ? String(role.role_id) : '',
            employee_id: '',
        })
        setIsModalOpen(true)
    }

    const handleSubmit = async () => {
        try {
            if (editingUserId) {
                await updateUser(editingUserId, {
                    username: formData.username,
                    password: formData.password || undefined,
                    role_id: Number(formData.role_id),
                })
            } else {
                await createUser({
                    username: formData.username,
                    password: formData.password,
                    role_id: Number(formData.role_id),
                    employee_id: Number(formData.employee_id),
                })
            }

            setIsModalOpen(false)
            fetchData()
        } catch {
            alert('Ошибка при сохранении пользователя')
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Удалить пользователя?')) return
        try {
            await deleteUser(id)
            fetchData()
        } catch {
            alert('Ошибка при удалении пользователя')
        }
    }

    return (
        <div className="container py-4">
            {/* Заголовок и кнопка */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Пользователи</h2>
                <button className="btn btn-primary" onClick={openCreateModal}>
                    Добавить пользователя
                </button>
            </div>

            {/* Поиск */}
            <div className="mb-3">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    placeholder="Поиск по логину или роли..."
                    className="form-control"
                />
            </div>

            {/* Таблица */}
            <div className="table-responsive">
                <table className="table table-bordered table-hover text-sm">
                    <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Логин</th>
                        <th>Роль</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.user_id}>
                            <td>{user.user_id}</td>
                            <td>{user.username}</td>
                            <td>{user.role_name}</td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => openEditModal(user)}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(user.user_id)}
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
                <span className="text-muted">Страница {page}</span>
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={users.length < limit}
                >
                    Вперёд →
                </button>
            </div>

            {/* Модальное окно */}
            {isModalOpen && (
                <div className="modal d-block" tabIndex={-1}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingUserId ? 'Редактирование пользователя' : 'Новый пользователь'}
                                </h5>
                                <button type="button" className="btn-close"
                                        onClick={() => setIsModalOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={(e) =>
                                        setFormData({...formData, username: e.target.value})
                                    }
                                    placeholder="Имя пользователя"
                                    className="form-control mb-3"
                                />

                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({...formData, password: e.target.value})
                                    }
                                    placeholder="Пароль"
                                    className="form-control mb-3"
                                />

                                <select
                                    name="role_id"
                                    value={formData.role_id}
                                    onChange={(e) =>
                                        setFormData({...formData, role_id: e.target.value})
                                    }
                                    className="form-select mb-3"
                                >
                                    <option value="">Выберите роль</option>
                                    {roles.map((role) => (
                                        <option key={role.role_id} value={role.role_id}>
                                            {role.role_name}
                                        </option>
                                    ))}
                                </select>

                                {!editingUserId && (
                                    <select
                                        name="employee_id"
                                        value={formData.employee_id}
                                        onChange={(e) =>
                                            setFormData({...formData, employee_id: e.target.value})
                                        }
                                        className="form-select mb-3"
                                    >
                                        <option value="">Выберите сотрудника</option>
                                        {employees.map((emp) => (
                                            <option key={emp.employee_id} value={emp.employee_id}>
                                                {emp.first_name} {emp.last_name} — {emp.position}
                                            </option>
                                        ))}
                                    </select>
                                )}
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

export default UsersPage
