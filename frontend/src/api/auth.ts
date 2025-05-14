import api from './api'

export interface LoginResponse {
    username: string
    role: string
    access_token: string
    token_type: string
}

export const login = async (
    username: string,
    password: string
): Promise<LoginResponse> => {
    const params = new URLSearchParams()
    params.append('username', username)
    params.append('password', password)

    const response = await api.post('/login', params, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    })

    return response.data
}
