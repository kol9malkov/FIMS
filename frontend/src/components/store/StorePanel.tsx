import {Outlet} from 'react-router-dom'
import Navbar from '@/components/Navbar'

const StorePage = () => (
    <div>
        <Navbar/>
        <main className="p-4">
            <Outlet/>
        </main>
    </div>
)

export default StorePage
