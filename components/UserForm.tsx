"use client";

import { useState, useEffect } from "react";

interface User {
  _id: string;
  email: string;
  role: "user" | "manager";
}

interface UserFormProps {
  user?: User;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const [email, setEmail] = useState<string>(user?.email || "");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<"user" | "manager">(user?.role || "user");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!user && !password) {
      setError("Password is required");
      return;
    }

    if (password && password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const url = user ? `/api/users/${user._id}` : "/api/users";
      const method = user ? "PUT" : "POST";

      const body: any = {
        email: email.trim(),
        role,
      };

      if (password) {
        body.password = password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${user ? "update" : "create"} user`);
      }

      if (!user) {
        setEmail("");
        setPassword("");
        setRole("user");
      } else {
        setPassword("");
      }

      onSuccess();
      if (onCancel) {
        onCancel();
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-5"
    >
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <span className="text-xl">{user ? "✏️" : "➕"}</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">{user ? "Edit User" : "Create New User"}</h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Email Address *</label>
        <input
          type="email"
          required
          className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          Password {user && <span className="text-gray-500 font-normal">(leave blank to keep current)</span>}
        </label>
        <input
          type="password"
          required={!user}
          className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Role</label>
        <select
          className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          value={role}
          onChange={(e) => setRole(e.target.value as "user" | "manager")}
        >
          <option value="user">User</option>
          <option value="manager">Manager</option>
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium border border-slate-300"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`${onCancel ? "flex-1" : "w-full"} bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-sm`}
        >
          {loading ? (user ? "Updating..." : "Creating...") : (user ? "Update User" : "Create User")}
        </button>
      </div>
    </form>
  );
}

