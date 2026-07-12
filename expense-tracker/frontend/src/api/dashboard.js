import { apiClient } from './client';

export const getSummary = () => apiClient.get('/dashboard/summary').then((r) => r.data);
export const getByCategory = () => apiClient.get('/dashboard/by-category').then((r) => r.data);
export const getMonthlyTrend = (months = 12) =>
  apiClient.get(`/dashboard/monthly-trend?months=${months}`).then((r) => r.data);

export const getRecurring = () => apiClient.get('/insights/recurring').then((r) => r.data);
export const getForecast = () => apiClient.get('/insights/next-month-forecast').then((r) => r.data);
export const getBudgetAlerts = () => apiClient.get('/insights/budget-alerts').then((r) => r.data);

export const listTransactions = (params) => apiClient.get('/transactions', { params }).then((r) => r.data);
export const createTransaction = (payload) => apiClient.post('/transactions', payload).then((r) => r.data);
