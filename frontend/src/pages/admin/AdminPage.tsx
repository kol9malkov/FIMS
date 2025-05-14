import Navbar from '../../components/Navbar'
import { Outlet } from 'react-router-dom'

const AdminPage = () => {
  return (
    <div>
      <Navbar />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminPage
