import {useEffect, useState} from 'react'
import {
    getRoles,
    createRole,
    updateRole,
    deleteRole,
    type Role,
} from '@/api/roles'

const RolesPage = () => {
    const [roles, setRoles] = useState<Role[]>([])
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [limit] = useState(10)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingRole, setEditingRole] = useState<Role | null>(null)
    const [roleName, setRoleName] = useState('')


    const fetchRoles = async () => {
        try {
            const data = await getRoles(search, page, limit)
            setRoles(data)
        } catch {
            alert('Ошибка загрузки ролей')
        }
    }

    useEffect(() => {
        fetchRoles()
    }, [search, page])

    const openCreateModal = () => {
        setEditingRole(null)
        setRoleName('')
        setIsModalOpen(true)
    }

    const openEditModal = (role: Role) => {
        setEditingRole(role)
        setRoleName(role.role_name)
        setIsModalOpen(true)
    }

    const handleSubmit = async () => {
        try {
            if (editingRole) {
                await updateRole(editingRole.role_id, roleName)
            } else {
                await createRole(roleName)
            }
            setIsModalOpen(false)
            await fetchRoles()
        } catch {
            alert('Ошибка при сохранении роли')
        }
    }

    const handleDelete = async (role_id: number) => {
        if (!confirm('Удалить роль?')) return
        try {
            await deleteRole(role_id)
            await fetchRoles()
        } catch {
            alert('Ошибка при удалении роли')
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Роли</h2>
                <button
                    onClick={openCreateModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Добавить роль
                </button>
            </div>

            <input
                type="text"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                }}
                placeholder="Поиск по названию..."
                className="border px-3 py-2 rounded w-full max-w-md mb-4"
            />

            <table className="w-full border text-sm mb-4">
                <thead className="bg-blue-100">
                <tr>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Название</th>
                    <th className="border p-2">Действия</th>
                </tr>
                </thead>
                <tbody>
                {roles.map((role) => (
                    <tr key={role.role_id} className="hover:bg-blue-50">
                        <td className="border p-2">{role.role_id}</td>
                        <td className="border p-2">{role.role_name}</td>
                        <td className="border p-2">
                            <button
                                onClick={() => openEditModal(role)}
                                className="text-blue-600 hover:underline mr-2"
                            >
                                Редактировать
                            </button>
                            <button
                                onClick={() => handleDelete(role.role_id)}
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
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    disabled={page === 1}
                >
                    ← Назад
                </button>
                <span className="text-sm text-gray-600">Страница {page}</span>
                <button
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    disabled={roles.length < limit}
                >
                    Вперёд →
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingRole ? 'Редактирование роли' : 'Новая роль'}
                        </h3>
                        <input
                            type="text"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            placeholder="Название роли"
                            className="border p-2 rounded w-full mb-4"
                        />
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

export default RolesPage
