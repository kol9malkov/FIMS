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
        localStorage.setItem('store_name', store.address)
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
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light px-3">
            <div className="bg-white shadow-sm rounded p-4 w-100" style={{maxWidth: '420px'}}>
                <h2 className="text-center fw-bold mb-4 fs-4">Выберите магазин</h2>

                <select
                    className="form-select mb-4"
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
                    className="btn btn-primary w-100"
                    disabled={!selectedStore}
                >
                    Начать смену
                </button>
            </div>
        </div>
    )
}

export default SelectStorePage
