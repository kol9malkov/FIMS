import api from './api'

const API_URL = '/admin/employees'

export interface Employee {
    employee_id: number
    first_name: string
    last_name: string
    position: string
    email: string
    phone: string
}

export interface EmployeeCreateUpdate {
    first_name: string
    last_name: string
    position: string
    email: string
    phone: string
}

export const getEmployees = async (
    search: string,
    page: number,
    limit: number
): Promise<Employee[]> => {
    const skip = (page - 1) * limit
    const response = await api.get(API_URL, {
        params: {search, skip, limit}
    })
    return response.data
}

export const createEmployee = async (
    data: EmployeeCreateUpdate
): Promise<void> => {
    await api.post(`${API_URL}/create`, data)
}

export const updateEmployee = async (
    employee_id: number,
    data: EmployeeCreateUpdate
): Promise<void> => {
    await api.put(`${API_URL}/${employee_id}`, data)
}

export const deleteEmployee = async (
    employee_id: number
): Promise<void> => {
    await api.delete(`${API_URL}/${employee_id}`)
}
