import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {getStores, type Store} from '@/api/stores'
import {useAuth} from '@/contexts/AuthContext'

const SelectCashierStorePage = () => {
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
        navigate('/cashier')
    }

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light px-3">
            <div className="bg-white shadow-lg rounded p-5 w-100" style={{maxWidth: '450px'}}>
                <div className="text-center mb-4">
                    <h1 className="fw-bold fs-3 text-primary">FIMS</h1>
                    <p className="text-muted">Перед началом смены выберите магазин</p>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-semibold">Магазин</label>
                    <select
                        className="form-select"
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
                </div>

                <button
                    onClick={handleSubmit}
                    className="btn btn-primary w-100 mt-3"
                    disabled={!selectedStore}
                >
                    🚀 Начать смену
                </button>
            </div>
        </div>
    )
}

export default SelectCashierStorePage
