import api from './api'

const API_URL = '/admin/roles'

export interface Role {
    role_id: number
    role_name: string
}

export const getRoles = async (
    search: string,
    page: number,
    limit: number
): Promise<Role[]> => {
    const skip = (page - 1) * limit
    const response = await api.get<Role[]>(API_URL, {
        params: {search, skip, limit},
    })
    return response.data
}

export const createRole = async (
    role_name: string
): Promise<void> => {
    await api.post(`${API_URL}/create`, {role_name})
}

export const updateRole = async (
    role_id: number,
    role_name: string
): Promise<void> => {
    await api.put(`${API_URL}/${role_id}`, {role_name})
}

export const deleteRole = async (
    role_id: number
): Promise<void> => {
    await api.delete(`${API_URL}/${role_id}`)
}
