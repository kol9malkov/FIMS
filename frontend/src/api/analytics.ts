import api from './api';

export const getSupplyAnalytics = async (
  store_id?: number,
  start_date?: string,
  end_date?: string
) => {
  const params: any = {};
  if (store_id) params.store_id = store_id;
  if (start_date) params.start_date = start_date;
  if (end_date) params.end_date = end_date;

  const response = await api.get('/admin/supplies/analytics', { params });
  return response.data;
};
