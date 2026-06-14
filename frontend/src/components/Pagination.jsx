import Button from './Button';

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between gap-3">
      <Button variant="secondary" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        Prev
      </Button>
      <div className="text-sm text-slate-400">
        Page {page} of {pages}
      </div>
      <Button variant="secondary" onClick={() => onPageChange(page + 1)} disabled={page >= pages}>
        Next
      </Button>
    </div>
  );
}
