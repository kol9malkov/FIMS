import api from './api'

const API_URL = '/admin/payments'

export interface PaymentMethod {
    payment_method_id: number
    method_name: string
}

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
    const response = await api.get<PaymentMethod[]>(API_URL)
    return response.data
}

export const createPaymentMethod = async (name: string): Promise<void> => {
    await api.post(`${API_URL}/create`, {method_name: name})
}

export const updatePaymentMethod = async (
    id: number,
    name: string
): Promise<void> => {
    await api.put(`${API_URL}/${id}`, {name})
}

export const deletePaymentMethod = async (id: number): Promise<void> => {
    await api.delete(`${API_URL}/${id}`)
}
