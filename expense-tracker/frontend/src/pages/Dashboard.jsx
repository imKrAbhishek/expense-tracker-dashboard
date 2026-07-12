import { useQuery } from '@tanstack/react-query';
import {
  getSummary,
  getByCategory,
  getMonthlyTrend,
  getRecurring,
  getForecast,
  getBudgetAlerts,
} from '../api/dashboard';
import SummaryCards from '../components/SummaryCards';
import CategoryPieChart from '../components/CategoryPieChart';
import MonthlyTrendChart from '../components/MonthlyTrendChart';
import InsightsPanel from '../components/InsightsPanel';

export default function Dashboard() {
  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ['summary'],
    queryFn: getSummary,
  });

  const { data: categoryData } = useQuery({
    queryKey: ['byCategory'],
    queryFn: getByCategory,
  });

  const { data: trendData } = useQuery({
    queryKey: ['monthlyTrend'],
    queryFn: () => getMonthlyTrend(12),
  });

  const { data: recurring } = useQuery({
    queryKey: ['recurring'],
    queryFn: getRecurring,
  });

  const { data: forecast } = useQuery({
    queryKey: ['forecast'],
    queryFn: getForecast,
  });

  const { data: budgetAlerts } = useQuery({
    queryKey: ['budgetAlerts'],
    queryFn: getBudgetAlerts,
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-xl font-semibold text-slate-800">Expense Tracker Dashboard</h1>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {loadingSummary ? (
          <p className="text-slate-400 text-sm">Loading summary…</p>
        ) : (
          <SummaryCards summary={summary} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <MonthlyTrendChart data={trendData || []} />
            <CategoryPieChart data={categoryData || []} />
          </div>

          <div className="space-y-6">
            <InsightsPanel
              recurring={recurring || []}
              forecast={forecast}
              budgetAlerts={budgetAlerts || []}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
