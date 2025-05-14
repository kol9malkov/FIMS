import api from './api'

const API_URL = '/admin/users'

export interface User {
    user_id: number
    username: string
    role_name: string
}

export interface RoleOption {
    role_id: number
    role_name: string
}

export interface CreateUserPayload {
    username: string
    password: string
    role_id: number
}

export interface UpdateUserPayload {
    username?: string
    password?: string
    role_id?: number
}

export const getUsers = async (
    search: string,
    page: number,
    limit: number
): Promise<User[]> => {
    const skip = (page - 1) * limit
    const response = await api.get(API_URL, {
        params: {search, skip, limit}
    })
    return response.data
}

export const getRoles = async (): Promise<RoleOption[]> => {
    const response = await api.get('/admin/roles')
    return response.data
}

export const createUser = async (
    payload: CreateUserPayload
): Promise<void> => {
    await api.post(`${API_URL}/create`, payload)
}

export const updateUser = async (
    user_id: number,
    payload: UpdateUserPayload
): Promise<void> => {
    await api.put(`${API_URL}/${user_id}`, payload)
}

export const deleteUser = async (
    user_id: number
): Promise<void> => {
    await api.delete(`${API_URL}/${user_id}`)
}
