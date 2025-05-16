import { Outlet } from 'react-router-dom'
import Navbar from '@/components/Navbar'

const StorePage = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      {/* Верхняя панель */}
      <Navbar />

      {/* Основной контент */}
      <main className="container py-4 flex-grow-1">
        <Outlet />
      </main>
    </div>
  )
}

export default StorePage
