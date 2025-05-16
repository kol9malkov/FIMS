import {Navigate, Outlet, useLocation} from 'react-router-dom'
import {useAuth} from '@/contexts/AuthContext'

const RequireStore = () => {
    const {storeId} = useAuth()
    const location = useLocation()

    const isCashier = location.pathname.startsWith('/cashier')
    const redirectTo = isCashier ? '/cashier/select' : '/store/select'

    return storeId ? <Outlet/> : <Navigate to={redirectTo} replace/>
}

export default RequireStore
