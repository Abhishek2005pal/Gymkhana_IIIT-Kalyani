import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    
    // Check if user is admin
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const users = await UserModel.find()
      .select("name email role studentId createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ data: users });
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
