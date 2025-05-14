import api from './api'

const API_URL = '/admin/products'

export interface Product {
    product_id: number
    name: string
    description?: string
    price: number
    barcode: string
    category_id: number
    category_name: string
}

export interface ProductPayload {
    name: string
    description?: string
    price: number
    barcode: string
    category_id: number
}

export const getProducts = async (
    search: string,
    page: number,
    limit: number
): Promise<Product[]> => {
    const skip = (page - 1) * limit
    const response = await api.get(API_URL, {
        params: {search, skip, limit}
    })
    return response.data
}

export const createProduct = async (
    payload: ProductPayload
): Promise<void> => {
    await api.post(`${API_URL}/create`, payload)
}

export const updateProduct = async (
    product_id: number,
    payload: ProductPayload
): Promise<void> => {
    await api.put(`${API_URL}/${product_id}`, payload)
}

export const deleteProduct = async (
    product_id: number
): Promise<void> => {
    await api.delete(`${API_URL}/${product_id}`)
}
