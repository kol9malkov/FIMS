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

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([])
    const [roles, setRoles] = useState<RoleOption[]>([])

    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [limit] = useState(10)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingUserId, setEditingUserId] = useState<number | null>(null)

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role_id: '',
    })

    const token = localStorage.getItem('access_token') || ''

    const fetchData = async () => {
        try {
            const users = await getUsers(token, search, page, limit)
            const roles = await getRoles(token)
            setUsers(users)
            setRoles(roles)
        } catch {
            alert('Ошибка при загрузке данных')
        }
    }

    useEffect(() => {
        fetchData()
    }, [search, page])

    const openCreateModal = () => {
        setEditingUserId(null)
        setFormData({username: '', password: '', role_id: ''})
        setIsModalOpen(true)
    }

    const openEditModal = (user: User) => {
        const role = roles.find(r => r.role_name === user.role_name)
        setEditingUserId(user.user_id)
        setFormData({
            username: user.username,
            password: '',
            role_id: role ? String(role.role_id) : '',
        })
        setIsModalOpen(true)
    }

    const handleSubmit = async () => {
        try {
            if (editingUserId) {
                await updateUser(token, editingUserId, {
                    username: formData.username,
                    password: formData.password || undefined,
                    role_id: Number(formData.role_id),
                })
            } else {
                await createUser(token, {
                    username: formData.username,
                    password: formData.password,
                    role_id: Number(formData.role_id),
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
            await deleteUser(token, id)
            fetchData()
        } catch {
            alert('Ошибка при удалении пользователя')
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Пользователи</h2>
                <button
                    onClick={openCreateModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Добавить пользователя
                </button>
            </div>

            <input
                type="text"
                value={search}
                onChange={e => {
                    setSearch(e.target.value)
                    setPage(1)
                }}
                placeholder="Поиск по логину или роли..."
                className="border px-3 py-2 rounded w-full max-w-md mb-4"
            />

            <table className="w-full border text-sm mb-4">
                <thead className="bg-blue-100">
                <tr>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Логин</th>
                    <th className="border p-2">Роль</th>
                    <th className="border p-2">Действия</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.user_id} className="hover:bg-blue-50">
                        <td className="border p-2">{user.user_id}</td>
                        <td className="border p-2">{user.username}</td>
                        <td className="border p-2">{user.role_name}</td>
                        <td className="border p-2">
                            <button
                                onClick={() => openEditModal(user)}
                                className="text-blue-600 hover:underline mr-2"
                            >
                                Редактировать
                            </button>
                            <button
                                onClick={() => handleDelete(user.user_id)}
                                className="text-red-600 hover:underline"
                            >
                                Удалить
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="flex justify-between">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    disabled={page === 1}
                >
                    ← Назад
                </button>
                <span className="text-sm text-gray-600">Страница {page}</span>
                <button
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    disabled={users.length < limit}
                >
                    Вперёд →
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingUserId ? 'Редактирование пользователя' : 'Новый пользователь'}
                        </h3>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={e => setFormData({...formData, username: e.target.value})}
                            placeholder="Имя пользователя"
                            className="border p-2 rounded w-full mb-3"
                        />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                            placeholder="Пароль"
                            className="border p-2 rounded w-full mb-3"
                        />
                        <select
                            name="role_id"
                            value={formData.role_id}
                            onChange={e => setFormData({...formData, role_id: e.target.value})}
                            className="border p-2 rounded w-full mb-4"
                        >
                            <option value="">Выберите роль</option>
                            {roles.map(role => (
                                <option key={role.role_id} value={role.role_id}>
                                    {role.role_name}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UsersPage
