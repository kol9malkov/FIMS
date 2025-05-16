import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {getSupplies, Supply} from '@/api/supplies'
import {getStocks, Stock} from '@/api/stock'
import {PackageCheck, AlertTriangle} from 'lucide-react'
import {toast} from 'react-toastify'
import {useAuth} from '@/contexts/AuthContext'

const StoreDashboardPage = () => {
    const [supplies, setSupplies] = useState<Supply[]>([])
    const [lowStocks, setLowStocks] = useState<Stock[]>([])
    const {storeId} = useAuth()

    useEffect(() => {
        if (storeId) {
            fetchData(storeId)
        }
    }, [storeId])

    const fetchData = async (storeId: string) => {
        try {
            const [supplies, stocks] = await Promise.all([
                getSupplies('', 1, 5, storeId ?? undefined),
                getStocks('', 1, 5, storeId ?? undefined)

            ])
            setSupplies(supplies)
            const critical = stocks.filter((s: Stock) => s.quantity <= 3)
            setLowStocks(critical)
            if (critical.length > 0) {
                toast.warn(`⚠️ Обнаружено ${critical.length} критических остатков!`)
            }
        } catch (err) {
            toast.error('Ошибка при загрузке данных')
            console.error('Ошибка при загрузке данных:', err)
        }
    }

    return (
        <div className="row g-4">
            {/* Новые поставки */}
            <div className="col-md-6">
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h5 className="card-title d-flex align-items-center gap-2">
                            <PackageCheck size={20}/> Последние поставки
                        </h5>
                        {supplies.length === 0 ? (
                            <p className="text-muted small">Нет поставок</p>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {supplies.map(s => (
                                    <li key={s.supply_id} className="list-group-item px-0">
                                        <Link to={`/store/supplies/id/${s.supply_id}`} className="text-decoration-none">
                                            <strong>#{s.supply_id}</strong> — {s.supplier_name} — {s.status}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* Критические остатки */}
            <div className="col-md-6">
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h5 className="card-title d-flex align-items-center gap-2">
                            <AlertTriangle size={20}/> Критические остатки
                        </h5>
                        {lowStocks.length === 0 ? (
                            <p className="text-muted small">Все товары в порядке</p>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {lowStocks.map(s => (
                                    <li key={s.stock_id} className="list-group-item px-0">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="flex-grow-1">
                                                <div className="fw-semibold small">{s.product_name}</div>
                                                <div className="progress mt-1" style={{height: '6px'}}>
                                                    <div
                                                        className="progress-bar bg-danger progress-bar-striped progress-bar-animated"
                                                        role="progressbar"
                                                        style={{width: `${Math.min((s.quantity / 10) * 100, 100)}%`}}
                                                    ></div>
                                                </div>
                                            </div>
                                            <span className="badge bg-danger ms-3">{s.quantity} шт.</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StoreDashboardPage
