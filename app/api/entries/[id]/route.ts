import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Entry from "@/models/Entry";
import { getCurrentUser } from "@/lib/auth";
import { updateStatusSchema, updateEntrySchema } from "@/lib/validators/entry";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const entry = await Entry.findById(id).populate("createdBy", "email role");

    if (!entry) {
      return NextResponse.json(
        { message: "Entry not found" },
        { status: 404 }
      );
    }

    if (user.role === "user" && entry.createdBy.toString() !== user.id) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json(entry, { status: 200 });
  } catch (error: any) {
    console.error("GET entry error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const entry = await Entry.findById(id);

    if (!entry) {
      return NextResponse.json(
        { message: "Entry not found" },
        { status: 404 }
      );
    }

    if (user.role === "user" && entry.createdBy.toString() !== user.id) {
      return NextResponse.json(
        { message: "You can only update your own entries" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = updateEntrySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const updated = await Entry.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true }
    ).populate("createdBy", "email role");

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error("PUT entry error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role !== "manager") {
      return NextResponse.json(
        { message: "Only managers can update status" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = updateStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const updated = await Entry.findByIdAndUpdate(
      id,
      { status: parsed.data.status },
      { new: true }
    ).populate("createdBy", "email role");

    if (!updated) {
      return NextResponse.json(
        { message: "Entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error("PATCH entry error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const entry = await Entry.findById(id);

    if (!entry) {
      return NextResponse.json(
        { message: "Entry not found" },
        { status: 404 }
      );
    }

    if (user.role === "user" && entry.createdBy.toString() !== user.id) {
      return NextResponse.json(
        { message: "You can only delete your own entries" },
        { status: 403 }
      );
    }

    await Entry.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Entry deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE entry error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}