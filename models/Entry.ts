import mongoose, { Schema, Document } from "mongoose";

export interface IEntry extends Document {
  title: string;
  description?: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdBy: mongoose.Types.ObjectId;
}

const EntrySchema = new Schema<IEntry>(
  {
    title: { type: String, required: true },
    description: String,
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Entry ||
  mongoose.model<IEntry>("Entry", EntrySchema);