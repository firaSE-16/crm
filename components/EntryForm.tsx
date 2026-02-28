"use client";

import { useState } from "react";

interface Entry {
  _id: string;
  title: string;
  description?: string;
  amount: number;
}

interface EntryFormProps {
  entry?: Entry;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function EntryForm({ entry, onSuccess, onCancel }: EntryFormProps) {
  const [title, setTitle] = useState<string>(entry?.title || "");
  const [description, setDescription] = useState<string>(entry?.description || "");
  const [amount, setAmount] = useState<string>(entry?.amount.toString() || "");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    // Basic client-side validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Amount must be a positive number");
      return;
    }

    try {
      setLoading(true);

      const url = entry ? `/api/entries/${entry._id}` : "/api/entries";
      const method = entry ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          amount: Number(amount),
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${entry ? "update" : "create"} entry`);
      }

      if (!entry) {
        setTitle("");
        setDescription("");
        setAmount("");
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
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <span className="text-xl">{entry ? "✏️" : "➕"}</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">{entry ? "Edit Entry" : "Create New Entry"}</h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Title *</label>
          <input
            type="text"
            required
            className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter entry title"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Amount *</label>
          <div className="relative">
            <span className="absolute left-3 top-3.5 text-gray-500">$</span>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              className="w-full border border-slate-300 p-3 pl-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Description</label>
        <textarea
          rows={3}
          className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description (optional)"
        />
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
          className={`${onCancel ? "flex-1" : "w-full"} bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-sm`}
        >
          {loading ? (entry ? "Updating..." : "Creating...") : (entry ? "Update Entry" : "Create Entry")}
        </button>
      </div>
    </form>
  );
}