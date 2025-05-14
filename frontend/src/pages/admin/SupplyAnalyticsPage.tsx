import {useEffect, useState} from 'react';
import {getSupplyAnalytics} from '@/api/analytics';

const SupplyAnalyticsPage = () => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        getSupplyAnalytics().then(setData);
    }, []);

    if (!data) return <p>Загрузка...</p>;

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Аналитика по поставкам</h1>
            <div className="p-4 border rounded shadow">
                <p>Общее количество поставок: <strong>{data.total_supplies}</strong></p>
                <p>Общее количество позиций: <strong>{data.total_items}</strong></p>
                <p>Общая стоимость: <strong>{data.total_cost} ₽</strong></p>
            </div>
            <div className="p-4 border rounded shadow">
                <h2 className="font-semibold text-lg">Поставки по магазинам:</h2>
                <ul className="list-disc ml-4">
                    {data.supplies_per_store.map((s: any) => (
                        <li key={s.store_id}>Магазин {s.store_id}: {s.count} поставок</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SupplyAnalyticsPage;
