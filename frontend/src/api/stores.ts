import api from './api'

const API_URL = '/admin/stores'

export interface Store {
    store_id: number
    address: string
}

export const getStores = async (
    search: string,
    page: number,
    limit: number
): Promise<Store[]> => {
    const skip = (page - 1) * limit
    const response = await api.get(API_URL, {
        params: {search, skip, limit}
    })
    return response.data
}

export const createStore = async (
    address: string
): Promise<void> => {
    await api.post(`${API_URL}/create`, {address})
}

export const updateStore = async (
    store_id: number,
    address: string
): Promise<void> => {
    await api.put(`${API_URL}/${store_id}`, {address})
}

export const deleteStore = async (
    store_id: number
): Promise<void> => {
    await api.delete(`${API_URL}/${store_id}`)
}
