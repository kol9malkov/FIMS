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
        <div className="container py-4">
            {/* Заголовок + кнопка */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Роли</h2>
                <button className="btn btn-primary" onClick={openCreateModal}>
                    Добавить роль
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
                    placeholder="Поиск по названию..."
                    className="form-control"
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
                    {roles.map((role) => (
                        <tr key={role.role_id}>
                            <td>{role.role_id}</td>
                            <td>{role.role_name}</td>
                            <td>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => openEditModal(role)}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(role.role_id)}
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
                    disabled={roles.length < limit}
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
                                    {editingRole ? 'Редактирование роли' : 'Новая роль'}
                                </h5>
                                <button type="button" className="btn-close"
                                        onClick={() => setIsModalOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    value={roleName}
                                    onChange={(e) => setRoleName(e.target.value)}
                                    placeholder="Название роли"
                                    className="form-control"
                                />
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

export default RolesPage
