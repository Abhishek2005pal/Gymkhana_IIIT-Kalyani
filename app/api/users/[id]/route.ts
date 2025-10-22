import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid user id" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await UserModel.findById(id)
      .select("-password") // Exclude password
      .lean();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("GET /api/users/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
