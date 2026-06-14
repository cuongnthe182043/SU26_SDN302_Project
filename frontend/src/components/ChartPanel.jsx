export default function ChartPanel({ stats }) {
  const items = [
    { label: 'Total', value: stats.totalContacts || 0 },
    { label: 'Favorite', value: stats.favoriteContacts || 0 },
    { label: 'Google', value: stats.googleContacts || 0 },
    { label: 'Local', value: stats.localContacts || 0 },
  ];

  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="mb-4 text-lg font-semibold text-white">Breakdown</div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex justify-between text-sm text-slate-300">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-emerald-400"
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
