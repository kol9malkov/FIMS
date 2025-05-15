import api from './api'

const BASE_URL = "/admin"

export interface AnalyticsFilters {
    store_id?: number
    start_date?: string
    end_date?: string
}

//
// ----- ПОСТАВКИ -----
//

export interface StoreSupplyAnalytics {
    store_id: number
    store_address: string
    count: number
    total_items: number
    total_cost: number
}

export interface SupplyAnalyticsResponse {
    total_supplies: number
    total_items: number
    total_cost: number
    supplies_per_store: StoreSupplyAnalytics[]
}

export const getSupplyAnalytics = async (
    filters: AnalyticsFilters
): Promise<SupplyAnalyticsResponse> => {
    const response = await api.get<SupplyAnalyticsResponse>(`${BASE_URL}/analytics/supplies`, {
        params: filters,
    })
    return response.data
}

//
// ----- ПРОДАЖИ -----
//

export interface StoreSalesAnalytics {
    store_id: number
    store_address: string
    count: number
    total_amount: number
}

export interface TopProduct {
    product_id: number
    name: string
    total_sold: number
}

export interface PaymentStats {
    method_name: string
    total_amount: number
}

export interface SalesAnalyticsResponse {
    total_sales: number
    total_amount: number
    average_check: number
    sales_per_store: StoreSalesAnalytics[]
    top_product?: TopProduct
    payments_stats?: PaymentStats[]
}

export const getSalesAnalytics = async (
    filters: AnalyticsFilters
): Promise<SalesAnalyticsResponse> => {
    const response = await api.get<SalesAnalyticsResponse>(`${BASE_URL}/analytics/sales`, {
        params: filters,
    })
    return response.data
}