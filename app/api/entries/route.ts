import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Entry from "@/models/Entry";
import { getCurrentUser } from "@/lib/auth";
import { getPaginationParams } from "@/lib/pagination";
import { createEntrySchema } from "@/lib/validators/entry";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role !== "user") {
      return NextResponse.json(
        { message: "Only users can create entries" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const parsed = createEntrySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const entry = await Entry.create({
      ...parsed.data,
      createdBy: user.id,
    });

    return NextResponse.json(entry, { status: 201 });

  } catch (error) {
    console.error("POST entries error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}


export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { page, limit, skip } = getPaginationParams(
      req.nextUrl.searchParams
    );

    const status = req.nextUrl.searchParams.get("status");
    const search = req.nextUrl.searchParams.get("search");

    let filter: any = {};

    if (user.role === "user") {
      filter.createdBy = user.id;
    }

    if (user.role === "manager" && status) {
      filter.status = status;
    }

    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const [entries, total] = await Promise.all([
      Entry.find(filter)
        .populate("createdBy", "email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Entry.countDocuments(filter),
    ]);

    return NextResponse.json({
      data: entries,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error("POST entries error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}