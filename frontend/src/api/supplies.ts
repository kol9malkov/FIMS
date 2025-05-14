import api from './api'

const API_URL = '/store/supplies'

export type SupplyStatus =
    | 'Ожидается'
    | 'Доставлено'
    | 'Принято частично'
    | 'Принято'
    | 'Закрыто'

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
}

export interface CreateSupplyPayload {
    store_id: number
    supplier_name: string
    supply_date: string
    supply_items: SupplyItemInput[]
}

export const getSupplies = async (
    search: string,
    page: number,
    limit: number,
    storeId?: string
): Promise<Supply[]> => {
    const skip = (page - 1) * limit

    const response = await api.get<Supply[]>(API_URL, {
        params: {search, skip, limit},
        headers: storeId ? {'X-Store-ID': storeId} : {},
    })

    return response.data
}

export const createSupply = async (
    payload: CreateSupplyPayload,
    storeId?: string
): Promise<void> => {
    await api.post(`${API_URL}/create`, payload, {
        headers: storeId ? {'X-Store-ID': storeId} : {},
    })
}
