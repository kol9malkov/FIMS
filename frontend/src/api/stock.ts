import api from './api'

export interface Stock {
    stock_id: number
    product_id: number
    product_name: string
    store_id: number
    stock_address: string
    quantity: number
    updated_datetime: string
}

export const getStocks = async (
    search: string,
    page: number,
    limit: number,
    storeId?: string
): Promise<Stock[]> => {
    const skip = (page - 1) * limit

    const params = {
        search,
        skip: skip.toString(),
        limit: limit.toString(),
    }

    const headers: Record<string, string> = {}
    if (storeId) {
        headers['X-Store-ID'] = storeId
    }

    const response = await api.get<Stock[]>('/store/stocks', {
        params,
        headers,
    })

    return response.data
}
