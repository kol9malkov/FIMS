import api from './api'

export interface SaleItemInput {
    product_id: number
    quantity: number
    price: number
}

// Внутреннее состояние кассы (доп. поле product_name)
export interface ScannedItem extends SaleItemInput {
    product_name: string
}

export interface PaymentInput {
    payment_method_id: number
    amount: number
}

export interface SaleCreate {
    sale_items: SaleItemInput[]
    payments: PaymentInput[]
}

export const createSale = async (payload: SaleCreate, storeId: string): Promise<void> => {
    const headers: Record<string, string> = {
        'X-Store-ID': storeId
    }
    await api.post('/store/sales/create', payload, {headers})
}

// --- Summary API ---
export interface SaleSummary {
    sale_id: number
    datetime: string
    amount: number
    payment_method: string
}

export interface SummaryResponse {
    date: string
    total_cash: number
    total_card: number
    sales: SaleSummary[]
}

export const getSaleSummary = async (storeId: string, date: string): Promise<SummaryResponse> => {
    const headers: Record<string, string> = {
        'X-Store-ID': storeId
    }
    const response = await api.get<SummaryResponse>(`/store/sales/summary?date=${date}`, {headers})
    return response.data
}

// --- Sales List API ---
export interface SaleItem {
    sale_id: number
    sale_datetime: string
    total_amount: number
    status: string
}

export const getSales = async (storeId: string): Promise<SaleItem[]> => {
    const headers: Record<string, string> = {
        'X-Store-ID': storeId
    }
    const response = await api.get<SaleItem[]>('/store/sales', {headers})
    return response.data
}

// --- Sale Details API ---
export interface SaleItemResponse {
    product_id: number
    product_name: string
    quantity: number
    price: number
}

export interface PaymentResponse {
    payment_id: number
    payment_method: string
    amount: number
}

export interface SaleResponse {
    sale_id: number
    sale_datetime: string
    total_amount: number
    status: string
    sale_items: SaleItemResponse[]
    payments: PaymentResponse[]
}

export const getSaleById = async (saleId: number, storeId: string): Promise<SaleResponse> => {
    const headers: Record<string, string> = {
        'X-Store-ID': storeId
    }
    const response = await api.get<SaleResponse>(`/store/sales/${saleId}`, {headers})
    return response.data
}
