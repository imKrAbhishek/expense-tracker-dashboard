import { Repeat, TrendingUp, AlertTriangle } from 'lucide-react';

export default function InsightsPanel({ recurring = [], forecast, budgetAlerts = [] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <h3 className="font-semibold text-slate-800 mb-4">Smart Insights</h3>

      <div className="space-y-5">
        {/* Forecast */}
        {forecast && (
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-slate-700">
                Predicted next month spend: ${forecast.predictedTotalExpense?.toFixed(2)}
              </p>
              <p className="text-xs text-slate-400">Based on a weighted average of your last 2 months</p>
            </div>
          </div>
        )}

        {/* Budget alerts */}
        {budgetAlerts.length > 0 && (
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
            <div className="space-y-1">
              {budgetAlerts.map((a) => (
                <p key={a.category} className="text-sm text-slate-700">
                  <span className="font-medium">{a.category}</span> is projected to exceed budget by{' '}
                  <span className="text-amber-600 font-medium">{a.percentOverBudget}%</span>
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Recurring */}
        {recurring.length > 0 && (
          <div className="flex items-start gap-3">
            <Repeat className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
            <div className="space-y-1 w-full">
              <p className="text-sm font-medium text-slate-700">Detected recurring expenses</p>
              {recurring.slice(0, 4).map((r) => (
                <div key={r.merchantName} className="flex justify-between text-xs text-slate-500">
                  <span>{r.merchantName}</span>
                  <span>${r.averageAmount.toFixed(2)}/mo</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {recurring.length === 0 && budgetAlerts.length === 0 && !forecast && (
          <p className="text-sm text-slate-400">Log a few weeks of transactions to unlock insights.</p>
        )}
      </div>
    </div>
  );
}
