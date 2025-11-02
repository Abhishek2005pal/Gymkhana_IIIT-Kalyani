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

    // Ensure models are registered
    ClubModel;
    UserModel;

    const events = await EventModel.find()
      .populate("club", "name")
      .populate("registeredUsers", "name email")
      .select("title description club date location status registeredUsers registrationLimit createdAt")
      .sort({ date: -1 })
      .lean();

    const eventStats = events.map((event: any) => ({
      _id: event._id,
      title: event.title,
      description: event.description,
      club: event.club,
      date: event.date,
      location: event.location,
      status: event.status,
      registeredCount: event.registeredUsers?.length || 0,
      registeredUsers: event.registeredUsers,
      registrationLimit: event.registrationLimit,
      createdAt: event.createdAt,
    }));

    return NextResponse.json({ data: eventStats });
  } catch (error) {
    console.error("GET /api/admin/events error:", error);
    return NextResponse.json({ error: "Failed to fetch event statistics" }, { status: 500 });
  }
}
