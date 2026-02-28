"use client";

import { useEffect, useState } from "react";
import EntryForm from "@/components/EntryForm";
import EntryTable from "@/components/EntryTable";
import Pagination from "@/components/Pagination";

interface Entry {
  _id: string;
  title: string;
  description?: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
}

interface PaginationData {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

export default function UserDashboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    totalPages: 0,
    total: 0,
    limit: 5,
  });

  const fetchEntries = async () => {
    try {
      const url = `/api/entries?page=${page}&limit=5${search ? `&search=${encodeURIComponent(search)}` : ""}`;
      const res = await fetch(url, {
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch entries");
      }
      
      const data = await res.json();
      setEntries(data.data || []);
      setPagination(data.pagination || {
        page: 1,
        totalPages: 0,
        total: 0,
        limit: 5,
      });
    } catch (error) {
      console.error("Error fetching entries:", error);
      setEntries([]);
      setPagination({
        page: 1,
        totalPages: 0,
        total: 0,
        limit: 5,
      });
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  const totalAmount = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const pendingCount = entries.filter((e) => e.status === "pending").length;
  const approvedCount = entries.filter((e) => e.status === "approved").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Entries</h1>
          <p className="text-gray-600 mt-1">Manage your expense entries</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{pagination.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${totalAmount.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by title or description..."
              className="w-full border border-slate-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
          </div>
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Clear
            </button>
          )}
        </div>
        {search && (
          <p className="mt-3 text-sm text-gray-600">
            Showing results for: <span className="font-semibold text-gray-900">"{search}"</span>
          </p>
        )}
      </div>

      {editingEntry ? (
        <EntryForm
          entry={editingEntry}
          onSuccess={() => {
            fetchEntries();
            setEditingEntry(null);
          }}
          onCancel={() => setEditingEntry(null)}
        />
      ) : (
        <EntryForm onSuccess={fetchEntries} />
      )}

      <EntryTable
        entries={entries}
        canEdit
        refresh={fetchEntries}
        onEdit={setEditingEntry}
      />

      <Pagination
        pagination={pagination}
        onPageChange={setPage}
      />
    </div>
  );
}