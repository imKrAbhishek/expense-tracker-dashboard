import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CategoryPieChart({ data = [] }) {
  if (data.length === 0) {
    return <EmptyState message="No expenses logged yet this month." />;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 h-96">
      <h3 className="font-semibold text-slate-800 mb-4">Spending by Category</h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="categoryName"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          <Legend layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 h-96 flex items-center justify-center text-slate-400 text-sm">
      {message}
    </div>
  );
}
