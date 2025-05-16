import {Outlet} from 'react-router-dom'
import Navbar from '@/components/Navbar'

const CashierPage = () => {
    return (
        <>
            <Navbar/>
            <Outlet/>
        </>
    )
}

export default CashierPage
