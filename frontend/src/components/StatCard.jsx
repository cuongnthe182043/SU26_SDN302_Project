export default function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-glow">
      <div className="text-sm text-slate-400">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-white">{value}</div>
    </div>
  );
}
