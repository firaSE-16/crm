import { z } from "zod";

export const createEntrySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  amount: z.number().positive("Amount must be positive"),
});

export const updateEntrySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  description: z.string().optional(),
  amount: z.number().positive("Amount must be positive").optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
});