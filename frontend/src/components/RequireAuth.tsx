import {Navigate, Outlet} from 'react-router-dom'
import {useAuth} from '@/contexts/AuthContext'

const RequireAuth = () => {
    const {isAuthenticated} = useAuth()
    return isAuthenticated ? <Outlet/> : <Navigate to="/login" replace/>
}

export default RequireAuth
