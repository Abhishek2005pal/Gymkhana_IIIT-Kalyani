import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import ClubModel from "@/models/club.model";
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

    // Ensure User model is registered
    UserModel;

    const clubs = await ClubModel.find()
      .populate("coordinator", "name email")
      .populate("members", "name email")
      .select("name description coordinator members createdAt")
      .lean();

    const clubStats = clubs.map((club: any) => ({
      _id: club._id,
      name: club.name,
      description: club.description,
      coordinator: club.coordinator,
      memberCount: club.members?.length || 0,
      members: club.members,
      createdAt: club.createdAt,
    }));

    return NextResponse.json({ data: clubStats });
  } catch (error) {
    console.error("GET /api/admin/clubs error:", error);
    return NextResponse.json({ error: "Failed to fetch club statistics" }, { status: 500 });
  }
}
