import { ArrowDownRight, ArrowUpRight, Wallet, TrendingUp } from 'lucide-react';

function Card({ label, value, icon: Icon, trend, tone = 'default' }) {
  const toneClasses = {
    default: 'bg-white',
    positive: 'bg-white border-l-4 border-l-emerald-500',
    negative: 'bg-white border-l-4 border-l-rose-500',
  };

  return (
    <div className={`rounded-2xl shadow-sm p-5 ${toneClasses[tone]} border border-slate-100`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <Icon className="w-5 h-5 text-slate-400" />
      </div>
      <p className="text-2xl font-semibold text-slate-800 mt-2">{value}</p>
      {trend != null && (
        <div className={`flex items-center gap-1 mt-2 text-sm ${trend >= 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
          {trend >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          <span>{Math.abs(trend).toFixed(1)}% vs last month</span>
        </div>
      )}
    </div>
  );
}

export default function SummaryCards({ summary, currency = 'USD' }) {
  const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n || 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card label="Total Income" value={fmt(summary?.totalIncome)} icon={Wallet} />
      <Card
        label="Total Expenses"
        value={fmt(summary?.totalExpense)}
        icon={TrendingUp}
        trend={summary?.monthOverMonthChangePct}
      />
      <Card
        label="Net Balance"
        value={fmt(summary?.netBalance)}
        icon={Wallet}
        tone={summary?.netBalance >= 0 ? 'positive' : 'negative'}
      />
      <Card label="Transactions" value={summary?.transactionCount ?? 0} icon={TrendingUp} />
    </div>
  );
}
