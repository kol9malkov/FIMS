import api from './api'

const API_URL = '/admin/categories'

export interface Category {
    category_id: number
    name: string
}

export const getCategories = async (
    search: string,
    page: number,
    limit: number
): Promise<Category[]> => {
    const skip = (page - 1) * limit

    const response = await api.get<Category[]>(API_URL, {
        params: {search, skip, limit},
    })

    return response.data // ✅ теперь тип известен, ошибки не будет
}

export const createCategory = async (
    name: string
): Promise<void> => {
    await api.post(`${API_URL}/create`, {name})
}

export const updateCategory = async (
    category_id: number,
    name: string
): Promise<void> => {
    await api.put(`${API_URL}/${category_id}`, {name})
}

export const deleteCategory = async (
    category_id: number
): Promise<void> => {
    await api.delete(`${API_URL}/${category_id}`)
}
