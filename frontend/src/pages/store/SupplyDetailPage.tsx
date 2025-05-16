import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {getSupplyById, updateSupplyItem, closeSupply} from '@/api/supplies'
import type {Supply, SupplyItem} from '@/api/supplies'
import {useAuth} from '@/contexts/AuthContext'

const SupplyDetailPage = () => {
    const {supplyId} = useParams<{ supplyId: string }>()
    const {storeId} = useAuth()
    const safeStoreId = storeId ?? undefined
    const navigate = useNavigate()

    const [supply, setSupply] = useState<Supply | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [updatingItemId, setUpdatingItemId] = useState<number | null>(null)
    const [localItems, setLocalItems] = useState<SupplyItem[]>([])
    const [savedItemIds, setSavedItemIds] = useState<Set<number>>(new Set())

    const fetchSupply = async () => {
        try {
            if (!supplyId) return
            const data = await getSupplyById(parseInt(supplyId), safeStoreId)
            setSupply(data)
            setLocalItems(data.supply_items)
            setSavedItemIds(new Set(data.supply_items.filter(i => i.is_received).map(i => i.supply_item_id)))
        } catch (e: any) {
            setError(e?.response?.data?.detail || 'Ошибка загрузки поставки')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSupply()
    }, [supplyId])

    const handleUpdateItem = async (itemId: number) => {
        const item = localItems.find(i => i.supply_item_id === itemId)
        if (!item) return

        try {
            setUpdatingItemId(itemId)
            await updateSupplyItem(parseInt(supplyId!), itemId, {
                received_quantity: item.received_quantity,
                is_received: item.is_received,
            }, safeStoreId)
            setSavedItemIds(prev => new Set(prev).add(itemId))
        } catch (e: any) {
            alert(e?.response?.data?.detail || 'Ошибка обновления позиции')
        } finally {
            setUpdatingItemId(null)
        }
    }

    const handleClose = async () => {
        try {
            await closeSupply(parseInt(supplyId!), safeStoreId)
            await fetchSupply()
        } catch (e: any) {
            alert(e?.response?.data?.detail || 'Ошибка при закрытии поставки')
        }
    }

    const isEditable = ['Доставлено', 'Принято частично', 'Принято'].includes(supply?.status || '')
    const canClose = ['Принято', 'Принято частично'].includes(supply?.status || '')

    if (loading) return <p className="p-4">Загрузка...</p>
    if (error) return <p className="text-red-600 p-4">{error}</p>
    if (!supply) return null

    return (
        <div className="container py-4" style={{maxWidth: '960px'}}>
            <h2 className="fw-bold fs-4 mb-4">Поставка #{supply.supply_id}</h2>

            <div className="mb-4 small">
                <p><strong>Магазин:</strong> {supply.store_name}</p>
                <p><strong>Поставщик:</strong> {supply.supplier_name}</p>
                <p><strong>Дата:</strong> {new Date(supply.supply_date).toLocaleDateString('ru-RU')}</p>
                <p><strong>Статус:</strong> {supply.status}</p>
            </div>

            {/* Таблица товаров */}
            <div className="table-responsive mb-4">
                <table className="table table-bordered align-middle text-sm">
                    <thead className="table-light">
                    <tr>
                        <th>Товар</th>
                        <th>Заказано</th>
                        <th>Принято</th>
                        <th className="text-center">✓</th>
                        {isEditable && <th>Действие</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {localItems.map((item) => (
                        <tr key={item.supply_item_id}>
                            <td>{item.product_name}</td>
                            <td>{item.quantity}</td>
                            <td>
                                {isEditable ? (
                                    <input
                                        type="number"
                                        min={0}
                                        max={item.quantity}
                                        value={item.received_quantity}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value);
                                            const safeValue = isNaN(value) ? 0 : Math.min(value, item.quantity);
                                            setLocalItems((prev) =>
                                                prev.map((i) =>
                                                    i.supply_item_id === item.supply_item_id
                                                        ? {...i, received_quantity: safeValue}
                                                        : i
                                                )
                                            );
                                        }}
                                        className="form-control form-control-sm w-100"
                                        style={{maxWidth: '80px'}}
                                    />
                                ) : (
                                    item.received_quantity
                                )}
                            </td>
                            <td className="text-center">
                                {isEditable ? (
                                    <input
                                        type="checkbox"
                                        checked={item.is_received}
                                        onChange={(e) =>
                                            setLocalItems((prev) =>
                                                prev.map((i) =>
                                                    i.supply_item_id === item.supply_item_id
                                                        ? {...i, is_received: e.target.checked}
                                                        : i
                                                )
                                            )
                                        }
                                    />
                                ) : item.is_received ? '✓' : ''}
                            </td>
                            {isEditable && (
                                <td>
                                    {savedItemIds.has(item.supply_item_id) ? (
                                        <span className="text-success small">✓ Сохранено</span>
                                    ) : (
                                        <button
                                            onClick={() => handleUpdateItem(item.supply_item_id)}
                                            disabled={updatingItemId === item.supply_item_id}
                                            className={`btn btn-link btn-sm p-0 text-primary ${
                                                updatingItemId === item.supply_item_id ? 'opacity-50' : ''
                                            }`}
                                        >
                                            {updatingItemId === item.supply_item_id ? 'Сохраняю...' : 'Сохранить'}
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Кнопка закрытия */}
            <div className="d-flex justify-content-between align-items-center mt-3">
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate(-1)}
                >
                    ← Назад
                </button>

                {canClose && (
                    <button
                        className="btn btn-success"
                        onClick={handleClose}
                    >
                        Закрыть поставку
                    </button>
                )}
            </div>
        </div>

    )
}

export default SupplyDetailPage
