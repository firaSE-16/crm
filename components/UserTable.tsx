"use client";

import { useState } from "react";

interface User {
  _id: string;
  email: string;
  role: "user" | "manager";
  createdAt?: string;
}

interface UserTableProps {
  users: User[];
  refresh?: () => void;
  onEdit?: (user: User) => void;
}

export default function UserTable({
  users,
  refresh,
  onEdit,
}: UserTableProps) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    setDeleting(id);
    setError("");

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete user");
      }

      if (refresh) {
        refresh();
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
    } finally {
      setDeleting(null);
    }
  };

  if (!users.length) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">👤</span>
        </div>
        <p className="text-gray-600 font-medium">No users found</p>
        <p className="text-sm text-gray-500 mt-1">Create a new user to get started</p>
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
              <th className="p-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Email</th>
              <th className="p-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Role</th>
              <th className="p-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="font-semibold text-gray-900">{user.email}</div>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                      user.role === "manager"
                        ? "bg-purple-100 text-purple-800 border-purple-200"
                        : "bg-blue-100 text-blue-800 border-blue-200"
                    }`}
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit && onEdit(user)}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm font-medium transition-colors border border-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      disabled={deleting === user._id}
                      className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 text-sm font-medium transition-colors border border-red-200 disabled:opacity-50"
                    >
                      {deleting === user._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

