"use client";

import { useState } from "react";

interface Entry {
  _id: string;
  title: string;
  description?: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdBy?: {
    email: string;
    role: string;
  };
}

interface EntryTableProps {
  entries: Entry[];
  isManager?: boolean;
  canEdit?: boolean;
  refresh?: () => void;
  onEdit?: (entry: Entry) => void;
}

export default function EntryTable({
  entries,
  isManager,
  canEdit,
  refresh,
  onEdit,
}: EntryTableProps) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    setError("");

    try {
      const res = await fetch(`/api/entries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update status");
      }

      if (refresh) {
        refresh();
      }
    } catch (err: any) {
      setError(err.message || "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) {
      return;
    }

    setDeleting(id);
    setError("");

    try {
      const res = await fetch(`/api/entries/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete entry");
      }

      if (refresh) {
        refresh();
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete entry");
    } finally {
      setDeleting(null);
    }
  };

  if (!entries.length) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📭</span>
        </div>
        <p className="text-gray-600 font-medium">No entries found</p>
        <p className="text-sm text-gray-500 mt-1">Create your first entry to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 m-4 rounded-lg">
          {error}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Title</th>
              <th className="p-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Description</th>
              <th className="p-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Amount</th>
              <th className="p-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
              {isManager && (
                <>
                  <th className="p-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Created By</th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Action</th>
                </>
              )}
              {canEdit && (
                <th className="p-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {entries.map((entry) => (
              <tr key={entry._id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="font-semibold text-gray-900">{entry.title}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-gray-600 max-w-md truncate">
                    {entry.description || <span className="text-gray-400">No description</span>}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-gray-900">${entry.amount.toLocaleString()}</div>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      entry.status === "approved"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : entry.status === "rejected"
                        ? "bg-red-100 text-red-800 border border-red-200"
                        : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    }`}
                  >
                    {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                  </span>
                </td>
                {isManager && (
                  <>
                    <td className="p-4">
                      <div className="text-sm text-gray-600">{entry.createdBy?.email || "-"}</div>
                    </td>
                    <td className="p-4">
                      <select
                        defaultValue={entry.status}
                        onChange={(e) => updateStatus(entry._id, e.target.value)}
                        disabled={updating === entry._id}
                        className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </>
                )}
                {canEdit && (
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit && onEdit(entry)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm font-medium transition-colors border border-blue-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(entry._id)}
                        disabled={deleting === entry._id}
                        className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 text-sm font-medium transition-colors border border-red-200 disabled:opacity-50"
                      >
                        {deleting === entry._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}