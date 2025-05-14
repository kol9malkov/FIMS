export const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('username')
    localStorage.removeItem('role')
    localStorage.removeItem('store_id')
    window.location.href = '/login'
}
