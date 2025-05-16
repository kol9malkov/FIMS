import {useEffect, useState} from 'react';
import {getSupplyAnalytics, getSalesAnalytics} from '@/api/analytics';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts';


const AdminDashboardPage = () => {
    const [supplyData, setSupplyData] = useState<any>(null);
    const [salesData, setSalesData] = useState<any>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const [supply, sales] = await Promise.all([
                    getSupplyAnalytics({}),
                    getSalesAnalytics({})
                ]);
                setSupplyData(supply);
                setSalesData(sales);
            } catch (e) {
                console.error('Ошибка загрузки аналитики:', e);
            }
        };

        load();
    }, []);

    return (
        <div className="container">
            <h2 className="mb-4 fw-bold">Панель администратора</h2>

            <div className="row g-4">
                {/* Поставки */}
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <h6 className="text-muted">Всего поставок</h6>
                            <h3 className="fw-bold">{supplyData ? supplyData.total_supplies : '...'}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <h6 className="text-muted">Всего позиций</h6>
                            <h3 className="fw-bold">{supplyData ? supplyData.total_items : '...'}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <h6 className="text-muted">Общая сумма поставок</h6>
                            <h3 className="fw-bold">
                                {supplyData ? supplyData.total_cost.toLocaleString() + ' ₽' : '...'}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Продажи */}
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <h6 className="text-muted">Всего продаж</h6>
                            <h3 className="fw-bold">{salesData ? salesData.total_sales : '...'}</h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <h6 className="text-muted">Общая сумма продаж</h6>
                            <h3 className="fw-bold">
                                {salesData ? salesData.total_amount.toLocaleString() + ' ₽' : '...'}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <h6 className="text-muted">Средний чек</h6>
                            <h3 className="fw-bold">
                                {salesData ? salesData.average_check.toFixed(2) + ' ₽' : '...'}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
            {salesData?.sales_per_store?.length > 0 && (
                <div className="mt-5">
                    <h5 className="fw-bold mb-3">Продажи по магазинам</h5>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salesData.sales_per_store}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="store_address"/>
                            <YAxis/>
                            <Tooltip
                                formatter={(value: number) =>
                                    [`${value.toFixed(2)} ₽`, 'Сумма продаж']
                                }
                            />
                            <Bar
                                dataKey="total_amount"
                                fill="#3A43F0"
                                name="Сумма продаж"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

        </div>
    );
};

export default AdminDashboardPage;
