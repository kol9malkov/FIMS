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
    limit: number
): Promise<Stock[]> => {
    const skip = (page - 1) * limit

    const response = await api.get('/store/stocks', {
        params: {search, skip, limit}
    })

    return response.data
}
