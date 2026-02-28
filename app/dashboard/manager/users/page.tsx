"use client";

import { useEffect, useState } from "react";
import UserForm from "@/components/UserForm";
import UserTable from "@/components/UserTable";
import Pagination from "@/components/Pagination";

interface User {
  _id: string;
  email: string;
  role: "user" | "manager";
}

interface PaginationData {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [role, setRole] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    totalPages: 0,
    total: 0,
    limit: 10,
  });

  const fetchUsers = async () => {
    try {
      const url = `/api/users?page=${page}&limit=10${role ? `&role=${role}` : ""}`;
      const res = await fetch(url, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await res.json();
      setUsers(data.data || []);
      setPagination(data.pagination || {
        page: 1,
        totalPages: 0,
        total: 0,
        limit: 10,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setPagination({
        page: 1,
        totalPages: 0,
        total: 0,
        limit: 10,
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, role]);

  const userCount = users.filter((u) => u.role === "user").length;
  const managerCount = users.filter((u) => u.role === "manager").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage system users and permissions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{pagination.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Regular Users</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{userCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Managers</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{managerCount}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👔</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Filter by Role
        </label>
        <select
          className="border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full max-w-xs bg-white"
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="manager">Manager</option>
        </select>
      </div>

      {editingUser ? (
        <UserForm
          user={editingUser}
          onSuccess={() => {
            fetchUsers();
            setEditingUser(null);
          }}
          onCancel={() => setEditingUser(null)}
        />
      ) : (
        <UserForm onSuccess={fetchUsers} />
      )}

      <UserTable
        users={users}
        refresh={fetchUsers}
        onEdit={setEditingUser}
      />

      <Pagination
        pagination={pagination}
        onPageChange={setPage}
      />
    </div>
  );
}

