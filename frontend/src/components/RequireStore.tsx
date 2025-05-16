import {Navigate, Outlet} from 'react-router-dom'
import {useAuth} from '@/contexts/AuthContext'

const RequireStore = () => {
    const {storeId} = useAuth()

    return storeId ? <Outlet/> : <Navigate to="/store/select" replace/>
}

export default RequireStore
