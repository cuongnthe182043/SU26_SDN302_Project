export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium transition disabled:opacity-60';
  const styles =
    variant === 'secondary'
      ? 'bg-white/5 text-slate-100 hover:bg-white/10'
      : 'bg-emerald-400 text-slate-950 hover:bg-emerald-300';
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
