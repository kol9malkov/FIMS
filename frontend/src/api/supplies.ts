import api from './api'

const API_URL = '/store/supplies'

// 💡 Строго типизированный массив статусов
export const STATUSES = [
    'Ожидается',
    'Доставлено',
    'Принято частично',
    'Принято',
    'Закрыто',
] as const

// 💡 Тип автоматически выводится из массива
export type SupplyStatus = (typeof STATUSES)[number]

export interface SupplyItem {
    supply_item_id: number
    product_id: number
    product_name: string
    quantity: number
    received_quantity: number
    is_received: boolean
}

export interface Supply {
    supply_id: number
    store_id: number
    store_name: string
    supply_date: string
    supplier_name: string
    status: SupplyStatus
    supply_items: SupplyItem[]
}

export interface SupplyItemInput {
    product_id: number
    quantity: number
    price: number
}

export interface CreateSupplyPayload {
    store_id: number
    supplier_name: string
    supply_date: string
    supply_items: SupplyItemInput[]
}

// 👇 Тип для PATCH позиции
export interface SupplyItemUpdate {
    received_quantity: number
    is_received: boolean
}

export const getSupplies = async (
    search: string,
    page: number,
    limit: number,
    storeId?: string,
    status?: string
): Promise<Supply[]> => {
    const skip = (page - 1) * limit

    const params: Record<string, string> = {
        search,
        skip: skip.toString(),
        limit: limit.toString(),
    }

    if (status) {
        params.status = status
    }

    const headers: Record<string, string> = {}
    if (storeId) {
        headers['X-Store-ID'] = storeId
    }

    const response = await api.get<Supply[]>(API_URL, {
        params,
        headers,
    })

    return response.data
}

export const createSupply = async (
    payload: CreateSupplyPayload,
    storeId?: string
): Promise<void> => {
    const headers: Record<string, string> = {}
    if (storeId) {
        headers['X-Store-ID'] = storeId
    }

    await api.post(`${API_URL}/create`, payload, {headers})
}


// Получить одну поставку по ID
export const getSupplyById = async (
    supplyId: number,
    storeId?: string
): Promise<Supply> => {
    const headers: Record<string, string> = {}
    if (storeId) {
        headers['X-Store-ID'] = storeId
    }

    const response = await api.get<Supply>(`${API_URL}/id/${supplyId}`, {
        headers,
    })

    return response.data
}

// Принять поставку (установить статус "Доставлено")
export const deliverSupply = async (
    supplyId: number,
    storeId?: string
): Promise<Supply> => {
    const headers: Record<string, string> = {}
    if (storeId) {
        headers['X-Store-ID'] = storeId
    }

    const response = await api.post<Supply>(`${API_URL}/${supplyId}/deliver`, null, {
        headers,
    })

    return response.data
}

// Обновить одну позицию поставки
export const updateSupplyItem = async (
    supplyId: number,
    itemId: number,
    data: SupplyItemUpdate,
    storeId?: string
): Promise<SupplyItem> => {
    const headers: Record<string, string> = {}
    if (storeId) {
        headers['X-Store-ID'] = storeId
    }

    const response = await api.patch<SupplyItem>(
        `/store/supplies/${supplyId}/${itemId}`,
        data,
        {headers}
    )
    return response.data
}

// Закрыть поставку
export const closeSupply = async (
    supplyId: number,
    storeId?: string
): Promise<Supply> => {
    const headers: Record<string, string> = {}
    if (storeId) {
        headers['X-Store-ID'] = storeId
    }

    const response = await api.post<Supply>(`${API_URL}/${supplyId}/close`, null, {
        headers,
    })

    return response.data
}