"use client";

interface PaginationProps {
  pagination: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
  onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, onPageChange }: PaginationProps) {
  if (!pagination.totalPages || pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
      <div className="text-sm text-gray-600">
        Showing <span className="font-semibold text-gray-900">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
        <span className="font-semibold text-gray-900">
          {Math.min(pagination.page * pagination.limit, pagination.total)}
        </span>{" "}
        of <span className="font-semibold text-gray-900">{pagination.total}</span> entries
      </div>

      <div className="flex items-center gap-2">
        <button
          disabled={pagination.page === 1}
          onClick={() => onPageChange(pagination.page - 1)}
          className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-gray-700 bg-white"
        >
          Previous
        </button>

        <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-sm font-semibold text-gray-900">
            Page {pagination.page} of {pagination.totalPages}
          </span>
        </div>

        <button
          disabled={pagination.page === pagination.totalPages}
          onClick={() => onPageChange(pagination.page + 1)}
          className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-gray-700 bg-white"
        >
          Next
        </button>
      </div>
    </div>
  );
}