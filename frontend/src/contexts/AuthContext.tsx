import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react'
import {login as loginApi, type LoginResponse} from '@/api/auth'
import {useNavigate} from 'react-router-dom'

interface AuthContextType {
    isAuthenticated: boolean
    username: string
    role: string
    login: (username: string, password: string) => Promise<void>
    logout: () => void
    loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [username, setUsername] = useState('')
    const [role, setRole] = useState('')
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('access_token')
        const savedUsername = localStorage.getItem('username')
        const savedRole = localStorage.getItem('role')

        if (token && savedUsername && savedRole) {
            setIsAuthenticated(true)
            setUsername(savedUsername)
            setRole(savedRole)
        }

        setLoading(false)
    }, [])

    const login = async (username: string, password: string) => {
        const data: LoginResponse = await loginApi(username, password)
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('username', data.username)
        localStorage.setItem('role', data.role)

        setIsAuthenticated(true)
        setUsername(data.username)
        setRole(data.role)

        if (data.role === 'Администратор') navigate('/admin')
        else if (data.role === 'Склад') navigate('/store')
        else if (data.role === 'Кассир') navigate('/cashier')
        else navigate('/login')
    }

    const logout = () => {
        localStorage.clear()
        setIsAuthenticated(false)
        setUsername('')
        setRole('')
        navigate('/login')
    }

    return (
        <AuthContext.Provider
            value={{isAuthenticated, username, role, login, logout, loading}}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context)
        throw new Error('useAuth must be used within an AuthProvider')
    return context
}
