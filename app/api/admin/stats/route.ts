import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import ClubModel from "@/models/club.model";
import EventModel from "@/models/event.model";
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

    // Get statistics
    const totalUsers = await UserModel.countDocuments();
    const totalStudents = await UserModel.countDocuments({ role: "student" });
    const totalCoordinators = await UserModel.countDocuments({ role: "coordinator" });
    const totalAdmins = await UserModel.countDocuments({ role: "admin" });
    const totalClubs = await ClubModel.countDocuments();
    const totalEvents = await EventModel.countDocuments();
    const approvedEvents = await EventModel.countDocuments({ status: "approved" });
    const pendingEvents = await EventModel.countDocuments({ status: "pending" });

    return NextResponse.json({
      data: {
        totalUsers,
        totalStudents,
        totalCoordinators,
        totalAdmins,
        totalClubs,
        totalEvents,
        approvedEvents,
        pendingEvents,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 });
  }
}
