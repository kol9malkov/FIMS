// src/pages/store/SelectStorePage.tsx
import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {getStores, type Store} from '@/api/stores'
import {useAuth} from '@/contexts/AuthContext'

const SelectStorePage = () => {
    const [stores, setStores] = useState<Store[]>([])
    const [selectedStore, setSelectedStore] = useState('')
    const navigate = useNavigate()
    const {setStoreId} = useAuth()

    useEffect(() => {
        getStores('', 1, 100)
            .then(setStores)
            .catch(() => {
                alert('Ошибка при загрузке магазинов')
            })
    }, [])

    const handleSelect = (store: Store) => {
        setStoreId(store.store_id.toString())
        localStorage.setItem('store_name', store.address) // 👈 добавь это
        navigate('/store')
    }

    const handleSubmit = () => {
        if (!selectedStore) {
            alert('Выберите магазин')
            return
        }

        const store = stores.find(s => s.store_id.toString() === selectedStore)
        if (store) {
            localStorage.setItem('store_name', store.address)
        }

        setStoreId(selectedStore)
        navigate('/store')
    }


    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-6 rounded shadow w-full max-w-md">
                <h1 className="text-xl font-bold mb-4 text-center">Выберите магазин</h1>
                <select
                    className="w-full border p-2 rounded mb-4"
                    value={selectedStore}
                    onChange={(e) => setSelectedStore(e.target.value)}
                >
                    <option value="">-- Выберите магазин --</option>
                    {stores.map((store) => (
                        <option key={store.store_id} value={store.store_id}>
                            {store.address}
                        </option>
                    ))}
                </select>
                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Начать смену
                </button>
            </div>
        </div>
    )
}

export default SelectStorePage
